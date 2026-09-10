import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const origin=process.env.TEST_ORIGIN || 'http://127.0.0.1:4175';
const output=path.join(root,'test-results/cards');await fs.mkdir(output,{recursive:true});
const entities=JSON.parse(await fs.readFile(path.join(root,'data/virtual-card-index.json'),'utf8'));
const examples=[...new Set(entities.map(e=>e.type))].map(type=>entities.find(e=>e.type===type && (type!=='dentist'||e.id==='dr-youssef-gaouri')));
examples.push(entities.find(e=>e.id==='pr-walid-el-ouardi'));
const errors=[],results=[];
for(const [engineName,engine] of [['chromium',chromium],['webkit',webkit]]){
  const browser=await engine.launch({headless:true});
  for(const width of [360,390,537,1440]){
    const context=await browser.newContext({viewport:{width,height:900},acceptDownloads:true});
    const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
    for(const entity of examples){
      const response=await page.goto(origin+entity.path);assert.equal(response.status(),200);
      await page.locator('.vc-photo').waitFor();
      assert.equal(await page.locator('h1').textContent(),entity.name);
      assert.equal(await page.locator('.vc-card').getAttribute('data-variant'),entity.variant);
      const geometry=await page.locator('.vc-card').evaluate(card=>{
        const measure=()=>[card,...card.querySelectorAll('.vc-photo,h1,.vc-actions,.vc-save,.vc-qr')].map(el=>{const r=el.getBoundingClientRect();return [r.x,r.y,r.width,r.height];});
        const before=measure(),variant=card.dataset.variant;card.dataset.variant=variant==='premium'?'standard':'premium';const after=measure();card.dataset.variant=variant;return {before,after};
      });
      assert.deepEqual(geometry.before,geometry.after,'Gold must preserve geometry');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,entity.path);
      assert.equal(await page.locator('.vc-actions a[href^="tel:"]').count(),Number(entity.phones.length>0));
      assert.equal(await page.locator('.vc-actions a[href*="wa.me"]').count(),Number(Boolean(entity.whatsapp)));
      if(entity.google_maps_url)assert.equal(await page.locator('.vc-actions a[href*="maps"]').getAttribute('href'),entity.google_maps_url);
      assert.equal(await page.locator('.vc-qr img').evaluate(img=>img.complete&&img.naturalWidth>0),true);
      await page.locator('#vc-share').click();assert.equal(await page.locator('#vc-dialog').isVisible(),true);
      await page.keyboard.press('Escape');assert.equal(await page.locator('#vc-dialog').isVisible(),false);
      if(width===390){
        await page.screenshot({path:path.join(output,`${engineName}-${entity.type}-${entity.variant}.png`),fullPage:true});
        await page.locator('#vc-share').click();
        const businessPending=page.waitForEvent('download');await page.locator('#vc-business').click();
        const business=await businessPending;assert.equal(business.suggestedFilename(),`${entity.slug}-medomicile-85x55mm.svg`);
        await business.saveAs(path.join(output,`${engineName}-${entity.type}-${entity.variant}-85x55mm.svg`));
        const pending=page.waitForEvent('download');await page.locator('#vc-download').click();
        const download=await pending;assert.equal(download.suggestedFilename(),`${entity.slug}-medomicile.png`);await download.saveAs(path.join(output,`${engineName}-${entity.type}-${entity.variant}-share.png`));
        await page.locator('#vc-close').click();
        await page.locator('#vc-language').selectOption('ar');
        assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
        await page.locator('#vc-share').click();
        const arPending=page.waitForEvent('download');await page.locator('#vc-download').click();
        await (await arPending).saveAs(path.join(output,`${engineName}-${entity.type}-${entity.variant}-ar-share.png`));
        await page.screenshot({path:path.join(output,`${engineName}-${entity.type}-${entity.variant}-ar-menu.png`),fullPage:true});
        await page.locator('#vc-close').click();
        await page.locator('#vc-language').selectOption('en');
        assert.equal(await page.locator('#vc-share').innerText(),'Share');
        // Web Share is simulated, not a claim of a real OS/application transfer.
        await page.evaluate(()=>{Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});Object.defineProperty(navigator,'share',{configurable:true,value:async data=>{window.shared={url:data.url,size:data.files?.[0]?.size,type:data.files?.[0]?.type};}});});
        await page.locator('#vc-share').click();await page.locator('#vc-share-link').click();
        assert.equal(await page.evaluate(()=>window.shared.url),entity.url);
        await page.locator('#vc-share-image').click();
        await page.waitForFunction(()=>window.shared?.type==='image/png');
        assert.equal(await page.evaluate(()=>window.shared.url),entity.url);
        assert.ok(await page.evaluate(()=>window.shared.size>10000));
        await page.locator('#vc-close').click();
      }
      results.push({engine:engineName,width,type:entity.type,url:entity.path});
    }
    await context.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:844}});
  page.on('pageerror',e=>errors.push(e.message));
  for(const filename of ['gastroenterologues-kenitra.html','dentistes-kenitra.html','hopitaux.html','centres-dialyse-kenitra.html','radiologie-kenitra.html','laboratoires-kenitra.html','pharmacies-saknia-kenitra.html']){
    await page.goto(origin+'/'+filename);await page.locator('.entity-actions').first().waitFor({state:'attached'});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,filename);
    const control=page.locator('.compact-card-toggle').first();if(await control.count())await control.click();
    assert.ok(await page.locator('.entity-actions a[href*="share=1"]').count()>0);
  }
  // Clipboard denial leaves a selectable URL, without a false success message.
  await page.goto(origin+examples[0].path);
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied');}}}));
  await page.locator('#vc-share').click();await page.locator('#vc-copy').click();
  assert.equal(await page.locator('#vc-copy-fallback').isVisible(),true);
  assert.equal(await page.locator('#vc-copy-fallback').inputValue(),examples[0].url);
  await page.evaluate(()=>Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false}));
  const fallbackDownload=page.waitForEvent('download');
  await page.locator('#vc-share-image').click();
  assert.equal((await fallbackDownload).suggestedFilename(),`${examples[0].slug}-medomicile.png`);
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.copied=value;}}}));
  await page.locator('#vc-copy').click();
  assert.equal(await page.evaluate(()=>window.copied),examples[0].url);
  await page.goto(origin+'/p/pr-walid-el-ouardi/');await page.setViewportSize({width:1280,height:1600});
  await page.evaluate(()=>{
    const card=document.querySelector('.vc-card'),standard=card.cloneNode(true);standard.dataset.variant='standard';
    standard.querySelector('.vc-badge').textContent='Médecin';
    const comparison=document.createElement('div');comparison.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:24px;align-items:start';
    card.before(comparison);comparison.append(standard,card);
  });
  await page.screenshot({path:path.join(output,`${engineName}-standard-gold-comparison.png`),fullPage:true});
  await browser.close();
}
assert.deepEqual(errors,[]);
await fs.writeFile(path.join(output,'browser-report.json'),JSON.stringify({cases:results.length,results,errors},null,2));
console.log(JSON.stringify({cases:results.length,engines:['chromium','webkit'],errors}));
