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
