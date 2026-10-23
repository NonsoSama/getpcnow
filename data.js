/* getpcnow DATA. This is the file you edit to change laptops, prices, sellers and social links.
   Sections:
   1. RATE, CATS, DEALS ... exchange rate and the category cards
   2. P ..................... the laptops (one line each)
   3. LINUX, SELL ........... which laptops count as Linux, and the Jiji / Jumia links
   3b. OFFERS ............... the real discounts: old price, price now, seller and link
   4. VARS .................. extra configurations shown on each laptop page
   5. RL, RCPU, RGPU ........ performance ratings (1 Low, 2 Average, 3 Solid)
   6. SOCIALS ............... footer social links
*/
var RATE=0.0085;
var CATS=[
 ["students","Students","Light, long battery life and easy on the budget."],
 ["programmers","Programmers","Fast processors, plenty of memory and a keyboard you can type on all day."],
 ["gamers","Gamers","A dedicated graphics card and enough cooling to run modern games."],
 ["creators","Creators","Strong screens and power for photo, video and design work."],
 ["home-work","Home & Work","Reliable everyday laptops for documents, email and video calls."]];
var DEALS=[
 ["macbook-deals","MacBook Deals","Apple laptops with the biggest savings, best deals first.","mac"],
 ["windows-deals","Windows Deals","Windows laptops at every price, best deals first.","win"],
 ["linux-deals","Linux Deals","Laptops that run Linux well, best deals first.","linux"]];
var P=[
{n:"Lenovo ThinkPad T14 Gen 2",c:"Used",s:["14 in","16 GB","512 GB","Core i5-1145G7","Intel Iris Xe"],u:["Students","Programmers","Home & Work"],sc:8.2,lo:380000,t:430000,hi:520000,pro:["Excellent keyboard","Sturdy build","Plenty of ports"],con:["Screen is only average","Battery wear varies by unit"]},
{n:"Dell Latitude 7420",c:"Refurbished",s:["14 in","16 GB","256 GB","Core i7-1185G7","Intel Iris Xe"],u:["Home & Work","Programmers"],sc:8.0,lo:470000,t:520000,hi:640000,pro:["Light and slim","Fast for office work","Refurbished units often carry a warranty"],con:["256 GB fills up quickly","Speakers are quiet"]},
{n:"Apple MacBook Air M1",c:"Used",s:["13.3 in","8 GB","256 GB","Apple M1","7-core GPU"],u:["Students","Creators","Programmers"],sc:8.8,lo:700000,t:780000,hi:900000,pro:["Very long battery life","Silent, no fan","Fast and smooth"],con:["8 GB RAM limits heavy work","Few ports","Check battery cycle count"]},
{n:"Apple MacBook Air M2",c:"New",s:["13.6 in","8 GB","256 GB","Apple M2","8-core GPU"],u:["Students","Creators"],sc:9.0,lo:1350000,t:1450000,hi:1600000,pro:["Bright screen","Great speakers","Strong battery"],con:["Expensive","8 GB RAM base model"]},
{n:"HP Pavilion 15",c:"New",s:["15.6 in","8 GB","512 GB","Core i5-1335U","Intel Iris Xe"],u:["Students","Home & Work"],sc:7.4,lo:700000,t:780000,hi:860000,pro:["Good all-rounder","Number pad included"],con:["Plastic build","Average battery"]},
{n:"Lenovo IdeaPad Slim 3",c:"New",s:["15.6 in","8 GB","512 GB","Ryzen 5 7520U","AMD Radeon"],u:["Students","Home & Work"],sc:7.3,lo:560000,t:650000,hi:720000,pro:["Affordable","Light for its size","Comfortable keyboard"],con:["Dim screen","Not for gaming or editing"]},
{n:"Acer Nitro V 15",c:"New",s:["15.6 in","16 GB","512 GB","Core i5-13420H","RTX 4050"],u:["Gamers","Creators"],sc:8.1,lo:1100000,t:1250000,hi:1400000,pro:["Real gaming performance","Upgradeable RAM and storage"],con:["Heavy","Battery life is short","Fans get loud"]},
{n:"ASUS TUF Gaming A15",c:"Used",s:["15.6 in","16 GB","512 GB","Ryzen 7 4800H","GTX 1660 Ti"],u:["Gamers","Creators","Programmers"],sc:7.9,lo:780000,t:860000,hi:980000,pro:["Strong value for gaming","Tough build"],con:["Older GPU, no ray tracing","Check fan noise and heat"]}
];
/* Operating system tags used by the Deals pages. Apple = mac, everything else = win. Add a laptop name to LINUX to list it under Linux Deals. */
var LINUX=["Lenovo ThinkPad T14 Gen 2","Dell Latitude 7420"];
/* Optional fields on a laptop: ad:true = this laptop exists only for one listing, so hide it when that listing dies (needs url:{...}).
   match:["thinkpad","t14"] = words a seller's title must contain for the finder to count it as this laptop. */
