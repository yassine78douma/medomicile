// Light HERO tokens from style.css :root, h1 and .directory-hero.page-hero.
export const CARD_THEMES = Object.freeze({
  standard: {ink:'#082f49',accent:'#0f4c81',accentText:'#0f4c81',bright:'#2f80ed',pale:'#eaf3ff',surface:'#ffffff',soft:'#f8fafc',muted:'#334155'},
  gold: {ink:'#082f49',accent:'#b88a2b',accentText:'#8a6a15',bright:'#c6a969',pale:'#f7f0df',surface:'#ffffff',soft:'#f8fafc',muted:'#334155'}
});
export const CARD_I18N = Object.freeze({
  fr: {partner:'PARTENAIRE MEDOMICILE',urgency:'Urgences 24h/24',doctor:'Médecin',dentist:'Dentiste',clinic:'Clinique',hospital:'Hôpital',dialysis_center:'Centre de dialyse',laboratory:'Laboratoire',radiology_center:'Centre de radiologie',pharmacy:'Pharmacie'},
  en: {partner:'MEDOMICILE PARTNER',urgency:'24/7 Emergency',doctor:'Doctor',dentist:'Dental Surgeon',clinic:'Clinic',hospital:'Hospital',dialysis_center:'Dialysis Center',laboratory:'Laboratory',radiology_center:'Radiology Center',pharmacy:'Pharmacy'},
  ar: {partner:'شريك ميدوميسيل',urgency:'طوارئ 24/24',doctor:'طبيب',dentist:'طبيب أسنان',clinic:'مصحة',hospital:'مستشفى',dialysis_center:'مركز تصفية الدم',laboratory:'مختبر',radiology_center:'مركز الأشعة',pharmacy:'صيدلية'}
});
const SPECIALTY_I18N = Object.freeze({
  'chirurgien-dentiste': {en:'Dental Surgeon',ar:'جراح أسنان'},
  'dentiste': {en:'Dentist',ar:'طبيب أسنان'},
  'gastro-entérologue': {en:'Gastroenterologist',ar:'اختصاصي أمراض الجهاز الهضمي'},
  'médecin généraliste': {en:'General Practitioner',ar:'طبيب عام'}
});
const translateSpecialty=(value,lang)=>{
  const key=String(value||'').trim().toLocaleLowerCase('fr-FR');
  if(key.startsWith('spécialiste en gastroentérologie')){
    return lang==='en'?'Gastroenterology, hepatology and diagnostic and therapeutic endoscopy specialist (Gastroscopy, Colonoscopy, Polypectomy, POEM, Submucosal Dissection, ERCP, Endoscopic Ultrasound).':lang==='ar'?'اختصاصي في أمراض الجهاز الهضمي والكبد والتنظير التشخيصي والعلاجي (تنظير المعدة والقولون، استئصال السلائل، POEM، التشريح تحت المخاطية، CPRE والتنظير بالموجات فوق الصوتية).':value;
  }
  return SPECIALTY_I18N[key]?.[lang]||value;
};
let fontsPromise;
const imagePromises=new Map();
function loadFonts() {
  return fontsPromise ||= Promise.all([
    ['CardInter','inter-400.ttf',400],['CardInter','inter-700.ttf',700],
    ['CardManrope','manrope-800.ttf',800],['CardTajawal','tajawal-400.ttf',400],['CardTajawal','tajawal-700.ttf',700]
  ].map(async ([family,file,weight])=>{
    const font=await new FontFace(family,`url(/assets/fonts/${file})`,{weight:String(weight)}).load();
    document.fonts.add(font);
  })).catch(error=>{fontsPromise=null;throw error;});
}
function loadImage(url) {
  if(imagePromises.has(url))return imagePromises.get(url);
  const pending=new Promise((resolve,reject)=>{
    const image=new Image();image.crossOrigin='anonymous';
    const timer=setTimeout(()=>reject(new Error('Image unavailable')),10000);
    image.onload=()=>{clearTimeout(timer);resolve(image);};
    image.onerror=()=>{clearTimeout(timer);reject(new Error('Image unavailable'));};image.src=url;
  }).catch(error=>{imagePromises.delete(url);throw error;});
  imagePromises.set(url,pending);
  return pending;
}
const isRTL=value=>/[\u0600-\u06ff]/.test(value);
function fontFor(text,size,title=false,bold=false){
  return `${title&&!isRTL(text)?800:bold||title?700:400} ${size}px ${isRTL(text)?'CardTajawal':title?'CardManrope':'CardInter'}`;
}
function wrap(ctx,text,width) {
  const lines=[];let line='';
  for(const word of String(text).trim().split(/\s+/)){
    if(ctx.measureText(word).width>width){
      if(line){lines.push(line);line='';}
      for(const {segment} of new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(word)){
        if(ctx.measureText(line+segment).width>width){lines.push(line);line='';}line+=segment;
      }
    }else if(line&&ctx.measureText(line+' '+word).width>width){lines.push(line);line=word;}
    else line+=(line?' ':'')+word;
  }
  if(line)lines.push(line);return lines;
}
function background(ctx,theme){
  ctx.fillStyle=theme.surface;ctx.fillRect(0,0,850,550);
  const wash=ctx.createLinearGradient(0,0,0,550);wash.addColorStop(0,theme.soft);wash.addColorStop(.42,theme.surface);wash.addColorStop(1,theme.surface);
  ctx.fillStyle=wash;ctx.fillRect(0,0,850,550);
  // Peripheral curves stay outside the text/QR safe areas; identical paths in both themes.
  ctx.fillStyle=theme.pale;ctx.beginPath();ctx.moveTo(230,0);ctx.bezierCurveTo(470,90,650,-12,850,88);ctx.lineTo(850,0);ctx.closePath();ctx.fill();
  ctx.fillStyle=theme.accent;ctx.beginPath();ctx.moveTo(710,0);ctx.bezierCurveTo(774,8,813,22,850,48);ctx.lineTo(850,0);ctx.closePath();ctx.fill();
  ctx.fillStyle=theme.pale;ctx.beginPath();ctx.moveTo(0,521);ctx.bezierCurveTo(230,472,510,567,850,516);ctx.lineTo(850,550);ctx.lineTo(0,550);ctx.closePath();ctx.fill();
  ctx.strokeStyle=theme.bright;ctx.globalAlpha=.22;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,535);ctx.bezierCurveTo(220,481,510,571,850,531);ctx.stroke();ctx.globalAlpha=1;
}
function contactBlocks(entity,labels){
  const blocks=[{key:'name',text:entity.name,title:true},
    {key:'specialty',text:labels.specialty||translateSpecialty(entity.subtitle||entity.specialty,labels.lang)},
    {key:'establishment',text:entity.establishment}];
  const responsible=entity.type==='hospital'&&entity.director ? ['director',entity.director]
    :entity.type==='clinic'&&entity.resuscitation_doctor ? ['resuscitation_doctor',entity.resuscitation_doctor]
    :entity.responsible_person ? ['responsible_person',entity.responsible_person] : null;
  if(responsible)blocks.push({key:'responsible',text:`${labels[responsible[0]]||'Responsable'}\n${responsible[1]}`});
  if(entity.subspecialty&&entity.subspecialty!==entity.subtitle)blocks.push({key:'expertise',text:entity.subspecialty});
  blocks.push({key:'address',text:entity.address||[entity.district,entity.city].filter(Boolean).join(', ')});
  blocks.push({key:'phone',text:(entity.phones||[]).map(p=>p.label||p.number).join(' · '),bold:true});
  return blocks.filter(b=>b.text);
}
function layout(ctx,blocks){
  for(let step=0;step<=12;step++){
    const scale=1-step*.025;let y=156;
    const boxes=blocks.map(block=>{
      const size=block.title?40*scale:block.bold?21*scale:19*scale;
      ctx.font=fontFor(block.text,size,block.title,block.bold);
      const lines=block.text.split('\n').flatMap(line=>wrap(ctx,line,546));
      const height=lines.length*size*1.24;
      const box={...block,x:48,y,width:546,height,size,lines};y+=height+(block.title?14:12);return box;
    });
    if(y-12<=490)return boxes;
  }
  // Never silently truncate supplied contact information or produce an overlapping export.
  throw new Error('CARD_CONTENT_TOO_LONG');
}
function drawText(ctx,text,x,y,size,color,title=false,bold=false,width=546){
  ctx.font=fontFor(text,size,title,bold);ctx.fillStyle=color;ctx.textBaseline='alphabetic';
  ctx.direction=isRTL(text)?'rtl':'ltr';ctx.textAlign=isRTL(text)?'right':'left';
  ctx.fillText(text,isRTL(text)?x+width:x,y+size);
}
function drawUrgencyBadge(ctx,y,label){
  const x=590,w=220,h=24;
  const gradient=ctx.createLinearGradient(x,y,x+w,y+h);
  gradient.addColorStop(0,'#d13a3a');gradient.addColorStop(1,'#c62828');
  ctx.fillStyle=gradient;ctx.shadowColor='#7f1d1d26';ctx.shadowBlur=5;ctx.shadowOffsetY=2;
  ctx.beginPath();ctx.roundRect(x,y,w,h,h/2);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(x+14,y+12,6,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#c62828';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+14,y+8);ctx.lineTo(x+14,y+16);ctx.moveTo(x+10,y+12);ctx.lineTo(x+18,y+12);ctx.stroke();
  drawText(ctx,label,x+28,y+5,11,'#ffffff',false,true,w-34);
}
// Canvas normally labels PNGs 96 dpi. 20,000 px/m makes 1700 x 1100 exactly 85 x 55 mm.
async function physicalPNG(canvas){
  const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('PNG unavailable')),'image/png'));
  const bytes=new Uint8Array(await blob.arrayBuffer()),view=new DataView(bytes.buffer);
  const chunk=new Uint8Array(21),cv=new DataView(chunk.buffer);cv.setUint32(0,9);
  chunk.set([112,72,89,115],4);cv.setUint32(8,20000);cv.setUint32(12,20000);chunk[16]=1;
  let crc=0xffffffff;for(const b of chunk.slice(4,17)){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}cv.setUint32(17,(crc^0xffffffff)>>>0);
  const parts=[bytes.slice(0,8)];
  for(let pos=8;pos<bytes.length;){const length=view.getUint32(pos)+12,type=String.fromCharCode(...bytes.slice(pos+4,pos+8));
    if(type!=='pHYs')parts.push(bytes.slice(pos,pos+length));if(type==='IHDR')parts.push(chunk);pos+=length;}
  return new Blob(parts,{type:'image/png'});
}
export async function generateBusinessCard(entity,options={}){
  const url=new URL(entity.url);if(url.origin!=='https://medomicile.com'||!/^\/(p|e)\//.test(url.pathname))throw new Error('Invalid personal URL');
  const gold=options.variant ? ['gold','premium'].includes(options.variant) : ['gold','premium'].includes(entity.variant)||['featured','premium','sponsored','gold'].some(key=>entity[key]===true);
  const theme=CARD_THEMES[gold?'gold':'standard'];
  const lang=(options.lang||document.documentElement.lang||'fr').split('-')[0];
  const labels={...(CARD_I18N[lang]||CARD_I18N.fr),lang,...(options.labels||{})};
  const [logo,qr]=await Promise.all([loadImage('/assets/brand/medomicile-logo.png'),loadImage(entity.qr),loadFonts()]);
  const canvas=document.createElement('canvas');canvas.width=1700;canvas.height=1100;const ctx=canvas.getContext('2d');ctx.scale(2,2);
  background(ctx,theme);ctx.drawImage(logo,48,48,58,58);
  drawText(ctx,'Medomicile',118,60,27,theme.ink,true);
  const category=options.category||labels[entity.type]||entity.type;
  drawText(ctx,category.toLocaleUpperCase(),48,124,12,theme.accentText,false,true);
  if(gold)drawText(ctx,options.partner||labels.partner,550,90,11,theme.accentText,false,true,250);
  const is24h=entity.is24h===true||entity.open24h===true||entity.available24h===true||entity.urgences===true||entity.emergency24===true||entity.open24===true||entity.onDuty===true;
  if(is24h)drawUrgencyBadge(ctx,gold?118:72,labels.urgency);
  const boxes=layout(ctx,contactBlocks(entity,labels));
  for(const box of boxes)box.lines.forEach((line,i)=>drawText(ctx,line,box.x,box.y+i*box.size*1.24,box.size,box.title?theme.ink:box.bold?theme.accentText:theme.muted,box.title,box.bold));
  // Integer scaling preserves the QR modules and its original white quiet zone.
  const modules=qr.naturalWidth/8,qrSize=Math.floor(384/modules)*modules;
  const qrWidth=qrSize/2,qrX=714-qrWidth/2,qrY=310;
  ctx.fillStyle='#ffffff';ctx.fillRect(qrX-8,qrY-8,qrWidth+16,qrWidth+16);
  ctx.imageSmoothingEnabled=false;ctx.drawImage(qr,qrX,qrY,qrWidth,qrWidth);ctx.imageSmoothingEnabled=true;
  drawText(ctx,'medomicile.com',638,490,15,theme.ink,false,true,164);
  return {blob:await physicalPNG(canvas),canvas,variant:gold?'gold':'standard',boxes,qr:{x:qrX,y:qrY,width:qrWidth,height:qrWidth},width:1700,height:1100};
}
