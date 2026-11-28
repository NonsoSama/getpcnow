/* getpcnow LIVE. Loads AFTER app.js and blog.js. Reads the "delisted", "added", "links" and "edits" tables from Supabase (public read, publishable key only)
   and applies them to the page, so a change made in /admin shows on the site within seconds with no code change or deploy.
   If Supabase cannot be reached, the site just shows data.js as before. The "edits", "checks" and "reports" tables are optional: if they are missing or fail, everything else still works.
   14-DAY TIMER: a listing with a specific Jiji ad link has a start date in the "checks" table. At 14 days its link is treated as dead (the Buy on Jiji button falls back to a Jiji search,
   and an ad-only laptop leaves that country). Visitors can press "Sold out?". After REPORT_HIDE different visitors report the same ad, it is hidden early. "Keep live" in /admin restarts the clock.
   Keep HIDE and REPORT_HIDE the same as in admin.html. Set REPORT_HIDE to 0 to show the warning label only and never hide because of reports. */
(function(){
 var C={url:"https://bcfspmezuuanhmxndjsq.supabase.co",key:"sb_publishable_pa3gHKvmKqW2Vb-kl_n61w_8Yvp5Ie2"};
 var HIDE=14,REPORT_HIDE=3;
 function get(t){return fetch(C.url+"/rest/v1/"+t+"?select=*",{headers:{apikey:C.key}}).then(function(r){if(!r.ok)throw 0;return r.json()})}
 /* EDITS: only known fields, only the right types. Anything else in an edit is ignored, so a bad row cannot break a laptop page. */
 var CD=["New","Used","Refurbished"],CN=["GH","NG"];
 function str(x,m){return typeof x==="string"&&x.trim().length>0&&x.length<=m}
 function strs(a,m,max,min){return Array.isArray(a)&&a.length>=min&&a.length<=max&&a.every(function(x){return str(x,m)})}
 function clean(d){var o={};if(!d||typeof d!=="object")return o;
  if(CD.indexOf(d.c)>-1)o.c=d.c;
  if(strs(d.s,40,5,5))o.s=d.s.slice();
  if(strs(d.u,30,10,1))o.u=d.u.slice();
  if(strs(d.pro,200,12,0))o.pro=d.pro.slice();
  if(strs(d.con,200,12,0))o.con=d.con.slice();
  if(d.pr&&typeof d.pr==="object"){var pr={};CN.forEach(function(k){var v=Math.round(+d.pr[k]);if(isFinite(v)&&v>0&&v<1e9)pr[k]=v});
   if(pr.GH||pr.NG){o.pr=pr;o.cn=CN.filter(function(k){return pr[k]})}}
  if(d.est===0)o.est=0;
  return o}
 Promise.all([get("delisted"),get("added"),get("links"),get("edits").catch(function(){return[]}),get("checks").catch(function(){return[]}),get("reports").catch(function(){return[]})]).then(function(x){
  var del=x[0],add=x[1],lk=x[2],ed=x[3],ck=x[4],rp=x[5];
  /* 1. delisted offer links (key starts with http) behave like dead links */
  del.forEach(function(d){if(/^https?:/.test(d.key))DEADL.push(nq(d.key))});
  function offs(){ALLOFF=(typeof OFFERS!=="undefined"?OFFERS:[]).concat(typeof AUTO!=="undefined"?AUTO:[]).filter(function(o){return o.src!=="Jumia"&&alive(o.url)&&fresh(o)})}
  offs();
  /* 2. laptops added from the admin page */
  add.forEach(function(a){var p=a.data;if(!p||!p.n||P.some(function(q){return q.n===p.n}))return;
   p.o=[/^Apple/.test(p.n)?"mac":"win"];if(LINUX.indexOf(p.n)>-1)p.o.push("linux");P.push(p)});
  /* 2b. edits from the Edit listings tab (key = laptop name). Applied over data.js and over added laptops, before delisting. */
  var E={};ed.forEach(function(e){if(e&&e.key)E[e.key]=e.data});
  P.forEach(function(p){try{var c=clean(E[p.n]);if(!Object.keys(c).length)return;
   for(var f in c)p[f]=c[f];
   if(c.est===0)delete p.est;
   /* t is the fallback price in naira, filled from pr exactly as data.js does it */
   if(c.pr){if(c.pr.NG)p.t=c.pr.NG;else{var n=Math.ceil(c.pr.GH/RATE);while(n*RATE<c.pr.GH)n++;p.t=n}}
  }catch(err){}});
  /* 3. delisted laptops (key = name). ALL removes it everywhere; GH or NG removes it from that country only */
  var byName={};del.forEach(function(d){if(!/^https?:/.test(d.key))(byName[d.key]=byName[d.key]||[]).push(d.country)});
  P=P.filter(function(p){var c=byName[p.n];if(!c)return true;
   if(c.indexOf("ALL")>-1)return false;
   var cn=(p.cn||["GH","NG"]).filter(function(k){return c.indexOf(k)<0});
   if(!cn.length)return false;p.cn=cn;return true});
  /* 4. posted Jiji links: the Buy on Jiji button opens the link for the country now selected (falls back to the link in data.js) */
  var L={},B={};lk.forEach(function(l){(L[l.key]=L[l.key]||{})[l.country]=l.url});
  P.forEach(function(p){if(p.url&&typeof p.url.Jiji==="string")B[p.n]=p.url.Jiji});
  P.forEach(function(p){var m=L[p.n];if(!m)return;var base=p.url&&p.url.Jiji;if(!p.url)p.url={};
   Object.defineProperty(p.url,"Jiji",{enumerable:true,configurable:true,get:function(){return m[st.cur]||base}})});
  /* 5. 14-day timer and visitor reports (see the header). Wrapped so a problem here can never break the site. */
  try{
   var DOMR={GH:/^https:\/\/(www\.)?jiji\.com\.gh\//i,NG:/^https:\/\/(www\.)?jiji\.ng\//i};
   /* Postgres sends microseconds; Safari can choke on them, so cut to milliseconds */
   function ts(v){return Date.parse(String(v).replace(/(\.\d{3})\d+/,"$1"))}
   function isAd(u){return typeof u==="string"&&/\.html(\?.*)?$/i.test(u)}
   function eurl(p,c){var m=L[p.n],u=m&&m[c];if(u)return u;var b=B[p.n];return b&&DOMR[c].test(b)?b:""}
   var CK={},RP={};
   ck.forEach(function(r){if(r&&r.key)CK[r.key+"|"+r.country]=r});
   rp.forEach(function(r){if(r&&r.key)(RP[r.key+"|"+r.country]=RP[r.key+"|"+r.country]||[]).push(r)});
   /* stat(p,c) is null when there is no timer for that listing. Otherwise: u = the ad link, n = visitors who reported it sold since the last check, gone = hide it */
   var stat=function(p,c){var u=eurl(p,c);if(!isAd(u))return null;
    var k=CK[p.n+"|"+c];if(!k||k.url!==u)return null;
    var t=ts(k.checked_at);if(isNaN(t))return null;
    var seen={},n=0;(RP[p.n+"|"+c]||[]).forEach(function(r){if(r.url===u&&ts(r.created_at)>t&&!seen[r.visitor]){seen[r.visitor]=1;n++}});
    return{u:u,n:n,gone:(Date.now()-t)/864e5>=HIDE||(REPORT_HIDE>0&&n>=REPORT_HIDE)}};
   /* expired or heavily reported links behave like dead links; an ad-only laptop leaves the country whose ad is gone */
   P.forEach(function(p){["GH","NG"].forEach(function(c){var s=stat(p,c);if(s&&s.gone)DEADL.push(nq(s.u))})});
   offs();
   P=P.filter(function(p){if(!p.ad)return true;
    var all=p.cn||["GH","NG"],cn=all.filter(function(c){var s=stat(p,c);return!(s&&s.gone)});
    if(!cn.length)return false;if(cn.length!==all.length)p.cn=cn;return true});
   /* "Sold out?" button and the "Reported sold by visitors" label, drawn under the Buy buttons by buyNote() in app.js */
   var mine={},esc=function(v){return String(v).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;")};
   try{mine=JSON.parse(localStorage.getItem("gpn_sold")||"{}")||{}}catch(err){}
   var vid=function(){try{var v=localStorage.getItem("gpn_vid");if(!v||v.length<8){v=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem("gpn_vid",v)}return v}catch(err){return"anon"+Math.random().toString(36).slice(2)+Date.now().toString(36)}};
   soldUI=function(p){var c=st.cur,s=stat(p,c);if(!s||s.gone)return"";
    var o=typeof offerFor==="function"?offerFor(p):null;if(o&&o.src==="Jiji"&&o.url)return"";
    var done=mine[p.n+"|"+c+"|"+s.u];
    return'<div class="soldrow">'+(s.n?'<span class="soldflag">Reported sold by visitors</span>':"")+'<button type="button" class="soldbtn" data-sold="'+esc(p.n)+'"'+(done?" disabled":"")+'>'+(done?"Thanks, we will check":"Sold out?")+"</button></div>"};
   document.addEventListener("click",function(e){var b=e.target.closest?e.target.closest("[data-sold]"):null;if(!b||b.disabled)return;
    var n=b.getAttribute("data-sold"),p=P.filter(function(q){return q.n===n})[0],c=st.cur,s=p&&stat(p,c);if(!s)return;
    b.disabled=true;b.textContent="Thanks, we will check";
    mine[n+"|"+c+"|"+s.u]=1;try{localStorage.setItem("gpn_sold",JSON.stringify(mine))}catch(err){}
    fetch(C.url+"/rest/v1/reports",{method:"POST",headers:{apikey:C.key,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({key:n,country:c,url:s.u,visitor:vid()})}).catch(function(){})});
   var sty=document.createElement("style");
   sty.textContent=".soldrow{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;margin:8px 0 0}.soldbtn{font:inherit;font-size:12px;background:none;border:0;padding:2px 0;color:inherit;opacity:.7;text-decoration:underline;cursor:pointer}.soldbtn:disabled{text-decoration:none;cursor:default}.soldflag{font-size:12px;font-weight:600;padding:1px 9px;border:1px solid currentColor;border-radius:99px;color:#d97706}";
   document.head.appendChild(sty);
  }catch(err){}
  hist();route()}).catch(function(){})})();
