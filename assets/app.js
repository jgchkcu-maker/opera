(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root&&root.document){root.OperaUI=api; api.init(root.document);}
})(typeof window!=='undefined'?window:null,function(){
  const ORIGIN='https://www.operaprint.ru/data/';
  const POSTPRESS=[
    ['листоподбор','01'],['фальцовка','02'],['биговка','03'],['навивка на пружину','04'],
    ['сшивка на скрепку','05'],['твердый переплет','06'],['мягкий переплет','07'],
    ['скрепление на болты','08'],['перфорация','09'],['фигурная','10'],
    ['скругление углов','11'],['сверление отверстий','12'],['конгрев','13'],
    ['ламинирование','14'],['упаковка в термопленку','15']
  ];
  const $$=(s,c)=>Array.from(c.querySelectorAll(s));
  const normalize=s=>String(s||'').toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9]+/g,' ').trim();

  function getServiceImageFromHref(href){
    if(!href) return null;
    let path=String(href).split('#')[0].split('?')[0].replace(/\\/g,'/');
    path=path.slice(path.lastIndexOf('/')+1).replace(/\.html?$/i,'');
    if(!/^(?:pechat-[a-z0-9-]+|proizvodstvo-kalendarei)$/.test(path)) return null;
    return `${ORIGIN}${path}/01.jpg`;
  }

  function getPostpressImage(title){
    const value=normalize(title);
    const hit=POSTPRESS.find(([needle])=>value.includes(needle));
    return hit?`${ORIGIN}postpechatnye-raboty/${hit[1]}.jpg`:null;
  }

  function ensureEnhancementStyles(doc){
    if(doc.querySelector('link[data-opera-enhancements]')) return;
    const link=doc.createElement('link');
    link.rel='stylesheet'; link.href='assets/enhancements.css'; link.dataset.operaEnhancements='true';
    doc.head.appendChild(link);
  }

  function initMenu(doc){
    const btn=doc.querySelector('[data-menu]'), drawer=doc.querySelector('#drawer');
    if(!btn||!drawer) return;
    btn.addEventListener('click',()=>{
      const open=!drawer.classList.contains('open');
      drawer.classList.toggle('open',open); btn.textContent=open?'×':'☰';
      btn.setAttribute('aria-expanded',String(open));
    });
    drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      drawer.classList.remove('open'); btn.textContent='☰'; btn.setAttribute('aria-expanded','false');
    }));
  }

  function initFilters(doc){
    const q=doc.querySelector('#serviceSearch'), filterBtns=$$('[data-filter]',doc), cards=$$('[data-service]',doc);
    if(!cards.length) return;
    const apply=()=>{
      const text=(q&&q.value||'').trim().toLowerCase();
      const active=doc.querySelector('[data-filter].active');
      const category=active?active.dataset.filter:'Все';
      cards.forEach((card,i)=>{
        const okText=!text||(card.dataset.search||'').includes(text);
        const okCat=category==='Все'||card.dataset.category===category;
        card.hidden=!(okText&&okCat);
        if(!card.hidden){const item=card.querySelector('.service-card'); if(item) item.style.setProperty('--reveal-delay',`${Math.min(i%6,5)*45}ms`);}
      });
    };
    if(q) q.addEventListener('input',apply);
    filterBtns.forEach(btn=>btn.addEventListener('click',()=>{
      filterBtns.forEach(x=>x.classList.remove('active')); btn.classList.add('active'); apply();
    }));
    apply();
  }

  function markImage(img){
    if(!img) return;
    img.decoding='async';
    const parent=img.closest('.image-wrap,.service-photo,.post-card-media');
    const loaded=()=>parent&&parent.classList.add('image-loaded');
    const failed=()=>parent&&parent.classList.add('image-error');
    img.addEventListener('load',loaded,{once:true}); img.addEventListener('error',failed,{once:true});
    if(img.complete&&img.naturalWidth) loaded();
  }

  function upgradeServiceImages(doc){
    $$('.service-card[href]',doc).forEach(card=>{
      const url=getServiceImageFromHref(card.getAttribute('href'));
      if(!url) return;
      let wrap=card.querySelector('.image-wrap');
      if(!wrap){wrap=doc.createElement('div'); wrap.className='image-wrap'; card.prepend(wrap);}
      let img=wrap.querySelector('img');
      if(!img){img=doc.createElement('img'); wrap.appendChild(img);}
      img.src=url; img.loading='lazy'; img.alt=(card.querySelector('h3')&&card.querySelector('h3').textContent.trim())||'Пример продукции';
      card.dataset.photoSource='operaprint'; markImage(img);
    });

    const detail=doc.querySelector('.service-photo img');
    if(detail&&typeof location!=='undefined'){
      const url=getServiceImageFromHref(location.pathname);
      if(url){detail.src=url; detail.loading='eager'; detail.dataset.photoSource='operaprint'; markImage(detail);}
    }
  }

  function upgradePostpress(doc){
    $$('.post-card',doc).forEach(card=>{
      const title=card.querySelector('b'); if(!title) return;
      const url=getPostpressImage(title.textContent); if(!url) return;
      if(card.querySelector('.post-card-media')) return;
      const content=doc.createElement('div'); content.className='post-card-content';
      while(card.firstChild) content.appendChild(card.firstChild);
      const media=doc.createElement('div'); media.className='post-card-media';
      const img=doc.createElement('img'); img.src=url; img.loading='lazy'; img.decoding='async'; img.alt=title.textContent.trim();
      media.appendChild(img); card.append(media,content); card.dataset.photoSource='operaprint'; markImage(img);
    });
  }

  function initReveals(doc){
    const selector='.hero-grid > *,.page-hero .shell > *,.section-head,.category-card,.service-card,.info-card,.post-card,.stat,.cap-card,.contact-card,.require-card,.machine,.cta-band,.builder';
    const items=$$(selector,doc);
    items.forEach((el,i)=>{el.classList.add('reveal-item'); el.style.setProperty('--reveal-delay',`${Math.min(i%6,5)*45}ms`);});
    const reduced=typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced||typeof IntersectionObserver==='undefined'){items.forEach(x=>x.classList.add('is-visible')); return;}
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible'); io.unobserve(entry.target);}
    }),{threshold:.12,rootMargin:'0px 0px -5% 0px'});
    items.forEach(item=>io.observe(item));
  }

  function initPointerGlow(doc){
    if(typeof matchMedia==='undefined'||!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    $$('.service-card,.post-card,.category-card,.info-card,.cap-card',doc).forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        card.style.setProperty('--mx',`${((e.clientX-r.left)/r.width)*100}%`);
        card.style.setProperty('--my',`${((e.clientY-r.top)/r.height)*100}%`);
      });
    });
  }

  function init(doc){
    ensureEnhancementStyles(doc); doc.documentElement.classList.add('opera-ui');
    initMenu(doc); initFilters(doc); upgradeServiceImages(doc); upgradePostpress(doc); initReveals(doc); initPointerGlow(doc);
  }

  return {init,getServiceImageFromHref,getPostpressImage,normalize};
});
