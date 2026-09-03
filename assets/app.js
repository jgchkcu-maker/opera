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
    const styles=[
      ['assets/enhancements.css','operaEnhancements'],
      ['assets/brand-v5.css','operaBrandV5']
    ];
    styles.forEach(([href,datasetKey])=>{
      if(doc.querySelector(`link[href="${href}"]`)) return;
      const link=doc.createElement('link');
      link.rel='stylesheet';
      link.href=href;
      link.dataset[datasetKey]='true';
      doc.head.appendChild(link);
    });
  }

  function initMenu(doc){
    const btn=doc.querySelector('[data-menu]');
    const drawer=doc.querySelector('#drawer');
    if(!btn||!drawer||btn.dataset.menuBound==='true') return;
    btn.dataset.menuBound='true';

    const setOpen=open=>{
      drawer.classList.toggle('open',open);
      drawer.dataset.open=String(open);
      doc.body.classList.toggle('menu-open',open);
      btn.textContent=open?'×':'☰';
      btn.setAttribute('aria-expanded',String(open));
      btn.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
    };
    const close=()=>setOpen(false);
    const open=()=>setOpen(true);

    btn.addEventListener('click',()=>drawer.classList.contains('open')?close():open());
    drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    doc.addEventListener('keydown',e=>{
      if(e.key==='Escape'&&drawer.classList.contains('open')){
        close();
        btn.focus({preventScroll:true});
      }
    });
    if(typeof window!=='undefined') window.addEventListener('resize',()=>{if(window.innerWidth>980) close();},{passive:true});
    setOpen(false);
  }

  function upgradeNavCopy(doc){
    $$('.navlinks a[href^="builder.html"],#drawer a[href^="builder.html"]',doc).forEach(a=>{a.textContent='Рассчитать заказ';});
  }

  function initFilterScroller(doc){
    const bar=doc.querySelector('.filterbar');
    if(!bar||bar.querySelector('.filter-scroller')) return;
    const buttons=$$('[data-filter]',bar);
    if(!buttons.length) return;
    const scroller=doc.createElement('div');
    scroller.className='filter-scroller';
    scroller.setAttribute('aria-label','Категории продукции');
    buttons[0].before(scroller);
    buttons.forEach(button=>scroller.appendChild(button));
  }

  function ensureCatalogueEmpty(doc){
    const grid=doc.querySelector('.services-grid');
    if(!grid) return null;
    let empty=doc.querySelector('.catalogue-empty');
    if(empty) return empty;
    empty=doc.createElement('div');
    empty.className='catalogue-empty';
    empty.hidden=true;
    empty.setAttribute('role','status');
    empty.setAttribute('aria-live','polite');
    empty.innerHTML='<b>Ничего не нашли</b><span>Попробуйте другое название или сбросьте категорию на «Все».</span>';
    grid.after(empty);
    return empty;
  }

  function initFilters(doc){
    const q=doc.querySelector('#serviceSearch');
    const buttons=$$('[data-filter]',doc);
    const cards=$$('[data-service]',doc);
    if(!cards.length) return;
    const empty=ensureCatalogueEmpty(doc);
    const reduced=typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
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
      if(empty) empty.hidden=visible!==0;
    };
    if(q) q.addEventListener('input',apply);
    buttons.forEach(button=>button.addEventListener('click',()=>{
      buttons.forEach(item=>item.classList.remove('active'));
      button.classList.add('active');
      if(button.closest('.filter-scroller')) button.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest',inline:'center'});
      apply();
    }));
    apply();
  }

  function markImage(img){
    if(!img||img.dataset.operaImageBound==='true') return;
    img.dataset.operaImageBound='true';
    img.decoding='async';
    const parent=img.closest('.image-wrap,.service-photo,.post-card-media,.customer-hero-media,.intent-media');
    const loaded=()=>{if(parent){parent.classList.add('image-loaded');parent.classList.remove('image-error');}};
    const failed=()=>{if(parent){parent.classList.add('image-error');parent.classList.remove('image-loaded');}};
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

  function upgradeServiceDetails(doc){
    const detail=doc.querySelector('.service-detail');
    const featureList=detail?.querySelector('.feature-list');
    if(!detail||!featureList||detail.dataset.serviceDetailUpgraded==='true') return;
    detail.dataset.serviceDetailUpgraded='true';

    const helpers=$$('.feature span',featureList);
    const helperText=helpers.map(span=>normalize(span.textContent));
    const sameHelper=helperText.length>1&&new Set(helperText).size===1;
    const generic=sameHelper&&/параметр можно указать|оставить на уточнение менеджеру/.test(helperText[0]);
    if(generic){
      helpers.forEach(span=>span.remove());
      const guidance=doc.createElement('div');
      guidance.className='service-guidance';
      guidance.textContent='Не уверены в материале или отделке? Выберите понятные параметры в расчёте — спорные технические детали менеджер проверит перед запуском.';
      featureList.after(guidance);
    }

    $$('.actions a[href^="builder.html"]',detail).forEach(a=>{a.textContent='Рассчитать заказ';});
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
    initFilterScroller(doc);
    initFilters(doc);
    upgradeServiceImages(doc);
    upgradeServiceDetails(doc);
    upgradePostpress(doc);
    initReveals(doc);
  }

  return {init,getServiceImageFromHref,getPostpressImage,normalize,initFilterScroller,upgradeServiceDetails};
});