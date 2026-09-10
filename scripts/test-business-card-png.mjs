import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.join(root,'test-results/cards/png');
await fs.mkdir(out,{recursive:true});
const entities=JSON.parse(await fs.readFile(path.join(root,'data/virtual-card-index.json'),'utf8'));
const seed=entities.find(e=>e.type==='doctor');
const examples=[...new Set(entities.map(e=>e.type))].map(type=>entities.find(e=>e.type===type));
examples.push(entities.find(e=>e.id==='pr-walid-el-ouardi'),entities.find(e=>e.id==='dr-youssef-gaouri'));
examples.push({...seed,id:'short',name:'Dr Ali'},
  {...seed,id:'long',name:'Pr Abdelmounaim Mohammed El Ouardi Benchekroun',address:'Villa 69, avenue Mohammed V, immeuble Centre Palace, deuxième étage, bureau 10, quartier Ismailia, Kénitra'},
  {...seed,id:'multispecialty',subtitle:'Gastro-entérologie, hépatologie et endoscopie diagnostique et thérapeutique : fibroscopie, coloscopie, POEM, ESD, CPRE, écho-endoscopie'},
  {...seed,id:'missing',phones:[],responsible_person:null,address:null,district:null,city:null});
const results=[];
for(const [name,engine] of [['chromium',chromium],['webkit',webkit]]){
  const browser=await engine.launch(),page=await browser.newPage();
  await page.goto('http://127.0.0.1:4175/p/dr-mouad-daoudi/');
  for(const entity of examples){
    let standard;
    for(const variant of ['standard','gold']){
      const result=await page.evaluate(async ({entity,variant})=>{
        const {generateBusinessCard}=await import('/assets/business-card.js');
        const card=await generateBusinessCard(entity,{variant,labels:{responsible_person:'Médecin responsable',director:'Directeur médical',resuscitation_doctor:'Réanimateur responsable'}});
        return {png:card.canvas.toDataURL(),blob:await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(card.blob);}),boxes:card.boxes,qr:card.qr};
      },{entity,variant});
      if(variant==='standard')standard=result;else assert.deepEqual(result.boxes,standard.boxes,'Same geometry');
      for(const box of result.boxes){assert.ok(box.x>=48&&box.x+box.width<=802);assert.ok(box.y>=124&&box.y+box.height<=490,entity.id);assert.ok(box.size>=13.3);}
      for(let i=1;i<result.boxes.length;i++)assert.ok(result.boxes[i-1].y+result.boxes[i-1].height<result.boxes[i].y);
      assert.ok(result.qr.x+result.qr.width<=802);assert.ok(result.qr.x>594);
      await fs.writeFile(path.join(out,name+'-'+entity.id+'-'+variant+'.png'),Buffer.from(result.blob.split(',')[1],'base64'));
      results.push({engine:name,id:entity.id,variant,url:entity.url});
    }
  }
  // Check every current profile for layout failure without generating extra checked-in files.
  if(name==='chromium'){
    const failures=await page.evaluate(async entities=>{
      const {generateBusinessCard}=await import('/assets/business-card.js');const errors=[];
      for(const entity of entities){try{await generateBusinessCard(entity);}catch(error){errors.push({name:entity.name,error:error.message});}}
      return errors;
    },entities);
    assert.deepEqual(failures,[]);
  }
  await browser.close();
}
await fs.writeFile(path.join(out,'report.json'),JSON.stringify({totalProfiles:entities.length,exports:results.length,results},null,2));
console.log(JSON.stringify({totalProfiles:entities.length,exports:results.length}));
