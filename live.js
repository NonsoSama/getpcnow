/* getpcnow LIVE. Loads AFTER app.js and blog.js. Reads the "delisted" and "added" tables from Supabase (public read, publishable key only)
   and applies them to the page, so a delist from /admin shows on the site within seconds with no code change or deploy.
   If Supabase cannot be reached, the site just shows data.js as before. */
(function(){
 var C={url:"https://bcfspmezuuanhmxndjsq.supabase.co",key:"sb_publishable_pa3gHKvmKqW2Vb-kl_n61w_8Yvp5Ie2"};
 function get(t){return fetch(C.url+"/rest/v1/"+t+"?select=*",{headers:{apikey:C.key}}).then(function(r){if(!r.ok)throw 0;return r.json()})}
 Promise.all([get("delisted"),get("added"),get("links")]).then(function(x){
  var del=x[0],add=x[1],lk=x[2];
  /* 1. delisted offer links (key starts with http) behave like dead links */
  del.forEach(function(d){if(/^https?:/.test(d.key))DEADL.push(nq(d.key))});
  ALLOFF=(typeof OFFERS!=="undefined"?OFFERS:[]).concat(typeof AUTO!=="undefined"?AUTO:[]).filter(function(o){return o.src!=="Jumia"&&alive(o.url)&&fresh(o)});
  /* 2. laptops added from the admin page */
  add.forEach(function(a){var p=a.data;if(!p||!p.n||P.some(function(q){return q.n===p.n}))return;
   p.o=[/^Apple/.test(p.n)?"mac":"win"];if(LINUX.indexOf(p.n)>-1)p.o.push("linux");P.push(p)});
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
