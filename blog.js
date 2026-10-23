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
  img:"",                 // optional: "images/ram.jpg". Leave empty for the placeholder
  body:"<p>Write your article here using normal HTML.</p><h3>A sub-heading</h3><p>Another paragraph. You can add <a href='#/all'>links</a> too.</p><ul><li>Point one</li><li>Point two</li></ul>"
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
var BRAND="getpcnow";
var MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function fmtDate(iso){var p=iso.split("-");return MON[+p[1]-1]+" "+(+p[2])+", "+p[0]}
function mins(p){if(p.mins)return p.mins;var w=p.body.replace(/<[^>]+>/g," ").split(/\s+/).filter(Boolean).length;return Math.max(1,Math.round(w/200))}
function fmtReads(n){return n>=1000?(n/1000).toFixed(1).replace(".0","")+"k":String(n)}
function meta(p){return '<div class="bmeta"><span>'+fmtDate(p.date)+'</span><span>'+fmtReads(p.reads||0)+' reads</span><span>'+mins(p)+' min read</span></div>'}
function pic(p){return '<div class="bpic">'+(p.img?'<img src="'+esc(p.img)+'" alt="" loading="lazy">':'<svg aria-hidden="true"><use href="#lap"/></svg>')+'</div>'}

function card(p,feat){
  if(feat)return '<button type="button" class="bcard bfeat" data-s="'+p.slug+'">'+pic(p)+'<div class="bbody"><span class="bcat">'+esc(p.category)+'</span><h3>'+esc(p.title)+'</h3><p class="bex">'+esc(p.excerpt)+'</p><div class="bfoot">'+meta(p)+'<b class="bby">by '+BRAND+'</b></div></div></button>';
  return '<button type="button" class="bcard" data-s="'+p.slug+'"><div class="bpic">'+(p.img?'<img src="'+esc(p.img)+'" alt="" loading="lazy">':'<svg aria-hidden="true"><use href="#lap"/></svg>')+'<span class="bcat">'+esc(p.category)+'</span></div><div class="bbody"><h3>'+esc(p.title)+'</h3><p class="bex">'+esc(p.excerpt)+'</p>'+meta(p)+'</div></button>';
}

function build(){
  var sec=document.createElement("section");sec.id="blog";sec.className="blog";sec.setAttribute("aria-labelledby","blog-h");
  var html='<div class="blog-head"><span class="blog-pill">Blog</span><h2 id="blog-h">Practical reads to help you buy <em>smarter.</em></h2></div>';
  if(!POSTS.length)html+='<p class="bempty">New articles are coming soon.</p>';
  else{
    html+=card(POSTS[0],true);
    if(POSTS.length>1)html+='<div class="bgrid">'+POSTS.slice(1).map(function(p){return card(p)}).join("")+'</div>';
  }
  sec.innerHTML=html;
  sec.addEventListener("click",function(e){var b=e.target.closest("[data-s]");if(b)openPost(b.getAttribute("data-s"),b)});
  return sec;
}

var last=null;
function openPost(slug,from){
  var p=POSTS.filter(function(x){return x.slug===slug})[0];if(!p)return;
  last=from;
  var r=document.createElement("div");r.className="reader";r.setAttribute("role","dialog");r.setAttribute("aria-modal","true");r.setAttribute("aria-label",p.title);
  r.innerHTML='<article class="reader-in"><button type="button" class="reader-x" aria-label="Close">×</button><span class="bcat">'+esc(p.category)+'</span><h1>'+esc(p.title)+'</h1>'+meta(p)+(p.img?pic(p):'')+'<div class="prose">'+p.body+'</div></article>';
  document.body.appendChild(r);document.body.style.overflow="hidden";
  var x=r.querySelector(".reader-x");x.focus();
  function close(){r.remove();document.body.style.overflow="";document.removeEventListener("keydown",key);if(last)last.focus()}
  function key(e){if(e.key==="Escape")close()}
  r.addEventListener("click",function(e){if(e.target===r||e.target===x)close()});
  document.addEventListener("keydown",key);
}

function mount(){
  if(document.getElementById("blog"))return;
  var anchor=document.querySelector("#app .deals")||document.querySelector("#app .more");
  if(!anchor)return;                      // not on the home page
  anchor.parentNode.insertBefore(build(),anchor.nextSibling);
}
var app=document.getElementById("app");
if(app){new MutationObserver(mount).observe(app,{childList:true,subtree:true});mount()}
})();
