(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root&&root.document) api.init(root.document,root);
})(typeof window!=='undefined'?window:null,function(){
  'use strict';

  const FEATURED_KEYS=['businessCards','leaflets','catalogs','stickers','menus','books','calendars'];
  const PRODUCT_UI={
    businessCards:{name:'Визитки',description:'Контактные и корпоративные карточки',aliases:'визитка карточка контакты бизнес'},
    leaflets:{name:'Листовки / флаеры',description:'Реклама, акции и раздаточные материалы',aliases:'листовка флаер flyer реклама раздатка'},
    catalogs:{name:'Каталоги / брошюры',description:'Многостраничная продукция и презентации',aliases:'каталог брошюра журнал многостраничная'},
    stickers:{name:'Наклейки / этикетки',description:'Бумага, плёнка и фигурная форма',aliases:'наклейка этикетка стикер sticker самоклейка'},
    menus:{name:'Меню / тейбл-тенты',description:'Для кафе, ресторанов и магазинов',aliases:'меню тейбл тент кафе ресторан'},
    books:{name:'Книги / фотоальбомы',description:'Страницы, обложка и переплёт',aliases:'книга фотоальбом альбом переплет'},
    calendars:{name:'Календари',description:'Настенные, настольные и карманные',aliases:'календарь квартальный настольный настенный'},
    posters:{name:'Плакаты',description:'Постеры и объявления крупного формата',aliases:'плакат постер афиша объявление'},
    postcards:{name:'Открытки / приглашения',description:'Праздничные и имиджевые карточки',aliases:'открытка приглашение карточка праздник'},
    certificates:{name:'Дипломы / грамоты / сертификаты',description:'Наградная и персонализированная продукция',aliases:'диплом грамота сертификат награда'},
    booklets:{name:'Буклеты',description:'Складные листы с одним или несколькими сгибами',aliases:'буклет евробуклет фальцовка сгиб'},
    forms:{name:'Бланки / конверты',description:'Фирменные документы и почтовая продукция',aliases:'бланк конверт фирменный документ письмо'},
    folders:{name:'Папки',description:'Презентационные папки с клапанами',aliases:'папка клапан презентационная'},
    notepads:{name:'Кубарики',description:'Стопки небольших листов для заметок',aliases:'кубарик блокнот заметки листочки'},
    tags:{name:'Бирки / воблеры',description:'Ярлыки, ценники и подвесные элементы',aliases:'бирка воблер ярлык ценник тег'}
  };

  const ICONS={
    businessCards:'<rect x="9" y="14" width="26" height="18" rx="4"/><rect x="14" y="10" width="25" height="18" rx="4" class="accent"/><path d="M19 17h9M19 21h13"/>',
    leaflets:'<rect x="13" y="9" width="23" height="30" rx="3"/><path d="M9 14v22a3 3 0 0 0 3 3h19"/><path d="M18 17h13M18 22h13M18 27h9" class="accent"/>',
    catalogs:'<path d="M7 12.5c7-2 12-.7 17 3.5v24c-5-4.2-10-5.5-17-3.5z"/><path d="M41 12.5c-7-2-12-.7-17 3.5v24c5-4.2 10-5.5 17-3.5z"/><path d="M24 16v24" class="accent"/>',
    stickers:'<path d="M12 8h20l8 8v20a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z"/><path d="M32 8v8h8" class="accent"/><circle cx="23" cy="26" r="7"/>',
    menus:'<path d="M10 38 18 10h12l8 28z"/><path d="M18 10l6 28 6-28" class="accent"/><path d="M17 23h14"/>',
    books:'<path d="M9 10h24a6 6 0 0 1 6 6v24H15a6 6 0 0 1-6-6z"/><path d="M15 10v30M15 34h24" class="accent"/>',
    calendars:'<rect x="8" y="11" width="32" height="29" rx="4"/><path d="M8 19h32M16 7v8M32 7v8"/><path d="M15 25h5M25 25h8M15 31h8M28 31h5" class="accent"/>',
    posters:'<rect x="11" y="7" width="26" height="34" rx="3"/><path d="M16 13h16M16 18h10"/><path d="m16 34 7-8 5 5 4-5" class="accent"/>',
    postcards:'<rect x="7" y="11" width="34" height="26" rx="4"/><path d="M24 11v26"/><path d="M29 18h7M29 23h7" class="accent"/><path d="m11 29 7-7 6 6"/>',
    certificates:'<path d="M12 8h24v27H12z"/><path d="M17 15h14M17 20h10"/><circle cx="27" cy="28" r="5" class="accent"/><path d="m24 32-2 8 5-3 5 3-2-8"/>',
    booklets:'<path d="M7 10h34v28H7z"/><path d="M18 10v28M30 10v28"/><path d="m13 16 5 4-5 4M35 16l-5 4 5 4" class="accent"/>',
    forms:'<path d="M8 12h22v27H8z"/><path d="M18 18h8M18 23h8"/><path d="M18 29 34 17l7 6-16 14-8 2z" class="accent"/>',
    folders:'<path d="M6 15h14l4 5h18v18H6z"/><path d="M6 15V10h13l4 5"/><path d="M12 28h24" class="accent"/>',
    notepads:'<rect x="10" y="9" width="25" height="25" rx="3"/><path d="M14 14h25v25H14z"/><path d="M19 20h14M19 25h10" class="accent"/>',
    tags:'<path d="M8 19 21 7h17v17L25 41 8 24z"/><circle cx="31" cy="14" r="3" class="accent"/><path d="M15 23h10"/>'
  };

  function normalizeQuery(value){
    return String(value||'').toLocaleLowerCase('ru-RU').replace(/ё/g,'е').trim().replace(/\s+/g,' ');
  }
  function filterProductKeys(query){
    const q=normalizeQuery(query);
    const keys=Object.keys(PRODUCT_UI);
    if(!q) return keys;
    const words=q.split(' ');
    return keys.filter(key=>{
      const item=PRODUCT_UI[key];
      const hay=normalizeQuery(`${item.name} ${item.description} ${item.aliases}`);
      return words.every(word=>hay.includes(word));
    });
  }
  function iconSvg(key){
    const body=ICONS[key]||ICONS.posters;
    return `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
  }
  function checkSvg(){
    return '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 10.2 3.1 3.1L15.3 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function listSvg(){
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7h10M9 12h10M9 17h10M5 7h.01M5 12h.01M5 17h.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  }
  function chevronSvg(){
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function optionMarkup(key,mode){
    const item=PRODUCT_UI[key];
    return `<button type="button" class="product-picker-option product-picker-${mode}" data-picker-product="${key}" aria-pressed="false"><span class="product-picker-icon">${iconSvg(key)}</span><span class="product-picker-copy"><b>${item.name}</b><small>${item.description}</small></span><span class="product-picker-check">${checkSvg()}</span></button>`;
  }

  function init(doc,win){
    const legacyGrid=doc.querySelector('#productGrid');
    const legacyOther=doc.querySelector('#otherProduct');
    const stage=legacyGrid?.closest('[data-builder-stage]');
    if(!legacyGrid||!legacyOther||!stage||stage.querySelector('[data-product-picker-v3]')) return;

    const products=(win.OperaBuilder&&win.OperaBuilder.PRODUCTS)||{};
    const availableKeys=Object.keys(products).filter(key=>PRODUCT_UI[key]);
    if(!availableKeys.length) return;

    const picker=doc.createElement('section');
    picker.className='product-picker-v3';
    picker.dataset.productPickerV3='';
    picker.innerHTML=`
      <div class="product-picker-heading"><div><b>Популярная продукция</b><span>Выберите самый похожий вариант — параметры дальше подстроятся сами.</span></div></div>
      <div class="product-picker-featured">${FEATURED_KEYS.filter(k=>availableKeys.includes(k)).map(k=>optionMarkup(k,'card')).join('')}</div>
      <div class="product-picker-catalog-shell">
        <button class="product-picker-catalog-toggle" type="button" aria-expanded="false" aria-controls="productCatalogV3"><span><b>Весь каталог</b><small data-picker-current>Ещё 8 видов продукции</small></span><span class="product-picker-toggle-icon">${listSvg()}</span></button>
        <div class="product-picker-catalog" id="productCatalogV3" hidden>
          <label class="product-picker-search"><span class="sr-only">Найти продукцию</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg><input type="search" autocomplete="off" placeholder="Найти: папки, буклеты, сертификаты..."></label>
          <div class="product-picker-list" data-picker-list>${availableKeys.map(k=>optionMarkup(k,'row')).join('')}</div>
          <div class="product-picker-empty" data-picker-empty hidden><b>Не нашли точное название?</b><span>Выберите наиболее похожий вариант или опишите задачу в комментарии — менеджер уточнит детали.</span></div>
        </div>
      </div>`;
    legacyGrid.before(picker);
    legacyGrid.classList.add('product-picker-legacy');
    legacyOther.closest('.builder-secondary-choice')?.classList.add('product-picker-legacy');

    const toggle=picker.querySelector('.product-picker-catalog-toggle');
    const catalog=picker.querySelector('.product-picker-catalog');
    const search=picker.querySelector('input[type="search"]');
    const list=picker.querySelector('[data-picker-list]');
    const empty=picker.querySelector('[data-picker-empty]');
    const current=picker.querySelector('[data-picker-current]');

    function setCatalogOpen(open,focusSearch){
      catalog.hidden=!open;
      toggle.setAttribute('aria-expanded',String(open));
      picker.classList.toggle('catalog-open',open);
      if(open&&focusSearch) win.setTimeout(()=>search.focus(),40);
    }
    function updateSelected(key){
      picker.querySelectorAll('[data-picker-product]').forEach(btn=>{
        const active=btn.dataset.pickerProduct===key;
        btn.classList.toggle('is-selected',active);
        btn.setAttribute('aria-pressed',String(active));
      });
      const item=PRODUCT_UI[key];
      if(item&&current) current.textContent=`Выбрано: ${item.name}`;
      if(item&&!FEATURED_KEYS.includes(key)) setCatalogOpen(true,false);
    }
    function selectProduct(key){
      const legacyFeatured=legacyGrid.querySelector(`[data-product="${key}"]`);
      if(legacyFeatured){
        legacyFeatured.click();
      }else{
        legacyOther.value=key;
        legacyOther.dispatchEvent(new win.Event('change',{bubbles:true}));
      }
      updateSelected(key);
      picker.dispatchEvent(new win.CustomEvent('picker:selected',{bubbles:true,detail:{key}}));
    }
    function renderFilter(){
      const matching=new Set(filterProductKeys(search.value).filter(k=>availableKeys.includes(k)));
      let visible=0;
      list.querySelectorAll('[data-picker-product]').forEach(btn=>{
        const show=matching.has(btn.dataset.pickerProduct);
        btn.hidden=!show;
        if(show) visible++;
      });
      empty.hidden=visible>0;
    }

    picker.addEventListener('click',event=>{
      const option=event.target.closest('[data-picker-product]');
      if(option){selectProduct(option.dataset.pickerProduct);return;}
      if(event.target.closest('.product-picker-catalog-toggle')) setCatalogOpen(catalog.hidden,true);
    });
    search.addEventListener('input',renderFilter);
    search.addEventListener('keydown',event=>{if(event.key==='Escape'){search.value='';renderFilter();setCatalogOpen(false,false);toggle.focus();}});

    const summaryButton=doc.querySelector('.builder-mobile-action [data-summary-toggle]');
    const backButton=doc.querySelector('.builder-mobile-action [data-mobile-back]');
    if(summaryButton) summaryButton.innerHTML=listSvg();
    if(backButton) backButton.innerHTML=chevronSvg();

    const queryKey=new URLSearchParams(win.location.search).get('product');
    const initial=availableKeys.includes(queryKey)?queryKey:(legacyGrid.querySelector('.product.active')?.dataset.product||legacyOther.value||'businessCards');
    updateSelected(initial);
  }

  return {FEATURED_KEYS,PRODUCT_UI,normalizeQuery,filterProductKeys,iconSvg,init};
});
