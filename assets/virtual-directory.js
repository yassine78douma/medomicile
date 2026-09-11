/* Canonical card links and a common action grid for every directory category. */
(async () => {
  'use strict';
  const selector='.doctor-card,.facility-card,.pharmacy-card--directory,.featured-clinic,.specialty-professional-slot--sponsored';
  if(!document.querySelector(selector) && !document.querySelector('[data-radiology-list],[data-laboratory-list],[data-specialty-professional-slots]')) return;
  const css=document.createElement('link');css.rel='stylesheet';css.href='/assets/virtual-directory.css';document.head.append(css);
  let entities;
  try { const response=await fetch('/data/virtual-card-index.json');if(!response.ok)throw new Error();entities=await response.json(); }
  catch { return; } // Original contacts stay usable when the index cannot load.
  const lang=document.documentElement.lang.split('-')[0];
  const labels={fr:{actions:['Appeler','WhatsApp','Itinéraire','Partager'],preview:'Aperçu de la carte',download:'Télécharger la carte de visite',shareLink:'Partager le lien',close:'Fermer',partner:'PARTENAIRE MEDOMICILE',urgency:'Urgences 24h/24'},en:{actions:['Call','WhatsApp','Directions','Share'],preview:'Card preview',download:'Download business card',shareLink:'Share link',close:'Close',partner:'MEDOMICILE PARTNER',urgency:'24/7 Emergency'},ar:{actions:['اتصال','واتساب','الاتجاهات','مشاركة'],preview:'معاينة البطاقة',download:'تنزيل بطاقة الزيارة',shareLink:'مشاركة الرابط',close:'إغلاق',partner:'شريك ميدوميسيل',urgency:'طوارئ 24/24'}}[lang] || {actions:['Appeler','WhatsApp','Itinéraire','Partager'],preview:'Aperçu de la carte',download:'Télécharger la carte de visite',shareLink:'Partager le lien',close:'Fermer',partner:'PARTENAIRE MEDOMICILE',urgency:'Urgences 24h/24'};
  const norm=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
  const byName=new Map();
  entities.forEach(e=>[e.name,...e.aliases].forEach(name=>{const key=norm(name);if(!byName.has(key))byName.set(key,[]);if(!byName.get(key).includes(e))byName.get(key).push(e);}));
  const byPath=new Map(entities.map(e=>[e.path,e]));
  const modal=document.createElement('dialog');
  modal.className='entity-share-modal';
  modal.innerHTML=`<div class="entity-share-modal__head"><h2>${labels.preview}</h2><button type="button" class="entity-share-modal__close" aria-label="${labels.close}">×</button></div><img class="entity-share-modal__preview" alt="${labels.preview}" hidden><div class="entity-share-modal__actions"><button type="button" data-share-link>${labels.shareLink}</button><button type="button" data-share-download>${labels.download}</button></div>`;
  document.body.append(modal);
  const preview=modal.querySelector('.entity-share-modal__preview');
  const shareLinkButton=modal.querySelector('[data-share-link]');
  const downloadButton=modal.querySelector('[data-share-download]');
  let activeEntity=null, activeUrl='', activeBlobUrl='';
  const closeModal=()=>{modal.close();if(activeBlobUrl){URL.revokeObjectURL(activeBlobUrl);activeBlobUrl='';}};
  modal.querySelector('.entity-share-modal__close').addEventListener('click',closeModal);
  const openShareModal=async entity=>{
    activeEntity=entity;activeUrl=entity.share_url||entity.url;modal.showModal();preview.hidden=true;shareLinkButton.disabled=downloadButton.disabled=true;
    try{const {blob}=await import('/assets/business-card.js').then(m=>m.generateBusinessCard(entity,{lang,labels:{partner:labels.partner,urgency:labels.urgency}}));activeBlobUrl=URL.createObjectURL(blob);preview.src=activeBlobUrl;preview.hidden=false;}
    finally{shareLinkButton.disabled=downloadButton.disabled=false;}
  };
  shareLinkButton.addEventListener('click',async()=>{
    if(navigator.share){try{await navigator.share({title:activeEntity.name,url:activeUrl});return;}catch(error){if(error.name==='AbortError')return;}}
    try{await navigator.clipboard.writeText(activeUrl);}catch{}
  });
  downloadButton.addEventListener('click',()=>{if(!activeBlobUrl)return;const a=document.createElement('a');a.href=activeBlobUrl;a.download=`${activeEntity.slug}-medomicile-carte-visite.png`;a.click();});
  function identify(card) {
    if(byPath.has(card.dataset.entityPath))return byPath.get(card.dataset.entityPath);
    if(card.dataset.entitySourceId)return entities.find(e=>e.id===card.dataset.entitySourceId && e.type===card.dataset.entityType) || null;
    const heading=card.querySelector('h3,h2,.compact-card-title strong');
    if(!heading)return null;
    const copy=heading.cloneNode(true);copy.querySelectorAll('.availability-badge').forEach(n=>n.remove());
    let candidates=byName.get(norm(copy.textContent)) || [];
    if(card.classList.contains('doctor-card') || card.classList.contains('specialty-professional-slot--sponsored')) candidates=candidates.filter(e=>['doctor','dentist'].includes(e.type));
    if(card.classList.contains('radiology-card'))candidates=candidates.filter(e=>e.type==='radiology_center');
    if(candidates.length===1)return candidates[0];
    const exactMaps=card.querySelector('a[href*="maps"]')?.href;
    const matching=candidates.filter(e=>e.google_maps_url===exactMaps);
    return matching.length===1 ? matching[0] : null;
  }
  function link(label,href,icon,extra='') {
    const a=document.createElement('a');a.className='entity-action '+extra;a.href=href;
    const i=document.createElement('i');i.dataset.lucide=icon;i.ariaHidden='true';
    const span=document.createElement('span');span.textContent=label;a.append(i,span);
    if(href.startsWith('http')){a.target='_blank';a.rel='noopener noreferrer';}
    return a;
  }
  function enhance(card) {
    if(card.dataset.entityReady)return;
    const e=identify(card);if(!e)return;
    card.dataset.entityReady='true';card.dataset.entityPath=e.path;
    if (!card.id) card.id = e.slug;
    const holder=card.querySelector('.compact-card-details') || card.querySelector('.featured-clinic__content') || card;
    // Keep textual phone/address information, removing only duplicate command groups.
    holder.querySelectorAll('.establishment-actions,.pharmacy-actions,.specialty-professional-slot__contact-actions,.doctor-share-menu,.doctor-share-button').forEach(n=>n.remove());
    holder.querySelectorAll('.urgent-actions a,.featured-clinic__actions a,.facility-route').forEach(a=>{
      if(a.href.startsWith('tel:')||a.href.includes('maps')||a.href.includes('wa.me'))a.remove();
    });
    holder.querySelectorAll('.urgent-actions,.featured-clinic__actions').forEach(n=>{if(!n.children.length)n.remove();});
    const grid=document.createElement('div');grid.className='entity-actions';
    if(e.phones.length)grid.append(link(labels.actions[0],'tel:'+e.phones[0].number,'phone'));
    if(e.whatsapp)grid.append(link(labels.actions[1],e.whatsapp,'message-circle','entity-action--whatsapp'));
    if(e.google_maps_url)grid.append(link(labels.actions[2],e.google_maps_url,'map-pin'));
    const share=link(labels.actions[3],'#'+e.slug,'share-2');
    share.addEventListener('click',event=>{event.preventDefault();openShareModal(e);});
    grid.append(share);
    holder.append(grid);
  }
  let pending=false;
  const scan=()=>{pending=false;document.querySelectorAll(selector).forEach(enhance);window.lucide?.createIcons();};
  const observer=new MutationObserver(records=>{
    if(records.some(record=>[...record.addedNodes].some(n=>n.nodeType===1 && (n.matches?.(selector)||n.querySelector?.(selector)))) && !pending){pending=true;requestAnimationFrame(scan);}
  });
  observer.observe(document.querySelector('main')||document.body,{childList:true,subtree:true});
  if(!window.lucide){const script=document.createElement('script');script.src='/assets/vendor/lucide.min.js';script.onload=scan;document.head.append(script);}
  scan();
  setTimeout(scan,100);
  const openTarget = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const card = document.getElementById(id) || [...document.querySelectorAll(selector)].find(node => node.dataset.entityPath?.endsWith(`/${id}/`));
    if (!card) return;
    const toggle = card.querySelector('.compact-card-toggle');
    if (toggle && !card.classList.contains('is-open')) toggle.click();
    card.classList.add('is-share-target');
    requestAnimationFrame(() => card.scrollIntoView({behavior:'smooth', block:'center'}));
    setTimeout(() => card.classList.remove('is-share-target'), 2000);
  };
  window.addEventListener('hashchange', openTarget);
  setTimeout(openTarget, 80);
})();