/* Sellers: edit here. Jumia only shows for New laptops. To link one laptop to an exact listing, add  url:{Jiji:"https://…",Jumia:"https://…"}  to that laptop above. */
var SELL={NG:[["Jiji","https://jiji.ng/search?query="],["Jumia","https://www.jumia.com.ng/catalog/?q="]],GH:[["Jiji","https://jiji.com.gh/search?query="],["Jumia","https://www.jumia.com.gh/catalog/?q="]]};
/* JJ: Jiji price bands (hand-set). A laptop listed here gets exactly this band. Prices are in the country's own money
   (cedis for GH, naira for NG). Format:  "Laptop name exactly as in P":{GH:[min,max],NG:[min,max]}
   You normally do NOT need to touch this: the script  tools/jiji-range.js  checks Jiji for every laptop in P, looks at the
   5 to 10 cheapest matching listings and writes the bands into jiji-bands.js (JJAUTO). A hand-set band here wins over the script.
   A laptop with neither keeps a plain Jiji search with no price filter. */
var JJ={
 "Apple MacBook Air M2":{GH:[8000,8700]}
};
/* jijiLink(laptop, country) = the Jiji link for the buy button.
   It uses Jiji's search address:  jiji.com.gh/search?query=Laptop+Name
   This works for every laptop. (The /computers-and-laptops/<name> path only exists on Jiji for some models and gave 404 for the rest;
   the old /laptops?query=... address was also a 404.) */
function jijiSlug(n){return String(n).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}
function jijiBand(p,c){
  var h=(JJ[p.n]||{})[c]; if(h) return h;
  var a=(typeof JJAUTO!=="undefined"&&JJAUTO[c]||{})[p.n];
  if(a&&a.b&&(Date.now()-new Date(a.upd))/864e5<=14) return a.b;   // script bands older than 14 days are ignored
  return null}
/* JIJI_FILTER: false = the Jiji button opens the plain results page (always works) and the price range is shown on the button.
   true = also add price_min / price_max to the address. Turn it on only after you have opened such a link and seen it work. */
var JIJI_FILTER=false;
function jijiLink(p,c){
  var host={GH:"https://jiji.com.gh",NG:"https://jiji.ng"}[c], b=JIJI_FILTER?jijiBand(p,c):null;
  var u=host+"/search?query="+encodeURIComponent(p.n).replace(/%20/g,"+");
  return b? u+"&price_min="+b[0]+"&price_max="+b[1] : u}
/* OFFERS: the discounts. The best deals on the site come from this list (Jumia, Jiji, Tonaton).
   One line per offer. Fields:
   n = laptop name, exactly as written in P above
   c = country: "NG" (prices in naira) or "GH" (prices in cedis)
   was = the old price, now = the price today (the site works out the % off)
   src = the seller: "Jumia", "Jiji" or "Tonaton"
   url = link to that exact listing
   upd = the date you checked it, so old deals can be hidden later
   Jiji and Tonaton listings have no old price, so use the laptop's typical price (t) as "was".
   A laptop with no offer here still shows at its normal price.
   Only add real, checked offers. A laptop with no offer here still shows at its normal price. */
