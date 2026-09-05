(function(){
  // live clock (every status bar has #clock)
  var c=document.getElementById('clock');
  if(c){
    function tick(){var d=new Date();var p=function(n){return (n<10?'0':'')+n};
      c.textContent=p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());}
    tick();setInterval(tick,1000);
  }

  // scroll reveal
  var els=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target);}});
    },{threshold:.12});
    els.forEach(function(e){io.observe(e);});
  }else{els.forEach(function(e){e.classList.add('on');});}
})();

// Photo galleries stay inside their own post; decorative scene art is excluded.
(function(){
  var photos=Array.from(document.querySelectorAll('article.record .screen img, article.record .side-by-side > img'));
  if(!photos.length || !('HTMLDialogElement' in window))return;
  var viewer=document.createElement('dialog');
  viewer.className='photo-viewer';
  viewer.setAttribute('aria-label','Photo viewer');
  viewer.innerHTML='<div class="photo-viewer-bar"><span data-count aria-live="polite"></span><button type="button" data-close aria-label="Close photo viewer">Close ×</button></div><div class="photo-viewer-stage"><img alt=""></div><div class="photo-viewer-footer"><button type="button" data-prev aria-label="Previous photo">←</button><p data-caption aria-live="polite"></p><button type="button" data-next aria-label="Next photo">→</button></div>';
  document.body.appendChild(viewer);
  var image=viewer.querySelector('img'),caption=viewer.querySelector('[data-caption]');
  var previous=viewer.querySelector('[data-prev]'),next=viewer.querySelector('[data-next]');
  var close=viewer.querySelector('[data-close]'),group=[],index=0,opener,oldOverflow,touch;
  function show(offset){
    index=(index+offset+group.length)%group.length;
    image.src=group[index].currentSrc || group[index].src;
    image.alt=group[index].alt;
    caption.textContent=image.alt;
    viewer.querySelector('[data-count]').textContent=(index+1)+' / '+group.length;
    previous.disabled=next.disabled=group.length<2;
  }
  photos.forEach(function(photo){
    // Preserve an existing link's behavior rather than hijacking it.
    if(photo.closest('a'))return;
    photo.tabIndex=0;photo.setAttribute('role','button');
    photo.setAttribute('aria-label','Enlarge photo: '+(photo.alt || 'Project photo'));
    photo.setAttribute('aria-haspopup','dialog');
    photo.classList.add('photo-enlarge');
    function open(){
      opener=photo;
      group=photos.filter(function(p){return p.closest('article')===photo.closest('article');});
      index=group.indexOf(photo);show(0);
      oldOverflow=document.body.style.overflow;
      document.body.style.overflow='hidden';
      viewer.showModal();close.focus();
    }
    photo.addEventListener('click',open);
    photo.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  });
  previous.addEventListener('click',function(){show(-1);});
  next.addEventListener('click',function(){show(1);});
  close.addEventListener('click',function(){viewer.close();});
  viewer.addEventListener('close',function(){
    document.body.style.overflow=oldOverflow;
    if(opener)opener.focus({preventScroll:true});
    image.removeAttribute('src');touch=null;
  });
  viewer.addEventListener('click',function(e){
    var r=viewer.getBoundingClientRect();
    if(e.target===viewer&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))viewer.close();
  });
  viewer.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'){e.preventDefault();show(1);}
    if(e.key==='ArrowLeft'){e.preventDefault();show(-1);}
    if(e.key==='Tab'){
      var buttons=Array.from(viewer.querySelectorAll('button:not(:disabled)'));
      var first=buttons[0],last=buttons[buttons.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  image.addEventListener('touchstart',function(e){touch=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
  image.addEventListener('touchend',function(e){
    if(!touch||!e.changedTouches.length)return;
    var dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;
    if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)show(dx<0?1:-1);
    touch=null;
  },{passive:true});
  image.addEventListener('touchcancel',function(){touch=null;},{passive:true});
})();
