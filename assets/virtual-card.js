/* Shared card actions. All identities and links come from the generated JSON. */
(() => {
  'use strict';
  const data = JSON.parse(document.getElementById('vc-data').textContent);
  const translations = {
    fr: {call:'Appeler', whatsapp:'WhatsApp', directions:'Itinéraire', share:'Partager', save:'Enregistrer le contact', qr:'Télécharger le QR code', print:'Imprimer', shareImage:'Partager la carte en image', shareLink:'Partager le lien', copy:'Copier le lien', download:'Télécharger l’image', copied:'Lien copié.', manual:'Sélectionnez le lien pour le copier.', preparing:'Préparation de l’image…', downloaded:'Image téléchargée.', failed:'Impossible de générer l’image. Réessayez ou partagez le lien.', ready:'Image prête à partager.', close:'Fermer', address:'Adresse', city:'Ville', district:'Quartier', phone:'Téléphone', subspecialty:'Sous-spécialité', responsible_person:'Responsable', director:'Directeur médical', resuscitation_doctor:'Réanimateur principal', website:'Site web', note:'Contactez directement le professionnel ou l’établissement pour confirmer les informations.', type_doctor:'Médecin', type_dentist:'Dentiste', type_clinic:'Clinique', type_hospital:'Hôpital', type_dialysis_center:'Dialyse', type_radiology_center:'Radiologie', type_laboratory:'Laboratoire', type_pharmacy:'Pharmacie', open24h:'🚨 URGENCES 24H/24', contact:'Coordonnées sur Medomicile'},
    en: {call:'Call', whatsapp:'WhatsApp', directions:'Directions', share:'Share', save:'Save contact', qr:'Download QR code', print:'Print', shareImage:'Share card as an image', shareLink:'Share link', copy:'Copy link', download:'Download image', copied:'Link copied.', manual:'Select the link to copy it.', preparing:'Preparing image…', downloaded:'Image downloaded.', failed:'Unable to create the image. Retry or share the link.', ready:'Image ready to share.', close:'Close', address:'Address', city:'City', district:'District', phone:'Phone', subspecialty:'Subspecialty', responsible_person:'Responsible person', director:'Medical director', resuscitation_doctor:'Lead intensive care specialist', website:'Website', note:'Contact the professional or establishment directly to confirm the information.', type_doctor:'Doctor', type_dentist:'Dentist', type_clinic:'Clinic', type_hospital:'Hospital', type_dialysis_center:'Dialysis', type_radiology_center:'Radiology', type_laboratory:'Laboratory', type_pharmacy:'Pharmacy', open24h:'24/7', contact:'Contact details on Medomicile'},
    ar: {call:'اتصال', whatsapp:'واتساب', directions:'الاتجاهات', share:'مشاركة', save:'حفظ جهة الاتصال', qr:'تنزيل رمز QR', print:'طباعة', shareImage:'مشاركة البطاقة كصورة', shareLink:'مشاركة الرابط', copy:'نسخ الرابط', download:'تنزيل الصورة', copied:'تم نسخ الرابط.', manual:'حدد الرابط لنسخه.', preparing:'جارٍ إعداد الصورة…', downloaded:'تم تنزيل الصورة.', failed:'تعذر إنشاء الصورة. أعد المحاولة أو شارك الرابط.', ready:'الصورة جاهزة للمشاركة.', close:'إغلاق', address:'العنوان', city:'المدينة', district:'الحي', phone:'الهاتف', subspecialty:'التخصص الدقيق', responsible_person:'المسؤول', director:'المدير الطبي', resuscitation_doctor:'الطبيب الرئيسي في الإنعاش', website:'الموقع الإلكتروني', note:'اتصل مباشرة بالمهني أو المؤسسة للتأكد من المعلومات.', type_doctor:'طبيب', type_dentist:'طبيب أسنان', type_clinic:'مصحة', type_hospital:'مستشفى', type_dialysis_center:'تصفية الدم', type_radiology_center:'الأشعة', type_laboratory:'مختبر', type_pharmacy:'صيدلية', open24h:'24/24', contact:'بيانات الاتصال على Medomicile'}
  };
  let lang = 'fr';
  translations.fr.partner='PARTENAIRE MEDOMICILE';
  translations.en.partner='MEDOMICILE PARTNER';
  translations.ar.partner='شريك MEDOMICILE';
  translations.fr.business='Télécharger la carte de visite';
  translations.en.business='Download business card';
  translations.ar.business='تنزيل بطاقة الزيارة';
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
  };
  selector.addEventListener('change', () => setLanguage(selector.value));
  setLanguage(new URLSearchParams(location.search).get('lang'));
  window.lucide?.createIcons();
  document.querySelector('.vc-photo').addEventListener('error', event => {
    event.target.onerror = null;
    event.target.src = '/assets/optimized/medomicile-logo-160.png';
  }, {once:true});

  let previewPromise=null,previewUrl=null;
  const preview=document.getElementById('vc-business-preview');
  const resetPreview=()=>{previewPromise=null;if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=null;preview.hidden=true;};
  selector.addEventListener('change',resetPreview);
  async function prepareCard(){
    if(previewPromise)return previewPromise;
    const category=lang==='fr'?undefined:t('type_'+data.type),partner=t('partner'),labels={responsible_person:t('responsible_person'),director:t('director'),resuscitation_doctor:t('resuscitation_doctor')};
    const version=new URL(document.querySelector('script[src*="/assets/virtual-card.js"]').src).searchParams.get('v')||'';
    const pending=import('/assets/business-card.js?v='+version).then(module=>module.generateBusinessCard(data,{category,partner,labels}));
    previewPromise=pending;
    try{
      const card=await pending;
      if(previewPromise===pending){previewUrl=URL.createObjectURL(card.blob);preview.src=previewUrl;preview.hidden=false;}
      return card;
    }catch(error){if(previewPromise===pending)previewPromise=null;throw error;}
  }
  document.getElementById('vc-business').addEventListener('click',async event=>{
    const button=event.currentTarget;button.disabled=true;status.textContent=t('preparing');
    try{
      const {blob}=await prepareCard(),url=URL.createObjectURL(blob),link=document.createElement('a');
      link.href=url;link.download=`${data.slug}-medomicile-carte-visite.png`;document.body.append(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),60000);status.textContent=t('downloaded');
    }catch{status.textContent=t('failed');}finally{button.disabled=false;}
  });
  document.getElementById('vc-share').addEventListener('click',()=>{
    status.textContent='';document.getElementById('vc-copy-fallback').hidden=true;dialog.showModal();
    prepareCard().catch(()=>{status.textContent=t('failed');});
  });
  document.getElementById('vc-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  document.getElementById('vc-print').addEventListener('click',()=>window.print());
  const shareText=()=>`${data.name}${data.city ? ' · '+data.city : ''}\n${t('contact')}`;
  document.getElementById('vc-share-link').addEventListener('click',async()=>{
    const shareUrl = data.share_url || data.url;
    if(navigator.share) {
      try { await navigator.share({title:data.name,text:shareText(),url:shareUrl});return; }
      catch(error){if(error.name==='AbortError')return;}
    }
    try{await navigator.clipboard.writeText(shareUrl);status.textContent=t('copied');}
    catch{const input=document.getElementById('vc-copy-fallback');input.value=shareUrl;input.hidden=false;input.focus();input.select();status.textContent=t('manual');}
  });
  if(new URLSearchParams(location.search).get('share')==='1') document.getElementById('vc-share').click();
})();
