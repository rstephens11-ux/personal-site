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

// Stable post URLs use the IDs already stored in the HTML, never list positions.
(function(){
  var posts=Array.from(document.querySelectorAll('[data-post-list] article.record[id]'));
  if(!posts.length)return;
  var status=document.createElement('span');
  status.className='post-link-status';status.setAttribute('role','status');
  document.body.appendChild(status);
  posts.forEach(function(post){
    // Duplicate IDs cannot identify a post reliably; do not offer a misleading link.
    if(posts.filter(function(p){return p.id===post.id;}).length!==1)return;
    var heading=post.querySelector('.r-head h3');
    if(!heading)return;
    var link=document.createElement('a');
    link.className='post-permalink';link.href='#'+encodeURIComponent(post.id);
    while(heading.firstChild)link.appendChild(heading.firstChild);
    heading.appendChild(link);
    var actions=document.createElement('div');actions.className='post-link-actions';
    var button=document.createElement('button');button.type='button';button.className='post-copy-link';
    button.textContent='Copy link';button.setAttribute('aria-label','Copy link to '+heading.textContent);
    actions.appendChild(button);post.appendChild(actions);
    var resetTimer;
    button.addEventListener('click',async function(){
      var url=new URL(location.href);url.search='';url.hash=post.id;
      clearTimeout(resetTimer);button.textContent='Copy link';status.textContent='';
      var old=actions.querySelector('.post-link-fallback');if(old)old.remove();
      try{
        if(!navigator.clipboard)throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(url.href);
        button.textContent='Copied!';status.textContent='Link copied for '+heading.textContent;
        resetTimer=setTimeout(function(){button.textContent='Copy link';},2500);
      }catch(error){
        var label=document.createElement('label');label.className='post-link-fallback';
        label.textContent='Copy this address:';
        var field=document.createElement('input');field.type='text';field.readOnly=true;field.value=url.href;
        label.appendChild(field);actions.appendChild(label);field.focus();field.select();
        status.textContent='Automatic copying is unavailable. The address is selected for you to copy.';
      }
    });
  });
  function openLinkedPost(){
    var id;try{id=decodeURIComponent(location.hash.slice(1));}catch(error){return;}
    if(!id)return;
    var target=document.getElementById(id);
    var post=target&&(target.matches('article.record')?target:target.closest('article.record'));
    if(!post)return;
    if(post.hidden){
      var all=post.closest('[data-post-list]').querySelector('[data-filter="all"]');
      if(all)all.click();else post.hidden=false;
    }
    post.classList.add('on');
    var header=document.querySelector('.bar');
    post.style.scrollMarginTop=((header?header.getBoundingClientRect().height:0)+18)+'px';
    post.scrollIntoView({behavior:'instant',block:'start'});
  }
  window.addEventListener('hashchange',openLinkedPost);
  window.addEventListener('load',openLinkedPost);
  if(document.fonts)document.fonts.ready.then(openLinkedPost);
  openLinkedPost();
})();
