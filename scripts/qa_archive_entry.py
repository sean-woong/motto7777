import asyncio,functools,http.server,threading,time
from pathlib import Path
from playwright.async_api import async_playwright
class Handler(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Handler,directory=str(Path(__file__).resolve().parents[1])))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/archive.html?view=vault'
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless=True)
  for lang,width in [('ko',1440),('en',768),('ja',390)]:
   c=await b.new_context(viewport={'width':width,'height':900},locale=lang,reduced_motion='reduce')
   await c.add_init_script('''window.entryTimes={}; new MutationObserver(()=>{const d=document.querySelector('.archive-entry[open]');if(d&&!entryTimes.start)entryTimes.start=performance.now();if(!d&&entryTimes.start&&!entryTimes.end)entryTimes.end=performance.now()}).observe(document,{childList:true,subtree:true});''')
   page=await c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   await page.goto(base,wait_until='domcontentloaded')
   await page.wait_for_selector('.archive-entry[open]')
   assert await page.locator('.archive-entry').get_attribute('lang')==lang
   assert await page.locator('.archive-entry').evaluate('e=>e.scrollWidth<=e.clientWidth && e.scrollHeight<=e.clientHeight')
   await page.screenshot(path=f'/tmp/archive-entry-{lang}.png')
   await page.wait_for_selector('.archive-entry',state='detached')
   elapsed=await page.evaluate('entryTimes.end-entryTimes.start');assert 2950<=elapsed<=4500,elapsed
   await page.reload(wait_until='domcontentloaded');await page.wait_for_selector('main h1')
   assert await page.locator('.archive-entry').count()==0
   assert not errors,errors
   print(lang,width,'duration_ms',round(elapsed),'return visit skipped',flush=True)
   await c.close()
  for method in ['click','touch','Escape','Enter']:
   c=await b.new_context(viewport={'width':390,'height':844},has_touch=True)
   page=await c.new_page();await page.goto(base,wait_until='domcontentloaded');await page.wait_for_selector('.archive-entry[open]')
   start=time.monotonic()
   if method=='click':await page.locator('.archive-entry h2').click()
   elif method=='touch':await page.locator('.archive-entry h2').tap()
   else:await page.keyboard.press(method)
   await page.wait_for_selector('.archive-entry',state='detached')
   assert time.monotonic()-start<1.5
   assert await page.evaluate('localStorage.getItem("motto-archive-entry-seen")')=='1'
   print('skip',method,'PASS',flush=True);await c.close()
  await b.close()
try:asyncio.run(main())
finally:server.shutdown()
