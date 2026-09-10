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
  for(const width of [360,390,430,768,1024,1440]){
    const context=await browser.newContext({viewport:{width,height:900},acceptDownloads:true});
    const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
    for(const entity of examples){
      assert.equal((await page.goto(origin+entity.path)).status(),200);
      assert.equal(await page.locator('h1').textContent(),entity.name);
      assert.equal(await page.locator('.vc-card').getAttribute('data-variant'),entity.variant);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      assert.equal(await page.locator('.vc-actions a[href*="wa.me"]').count(),Number(Boolean(entity.whatsapp)));
      await page.locator('#vc-share').click();
      assert.deepEqual(await page.locator('#vc-dialog .vc-action').allTextContents(),['Partager le lien','Télécharger la carte de visite']);
      assert.equal(await page.locator('#vc-dialog a').count(),0);
      assert.equal(await page.locator('#vc-dialog button').count(),3);
      await page.locator('#vc-business-preview').waitFor({state:'visible'});
      assert.equal(await page.locator('#vc-business-preview').evaluate(img=>img.naturalWidth),1700);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      if(width===390){
        const prefix=engineName+'-'+entity.type+'-'+entity.variant;
        await page.screenshot({path:path.join(output,prefix+'-simple-menu.png')});
        const pending=page.waitForEvent('download');await page.locator('#vc-business').click();
        const download=await pending;assert.equal(download.suggestedFilename(),entity.slug+'-medomicile-carte-visite.png');
        const destination=path.join(output,prefix+'-carte-visite.png');await download.saveAs(destination);
        const png=await fs.readFile(destination);assert.equal(png.readUInt32BE(16),1700);assert.equal(png.readUInt32BE(20),1100);
        // Native OS share is mocked; no external app receives a message.
        await page.evaluate(()=>Object.defineProperty(navigator,'share',{configurable:true,value:async payload=>{window.shared=payload;}}));
        await page.locator('#vc-share-link').click();
        assert.equal(await page.evaluate(()=>window.shared.url),entity.share_url || entity.url);
        assert.equal(await page.evaluate(()=>window.shared.title),entity.name);
        assert.ok(await page.evaluate(()=>Boolean(window.shared.text)));
        await page.evaluate(()=>{Object.defineProperty(navigator,'share',{configurable:true,value:undefined});Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.copied=value;}}});});
        await page.locator('#vc-share-link').click();assert.equal(await page.evaluate(()=>window.copied),entity.share_url || entity.url);
        assert.equal(await page.locator('#vc-status').textContent(),'Lien copié.');
        await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied');}}}));
        await page.locator('#vc-share-link').click();assert.equal(await page.locator('#vc-copy-fallback').inputValue(),entity.share_url || entity.url);
        assert.equal(await page.locator('#vc-copy-fallback').isVisible(),true);
        await page.locator('#vc-close').click();await page.locator('#vc-language').selectOption('ar');
        await page.locator('#vc-share').click();assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
        await page.evaluate(()=>Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{throw new DOMException('Cancelled','AbortError');}}));
        await page.locator('#vc-share-link').click();assert.equal(await page.locator('#vc-status').textContent(),'');
      }
      await page.keyboard.press('Escape');assert.equal(await page.locator('#vc-dialog').isVisible(),false);
      results.push({engine:engineName,width,url:entity.path});
    }
    await context.close();
  }
  await browser.close();
}
assert.deepEqual(errors,[]);
await fs.writeFile(path.join(output,'browser-report.json'),JSON.stringify({cases:results.length,results,errors},null,2));
console.log(JSON.stringify({cases:results.length,engines:['chromium','webkit'],errors}));
