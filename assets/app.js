(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root&&root.document){root.OperaUI=api;api.init(root.document);}
})(typeof window!=='undefined'?window:null,function(){
  const ORIGIN='https://www.operaprint.ru/data/';
  const POSTPRESS=[
    ['листоподбор','01'],['фальцовка','02'],['биговка','03'],['навивка на пружину','04'],
    ['сшивка на скрепку','05'],['твердый переплет','06'],['мягкий переплет','07'],
    ['скрепление на болты','08'],['перфорация','09'],['фигурная','10'],
    ['скругление углов','11'],['сверление отверстий','12'],['конгрев','13'],
    ['ламинирование','14'],['упаковка в термопленку','15']
  ];
  const $$=(s,c)=>Array.from((c||document).querySelectorAll(s));
  const normalize=s=>String(s||'').toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9]+/g,' ').trim();

  function getServiceImageFromHref(href){
    if(!href) return null;
    let path=String(href).split('#')[0].split('?')[0].replace(/\\/g,'/');
    path=path.slice(path.lastIndexOf('/')+1).replace(/\.html?$/i,'');
    if(path==='pechat-knig-fotoknig-foto') path='pechat-fotoalbomov';
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
    link.rel='stylesheet';
    link.href='assets/enhancements.css';
    link.dataset.operaEnhancements='true';
    doc.head.appendChild(link);
  }

  function initMenu(doc){
    const btn=doc.querySelector('[data-menu]');
    const drawer=doc.querySelector('#drawer');
    if(!btn||!drawer||btn.dataset.menuBound==='true') return;
    btn.dataset.menuBound='true';

    const close=()=>{
      drawer.classList.remove('open');
      doc.body.classList.remove('menu-open');
      btn.textContent='☰';
      btn.setAttribute('aria-expanded','false');
    };
    const open=()=>{
      drawer.classList.add('open');
      doc.body.classList.add('menu-open');
      btn.textContent='×';
      btn.setAttribute('aria-expanded','true');
    };
    btn.addEventListener('click',()=>drawer.classList.contains('open')?close():open());
    drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    doc.addEventListener('keydown',e=>{if(e.key==='Escape'&&drawer.classList.contains('open')){close();btn.focus();}});
    if(typeof window!=='undefined') window.addEventListener('resize',()=>{if(window.innerWidth>980) close();},{passive:true});
  }

  function upgradeNavCopy(doc){
    $$('.navlinks a[href^="builder.html"],#drawer a[href^="builder.html"]',doc).forEach(a=>{a.textContent='Рассчитать заказ';});
  }

  function initFilters(doc){
    const q=doc.querySelector('#serviceSearch');
    const buttons=$$('[data-filter]',doc);
    const cards=$$('[data-service]',doc);
    if(!cards.length) return;
    const apply=()=>{
      const text=normalize(q&&q.value);
      const active=doc.querySelector('[data-filter].active');
      const category=active?active.dataset.filter:'Все';
      cards.forEach(card=>{
        const hay=normalize(card.dataset.search);
        const okText=!text||hay.includes(text);
        const okCat=category==='Все'||card.dataset.category===category;
        card.hidden=!(okText&&okCat);
      });
      const visible=cards.filter(card=>!card.hidden).length;
      const count=doc.querySelector('[data-results-count]');
      if(count) count.textContent=`Найдено: ${visible}`;
    };
    if(q) q.addEventListener('input',apply);
    buttons.forEach(button=>button.addEventListener('click',()=>{
      buttons.forEach(item=>item.classList.remove('active'));
      button.classList.add('active');
      apply();
    }));
    apply();
  }

  function markImage(img){
    if(!img) return;
    img.decoding='async';
    const parent=img.closest('.image-wrap,.service-photo,.post-card-media,.customer-hero-media,.intent-media');
    const loaded=()=>parent&&parent.classList.add('image-loaded');
    const failed=()=>parent&&parent.classList.add('image-error');
    img.addEventListener('load',loaded,{once:true});
    img.addEventListener('error',failed,{once:true});
    if(img.complete&&img.naturalWidth) loaded();
    if(img.complete&&!img.naturalWidth) failed();
  }

  function upgradeServiceImages(doc){
    $$('.service-card[href]',doc).forEach(card=>{
      const url=getServiceImageFromHref(card.getAttribute('href'));
      if(!url) return;
      let wrap=card.querySelector('.image-wrap');
      if(!wrap){wrap=doc.createElement('div');wrap.className='image-wrap';card.prepend(wrap);}
      let img=wrap.querySelector('img');
      if(!img){img=doc.createElement('img');wrap.appendChild(img);}
      img.src=url;
      img.loading='lazy';
      img.alt=(card.querySelector('h3')&&card.querySelector('h3').textContent.trim())||'Пример продукции';
      card.dataset.photoSource='operaprint';
      markImage(img);
    });
    const detail=doc.querySelector('.service-photo img');
    if(detail&&typeof location!=='undefined'){
      const url=getServiceImageFromHref(location.pathname);
      if(url){detail.src=url;detail.loading='eager';detail.dataset.photoSource='operaprint';markImage(detail);}
    }
    $$('img',doc).forEach(markImage);
  }

  function upgradePostpress(doc){
    $$('.post-card',doc).forEach(card=>{
      const title=card.querySelector('b,h3');
      if(!title) return;
      const url=getPostpressImage(title.textContent);
      if(!url) return;
      if(card.querySelector('.post-card-media')){markImage(card.querySelector('.post-card-media img'));return;}
      const content=doc.createElement('div');
      content.className='post-card-content';
      while(card.firstChild) content.appendChild(card.firstChild);
      const media=doc.createElement('div');
      media.className='post-card-media';
      const img=doc.createElement('img');
      img.src=url;img.loading='lazy';img.alt=title.textContent.trim();
      media.appendChild(img);card.append(media,content);markImage(img);
    });
  }

  function initReveals(doc){
    const selector='.customer-hero-copy,.customer-hero-media,.section-head,.intent-card,.category-card,.service-card,.info-card,.post-card,.stat,.cap-card,.contact-card,.require-card,.machine,.cta-band,.quick-calc,.order-step';
    const items=$$(selector,doc);
    const reduced=typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced||typeof IntersectionObserver==='undefined') return;
    doc.documentElement.classList.add('motion-ready');
    items.forEach((el,i)=>{el.classList.add('reveal-item');el.style.setProperty('--reveal-delay',`${Math.min(i%5,4)*35}ms`);});
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target);}
    }),{threshold:.08,rootMargin:'0px 0px -4% 0px'});
    items.forEach(item=>io.observe(item));
  }

  function init(doc){
    ensureEnhancementStyles(doc);
    doc.documentElement.classList.add('opera-ui');
    initMenu(doc);
    upgradeNavCopy(doc);
    initFilters(doc);
    upgradeServiceImages(doc);
    upgradePostpress(doc);
    initReveals(doc);
  }

  return {init,getServiceImageFromHref,getPostpressImage,normalize};
});
