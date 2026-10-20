/* getpcnow APP. The page logic: routing, lists, laptop pages, footer. Loads after data.js and art.js. */
/* Listing health. DEAD (dead.js) = links the checker found gone. AUTO (offers-auto.js) = offers found by the finder.
   Dead links never show, auto offers older than 5 days never show, and an ad-only laptop (ad:true) disappears when its listing dies. */
var DEADL=typeof DEAD!=="undefined"?DEAD:[];
function nq(u){return String(u||"").replace(/(\.html)\?.*/,"$1")}
function alive(u){return!u||DEADL.indexOf(nq(u))<0}
function fresh(o){return!o.auto||(Date.now()-new Date(o.upd))/864e5<=5}
var ALLOFF=(typeof OFFERS!=="undefined"?OFFERS:[]).concat(typeof AUTO!=="undefined"?AUTO:[]).filter(function(o){return alive(o.url)&&fresh(o)});
P=P.filter(function(p){var u=p.url?Object.keys(p.url).map(function(k){return p.url[k]}):[];return!(p.ad&&u.length&&u.every(function(x){return!alive(x)}))});
P.forEach(function(p){p.o=[/^Apple/.test(p.n)?"mac":"win"];if(LINUX.indexOf(p.n)>-1)p.o.push("linux")});
var MAX=Math.max.apply(null,P.map(function(p){return p.hi}));
P.forEach(function(p,i){var h=[],v=p.t,x=i*7+3;for(var k=0;k<12;k++){h.unshift(Math.round(v/1000)*1000);x=(x*9301+49297)%233280;v=v*(1+((x/233280)-0.42)*0.05)}
 p.h=h;p.avg=h.reduce(function(a,b){return a+b},0)/12;p.deal=p.t<=p.avg*0.95;p.chg=(p.t-h[7])/h[7]});
var st={cur:"GH",cond:"All",bud:0,sort:"deal"},open={},alerts={},cat=null,moreOpen=false,lastCat=null;
var $=function(i){return document.getElementById(i)};
function money(n){return st.cur==="NG"?"₦"+Math.round(n).toLocaleString("en-NG"):"GH₵"+(Math.round(n*RATE/10)*10).toLocaleString("en-GH")}
/* OFFERS (from data.js): only offers for the country now selected are used. */
function fmt(n){return st.cur==="NG"?"₦"+Math.round(n).toLocaleString("en-NG"):"GH₵"+Math.round(n).toLocaleString("en-GH")}
function offerFor(p){var b=null;ALLOFF.forEach(function(o){
 if(o.n!==p.n||o.c!==st.cur||!(o.was>o.now))return;var x=1-o.now/o.was,pc=Math.round(x*100);if(pc<1)return;
 if(!b||x>b.x)b={x:x,pct:pc,was:o.was,now:o.now,src:o.src,url:o.url,upd:o.upd,test:o.test,nowN:st.cur==="GH"?o.now/RATE:o.now}});return b}
function ep(p){var o=offerFor(p);return o?o.nowN:p.t}
function budN(){return st.cur==="GH"?st.bud/RATE:st.bud}
function dk(p){var o=offerFor(p);return o?1+o.x:(p.avg-p.t)/p.avg}
function when(d){var t=new Date(d);return isNaN(t)?"":t.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}
/* Jiji button shows the going price range (from data.js JJ or jiji-bands.js), e.g. ' · GH₵8,000–8,700'. */
function jijiTag(p){var b=jijiBand(p,st.cur);return b?' · '+fmt(b[0])+'–'+fmt(b[1]).replace(/^[^\d]+/,''):''}
function sellersHtml(p){var o=offerFor(p),S=SELL[st.cur].filter(function(s){return s[0]==="Jiji"||p.c==="New"}).map(function(s){return[s[0],(o&&o.url&&o.src===s[0])?o.url:((p.url&&alive(p.url[s[0]])&&p.url[s[0]])||(s[0]==="Jiji"?jijiLink(p,st.cur):s[1]+encodeURIComponent(p.n)))]});
 if(o&&o.url&&!S.some(function(s){return s[0]===o.src}))S.push([o.src,o.url]);
 if(o)S.sort(function(a,b){return(b[0]===o.src)-(a[0]===o.src)});
 return S.map(function(s,j){return'<a class="btn'+(j?"":" dark")+'" href="'+s[1]+'" target="_blank" rel="noopener">Buy on '+s[0]+(s[0]==="Jiji"?jijiTag(p):"")+"</a>"}).join("")}
