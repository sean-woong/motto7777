#!/usr/bin/env python3
"""Read-only local browser regression checks. Requires Python Playwright and Chrome."""
import asyncio
import functools
import http.server
import json
from pathlib import Path
import threading
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

async def run(base):
    results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless=True)
        for width in [1440, 768, 390]:
            context = await browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce', has_touch=width == 390)
            page = await context.new_page()
            errors = []
            requests = []
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.on('request', lambda r: requests.append(r.url))
            for route in ['home', 'vault', 'sound']:
                requests.clear()
                await page.goto(base + '/archive.html?view=' + route)
                await page.wait_for_selector('main h1')
                assert await page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (width, route, 'overflow')
                assert not any('.mp4' in url or '.gif' in url for url in requests), (route, requests)
                assert not await page.locator('video[autoplay]').count()
                if route == 'home':
                    assert await page.locator('link[rel=canonical]').get_attribute('href') == 'https://motto7777.com/archive.html'
                    await page.locator('.home-stage').screenshot(path=f'/tmp/motto-fixed-home-{width}.png')
                for button in await page.locator('[data-motion-toggle]').all():
                    video_id = await button.get_attribute('data-motion-toggle')
                    video = page.locator('#' + video_id)
                    await button.scroll_into_view_if_needed()
                    if width == 390:
                        await button.tap()
                    else:
                        await button.focus()
                        await page.keyboard.press('Enter')
                    await page.wait_for_function('(id) => { const v=document.getElementById(id);return !v.paused && v.currentTime > 0; }', arg=video_id)
                    if video_id.startswith('vault-') or video_id == 'home-motion':
                        assert await video.get_attribute('controls') is not None
                    await button.click()
                    assert await video.evaluate('v=>v.paused')
                    await button.click()
                    await page.wait_for_function('(id)=>!document.getElementById(id).paused', arg=video_id)
                    await video.evaluate('v=>v.pause()')
                    results.append({'width': width, 'player': video_id, 'first_play_pause_resume': 'pass'})
                if route == 'vault':
                    await page.locator('.identity-grid').screenshot(path=f'/tmp/motto-fixed-identity-{width}.png')
                    await page.emulate_media(reduced_motion='no-preference')
                    await page.locator('[data-motion-toggle="vhs-motion"]').click()
                    await page.wait_for_function('!document.getElementById("vhs-motion").paused')
                    await page.emulate_media(reduced_motion='reduce')
                    await page.wait_for_function('document.getElementById("vhs-motion").paused')
                    await page.locator('[data-motion-toggle="mark-motion"]').click()
                    await page.locator('[data-motion-toggle="vhs-motion"]').click()
                    await page.wait_for_function('!document.getElementById("vhs-motion").paused && document.getElementById("mark-motion").paused')
                    await page.locator('#vhs-motion').evaluate('v=>v.currentTime=v.duration-0.1')
                    await page.wait_for_timeout(300)
                    assert await page.locator('#vhs-motion').evaluate('v=>v.currentTime < 0.8 && !v.paused')
                    results.append({'width': width, 'reduced_motion_single_player_loop': 'pass'})
            assert not errors, errors
            await context.close()
        page = await browser.new_page()
        await page.route('**/controlled-motion/vhs-signal.mp4', lambda route: route.abort())
        await page.goto(base+'/archive.html?view=vault')
        button=page.locator('[data-motion-toggle="vhs-motion"]')
        await button.click()
        await page.wait_for_function('document.querySelector("[data-motion-status=vhs-motion]").textContent.length > 0')
        assert await page.locator('#vhs-motion').count() == 1
        await page.unroute('**/controlled-motion/vhs-signal.mp4')
        await button.click()
        await page.wait_for_function('document.getElementById("vhs-motion").currentTime>0')
        results.append({'failure_retry': 'pass'})
        for route in ['/vault/', '/works/immortals/legend-boxer/']:
            await page.goto(base+route)
            await page.wait_for_selector('main h1')
            assert '/archive.html?view=' in page.url
        await page.goto(base+'/')
        assert '난 모르겠어' in await page.title()
        results.append({'entry_routes_root_preserved': 'pass'})
        await browser.close()
    print(json.dumps(results, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    handler=functools.partial(QuietHandler, directory=str(ROOT))
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        asyncio.run(run(f'http://127.0.0.1:{server.server_port}'))
    finally:
        server.shutdown()
