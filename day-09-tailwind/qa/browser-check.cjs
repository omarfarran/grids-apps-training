// QA tooling only. The application imports no code from this directory.
// Requires installed Chrome and an existing Playwright module.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '..')
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:5173'
const pages = ['index', 'dashboard', 'customers', 'products', 'analytics', 'reports', 'settings', 'profile', 'auth']
const widths = [320, 390, 768, 1024, 1366]
const results = []
const errors = []
const targetCache = new Map()
const snapshots = new Set(['index-390', 'index-1366', 'dashboard-390', 'dashboard-1366', 'customers-1366', 'analytics-1366', 'settings-390', 'settings-1366', 'profile-1366', 'auth-390'])

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  try {
    const page = await browser.newPage()
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    page.on('pageerror', error => errors.push(error.message))
    page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`))
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
    const titles = new Map()

    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 })
      for (const name of pages) {
        const response = await page.goto(`${base}/${name}.html`, { waitUntil: 'networkidle' })
        assert.equal(response.status(), 200)
        const title = await page.title()
        titles.set(name, title)
        const layout = await page.evaluate(() => {
          const col = selector => {
            const e = document.querySelector(selector)
            return e ? getComputedStyle(e).gridTemplateColumns.split(' ').length : null
          }
          return {
            viewport: innerWidth, documentWidth: document.documentElement.scrollWidth,
            productColumns: col('#product-grid'), kpiColumns: col('#kpi-grid'),
            sidebarPosition: document.querySelector('aside[aria-label="Workspace navigation"]') ? getComputedStyle(document.querySelector('aside[aria-label="Workspace navigation"]')).position : null,
            tables: [...document.querySelectorAll('table')].map(table => ({ content: table.parentElement.scrollWidth, container: table.parentElement.clientWidth, columns: table.tHead.rows[0].cells.length, rows: table.tBodies[0].rows.length })),
          }
        })
        assert.equal(layout.documentWidth, width, `${name} @ ${width}: no page overflow`)
        assert.equal(await page.locator('h1').count(), 1)
        assert.equal(await page.locator('main').count(), 1)
        assert.ok(title.endsWith('| Forma'))

        const semantics = await page.evaluate(() => {
          const ids = [...document.querySelectorAll('[id]')].map(e => e.id)
          const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(e => +e.tagName.slice(1))
          return {
            missingLabels: [...document.querySelectorAll('input,select,textarea')].filter(e => !e.labels?.length).map(e => e.id),
            badReferences: [...document.querySelectorAll('[aria-describedby],[aria-labelledby]')].filter(e => ['aria-describedby','aria-labelledby'].some(attr => (e.getAttribute(attr)||'').split(' ').filter(Boolean).some(id => !document.getElementById(id)))).length,
            duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i),
            headingSkips: headings.filter((h, i) => i && h > headings[i - 1] + 1),
            badTableHeaders: [...document.querySelectorAll('table thead th')].filter(e => e.scope !== 'col').length,
            missingAlt: [...document.images].filter(e => !e.hasAttribute('alt')).length,
            badImages: [...document.images].filter(e => !e.complete || !e.naturalWidth).length,
            exposedSvg: [...document.querySelectorAll('svg')].filter(e => e.getAttribute('aria-hidden') !== 'true' && !e.querySelector('title')).length,
            arbitrary: [...document.querySelectorAll('[class]')].flatMap(e => [...e.classList]).filter(c => c.includes('[') || c.includes(']')),
          }
        })
        assert.deepEqual(semantics.missingLabels, [])
        assert.deepEqual(semantics.duplicateIds, [])
        assert.deepEqual(semantics.headingSkips, [])
        assert.deepEqual(semantics.arbitrary, [])
        for (const key of ['badReferences','badTableHeaders','missingAlt','badImages','exposedSvg']) assert.equal(semantics[key], 0, `${name} ${key}`)

        if (name === 'index') {
          assert.equal(layout.productColumns, width >= 1024 ? 3 : width >= 768 ? 2 : 1)
          for (const id of ['features','products','workflow','pricing','testimonials','faq']) assert.equal(await page.locator(`#${id}`).count(), 1)
          const summary = page.locator('#faq summary').first()
          await summary.focus()
          await page.keyboard.press('Enter')
          assert.equal(await summary.evaluate(e => e.parentElement.open), true)
          await page.keyboard.press('Enter')
          assert.equal(await summary.evaluate(e => e.parentElement.open), false)
        }
        if (!['index','auth'].includes(name)) {
          assert.equal(layout.sidebarPosition, width >= 1024 ? 'sticky' : 'static')
          const nav = page.getByRole('navigation', { name: 'Workspace', exact: true })
          assert.equal(await nav.locator('a').count(), 7)
          assert.equal(await nav.locator('[aria-current="page"]').getAttribute('href'), `./${name}.html`)
          if (width >= 1024) assert.equal(await page.locator('aside[aria-label="Workspace navigation"]').evaluate(e => e.getBoundingClientRect().width), 240)
        }
        for (const region of await page.locator('[role="region"]').all()) {
          const dimensions = await region.evaluate(e => ({ content: e.scrollWidth, viewport: e.clientWidth }))
          assert.equal(await region.getAttribute('tabindex'), '0')
          if (dimensions.content > dimensions.viewport) {
            await region.focus()
            await page.keyboard.press('ArrowRight')
            await page.waitForTimeout(100)
            assert.ok(await region.evaluate(e => e.scrollLeft > 0), 'Table region scrolls using keyboard')
            await region.evaluate(e => { e.scrollLeft = e.scrollWidth })
            assert.ok(await region.evaluate(e => e.querySelector('tr:last-child td:last-child').getBoundingClientRect().right <= e.getBoundingClientRect().right + 1), 'Final table column is reachable')
            await region.evaluate(e => { e.scrollLeft = 0 })
          }
        }

        // Reload for a real initial keyboard sequence, independent of earlier focus.
        await page.goto(`${base}/${name}.html`, { waitUntil: 'networkidle' })
        await page.keyboard.press('Tab')
        assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'Skip to main content')
        assert.ok(await page.evaluate(() => document.activeElement.getBoundingClientRect().width > 10))
        await page.keyboard.press('Enter')
        assert.equal(await page.evaluate(() => document.activeElement.id), 'main-content')
        const count = await page.locator('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),summary,[tabindex="0"]').count()
        let keyboardControls = 0
        for (let i = 0; i <= count; i++) {
          await page.keyboard.press('Tab')
          const focused = await page.evaluate(() => {
            const e = document.activeElement, s = getComputedStyle(e)
            return { tag: e.tagName, text: e.textContent.trim().slice(0, 60), outline: s.outlineStyle, width: parseFloat(s.outlineWidth), disabled: !!e.disabled }
          })
          if (focused.tag === 'BODY') continue
          assert.equal(focused.disabled, false)
          assert.equal(focused.outline, 'solid', `Focus outline: ${name} ${focused.tag} ${focused.text}`)
          assert.ok(focused.width >= 2)
          keyboardControls++
        }

        if (name === 'settings') {
          await page.locator('#workspace-name').fill('Practice workspace')
          await page.locator('#workspace-timezone').selectOption('Europe/London')
          await page.locator('#weekly-summary').uncheck()
          await page.getByRole('button', { name: 'Reset preferences' }).click()
          assert.equal(await page.locator('#workspace-name').inputValue(), 'Studio workspace')
          assert.equal(await page.locator('#workspace-timezone').inputValue(), 'Asia/Hebron')
          assert.equal(await page.locator('#weekly-summary').isChecked(), true)
          assert.equal(await page.locator('#workspace-id').isDisabled(), true)
          assert.equal(await page.locator('button[type="submit"]').isDisabled(), true)
        }
        if (name === 'auth') {
          assert.equal(await page.locator('button[type="submit"][disabled]').count(), 2)
          await page.locator('#login-email').fill('sample@example.com')
          await page.getByRole('button', { name: 'Clear sign-in fields' }).click()
          assert.equal(await page.locator('#login-email').inputValue(), '')
          const normal = await page.locator('#login-email').evaluate(e => getComputedStyle(e).borderColor)
          await page.locator('#login-email').hover()
          await page.waitForTimeout(200)
          assert.notEqual(await page.locator('#login-email').evaluate(e => getComputedStyle(e).borderColor), normal)
          assert.equal(await page.locator('#example-email').getAttribute('aria-invalid'), 'true')
          assert.notEqual(await page.locator('#example-email').evaluate(e => getComputedStyle(e).borderColor), normal)
        }
        if (name === 'analytics') {
          assert.deepEqual(await page.locator('meter').evaluateAll(es => es.map(e => [e.value, e.max])), [[12480,12480],[1560,12480],[828,12480],[452,12480]])
        }

        // Every distinct visible text element: resolve CSS colors through canvas to sRGB.
        // This checks rendered foreground/background pairs, not screen-reader behavior.
        const contrast = await page.evaluate(() => {
          const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
          const rgb = color => { ctx.clearRect(0,0,1,1); ctx.fillStyle=color; ctx.fillRect(0,0,1,1); return [...ctx.getImageData(0,0,1,1).data] }
          const lum = rgb => rgb.slice(0,3).map(v => v / 255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4).reduce((a,v,i) => a+v*[.2126,.7152,.0722][i],0)
          const failures = [], pairs = new Map()
          for (const e of document.querySelectorAll('body *')) {
            if (!e.checkVisibility() || e.closest('svg') || e.matches(':disabled') || ![...e.childNodes].some(n => n.nodeType===3 && n.textContent.trim())) continue
            const s = getComputedStyle(e)
            if (s.visibility !== 'visible' || s.opacity === '0') continue
            let bg = e, bgRgb
            while (bg) {
              bgRgb = rgb(getComputedStyle(bg).backgroundColor)
              if (bgRgb[3] >= 254) break
              bg = bg.parentElement
            }
            bgRgb = bg ? bgRgb : [255,255,255,255]
            const fgRgb = rgb(s.color)
            if (fgRgb[3] < 254) continue
            const a=lum(fgRgb),b=lum(bgRgb),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05)
            const large=parseFloat(s.fontSize)>=24 || (parseFloat(s.fontSize)>=18.66 && +s.fontWeight>=700)
            const required=large ? 3 : 4.5
            const key=`${fgRgb.join(',')}/${bgRgb.join(',')}/${required}`
            if (!pairs.has(key)) pairs.set(key, { ratio: +ratio.toFixed(2), required })
            if (ratio+.01 < required) failures.push({ tag:e.tagName, text:e.textContent.trim().slice(0,80), ratio:+ratio.toFixed(2), required })
          }
          return { pairs: [...pairs.values()], failures }
        })
        assert.deepEqual(contrast.failures, [], `${name} @ ${width} text contrast`)

        for (const href of new Set(await page.locator('a[href]').evaluateAll(es => es.map(e => e.href)))) {
          const url = new URL(href)
          assert.equal(url.origin, new URL(base).origin)
          const targetUrl = url.origin + url.pathname
          if (!targetCache.has(targetUrl)) {
            const res = await page.request.get(targetUrl)
            assert.equal(res.status(),200,`Local target ${href}`)
            targetCache.set(targetUrl, await res.text())
          }
          if (url.hash) assert.ok(targetCache.get(targetUrl).includes(`id="${url.hash.slice(1)}"`),`Fragment ${href}`)
        }

        if (snapshots.has(`${name}-${width}`)) {
          await page.goto(`${base}/${name}.html`, { waitUntil: 'networkidle' })
          await page.screenshot({ path:path.join(root,'screenshots',`day11-${name}-${width}.png`),fullPage:true })
        }
        results.push({ page:`${name}.html`,width,title,...layout,keyboardControls,contrastPairs:contrast.pairs,passed:true })
        console.log(`PASS ${name}.html @ ${width}px · focus ${keyboardControls} · contrast ${contrast.pairs.length} pairs · tables ${layout.tables.length}`)
      }
    }
    assert.equal(new Set(titles.values()).size,9,'Nine unique page titles')
    assert.deepEqual(errors,[],'No browser or asset errors')
    const report={browser:await browser.version(),base,screenCount:9,viewportCount:5,localTargetsChecked:targetCache.size,results,errors}
    fs.writeFileSync(path.join(root,'qa',process.env.QA_REPORT_NAME||'browser-results-day11.json'),JSON.stringify(report,null,2)+'\n')
    console.log(`PASS: 45 page/viewport checks; ${targetCache.size} distinct local targets; zero errors; ten screenshots.`)
  } finally { await browser.close() }
}
run().catch(error=>{console.error(error);process.exitCode=1})
