/* getpcnow blog. Add <script src="blog.js"></script> after app.js.
   TO PUBLISH A POST: copy one block in POSTS below, change the fields, put the newest first. */
(function(){
var POSTS=[
{
  slug:"ram-8-vs-16",
  category:"Advice",
  title:"8GB or 16GB RAM? What you actually need in 2026",
  excerpt:"Most people overspend on specs they never use. Here is a simple way to pick the right amount of memory for how you work.",
  date:"2026-10-20",      // YYYY-MM-DD
  reads:131,              // update this number whenever you like
  // mins:6,              // optional. If left out, it is worked out from the article length
  img:"",                 // headline image, e.g. "images/ram.jpg". Empty = grey placeholder
  caption:"",             // optional small line under the headline image
  summary:"A plain guide to choosing between 8GB and 16GB of RAM, based on what you actually do on your laptop.", // optional. Shows under the image as 'Summary'
  body:"<p>Memory is one of the easiest specs to overspend on. More RAM does not make a laptop faster by itself. It only helps when your work needs more than you have.</p><p>If you mostly browse, watch videos, write documents and join video calls, 8GB is enough for many people. The moment you keep dozens of browser tabs open or run heavy apps next to each other, 16GB starts to feel much smoother.</p><h2>Who should pick 16GB?</h2><p>Programmers, video editors, designers and anyone who likes to keep many apps open at once. If you plan to keep the laptop for four years or more, 16GB also gives you room as apps grow.</p><h2>Who can save money with 8GB?</h2><p>Students and office users with simple needs. Put the money you save into a bigger SSD or a better screen instead.</p><ul><li>Check if the RAM can be upgraded later.</li><li>Check if it is soldered to the board.</li><li>Always prefer an SSD over a hard drive.</li></ul>"
},
{
  slug:"used-laptop-checklist",
  category:"Buying used",
  title:"The 10-minute checklist before you pay for a used laptop",
  excerpt:"Battery health, screen, keyboard and ports. What to test in the seller's shop so you do not get stuck with a problem.",
  date:"2026-10-14",reads:98,img:"",
  body:"<p>Your article goes here.</p>"
},
{
  slug:"best-student-laptops",
  category:"Guides",
  title:"Laptops that survive four years of campus life",
  excerpt:"Light, tough and fair on price. What to look for when you are buying for school.",
  date:"2026-10-08",reads:204,img:"",
  body:"<p>Your article goes here.</p>"
},
{
  slug:"chromebook-vs-windows",
  category:"Tips",
  title:"Windows, Mac or Chromebook: which suits your budget?",
  excerpt:"A plain comparison for first-time buyers, with no jargon.",
  date:"2026-09-30",reads:75,img:"",
  body:"<p>Your article goes here.</p>"
}
];
var BY="getpcwriters";
var MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function fmtDate(iso){var p=iso.split("-");return MON[+p[1]-1]+" "+(+p[2])+", "+p[0]}
function mins(p){if(p.mins)return p.mins;var w=p.body.replace(/<[^>]+>/g," ").split(/\s+/).filter(Boolean).length;return Math.max(1,Math.round(w/200))}
function fmtReads(n){return n>=1000?(n/1000).toFixed(1).replace(".0","")+"k":String(n)}
function meta(p){return '<div class="bmeta"><span>'+fmtDate(p.date)+'</span><span>'+fmtReads(p.reads||0)+' reads</span><span>'+mins(p)+' min read</span></div>'}
function pic(p,extra){return '<div class="bpic">'+(p.img?'<img src="'+esc(p.img)+'" alt="" loading="lazy">':'<svg aria-hidden="true"><use href="#lap"/></svg>')+(extra||'')+'</div>'}
function href(p){return '#/post/'+p.slug}

function card(p,feat){
  if(feat)return '<a class="bcard bfeat" href="'+href(p)+'">'+pic(p)+'<div class="bbody"><span class="bcat">'+esc(p.category)+'</span><h3>'+esc(p.title)+'</h3><p class="bex">'+esc(p.excerpt)+'</p><div class="bfoot">'+meta(p)+'<b class="bby">by '+BY+'</b></div></div></a>';
  return '<a class="bcard" href="'+href(p)+'">'+pic(p,'<span class="bcat">'+esc(p.category)+'</span>')+'<div class="bbody"><h3>'+esc(p.title)+'</h3><p class="bex">'+esc(p.excerpt)+'</p>'+meta(p)+'</div></a>';
}
function grid(list){return '<div class="bgrid">'+list.map(function(p){return card(p)}).join("")+'</div>'}

/* ---- home section (under View More) ---- */
var SHOW=4; // how many posts show on the home page (1 big + 3 small)
function build(){
  var sec=document.createElement("section");sec.id="blog";sec.className="blog";sec.setAttribute("aria-labelledby","blog-h");
  var html='<div class="blog-head"><span class="blog-pill">Blog</span><h2 id="blog-h">Practical reads before purchase on <span class="blog-brand">getpcnow</span></h2></div>';
  if(!POSTS.length)html+='<p class="bempty">New articles are coming soon.</p>';
  else{
    html+=card(POSTS[0],true);
    if(POSTS.length>1)html+=grid(POSTS.slice(1,SHOW));
    if(POSTS.length>SHOW)html+='<p class="bmore"><a class="btn dark" href="#/blog">See all articles</a></p>';
  }
  sec.innerHTML=html;return sec;
}
function mount(){
  if(document.getElementById("blog"))return;
  var anchor=document.querySelector("#app .deals")||document.querySelector("#app .more");
  if(!anchor)return;
  anchor.parentNode.insertBefore(build(),anchor.nextSibling);
}

/* ---- pages ---- */
function setToggle(){ // keep the Nigeria/Ghana buttons in sync, as app.js does
  if(typeof st==="undefined")return;
  var n=document.getElementById("NG"),g=document.getElementById("GH");
  if(n)n.className="btn"+(st.cur==="NG"?" on":"");if(g)g.className="btn"+(st.cur==="GH"?" on":"");
}
function blogIndex(){
  setToggle();
  document.getElementById("app").innerHTML='<section class="page"><a class="back" href="#/">← Home</a><h1>Blog</h1><p>Advice, guides and tips for buying the right laptop.</p>'+(POSTS.length?grid(POSTS):'<p class="bempty">New articles are coming soon.</p>')+'</section>';
  document.title="Blog – getpcnow";
}
function share(p){
  var url=location.href;
  if(navigator.share){navigator.share({title:p.title,url:url}).catch(function(){});return}
  var done=function(){if(typeof toast==="function")toast("Link copied")};
  if(navigator.clipboard)navigator.clipboard.writeText(url).then(done,function(){});else done();
}
function postPage(slug){
  var p=POSTS.filter(function(x){return x.slug===slug})[0];
  if(!p)return blogIndex();
  setToggle();
  var more=POSTS.filter(function(x){return x!==p}).slice(0,3);
  var shareIc='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.6l6.8-4.2M8.6 13.4l6.8 4.2"/></svg>';
  document.getElementById("app").innerHTML='<article class="page post"><a class="back" href="#/">← Home</a>'
   +'<h1>'+esc(p.title)+'</h1>'
   +'<div class="postbar">'+meta(p)+'<button type="button" class="shr" id="shr">'+shareIc+'Share</button></div>'
   +'<figure class="hero-img">'+pic(p)+(p.caption?'<figcaption>'+esc(p.caption)+'</figcaption>':'')+'</figure>'
   +(p.summary?'<h2 class="sumh">Summary</h2><p class="sum">'+esc(p.summary)+'</p>':'')
   +'<div id="toc"></div>'
   +'<div class="prose" id="prose">'+p.body+'</div>'
   +'<p class="byline">Written by '+BY+'</p>'
   +(more.length?'<h2 class="postmore">More reads</h2>'+grid(more):'')+'</article>';
  document.getElementById("shr").onclick=function(){share(p)};
  /* table of contents from the article's h2 headings */
  var hs=document.querySelectorAll("#prose h2");
  if(hs.length>1){
    var items="";
    Array.prototype.forEach.call(hs,function(h,i){h.id="sec-"+(i+1);items+='<li><a href="#" data-t="sec-'+(i+1)+'">'+esc(h.textContent)+'</a></li>'});
    var toc=document.getElementById("toc");
    toc.className="toc";
    toc.innerHTML='<h2 class="sumh">In this article</h2><ol>'+items+'</ol>';
    /* scroll without touching the URL hash, because the hash is what the router uses */
    toc.onclick=function(e){
      var a=e.target.closest("a[data-t]");if(!a)return;
      e.preventDefault();
      var el=document.getElementById(a.getAttribute("data-t"));
      if(el)el.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
    };
  }
  document.title=p.title+" – getpcnow";
}

/* ---- hook into app.js routing ---- */
if(typeof route==="function"){
  var baseRoute=route;
  route=function(){
    var h=location.hash.replace(/^#\/?/,"");
    if(h==="blog")return blogIndex();
    if(h.indexOf("post/")===0)return postPage(h.slice(5));
    baseRoute();
  };
}
/* header + footer links */
var nav=document.querySelector("header nav");
if(nav){var a=document.createElement("a");a.href="#/blog";a.textContent="Blog";nav.appendChild(a)}
var fl=document.querySelector("#foot .foot-grid > div:nth-child(2) ul");
if(fl){var li=document.createElement("li");li.innerHTML='<a href="#/blog">Blog</a>';fl.appendChild(li)}

var app=document.getElementById("app");
if(app){new MutationObserver(mount).observe(app,{childList:true,subtree:true})}
/* blog.js must load AFTER app.js (see index.html). The patched route() above handles blog pages
   on every hash change. app.js has already drawn the first page, so handle direct links here. */
var h0=location.hash.replace(/^#\/?/,"");
if(h0==="blog")blogIndex();
else if(h0.indexOf("post/")===0)postPage(h0.slice(5));
else mount();
})();