var OFFERS=[
/* Example (copy this line, remove the slashes and fill it in):
{n:"HP Pavilion 15",c:"NG",was:780000,now:690000,src:"Jumia",url:"https://www.jumia.com.ng/...",upd:"2026-10-20"},
*/
];
/* Configurations shown on each laptop page. Format: [RAM, storage, processor, graphics, price multiplier, on sale?]. The first row on the page is always the laptop's standard config. Prices and sales are sample placeholders. */
var VARS={
 "Lenovo ThinkPad T14 Gen 2":[["16 GB","256 GB","Core i5-1145G7","Intel Iris Xe",.9,1],["16 GB","512 GB","Core i7-1185G7","Intel Iris Xe",1.15]],
 "Dell Latitude 7420":[["16 GB","512 GB","Core i7-1185G7","Intel Iris Xe",1.1],["8 GB","256 GB","Core i5-1135G7","Intel Iris Xe",.85,1]],
 "Apple MacBook Air M1":[["8 GB","512 GB","Apple M1","8-core GPU",1.18],["16 GB","512 GB","Apple M1","8-core GPU",1.4]],
 "Apple MacBook Air M2":[["8 GB","512 GB","Apple M2","10-core GPU",1.25],["16 GB","512 GB","Apple M2","10-core GPU",1.45,1]],
 "HP Pavilion 15":[["16 GB","512 GB","Core i5-1335U","Intel Iris Xe",1.12,1],["16 GB","1 TB","Core i7-1355U","Intel Iris Xe",1.3]],
 "Lenovo IdeaPad Slim 3":[["16 GB","512 GB","Ryzen 5 7520U","AMD Radeon",1.12],["8 GB","256 GB","Ryzen 3 7320U","AMD Radeon",.88,1]],
 "Acer Nitro V 15":[["16 GB","1 TB","Core i5-13420H","RTX 4050",1.1],["16 GB","512 GB","Core i5-13420H","RTX 4060",1.2,1],["32 GB","1 TB","Core i7-13620H","RTX 4060",1.45]],
 "ASUS TUF Gaming A15":[["8 GB","512 GB","Ryzen 7 4800H","GTX 1660 Ti",.9,1],["16 GB","1 TB","Ryzen 7 4800H","GTX 1660 Ti",1.12],["16 GB","512 GB","Ryzen 5 4600H","GTX 1650",.8]]};
/* Performance ratings: 1 = Low, 2 = Average, 3 = Solid. Memory and storage are rated by size; processors and graphics by this list (anything not listed counts as Average). */
var RL=["","Low","Average","Solid"];
var RCPU={"Apple M1":3,"Apple M2":3,"Core i5-13420H":3,"Core i7-13620H":3,"Ryzen 7 4800H":3,"Core i7-1185G7":2,"Core i7-1355U":2,"Core i5-1145G7":2,"Core i5-1135G7":2,"Core i5-1335U":2,"Ryzen 5 4600H":2,"Ryzen 5 7520U":1,"Ryzen 3 7320U":1};
var RGPU={"RTX 4050":3,"RTX 4060":3,"10-core GPU":3,"GTX 1660 Ti":2,"Intel Iris Xe":2,"7-core GPU":2,"8-core GPU":2,"GTX 1650":1,"AMD Radeon":1};
/* Footer. SOCIALS: paste each profile link between the quotes. Empty = shows "coming soon" when tapped. */
var SOCIALS=[
 {k:"email",label:"Email",url:"getpcnow.alert@gmail.com"},          /* e.g. "mailto:hello@yourdomain.com" */
 {k:"youtube",label:"YouTube",url:""},      /* e.g. "https://youtube.com/@getpcnow" */
 {k:"x",label:"X (Twitter)",url:""},        /* e.g. "https://x.com/getpcnow" */
 {k:"instagram",label:"Instagram",url:""},  /* e.g. "https://instagram.com/getpcnow" */
 {k:"tiktok",label:"TikTok",url:""}];        /* e.g. "https://tiktok.com/@getpcnow" */