function topDeals(){var L=P.map(function(p){return{p:p,o:offerFor(p)}}).filter(function(x){return x.o}).sort(function(a,b){return b.o.x-a.o.x}).slice(0,3);
 if(!L.length)return"";
 return'<h2>Best deals right now</h2><div class="grid g1">'+L.map(function(x){return'<a class="card" href="#/laptop/'+slug(x.p.n)+'">'+lapImg(x.p.n)+"<h3>"+x.p.n+'</h3><p class="note"><b class="off">'+x.o.pct+"% off</b> · "+fmt(x.o.now)+" on "+x.o.src+(x.o.test?" · SAMPLE":"")+"</p></a>"}).join("")+"</div>"}
function toast(m){var t=$("toast");t.textContent=m;t.className="on";clearTimeout(toast.t);toast.t=setTimeout(function(){t.className=""},2200)}
function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function img(src){return'<div class="im"><svg aria-hidden="true"><use href="#lap"/></svg><img src="'+src+'" alt="" loading="lazy" onerror="this.remove()"></div>'}
function chart(p){var w=300,h=90,mn=Math.min.apply(null,p.h),mx=Math.max.apply(null,p.h),d=(mx-mn)||1;
 var pts=p.h.map(function(v,i){return[(i*(w-20)/11+10).toFixed(1),(h-14-((v-mn)/d)*(h-34)).toFixed(1)]});
 var line=pts.map(function(q){return q.join(",")}).join(" ");
 return'<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="Price over the last 12 weeks"><polygon points="10,'+(h-4)+' '+line+' '+(w-10)+','+(h-4)+'" fill="#1e90ff" opacity=".12"/><polyline points="'+line+'" fill="none" stroke="#1e90ff" stroke-width="2.5" stroke-linejoin="round"/><circle cx="'+pts[11][0]+'" cy="'+pts[11][1]+'" r="4" fill="#1e90ff"/><text x="10" y="12" font-size="10" fill="#555">High '+money(mx)+'</text><text x="'+(w-10)+'" y="12" font-size="10" text-anchor="end" fill="#555">Low '+money(mn)+'</text></svg><p class="note">Last 12 weeks. Today’s typical price is '+(p.t<=p.avg?Math.round((1-p.t/p.avg)*100)+"% below":Math.round((p.t/p.avg-1)*100)+"% above")+' the 12-week average.</p>'}
function panel(p,k){
 if(k==="pc")return'<div class="pc"><div><h4>Pros</h4><ul class="pros">'+p.pro.map(function(x){return"<li>"+x+"</li>"}).join("")+'</ul></div><div><h4>Cons</h4><ul class="cons">'+p.con.map(function(x){return"<li>"+x+"</li>"}).join("")+'</ul></div></div>';
 if(k==="sp"){var L=["Screen","Memory","Storage","Processor","Graphics"];return"<table>"+L.map(function(l,i){return"<tr><td>"+l+"</td><td>"+p.s[i]+"</td></tr>"}).join("")+"<tr><td>Condition</td><td>"+p.c+"</td></tr></table>"}
 return'<div class="chart">'+chart(p)+"</div>"}

function seg(items,key,id){return'<div class="seg" role="group">'+items.map(function(v){return'<button class="btn'+(st[key]===v?" on":"")+'" data-k="'+key+'" data-v="'+v+'">'+v+"</button>"}).join("")+"</div>"}
function budgetSel(){var n=st.cur==="NG"?[500000,800000,1200000,1600000]:[3500,5000,7500,10000],o=[[0,"Any budget"]].concat(n.map(function(v){return[v,"Under "+fmt(v)]}));
 return'<select id="budget" aria-label="Budget">'+o.map(function(x){return'<option value="'+x[0]+'"'+(st.bud===x[0]?" selected":"")+">"+x[1]+"</option>"}).join("")+"</select>"}

