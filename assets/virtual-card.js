/* Shared card actions. All identities and links come from the generated JSON. */
(() => {
  'use strict';
  const data = JSON.parse(document.getElementById('vc-data').textContent);
  const translations = {
    fr: {call:'Appeler', whatsapp:'WhatsApp', directions:'Itinéraire', share:'Partager', save:'Enregistrer le contact', qr:'Télécharger le QR code', print:'Imprimer', shareImage:'Partager la carte en image', shareLink:'Partager le lien', copy:'Copier le lien', download:'Télécharger l’image', copied:'Lien copié.', manual:'Sélectionnez le lien pour le copier.', preparing:'Préparation de l’image…', downloaded:'Image téléchargée.', failed:'Impossible de générer l’image. Réessayez ou partagez le lien.', ready:'Image prête à partager.', close:'Fermer', address:'Adresse', city:'Ville', district:'Quartier', phone:'Téléphone', subspecialty:'Sous-spécialité', responsible_person:'Responsable', director:'Directeur médical', resuscitation_doctor:'Réanimateur principal', website:'Site web', note:'Contactez directement le professionnel ou l’établissement pour confirmer les informations.', type_doctor:'Médecin', type_dentist:'Dentiste', type_clinic:'Clinique', type_hospital:'Hôpital', type_dialysis_center:'Dialyse', type_radiology_center:'Radiologie', type_laboratory:'Laboratoire', type_pharmacy:'Pharmacie', open24h:'24h/24', contact:'Coordonnées sur Medomicile'},
    en: {call:'Call', whatsapp:'WhatsApp', directions:'Directions', share:'Share', save:'Save contact', qr:'Download QR code', print:'Print', shareImage:'Share card as an image', shareLink:'Share link', copy:'Copy link', download:'Download image', copied:'Link copied.', manual:'Select the link to copy it.', preparing:'Preparing image…', downloaded:'Image downloaded.', failed:'Unable to create the image. Retry or share the link.', ready:'Image ready to share.', close:'Close', address:'Address', city:'City', district:'District', phone:'Phone', subspecialty:'Subspecialty', responsible_person:'Responsible person', director:'Medical director', resuscitation_doctor:'Lead intensive care specialist', website:'Website', note:'Contact the professional or establishment directly to confirm the information.', type_doctor:'Doctor', type_dentist:'Dentist', type_clinic:'Clinic', type_hospital:'Hospital', type_dialysis_center:'Dialysis', type_radiology_center:'Radiology', type_laboratory:'Laboratory', type_pharmacy:'Pharmacy', open24h:'24/7', contact:'Contact details on Medomicile'},
    ar: {call:'اتصال', whatsapp:'واتساب', directions:'الاتجاهات', share:'مشاركة', save:'حفظ جهة الاتصال', qr:'تنزيل رمز QR', print:'طباعة', shareImage:'مشاركة البطاقة كصورة', shareLink:'مشاركة الرابط', copy:'نسخ الرابط', download:'تنزيل الصورة', copied:'تم نسخ الرابط.', manual:'حدد الرابط لنسخه.', preparing:'جارٍ إعداد الصورة…', downloaded:'تم تنزيل الصورة.', failed:'تعذر إنشاء الصورة. أعد المحاولة أو شارك الرابط.', ready:'الصورة جاهزة للمشاركة.', close:'إغلاق', address:'العنوان', city:'المدينة', district:'الحي', phone:'الهاتف', subspecialty:'التخصص الدقيق', responsible_person:'المسؤول', director:'المدير الطبي', resuscitation_doctor:'الطبيب الرئيسي في الإنعاش', website:'الموقع الإلكتروني', note:'اتصل مباشرة بالمهني أو المؤسسة للتأكد من المعلومات.', type_doctor:'طبيب', type_dentist:'طبيب أسنان', type_clinic:'مصحة', type_hospital:'مستشفى', type_dialysis_center:'تصفية الدم', type_radiology_center:'الأشعة', type_laboratory:'مختبر', type_pharmacy:'صيدلية', open24h:'24/24', contact:'بيانات الاتصال على Medomicile'}
  };
  let lang = 'fr';
  translations.fr.partner='PARTENAIRE MEDOMICILE';
  translations.en.partner='MEDOMICILE PARTNER';
  translations.ar.partner='شريك MEDOMICILE';
  translations.fr.business='Carte de visite 85 × 55 mm';
  translations.en.business='Business card 85 × 55 mm';
  translations.ar.business='بطاقة زيارة 85 × 55 مم';
  const t = key => translations[lang][key] || ({instagram:'Instagram',facebook:'Facebook'})[key] || key;
  const dialog = document.getElementById('vc-dialog');
  const status = document.getElementById('vc-status');
  const selector = document.getElementById('vc-language');
  const setLanguage = value => {
    lang = translations[value] ? value : 'fr';
    selector.value = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
    const close = document.getElementById('vc-close');
    close.title = close.ariaLabel = t('close');
    imagePromise = null;
  };
  let imagePromise = null;
  selector.addEventListener('change', () => setLanguage(selector.value));
  setLanguage(new URLSearchParams(location.search).get('lang'));
  window.lucide?.createIcons();
  document.querySelector('.vc-photo').addEventListener('error', event => {
    event.target.onerror = null;
    event.target.src = '/assets/optimized/medomicile-logo-160.png';
  }, {once:true});

  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const timeout = setTimeout(() => reject(new Error('Image timeout')), 10000);
      img.onload = () => { clearTimeout(timeout); resolve(img); };
      img.onerror = () => { clearTimeout(timeout); reject(new Error('Image unavailable')); };
      img.src = url;
    });
  }
  function fitImage(ctx, img, x, y, width, height) {
    const ratio = Math.min(width/img.naturalWidth, height/img.naturalHeight);
    const w = img.naturalWidth*ratio, h = img.naturalHeight*ratio;
    ctx.drawImage(img, x+(width-w)/2, y+(height-h)/2, w, h);
  }
  function textBlock(ctx, value, y, maxHeight, maxSize, color, weight=400, width=928, center=540) {
    if (!value) return;
    let lines=[], size=maxSize;
    for (; size>=16; size--) {
      ctx.font = `${weight} ${size}px Arial, sans-serif`;
      lines=[]; let line='';
      for (const word of String(value).split(/\s+/)) {
        if (ctx.measureText(word).width > width) {
          if (line) { lines.push(line); line=''; }
          for (const character of word) {
            if (ctx.measureText(line+character).width > width) { lines.push(line); line=''; }
            line+=character;
          }
        } else if (line && ctx.measureText(line+' '+word).width > width) {
          lines.push(line); line=word;
        } else { line += (line ? ' ' : '')+word; }
      }
      if (line) lines.push(line);
      if (lines.length*size*1.25<=maxHeight) break;
    }
    ctx.direction = /[\u0600-\u06ff]/.test(String(value)) ? 'rtl' : 'ltr';
    ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='top';
    size=Math.max(size,16);
    const limit=Math.max(1,Math.floor(maxHeight/(size*1.25)));
    if(lines.length>limit){lines=lines.slice(0,limit);let last=lines[limit-1];while(ctx.measureText(last+'…').width>width)last=last.slice(0,-1);lines[limit-1]=last+'…';}
    lines.forEach((line,i)=>ctx.fillText(line,center,y+i*size*1.25));
  }
  async function makeImage() {
    const canvas=document.createElement('canvas'); canvas.width=1080;canvas.height=1350;
    const ctx=canvas.getContext('2d');
    const premium=data.variant==='premium';
    const imageType=t(premium?'partner':'type_'+data.type);
    const [logo,qr]=await Promise.all([loadImage('/assets/brand/medomicile-logo.png'),loadImage(data.qr)]);
    ctx.fillStyle='#f5f8fb';ctx.fillRect(0,0,1080,1350);
    ctx.beginPath();
    if(ctx.roundRect)ctx.roundRect(28,28,1024,1294,24);else ctx.rect(28,28,1024,1294);
    const background=ctx.createLinearGradient(28,28,1052,1322);
    background.addColorStop(0,'#fffaf0');background.addColorStop(.45,'#ffffff');background.addColorStop(1,'#eef6fc');
    ctx.fillStyle=premium?background:'#ffffff';ctx.fill();ctx.strokeStyle=premium?'#b38b36':'#d5e2ec';ctx.lineWidth=premium?6:2;ctx.stroke();
    fitImage(ctx,logo,72,48,84,84);
    ctx.font='700 40px Arial';ctx.fillStyle='#12364b';ctx.textAlign='left';ctx.fillText('Medomicile',178,103);
    ctx.fillStyle='#b38b36';ctx.fillRect(72,158,936,3);
    if(premium){ctx.fillStyle='#fbf2dd';ctx.fillRect(190,177,700,62);}
    textBlock(ctx,imageType,186,50,27,'#765913',700);
    let photo=logo;
    if(data.photo) { try { photo=await loadImage(data.photo); } catch { /* Use the genuine brand mark, never a fictitious portrait. */ } }
    fitImage(ctx,photo,390,245,300,180);
    textBlock(ctx,data.name,457,146,62,'#12364b',700);
    const expertise=data.expertise || data.subspecialty;
    textBlock(ctx,data.subtitle,621,expertise?110:174,34,'#4c6577');
    if(expertise)textBlock(ctx,expertise,739,65,26,'#765913',700);
    textBlock(ctx,data.address || [data.district,data.city].filter(Boolean).join(' · '),818,105,30,'#4c6577');
    textBlock(ctx,data.phones.map(p=>p.label).join(' · '),946,55,32,'#125181',700);
    if(premium){ctx.fillStyle='#fffaf0';ctx.fillRect(390,1006,300,264);ctx.strokeStyle='#b38b36';ctx.lineWidth=2;ctx.strokeRect(390,1006,300,264);}
    ctx.imageSmoothingEnabled=false;fitImage(ctx,qr,420,1020,240,240);
    textBlock(ctx,'medomicile.com',1280,40,25,'#12364b',700);
    return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('PNG unavailable')),'image/png'));
  }
  const prepareImage=()=>imagePromise ||= makeImage().catch(error=>{imagePromise=null;throw error;});
  document.getElementById('vc-business').addEventListener('click',async event=>{
    const button=event.currentTarget;button.disabled=true;status.textContent=t('preparing');
    try {
      // A self-contained SVG supplies exact physical dimensions; embedded artwork is 300 dpi.
      const canvas=document.createElement('canvas');canvas.width=1004;canvas.height=650;
      const ctx=canvas.getContext('2d'),gold=data.variant==='premium';
      const badge=t(gold?'partner':'type_'+data.type);
      const [logo,qr]=await Promise.all([loadImage('/assets/brand/medomicile-logo.png'),loadImage(data.qr)]);
      ctx.fillStyle=gold?'#fffdf7':'#ffffff';ctx.fillRect(0,0,1004,650);
      ctx.strokeStyle=gold?'#b38b36':'#d5e2ec';ctx.lineWidth=3;ctx.strokeRect(20,20,964,610);
      fitImage(ctx,logo,42,42,80,80);
      textBlock(ctx,'Medomicile',58,50,32,'#12364b',700,500,380);
      textBlock(ctx,badge,146,45,24,'#765913',700,594,342);
      textBlock(ctx,data.name,208,120,42,'#12364b',700,594,342);
      textBlock(ctx,data.subtitle,338,105,26,'#4c6577',400,594,342);
      textBlock(ctx,data.address||[data.district,data.city].filter(Boolean).join(' · '),461,65,23,'#4c6577',400,594,342);
      textBlock(ctx,data.phones.map(p=>p.label).join(' · '),555,45,27,'#125181',700,594,342);
      ctx.imageSmoothingEnabled=false;fitImage(ctx,qr,686,224,248,248);
      textBlock(ctx,'medomicile.com',491,40,23,'#12364b',700,274,810);
      const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="85mm" height="55mm" viewBox="0 0 1004 650"><image width="1004" height="650" href="${canvas.toDataURL('image/png')}"/></svg>`;
      const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'})),link=document.createElement('a');
      link.href=url;link.download=`${data.slug}-medomicile-85x55mm.svg`;document.body.append(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),60000);status.textContent=t('downloaded');
    } catch {status.textContent=t('failed');}finally{button.disabled=false;}
  });
  function download(blob) {
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=`${data.slug}-medomicile.png`;document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),60000);status.textContent=t('downloaded');
  }
  document.getElementById('vc-share').addEventListener('click',()=>{
    status.textContent='';dialog.showModal();
    prepareImage().catch(()=>{});
  });
  document.getElementById('vc-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  document.getElementById('vc-print').addEventListener('click',()=>window.print());
  const shareText=()=>`${data.name}${data.city ? ' · '+data.city : ''}\n${t('contact')}`;
  document.getElementById('vc-share-link').addEventListener('click',async()=>{
    if(navigator.share) {
      try { await navigator.share({title:data.name,text:shareText(),url:data.url});return; }
      catch(error){if(error.name==='AbortError')return;}
    }
    document.getElementById('vc-copy').focus();status.textContent=t('manual');
  });
  document.getElementById('vc-copy').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(data.url);status.textContent=t('copied');}
    catch{const input=document.getElementById('vc-copy-fallback');input.hidden=false;input.focus();input.select();status.textContent=t('manual');}
  });
  async function imageAction(event,share) {
    const button=event.currentTarget;button.disabled=true;status.textContent=t('preparing');
    try {
      const blob=await prepareImage();
      const file=new File([blob],`${data.slug}-medomicile.png`,{type:'image/png'});
      if(share && navigator.share && navigator.canShare?.({files:[file]})) {
        try { await navigator.share({files:[file],title:data.name,text:shareText(),url:data.url});status.textContent='';return; }
        catch(error){if(error.name==='AbortError'){status.textContent='';return;}}
      }
      download(blob);
    } catch { status.textContent=t('failed'); }
    finally{button.disabled=false;}
  }
  document.getElementById('vc-share-image').addEventListener('click',event=>imageAction(event,true));
  document.getElementById('vc-download').addEventListener('click',event=>imageAction(event,false));
  if(new URLSearchParams(location.search).get('share')==='1') document.getElementById('vc-share').click();
})();
