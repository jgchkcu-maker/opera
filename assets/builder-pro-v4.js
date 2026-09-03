(()=>{
  'use strict';

  const doc=document;
  const hero=doc.querySelector('.builder-hero');
  const stages=[...doc.querySelectorAll('[data-builder-stage]')];
  const progress=[...doc.querySelectorAll('[data-builder-progress]')];

  function setText(selector,text){
    const el=doc.querySelector(selector);
    if(el) el.textContent=text;
  }

  if(hero){
    setText('.builder-hero h1','Рассчитать заказ');
    setText('.builder-hero p','Заполните только то, что знаете. Остальное уточнит менеджер.');
    const trust=[...hero.querySelectorAll('.builder-trust>div')];
    const trustCopy=[
      ['4 шага','от изделия до контактов'],
      ['Можно без макета','добавите позже'],
      ['Проверим перед печатью','стоимость и срок подтвердим']
    ];
    trust.forEach((item,index)=>{
      const copy=trustCopy[index];
      if(!copy)return;
      const title=item.querySelector('b');
      const sub=item.querySelector('span');
      if(title)title.textContent=copy[0];
      if(sub)sub.textContent=copy[1];
    });
  }

  const stageCopy=[
    ['Что печатаем?','Выберите продукцию.'],
    ['Размер и тираж','Укажите формат и количество.'],
    ['Материал и печать','Выберите материал и вариант печати.'],
    ['Отделка и контакты','Отделка необязательна. Затем оставьте контакты.']
  ];
  stages.forEach((stage,index)=>{
    const copy=stageCopy[index];
    if(!copy)return;
    const heading=stage.querySelector('.step-title h3');
    const paragraph=stage.querySelector('.step-title p');
    if(heading)heading.textContent=copy[0];
    if(paragraph)paragraph.textContent=copy[1];
  });

  if(progress.length){
    const names=['Изделие','Размер и тираж','Материал и печать','Отделка и контакты'];
    const mobileLabel=doc.createElement('div');
    mobileLabel.className='builder-mobile-step-label';
    mobileLabel.innerHTML='<span>Шаг 1 из 4</span><b>Изделие</b>';
    progress[0].parentElement?.before(mobileLabel);

    function syncStepLabel(){
      let active=progress.findIndex(button=>button.getAttribute('aria-current')==='step');
      if(active<0)active=progress.findIndex(button=>button.classList.contains('active'));
      if(active<0)active=0;
      const count=mobileLabel.querySelector('span');
      const name=mobileLabel.querySelector('b');
      if(count)count.textContent=`Шаг ${active+1} из ${progress.length}`;
      if(name)name.textContent=names[active]||'';
      progress.forEach((button,index)=>button.setAttribute('aria-label',`Шаг ${index+1}: ${names[index]||''}`));
    }

    const progressObserver=new MutationObserver(syncStepLabel);
    progress.forEach(button=>progressObserver.observe(button,{attributes:true,attributeFilter:['aria-current','class']}));
    syncStepLabel();
  }

  function chevronDownSvg(){
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  const picker=doc.querySelector('[data-product-picker-v3]');
  if(picker){
    const heading=picker.querySelector('.product-picker-heading');
    if(heading){
      const title=heading.querySelector('b');
      const hint=heading.querySelector('span');
      if(title)title.textContent='Популярное';
      if(hint)hint.textContent='Выберите один вариант';
    }

    const toggle=picker.querySelector('.product-picker-catalog-toggle');
    const catalog=picker.querySelector('.product-picker-catalog');
    const search=picker.querySelector('.product-picker-search input');
    if(toggle){
      toggle.innerHTML=`<span><b>Не нашли нужное?</b><small class="product-picker-toggle-copy">Открыть весь каталог</small></span><span class="product-picker-toggle-icon">${chevronDownSvg()}</span>`;
      const toggleCopy=()=>{
        const open=toggle.getAttribute('aria-expanded')==='true';
        const small=toggle.querySelector('.product-picker-toggle-copy');
        if(small)small.textContent=open?'Скрыть каталог':'Открыть весь каталог';
        toggle.setAttribute('aria-label',open?'Скрыть весь каталог продукции':'Открыть весь каталог продукции');
      };
      new MutationObserver(toggleCopy).observe(toggle,{attributes:true,attributeFilter:['aria-expanded']});
      toggleCopy();
    }
    if(catalog)catalog.setAttribute('aria-label','Весь каталог продукции');
    if(search){
      search.placeholder='Визитки, буклеты, сертификаты…';
      search.setAttribute('aria-label','Найти продукцию');
    }
  }

  const finishes=doc.querySelector('#finishes');
  if(finishes){
    const block=finishes.closest('.builder-block');
    if(block){
      block.classList.add('builder-finish-block');
      const head=block.querySelector('.builder-block-head');
      if(head)head.innerHTML='<div><b>Отделка</b><span>Необязательно. Можно выбрать несколько.</span></div>';
    }

    function enhanceFinishRows(){
      finishes.querySelectorAll('.finish').forEach(item=>{
        const title=item.querySelector('b')?.textContent?.trim()||'Отделка';
        const description=item.querySelector('span')?.textContent?.trim()||'';
        item.setAttribute('aria-label',description?`${title}. ${description}`:title);
      });
    }
    new MutationObserver(enhanceFinishRows).observe(finishes,{childList:true});
    enhanceFinishRows();
  }

  const contactBlock=doc.querySelector('.builder-contact-block .builder-block-head span');
  if(contactBlock)contactBlock.textContent='Телефон или e-mail — как удобнее.';

  const fileBlock=doc.querySelector('#dropzone')?.closest('.builder-block')?.querySelector('.builder-block-head span');
  if(fileBlock)fileBlock.textContent='Можно добавить сейчас или отправить позже.';

  const deliveryBlock=doc.querySelector('#deliveryChoices')?.closest('.builder-block')?.querySelector('.builder-block-head span');
  if(deliveryBlock)deliveryBlock.textContent='Выберите удобный способ.';
})();