function bindMore(){
 var b=$("more"),d=$("deals");
 b.onclick=function(e){
  var r=b.getBoundingClientRect(),z=Math.max(r.width,r.height)*2,x=e.detail?e.clientX-r.left:r.width/2,y=e.detail?e.clientY-r.top:r.height/2,rp=document.createElement("span");
  rp.className="rp";rp.style.cssText="width:"+z+"px;height:"+z+"px;left:"+(x-z/2)+"px;top:"+(y-z/2)+"px";b.appendChild(rp);setTimeout(function(){rp.remove()},700);
  moreOpen=!moreOpen;b.setAttribute("aria-expanded",moreOpen);d.classList.toggle("open",moreOpen);
  var l=b.querySelector(".lbl");l.textContent=moreOpen?"View Less":"View More";l.classList.remove("swap");void l.offsetWidth;l.classList.add("swap");
  if(moreOpen)setTimeout(function(){d.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})},350)}}
function home(){
 $("app").innerHTML='<section class="hero"><div><h1>Find the right laptop for what you do.</h1><p>Pick how you will use it. We show the laptops that fit, what is good and bad about each, and where to buy.</p><a class="btn dark" href="#/all">Browse all laptops</a></div>'+img("images/hero.jpg")+'</section>'
 +topDeals()+'<h2>Choose your use</h2><div class="grid g1">'+CATS.map(function(c){return'<a class="card" href="#/'+c[0]+'">'+img("images/"+c[0]+".jpg")+'<h3>Best Laptops for '+c[1]+"</h3></a>"}).join("")+'<a class="card" href="#/all">'+img("images/all.jpg")+"<h3>All laptops</h3></a></div>"
 +'<div class="more"><button class="btn dark more-btn" id="more" aria-expanded="'+moreOpen+'" aria-controls="deals"><span class="lbl">'+(moreOpen?"View Less":"View More")+'</span><svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button></div>'
 +'<div class="deals'+(moreOpen?" open":"")+'" id="deals"><div class="deals-in"><h2>Deals by system</h2><div class="grid">'+DEALS.map(function(c){return'<a class="card" href="#/'+c[0]+'">'+dealImg(c)+"<h3>"+c[1]+"</h3></a>"}).join("")+"</div></div></div>";
 bindMore();
 document.title="getpcnow – find the right laptop at the right price"}

function tips(){
 $("app").innerHTML='<section class="page"><a class="back" href="#/">← Home</a><h1>Buying used? Check these first</h1><p>A little caution goes a long way.</p><ol class="tips"><li>Meet in a public place and test the laptop before paying.</li><li>Check battery health and charge cycles.</li><li>Look for dead pixels, a loose hinge and keyboard faults.</li><li>Confirm the serial number matches the box or the sticker.</li><li>Never send money before you have seen the laptop.</li></ol></section>';
 document.title="Buying used – getpcnow"}

