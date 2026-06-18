
(function(){
function q(s,c){return(c||document).querySelector(s)}
function qa(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
document.addEventListener('DOMContentLoaded',function(){
var btn=q('.mobile-btn'),nav=q('.mobile-nav');if(btn&&nav){btn.addEventListener('click',function(){nav.classList.toggle('open')})}
var slides=qa('.hero-card'),dots=qa('.hero-dot'),i=0,timer=null;function show(n){if(!slides.length)return;i=(n+slides.length)%slides.length;slides.forEach(function(el,k){el.classList.toggle('active',k===i)});dots.forEach(function(el,k){el.classList.toggle('active',k===i)})}if(slides.length){dots.forEach(function(d,k){d.addEventListener('click',function(){show(k);restart()})});function restart(){if(timer)clearInterval(timer);timer=setInterval(function(){show(i+1)},5200)}show(0);restart()}
var back=q('.back-top');if(back){window.addEventListener('scroll',function(){back.classList.toggle('show',window.scrollY>360)});back.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})})}
var searchInput=q('[data-search-input]'),selects=qa('[data-filter-select]'),cards=qa('[data-movie-card]'),empty=q('.empty-message');function normalize(v){return String(v||'').toLowerCase()}function apply(){if(!cards.length)return;var kw=normalize(searchInput&&searchInput.value);var filters={};selects.forEach(function(s){filters[s.getAttribute('data-filter-select')]=s.value});var visible=0;cards.forEach(function(card){var text=normalize(card.getAttribute('data-search-text'));var ok=!kw||text.indexOf(kw)>-1;Object.keys(filters).forEach(function(k){var v=filters[k];if(v&&card.getAttribute('data-'+k)!==v)ok=false});card.style.display=ok?'':'none';if(ok)visible++});if(empty)empty.style.display=visible?'none':'block'}if(searchInput||selects.length){if(searchInput){var params=new URLSearchParams(location.search);var val=params.get('q');if(val)searchInput.value=val;searchInput.addEventListener('input',apply)}selects.forEach(function(s){s.addEventListener('change',apply)});apply()}
})
})();
