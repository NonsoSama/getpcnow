/* getpcnow LIVE. Loads AFTER app.js and blog.js. Reads the "delisted", "added", "links" and "edits" tables from Supabase (public read, publishable key only)
   and applies them to the page, so a change made in /admin shows on the site within seconds with no code change or deploy.
   If Supabase cannot be reached, the site just shows data.js as before. The "edits" table is optional: if it is missing or fails, everything else still works. */
(function(){
 var C={url:"https://bcfspmezuuanhmxndjsq.supabase.co",key:"sb_publishable_pa3gHKvmKqW2Vb-kl_n61w_8Yvp5Ie2"};
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
 Promise.all([get("delisted"),get("added"),get("links"),get("edits").catch(function(){return[]})]).then(function(x){
  var del=x[0],add=x[1],lk=x[2],ed=x[3];
  /* 1. delisted offer links (key starts with http) behave like dead links */
  del.forEach(function(d){if(/^https?:/.test(d.key))DEADL.push(nq(d.key))});
  ALLOFF=(typeof OFFERS!=="undefined"?OFFERS:[]).concat(typeof AUTO!=="undefined"?AUTO:[]).filter(function(o){return o.src!=="Jumia"&&alive(o.url)&&fresh(o)});
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
  var L={};lk.forEach(function(l){(L[l.key]=L[l.key]||{})[l.country]=l.url});
  P.forEach(function(p){var m=L[p.n];if(!m)return;var base=p.url&&p.url.Jiji;if(!p.url)p.url={};
   Object.defineProperty(p.url,"Jiji",{enumerable:true,configurable:true,get:function(){return m[st.cur]||base}})});
  hist();route()}).catch(function(){})})();
