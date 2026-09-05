(function(){
  var list=document.querySelector('.links-list');if(!list)return;
  var empty=list.querySelector('.links-empty');
  function updateEmpty(){
    var active=list.querySelector('.filter-bar button.active');
    var kind=active?active.dataset.filter:'all';
    var any=Array.from(list.querySelectorAll('article.record')).some(function(p){return !p.hidden;});
    empty.hidden=any;
    var names={websites:'websites',books:'books',twitter:'Twitter posts',youtube:'YouTube channels',all:'entries'};
    empty.querySelector('h2').textContent='No '+(names[kind]||'entries')+' added yet.';
  }
  list.querySelector('.filter-bar').addEventListener('click',updateEmpty);
  function revealHash(){
    var id;try{id=decodeURIComponent(location.hash.slice(1));}catch(e){return false;}
    var target=id&&document.getElementById(id);
    var post=target&&(target.matches('article.record')?target:target.closest('article.record'));
    if(post&&list.contains(post)){
      list.querySelector('[data-filter="all"]').click();return true;
    }
    return false;
  }
  if(!revealHash())list.querySelector('[data-filter="websites"]').click();
  updateEmpty();
  window.addEventListener('hashchange',function(){revealHash();updateEmpty();});
})();
