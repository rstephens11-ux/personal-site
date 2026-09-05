/* Published project-list behavior, adapted to the mock's .record components. */
(function(){
  document.querySelectorAll('[data-post-list]').forEach(function(list){
    var bar=list.querySelector('.filter-bar');
    if(!bar)return;
    var articles=Array.from(list.querySelectorAll('article.record'));
    var buttons=Array.from(bar.querySelectorAll('button'));
    buttons.forEach(function(button){
      button.addEventListener('click',function(){
        buttons.forEach(function(b){b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
        var filter=button.dataset.filter,sort=button.dataset.sort;
        var visible=articles.filter(function(a){return !filter||filter==='all'||a.dataset.category===filter;});
        if(sort)visible.sort(function(a,b){
          var da=a.dataset.date,db=b.dataset.date;
          if(da==='ongoing'&&db==='ongoing')return 0;
          if(da==='ongoing')return 1;
          if(db==='ongoing')return -1;
          return sort==='newest'?db.localeCompare(da):da.localeCompare(db);
        });
        articles.forEach(function(a){a.hidden=true;});
        visible.forEach(function(a,i){
          a.hidden=false;list.appendChild(a);a.classList.add('on');
          var no=a.querySelector('.no');if(no)no.textContent=String(i+1).padStart(2,'0');
        });
      });
    });
  });
})();
