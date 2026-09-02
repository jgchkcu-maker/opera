(()=>{
  const stages=[...document.querySelectorAll('[data-builder-stage]')];
  if(!stages.length) return;
  const progress=[...document.querySelectorAll('[data-builder-progress]')];
  const desktopBack=[...document.querySelectorAll('[data-builder-back]')];
  const desktopNext=[...document.querySelectorAll('[data-builder-next]')];
  const mobileBack=document.querySelector('[data-mobile-back]');
  const mobileNext=document.querySelector('[data-mobile-next]');
  const summary=document.querySelector('.summary');
  const summaryToggles=[...document.querySelectorAll('[data-summary-toggle]')];
  const summaryClose=document.querySelector('[data-summary-close]');
  const backdrop=document.querySelector('[data-summary-backdrop]');
  let current=0;
  let lastSummaryTrigger=null;

  function clearError(){document.querySelectorAll('.stage-error').forEach(el=>el.remove());}
  function showError(stage,message){
    clearError();
    const box=document.createElement('div');
    box.className='stage-error';
    box.textContent=message;
    stage.appendChild(box);
  }
  function valid(index){
    if(index===1){
      const qty=document.querySelector('#qty');
      if(!qty||Number(qty.value)<1){showError(stages[index],'Укажите тираж больше нуля.');qty&&qty.focus();return false;}
    }
    if(index===2){
      const paper=document.querySelector('#paper');
      if(paper&&!paper.value){showError(stages[index],'Выберите материал или вернитесь к предыдущему шагу.');paper.focus();return false;}
    }
    clearError();
    return true;
  }
  function show(index,focus=true){
    current=Math.max(0,Math.min(stages.length-1,index));
    stages.forEach((stage,i)=>{stage.classList.toggle('is-active',i===current);stage.hidden=i!==current;});
    progress.forEach((button,i)=>{button.classList.toggle('active',i===current);button.setAttribute('aria-current',i===current?'step':'false');});
    if(mobileBack) mobileBack.disabled=current===0;
    if(mobileNext){mobileNext.textContent=current===stages.length-1?'Итог':'Продолжить';mobileNext.dataset.final=String(current===stages.length-1);}
    if(focus){const heading=stages[current].querySelector('h3');heading&&heading.setAttribute('tabindex','-1');heading&&heading.focus({preventScroll:true});}
    const builder=document.querySelector('.builder-progress');
    if(builder&&focus) builder.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  }
  function setSummaryExpanded(expanded){summaryToggles.forEach(toggle=>toggle.setAttribute('aria-expanded',String(expanded)));}
  function openSummary(trigger){
    if(!summary)return;
    if(trigger) lastSummaryTrigger=trigger;
    summary.classList.add('is-open');
    document.body.classList.add('summary-open');
    setSummaryExpanded(true);
  }
  function closeSummary(restoreFocus=false){
    if(!summary)return;
    summary.classList.remove('is-open');
    document.body.classList.remove('summary-open');
    setSummaryExpanded(false);
    if(restoreFocus&&lastSummaryTrigger) lastSummaryTrigger.focus();
  }
  function next(){
    if(current===stages.length-1){openSummary(mobileNext);return;}
    if(valid(current)) show(current+1);
  }
  function back(){if(current>0) show(current-1);}

  desktopNext.forEach(btn=>btn.addEventListener('click',next));
  desktopBack.forEach(btn=>btn.addEventListener('click',back));
  progress.forEach((btn,i)=>btn.addEventListener('click',()=>{if(i<=current||valid(current))show(i);}));
  mobileNext&&mobileNext.addEventListener('click',next);
  mobileBack&&mobileBack.addEventListener('click',back);
  summaryToggles.forEach(toggle=>toggle.addEventListener('click',()=>{
    if(summary&&summary.classList.contains('is-open')) closeSummary();
    else openSummary(toggle);
  }));
  summaryClose&&summaryClose.addEventListener('click',()=>closeSummary(true));
  backdrop&&backdrop.addEventListener('click',()=>closeSummary(true));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&summary&&summary.classList.contains('is-open'))closeSummary(true);});
  window.addEventListener('resize',()=>{if(window.innerWidth>720)closeSummary();},{passive:true});
  show(0,false);
})();