function list(){
 var L=P.filter(function(p){return(!cat||(cat[3]?p.o.indexOf(cat[3])>-1:p.u.indexOf(cat[1])>-1))&&(st.cond==="All"||p.c===st.cond)&&(!st.bud||ep(p)<=budN())});
 L.sort(function(a,b){return st.sort==="low"?ep(a)-ep(b):st.sort==="high"?ep(b)-ep(a):st.sort==="deal"?dk(b)-dk(a):b.sc-a.sc});
 var nd=L.filter(function(p){return offerFor(p)}).length;
 $("count").textContent=L.length+(L.length===1?" laptop":" laptops")+(nd?" · "+nd+" on offer":"");
 var box=$("items");box.innerHTML=L.length?"":'<div class="item"><div class="top" style="grid-template-columns:1fr"><div><h3 class="name">No laptops match yet</h3><p class="spec">Try a higher budget or set condition to All.</p></div></div></div>';
 L.forEach(function(p){var i=P.indexOf(p),o=open[i],el=document.createElement("article"),ofr=offerFor(p);el.className="item";
  var sellers=sellersHtml(p);
  el.innerHTML='<div class="top"><a class="imlink" href="#/laptop/'+slug(p.n)+'" aria-label="View '+p.n+'">'+lapImg(p.n)+'</a><div><h3 class="name"><a class="nl" href="#/laptop/'+slug(p.n)+'">'+p.n+'</a><span class="score" title="Our score out of 10">'+p.sc.toFixed(1)+'</span></h3><p class="spec">'+p.s.join(" | ")+'</p><div class="tags">'+p.u.map(function(u){return'<span class="tag">'+u+"</span>"}).join("")+'</div><div class="tabs">'+[["pc","Pros and cons"],["sp","Specs"],["ph","Price history"]].map(function(t){return'<button class="tab" data-k="'+t[0]+'" aria-expanded="'+(o===t[0])+'">'+t[1]+"</button>"}).join("")+'</div></div>'
  +'<div class="buy"><span class="b'+(ofr?" sale":p.deal?" deal":p.chg<-0.03?" drop":"")+'">'+(ofr?ofr.pct+"% off":p.deal?"Good deal":p.chg<-0.03?"Down "+Math.round(-p.chg*100)+"%":p.c)+'</span><div class="price">'+(ofr?fmt(ofr.now)+'<small><s>'+fmt(ofr.was)+'</s> · Save '+fmt(ofr.was-ofr.now)+'<br>'+ofr.src+' · '+p.c+(ofr.upd?' · checked '+when(ofr.upd):'')+(ofr.test?' · SAMPLE':'')+'</small>':money(p.t)+'<small>typical price · '+p.c+'</small>')+'</div><div><div class="range" aria-hidden="true"><i style="left:'+(p.lo/MAX*100)+'%;width:'+((p.hi-p.lo)/MAX*100)+'%"></i><u style="left:'+(p.t/MAX*100)+'%"></u></div><div class="rl"><span>'+money(p.lo)+'</span><span>'+money(p.hi)+'</span></div></div><div class="btns">'+sellers+'<button class="btn bell'+(alerts[i]?" on":"")+'" aria-label="Price alert" aria-pressed="'+!!alerts[i]+'">🔔</button></div></div></div>'
  +(o?'<div class="panel">'+panel(p,o)+"</div>":"");
  el.querySelectorAll(".tab").forEach(function(b){b.onclick=function(){open[i]=open[i]===b.dataset.k?null:b.dataset.k;list()}});
  el.querySelector(".bell").onclick=function(){alerts[i]=!alerts[i];toast(alerts[i]?"Alert set for "+p.n+" (demo)":"Alert removed");list();if(alerts[i]){var bl=$("items").children[L.indexOf(p)].querySelector(".bell");bl.classList.add("ring")}};
  box.appendChild(el)})}

function category(c){
 if(!lastCat||c[0]!==lastCat[0])st.sort="deal";lastCat=c;
 cat=c[0]==="all"?null:c;var t=cat?(c[3]?c[1]:"Best Laptops for "+c[1]):"All laptops";
 $("app").innerHTML='<section class="page"><a class="back" href="#/">← All categories</a><h1>'+t+'</h1><p>'+c[2]+'</p><div class="filters">'+seg(["All","New","Used","Refurbished"],"cond")+budgetSel()
 +'<select id="sort" aria-label="Sort"><option value="score">Top rated</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="deal">Best deals</option></select></div><p class="count" id="count"></p><div id="items"></div></section>';
 $("sort").value=st.sort;
 $("budget").onchange=function(){st.bud=+this.value;list()};$("sort").onchange=function(){st.sort=this.value;list()};
 document.querySelectorAll("[data-k=cond]").forEach(function(b){b.onclick=function(){st.cond=b.dataset.v;category(c)}});
 document.title=t+" – getpcnow";list()}
function rateOf(k,v){var n=parseFloat(v);return k==="r"?(n>=16?3:n>=8?2:1):k==="s"?(n*(/TB/i.test(v)?1000:1)>=1000?3:n*(/TB/i.test(v)?1000:1)>=512?2:1):((k==="c"?RCPU:RGPU)[v]||2)}
function pf(n){return'<span class="pf pf'+n+'">'+RL[n]+" Performance</span>"}
function variants(p){var b=p.s,o=offerFor(p),l=[{r:b[1],s:b[2],c:b[3],g:b[4],t:o?o.nowN:p.t,base:1,o:o}];
 (VARS[p.n]||[]).forEach(function(a){var t=Math.round(p.t*a[4]/1000)*1000;l.push({r:a[0],s:a[1],c:a[2],g:a[3],t:t,was:a[5]?Math.round(t/0.9/1000)*1000:0})});return l}
