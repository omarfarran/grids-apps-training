/* QA tooling only; this file is never loaded by the application.
 * Run: PLAYWRIGHT_MODULE=<installed playwright module> node qa/browser-check.cjs
 * PowerShell: $env:PLAYWRIGHT_MODULE = '<path>'; node qa/browser-check.cjs
 * Uses installed Chrome. No browser download or project dependency is required.
 */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '..')
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:5173'
const errors = []
const results = []

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  try {
    const page = await browser.newPage()
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text())
    })
    page.on('response', response => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
    })
    page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`))

    for (const width of [320, 390, 768, 1024, 1366]) {
      await page.setViewportSize({ width, height: 900 })
      for (const file of ['index.html', 'dashboard.html', 'auth.html']) {
        const response = await page.goto(`${base}/${file}`, { waitUntil: 'networkidle' })
        assert.equal(response.status(), 200)
        const layout = await page.evaluate(() => {
          const columns = selector => {
            const el = document.querySelector(selector)
            return el ? getComputedStyle(el).gridTemplateColumns.split(' ').length : null
          }
          return {
            viewport: innerWidth,
            document: document.documentElement.scrollWidth,
            productColumns: columns('#product-grid'),
            kpiColumns: columns('#kpi-grid'),
            sidebarPosition: document.querySelector('aside') ? getComputedStyle(document.querySelector('aside')).position : null,
            tableWidth: document.querySelector('#orders-scroll')?.scrollWidth ?? null,
            tableViewport: document.querySelector('#orders-scroll')?.clientWidth ?? null,
            heroColumns: columns('main > section:first-child'),
            headings: [...document.querySelectorAll('h1')].map(h => h.textContent),
          }
        })
        assert.equal(layout.document, width, `Page overflow: ${file} at ${width}: ${layout.document}`)
        assert.equal(layout.headings.length, 1, `One h1: ${file}`)
        if (file === 'index.html') {
          assert.equal(layout.productColumns, width >= 1024 ? 3 : width >= 768 ? 2 : 1)
          assert.equal(layout.heroColumns, width >= 1024 ? 2 : 1)
          assert.equal(await page.locator('#product-grid article').count(), 3)
        }
        if (file === 'dashboard.html') {
          assert.equal(layout.sidebarPosition, width >= 1024 ? 'sticky' : 'static')
          assert.equal(await page.locator('table thead th[scope="col"]').count(), 5)
          assert.equal(await page.locator('table tbody tr').count(), 5)
          if (width < 672) assert.ok(layout.tableWidth > layout.tableViewport, 'Narrow table is scrollable')
          if (layout.tableWidth > layout.tableViewport) {
            await page.locator('#orders-scroll').focus()
            await page.keyboard.press('ArrowRight')
            await page.waitForTimeout(100)
            assert.ok(await page.locator('#orders-scroll').evaluate(e => e.scrollLeft > 0), 'Table scrolls by keyboard')
            await page.locator('#orders-scroll').evaluate(e => { e.scrollLeft = 0 })
          }
        }

        const semantics = await page.evaluate(() => {
          const controls = [...document.querySelectorAll('input')]
          const ids = [...document.querySelectorAll('[id]')].map(e => e.id)
          return {
            missingLabels: controls.filter(e => !e.labels?.length).map(e => e.id),
            brokenDescriptions: [...document.querySelectorAll('[aria-describedby]')].filter(e => e.getAttribute('aria-describedby').split(' ').some(id => !document.getElementById(id))).length,
            duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i),
            brokenImages: [...document.images].filter(e => !e.complete || !e.naturalWidth).length,
            main: document.querySelectorAll('main').length,
          }
        })
        assert.deepEqual(semantics.missingLabels, [])
        assert.deepEqual(semantics.duplicateIds, [])
        assert.equal(semantics.brokenDescriptions, 0)
        assert.equal(semantics.brokenImages, 0)
        assert.equal(semantics.main, 1)

        // Real keyboard navigation: first Tab reveals the skip link; Enter focuses main.
        await page.goto(`${base}/${file}`, { waitUntil: 'networkidle' })
        await page.keyboard.press('Tab')
        const skip = await page.evaluate(() => {
          const el = document.activeElement
          const style = getComputedStyle(el)
          const box = el.getBoundingClientRect()
          return { text: el.textContent.trim(), outline: style.outlineStyle, width: style.outlineWidth, visible: box.width > 10 && box.height > 10 }
        })
        assert.equal(skip.text, 'Skip to main content')
        assert.equal(skip.visible, true)
        assert.equal(skip.outline, 'solid')
        assert.equal(skip.width, '3px')
        await page.keyboard.press('Enter')
        assert.equal(await page.evaluate(() => document.activeElement.id), 'main-content')

        // Walk every keyboard-focusable control. Disabled submissions must be skipped.
        const focusChecks = []
        const focusableCount = await page.locator('a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]').count()
        for (let i = 0; i < focusableCount + 1; i++) {
          await page.keyboard.press('Tab')
          const focused = await page.evaluate(() => {
            const el = document.activeElement
            const style = getComputedStyle(el)
            return { tag: el.tagName, id: el.id, disabled: !!el.disabled, outline: style.outlineStyle, width: parseFloat(style.outlineWidth) }
          })
          if (focused.tag === 'BODY') continue
          assert.equal(focused.disabled, false)
          assert.equal(focused.outline, 'solid', `Visible keyboard outline: ${file} ${focused.tag} ${focused.id}`)
          assert.ok(focused.width >= 2)
          focusChecks.push(focused)
        }

        if (file === 'auth.html') {
          assert.equal(await page.locator('button[type="submit"][disabled]').count(), 2)
          assert.equal(await page.locator('#example-email').getAttribute('aria-invalid'), 'true')
          const normalBorder = await page.locator('#login-email').evaluate(e => getComputedStyle(e).borderColor)
          const errorBorder = await page.locator('#example-email').evaluate(e => getComputedStyle(e).borderColor)
          assert.notEqual(errorBorder, normalBorder, 'Error-ready input has its own border color')
          await page.locator('#login-email').hover()
          const hoverBorder = await page.locator('#login-email').evaluate(e => getComputedStyle(e).borderColor)
          await page.waitForTimeout(200)
          assert.notEqual(await page.locator('#login-email').evaluate(e => getComputedStyle(e).borderColor), normalBorder, 'Input hover changes border')
          assert.ok(hoverBorder)
          const reset = page.getByRole('button', { name: 'Clear sign-in fields' })
          await page.mouse.move(0, 0)
          await page.waitForTimeout(200)
          const normalButton = await reset.evaluate(e => getComputedStyle(e).backgroundColor)
          await reset.hover()
          await page.waitForTimeout(200)
          assert.notEqual(await reset.evaluate(e => getComputedStyle(e).backgroundColor), normalButton, 'Reset button hover changes background')
          await page.locator('#login-email').fill('sample@example.com')
          await page.getByRole('button', { name: 'Clear sign-in fields' }).click()
          assert.equal(await page.locator('#login-email').inputValue(), '')
          await page.locator('#register-name').fill('Sample Person')
          await page.getByRole('button', { name: 'Clear registration fields' }).click()
          assert.equal(await page.locator('#register-name').inputValue(), '')
        }

        assert.deepEqual(await page.locator('[class]').evaluateAll(elements =>
          elements.flatMap(e => [...e.classList]).filter(c => c.includes('[') || c.includes(']'))
        ), [], 'No arbitrary Tailwind utility values')

        // Verify all local navigation targets and fragments exist.
        const hrefs = await page.locator('a[href]').evaluateAll(links => links.map(a => a.href))
        for (const href of new Set(hrefs)) {
          const url = new URL(href)
          assert.equal(url.origin, new URL(base).origin)
          const target = await page.request.get(url.origin + url.pathname)
          assert.equal(target.status(), 200, `Link target ${href}`)
          if (url.hash) assert.ok((await target.text()).includes(`id="${url.hash.slice(1)}"`), `Fragment target ${href}`)
        }

        if ([390, 1366].includes(width)) {
          await page.goto(`${base}/${file}`, { waitUntil: 'networkidle' })
          await page.screenshot({ path: path.join(root, 'screenshots', `${file.replace('.html', '')}-${width}.png`), fullPage: true })
        }
        results.push({ page: file, width, ...layout, keyboardControlsChecked: focusChecks.length, passed: true })
        console.log(`PASS ${file} @ ${width}px · products ${layout.productColumns ?? '—'} · KPIs ${layout.kpiColumns ?? '—'} · focus ${focusChecks.length}`)
      }
    }
    assert.deepEqual(errors, [], 'No browser console, runtime, request, or HTTP errors')
    fs.writeFileSync(path.join(root, 'qa', process.env.QA_REPORT_NAME || 'browser-results.json'), JSON.stringify({ browser: await browser.version(), base, results, errors }, null, 2) + '\n')
    console.log('PASS: 15 viewport/page checks; no browser errors. Six screenshots saved.')
  } finally {
    await browser.close()
  }
}
run().catch(error => { console.error(error); process.exitCode = 1 })