var DV={n:"",open:false,sort:"low",sel:{c:[],g:[],r:[],s:[]},spec:{}};
function vkey(v){return[v.r,v.s,v.c,v.g].join("|")}
function vrow(p,v){
 var key=vkey(v),on=DV.spec[key],al=alerts[p.n+key],
 lbl=v.o?v.o.pct+"% off":v.was?"On Sale":v.base?(p.deal?"Great Deal":p.chg<-0.03?"Down "+Math.round(-p.chg*100)+"%":p.c):p.c,
 cls=v.o||v.was?" sale":v.base?(p.deal?" deal":p.chg<-0.03?" drop":""):"",
 sellers=sellersHtml(p);
 return'<article class="vr"><div class="vi">'+lapImg(p.n)+'</div><div class="vm"><h3>'+p.n+'</h3><div class="chips"><span>'+v.r+"</span><span>"+v.s+"</span><span>"+v.c+"</span><span>"+v.g+'</span></div>'
  +'<button class="tab" data-a="spec" data-k="'+key+'" aria-expanded="'+!!on+'">'+GEAR+"Specs</button>"
  +(on?"<table><tr><td>Screen</td><td>"+p.s[0]+"</td></tr><tr><td>Memory</td><td>"+v.r+"</td></tr><tr><td>Storage</td><td>"+v.s+"</td></tr><tr><td>Processor</td><td>"+v.c+"</td></tr><tr><td>Graphics</td><td>"+v.g+"</td></tr><tr><td>Condition</td><td>"+p.c+"</td></tr></table>":"")+"</div>"
  +'<div class="vb"><span class="b'+cls+'">'+lbl+'</span><div class="vp"><b class="price">'+(v.o?fmt(v.o.now):money(v.t))+"</b>"+(v.o?"<s>"+fmt(v.o.was)+"</s><em>Save "+fmt(v.o.was-v.o.now)+"</em>"+(v.o.test?"<em>Sample offer</em>":""):v.was?"<s>"+money(v.was)+"</s><em>Save "+money(v.was-v.t)+"</em>":"")+'</div><div class="btns"><div class="sl">'+sellers+'</div><button class="btn bell'+(al?" on":"")+'" data-a="bell" data-k="'+key+'" aria-label="Price alert" aria-pressed="'+!!al+'">🔔</button></div></div></article>'}
function vrender(p){
 var all=variants(p),G=[["c","Processor","cpu"],["g","GPU","gpu"],["r","RAM","ram"],["s","Storage","storage"]],any=false;
 var list=all.filter(function(v){return G.every(function(g){return!DV.sel[g[0]].length||DV.sel[g[0]].indexOf(v[g[0]])>-1})}).sort(function(a,b){return DV.sort==="low"?a.t-b.t:b.t-a.t});
 G.forEach(function(g){if(DV.sel[g[0]].length)any=true});
 $("vw").className="vw"+(DV.open?" cfg-open":"");$("cfg").hidden=!DV.open;
 $("cfgb").setAttribute("aria-expanded",DV.open);
 $("cfg").innerHTML=G.map(function(g){var u=[];all.forEach(function(v){if(u.indexOf(v[g[0]])<0)u.push(v[g[0]])});
  return'<div class="cg"><h4>'+dico(g[2])+g[1]+"</h4>"+u.map(function(o){return'<button class="opt'+(DV.sel[g[0]].indexOf(o)>-1?" on":"")+'" data-a="opt" data-g="'+g[0]+'" data-v="'+o+'" aria-pressed="'+(DV.sel[g[0]].indexOf(o)>-1)+'">'+o+"</button>"}).join("")+"</div>"}).join("")+(any?'<button class="clr" data-a="clr">Clear choices</button>':"");
 $("vlist").innerHTML=list.length?list.map(function(v){return vrow(p,v)}).join(""):'<div class="vempty">No configuration matches those choices. <button class="clr" data-a="clr">Clear choices</button></div>'}
function accRows(p){
 var vs=variants(p),b=p.s;
 function others(k,std){var u=[];vs.forEach(function(v){if(v[k]!==std&&u.indexOf(v[k])<0)u.push(v[k])});return u.length?"<p>Also available: "+u.join(", ")+"</p>":""}
 function part(k,std,what){return"<p>Standard: "+std+"</p>"+others(k,std)}
 return[["Display",0,"<p>Screen size: "+b[0]+"</p>"],
  ["Processor",rateOf("c",b[3]),part("c",b[3])],
  ["Memory",rateOf("r",b[1]),part("r",b[1])],
  ["Storage",rateOf("s",b[2]),part("s",b[2])],
  ["Graphics",rateOf("g",b[4]),part("g",b[4])],
  ["Network",0,"<p>"+(p.net||"Wi-Fi and Bluetooth details have not been added for this laptop yet.")+"</p>"],
  ["Others",0,"<p>Condition: "+p.c+"</p><p>Best for: "+p.u.join(", ")+"</p><p>Our score: "+p.sc.toFixed(1)+" out of 10</p><p>Typical price: "+money(p.t)+"</p>"]]}
function detail(p){
 if(DV.n!==p.n)DV={n:p.n,open:false,sort:"low",sel:{c:[],g:[],r:[],s:[]},spec:{}};
 var sellers=sellersHtml(p),ofr=offerFor(p);
 var C=[["screen","Screen Size",p.s[0]],["ram","Memory (RAM)",p.s[1]],["storage","Storage",p.s[2]],["cpu","Processor",p.s[3]],["gpu","Graphics",p.s[4]],["tag","Condition",p.c],["star","Our Score",p.sc.toFixed(1)+" / 10"],["users","Best For",p.u.join(", ")]];
 var chev='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
 $("app").innerHTML='<section class="page"><a class="back" href="#/'+(lastCat?lastCat[0]:"all")+'">← Back to laptops</a>'
  +'<div class="dz">'+lapImg(p.n)+'<div><h1>'+p.n+'</h1><p class="lead">A '+p.c.toLowerCase()+' laptop that suits '+p.u.join(", ").replace(/, ([^,]*)$/," and $1")+'. Rated '+p.sc.toFixed(1)+' out of 10.</p>'
  +'<button class="rm" id="rm" aria-expanded="false" aria-controls="rmb">Read More '+chev+'</button><div class="rmb" id="rmb" hidden>'+panel(p,"pc")+'</div>'
  +'<div class="dlinks"><a href="https://www.youtube.com/results?search_query='+encodeURIComponent(p.n+" review")+'" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4.5"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/></svg>Watch Review</a></div>'
  +'<div class="dbuy">'+(ofr?'<span class="b sale">'+ofr.pct+'% off</span><div class="dprice"><b class="price">'+fmt(ofr.now)+'</b><small><s>'+fmt(ofr.was)+'</s> · Save '+fmt(ofr.was-ofr.now)+' · '+ofr.src+(ofr.test?' · SAMPLE':'')+'</small></div>':'<span>Starts from</span><b class="price">'+money(p.lo)+'</b>')+'<div class="btns">'+sellers+'</div></div></div></div>'
  +'<div class="sg">'+C.map(function(c){return'<div class="sc"><div class="ic">'+dico(c[0])+"</div><small>"+c[1]+"</small><b>"+c[2]+"</b></div>"}).join("")+"</div>"
  +'<div class="dsec"><h2>Best Prices &amp; Deals</h2><div class="vt"><button class="btn dark" id="cfgb" aria-expanded="false" aria-controls="cfg">'+SLID+'Customize Config</button><select id="vsort" aria-label="Sort configurations"><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option></select></div>'
  +'<div class="vw" id="vw"><aside class="cp" id="cfg" hidden></aside><div id="vlist"></div></div></div>'
  +'<div class="dsec"><h2>Details</h2><div class="acc">'+accRows(p).map(function(r){return"<details><summary>"+r[0]+(r[1]?pf(r[1]):"")+'</summary><div class="ab">'+r[2]+"</div></details>"}).join("")+'</div><p class="note">Performance ratings are our own simple estimate of each part compared with the other laptops on this site.</p></div>'
  +'<div class="dsec"><h2>Pros and cons</h2>'+panel(p,"pc")+"</div></section>";
 $("rm").onclick=function(){var o=this.getAttribute("aria-expanded")!=="true";this.setAttribute("aria-expanded",o);$("rmb").hidden=!o};
 $("cfgb").onclick=function(){DV.open=!DV.open;vrender(p)};
 $("vsort").value=DV.sort;$("vsort").onchange=function(){DV.sort=this.value;vrender(p)};
 $("vw").onclick=function(e){var t=e.target.closest("[data-a]");if(!t)return;var a=t.dataset.a;
  if(a==="opt"){var l=DV.sel[t.dataset.g],i=l.indexOf(t.dataset.v);i>-1?l.splice(i,1):l.push(t.dataset.v)}
  else if(a==="clr"){DV.sel={c:[],g:[],r:[],s:[]}}
  else if(a==="spec"){DV.spec[t.dataset.k]=!DV.spec[t.dataset.k]}
  else if(a==="bell"){var k=p.n+t.dataset.k;alerts[k]=!alerts[k];toast(alerts[k]?"Alert set for "+p.n+" (demo)":"Alert removed")}
  vrender(p)};
 vrender(p);
 document.title=p.n+" – getpcnow"}

function route(){
 var h=location.hash.replace(/^#\/?/,"");
 $("NG").className="btn"+(st.cur==="NG"?" on":"");$("GH").className="btn"+(st.cur==="GH"?" on":"");
 if(!h)home();else if(h==="tips")tips();else if(h==="all")category(["all","","Every laptop we track, in one list."]);
 else if(h.indexOf("laptop/")===0){var q=P.filter(function(x){return slug(x.n)===h.slice(7)})[0];q?detail(q):home()}
 else{var c=CATS.concat(DEALS).filter(function(x){return x[0]===h})[0];c?category(c):home()}}
window.addEventListener("hashchange",function(){route();window.scrollTo(0,0)});
["NG","GH"].forEach(function(k){$(k).onclick=function(){if(st.cur!==k)st.bud=0;st.cur=k;route()}});
function footer(){
 var q=[["Home","#/"],["All laptops","#/all"],["Buying used","#/tips"]],
 d=DEALS.map(function(c){return[c[1],"#/"+c[0]]});
 function col(t,a){return"<div><h4>"+t+'</h4><ul>'+a.map(function(x){return'<li><a href="'+x[1]+'">'+x[0]+"</a></li>"}).join("")+"</ul></div>"}
 var soc=SOCIALS.map(function(x){var live=!!x.url,mail=/^mailto:/.test(x.url);
  return'<li><a href="'+(live?x.url:"#")+'"'+(live&&!mail?' target="_blank" rel="noopener noreferrer"':"")+(live?"":' data-soon="'+x.label+'"')+' aria-label="'+x.label+(live&&!mail?" (opens in a new tab)":"")+'">'+ICO[x.k]+"<span>"+x.label+"</span></a></li>"}).join("");
 $("foot").innerHTML='<div class="wrap"><div class="foot-grid"><div class="foot-brand"><a class="foot-logo" href="#/" aria-label="getpcnow home"><div><span>get</span><span><b>pc</b></span><span>now</span></div></a></div>'
  +col("Quick Links",q)+col("Deals by system",d)+'<div><h4>Get In Touch</h4><ul>'+soc+"</ul></div></div>"
  +'<div class="foot-note"><span>Prototype with sample data. Prices, scores and exchange rate are placeholders, not live market prices.</span><button class="to-top" id="top" aria-label="Back to top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button></div></div>';
 $("foot").onclick=function(e){var a=e.target.closest("a[data-soon]");if(a){e.preventDefault();toast(a.getAttribute("data-soon")+" is coming soon")}};
 $("top").onclick=function(){window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}}
footer();
route();
