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
/* RATE: cedis per naira. Based on about N1,380 and GH 12.25 to the dollar (rule of thumb: N = GH x 113). Re-check when the dollar moves. */
var RATE=0.00888;
var CATS=[
 ["students","Students","Light, long battery life and easy on the budget."],
 ["programmers","Programmers","Fast processors, plenty of memory and a keyboard you can type on all day."],
 ["gamers","Gamers","Value gaming laptops from GH₵5,000 to GH₵10,000 with a real graphics card, not overpriced ones."],
 ["creators","Creators","Strong screens and power for photo, video and design work."],
 ["home-work","Home & Work","Reliable everyday laptops for documents, email and video calls."]];
var DEALS=[
 ["macbook-deals","MacBook Deals","Apple laptops with the biggest savings, best deals first.","mac"],
 ["windows-deals","Windows Deals","Windows laptops at every price, best deals first.","win"],
 ["linux-deals","Linux Deals","Laptops that run Linux well, best deals first.","linux"]];
/* Laptop fields:
   n = name (also the Jiji / Jumia search words), c = New / Used / Refurbished
   s = [screen, memory, storage, processor, graphics] for the usual version
   u = categories, sc = our score, lo / t / hi = low, typical and high price in NAIRA (cedis are worked out with RATE)
   cn = countries where we found it listed ("GH", "NG"). It only shows, and only gets Buy buttons, in those countries.
        Remove cn to show a laptop in both countries. */
/* CAP: price limits for a category page, in CEDIS, checked against each laptop's typical price (t x RATE). Gamers: GH 5,000 to 10,000. Typical picks sit at 5,500 to 8,000; 9,000 to 9,500 is the extreme. A laptop outside the limit does not show on that page. */
var CAP={Gamers:[5000,10000]};
var P=[
/* ---- Used business laptops ---- */
{n:"HP EliteBook 840 G7",c:"Used",s:["14 in","16 GB","512 GB","Core i5","Intel UHD"],u:["Students","Home & Work"],sc:8.3,lo:360000,t:430000,hi:510000,cn:["GH","NG"],pro:["Sturdy build and a good keyboard","14 in full HD screen","Cheap to upgrade"],con:["Battery wear varies by unit","Check the exact RAM and SSD on the listing"]},
{n:"HP EliteBook 840 G8",c:"Used",s:["14 in","16 GB","512 GB","Core i7","Intel Iris Xe"],u:["Home & Work","Programmers"],sc:8.6,lo:410000,t:555000,hi:640000,cn:["GH","NG"],pro:["Best all-round office laptop on the list","Solid for Windows and Linux"],con:["Battery wear varies by unit","Confirm the RAM and SSD before you pay"]},
{n:"HP EliteBook x360 1040 G8",c:"Used",s:["14 in","16 GB","512 GB","Core i7","Intel Iris Xe"],u:["Home & Work"],sc:8.4,lo:765000,t:850000,hi:980000,cn:["GH","NG"],pro:["Premium touch 2-in-1","Top of the used business range"],con:["The priciest used business pick","Check battery health and the hinge"]},
{n:"Lenovo ThinkPad T14 Gen 2",c:"Used",s:["14 in","16 GB","512 GB","Core i5","Intel Iris Xe"],u:["Students","Programmers","Home & Work"],sc:8.5,lo:450000,t:520000,hi:620000,cn:["GH","NG"],pro:["Best keyboard on the list","Reliable and easy to service","Linux-friendly"],con:["Battery wear varies by unit","Check the exact CPU and RAM on the listing"]},
{n:"Lenovo ThinkPad X1 Carbon Gen 8",c:"Used",s:["14 in","16 GB","512 GB","Core i7","Intel UHD"],u:["Home & Work","Programmers"],sc:8.2,lo:380000,t:420000,hi:500000,cn:["GH","NG"],pro:["Very light for travel","Top keyboard"],con:["RAM is soldered, so no upgrade later","Check battery health"]},
{n:"Dell Latitude 5420",c:"Used",s:["14 in","16 GB","512 GB","Core i5","Intel Iris Xe"],u:["Students","Home & Work","Programmers"],sc:8.0,lo:340000,t:450000,hi:710000,cn:["GH"],pro:["Tough and easy to repair","Parts are easy to find","Can be upgraded to 32 GB"],con:["Price swings with RAM and CPU","Check battery health"]},
{n:"HP ProBook 450 G8",c:"Used",s:["15.6 in","8 GB","256 GB","Core i5","Intel Iris Xe"],u:["Home & Work"],sc:7.4,lo:305000,t:350000,hi:395000,cn:["GH"],pro:["Cheap","Add a second RAM stick later"],con:["Only 8 GB as sold","Check battery health"]},
{n:"Dell Inspiron 14 7420",c:"Used",s:["14 in","16 GB","256 GB","Core i5","Intel Iris Xe"],u:["Students"],sc:7.6,lo:365000,t:405000,hi:470000,cn:["GH"],pro:["16 GB and a good display for the price"],con:["Only 256 GB of storage"]},
{n:"HP ZBook Firefly G8",c:"Used",s:["14 in","16 GB","256 GB","Core i5","Intel Iris Xe"],u:["Programmers"],sc:8.0,lo:405000,t:450000,hi:520000,cn:["GH"],pro:["Workstation build","Handles Docker and VMs well"],con:["Only 256 GB of storage"]},
{n:"Dell Precision 5530",c:"Used",s:["15.6 in","16 GB","512 GB","Core i7","Nvidia Quadro"],u:["Creators"],sc:7.5,lo:600000,t:680000,hi:780000,cn:["GH"],pro:["Cheap for a workstation","Colour-accurate panel"],con:["Older workstation, check battery and screen"]},
/* ---- New Windows laptops ---- */
{n:"Lenovo V15 G4",c:"New",s:["15.6 in","16 GB","512 GB","Core i5-13420H","Intel UHD"],u:["Students","Home & Work","Programmers"],sc:7.7,lo:500000,t:550000,hi:620000,cn:["GH"],pro:["Newer CPU","RAM is listed as upgradeable","New with warranty"],con:["Basic laptop, not for gaming or editing"]},
{n:"ASUS Vivobook 16",c:"New",s:["16 in","16 GB","512 GB","Ryzen 7","AMD Radeon"],u:["Students","Home & Work","Programmers"],sc:7.9,lo:690000,t:760000,hi:830000,cn:["GH"],pro:["Rated best under $600 by RTINGS, in the 16 GB version","New with warranty"],con:["Get the 16 GB version, not the base model"]},
{n:"Acer Aspire 16",c:"New",s:["16 in","16 GB","512 GB","Ryzen 5","AMD Radeon"],u:["Students","Programmers"],sc:7.7,lo:620000,t:700000,hi:790000,cn:["GH"],pro:["New with warranty","Comes in Ryzen and Intel versions"],con:["Confirm the exact RAM and SSD on the listing"]},
{n:"Lenovo IdeaPad Slim 3",c:"New",s:["15.6 in","16 GB","512 GB","Ryzen 5","AMD Radeon"],u:["Students"],sc:7.4,lo:620000,t:700000,hi:790000,cn:["GH"],pro:["Light with good battery"],con:["Avoid the 8 GB soldered versions"]},
{n:"Dell Inspiron 14 Plus 7440",c:"New",s:["14 in","16 GB","1 TB","Ryzen 7","AMD Radeon"],u:["Programmers"],sc:8.1,lo:680000,t:735000,hi:800000,cn:["GH"],pro:["Newest chip on the list","Plenty of storage"],con:["Dearer than the used picks"]},
/* ---- Apple ---- */
{n:"Apple MacBook Air M1",c:"Used",s:["13.3 in","16 GB","256 GB","Apple M1","7-core GPU"],u:["Students","Programmers","Creators"],sc:8.8,lo:780000,t:815000,hi:870000,cn:["GH"],pro:["Excellent screen and battery","Strong resale","Cheapest way into Final Cut or Logic"],con:["256 GB fills up fast","Make sure it is not iCloud-locked","Check battery health"]},
{n:"Apple MacBook Air M4",c:"New",s:["13.6 in","16 GB","256 GB","Apple M4","8-core GPU"],u:["Creators"],sc:9.1,lo:1150000,t:1200000,hi:1350000,cn:["GH"],pro:["Great value for a new MacBook","16 GB of RAM"],con:["256 GB fills up fast","Much dearer on Jumia Ghana"]},
{n:"Apple MacBook Air M5",c:"New",s:["13.6 in","16 GB","512 GB","Apple M5","10-core GPU"],u:["Creators"],sc:9.3,lo:1450000,t:1550000,hi:1650000,cn:["GH"],pro:["Best all-round creator laptop in range"],con:["At or above the N1.5M ceiling","Jumia Ghana price is over the cap"]},
/* ---- Gaming ---- */
{n:"Lenovo LOQ 15 RTX 5050",c:"New",s:["15.6 in","16 GB","512 GB","Core i5","RTX 5050"],u:["Creators"],sc:8.3,lo:1200000,t:1350000,hi:1500000,cn:["GH"],pro:["The RTX 5050 gets a 100W power budget","NVIDIA acceleration for Premiere and DaVinci"],con:["Often near the N1.5M ceiling"]},,
/* ---- Gaming: value picks only. Gamers page range is GH 5,000 to 10,000 (see CAP below) ---- */
{n:"MSI GF63",c:"Used",s:["15.6 in","16 GB","512 GB","Core i5","RTX 3050"],u:["Gamers"],sc:8.0,lo:660000,t:730000,hi:840000,cn:["GH"],pro:["The cheapest RTX laptop on the list","Backlit keyboard"],con:["Only 4 GB of graphics memory","Used, check battery and fans"]},
{n:"Acer Nitro 5",c:"Used",s:["15.6 in","16 GB","512 GB","Core i5","RTX 3050 Ti"],u:["Gamers"],sc:8.3,lo:845000,t:910000,hi:1100000,cn:["GH","NG"],pro:["Real RTX graphics at a used price","Easy to upgrade RAM and storage"],con:["Used, check battery and fan noise","Some listings are RTX 3050, others 3050 Ti"]},
{n:"ASUS TUF Gaming A15",c:"Used",s:["15.6 in","16 GB","512 GB","Ryzen 5","GTX 1650"],u:["Gamers"],sc:7.6,lo:810000,t:900000,hi:1035000,cn:["NG"],pro:["Tough build","Good battery"],con:["Older GTX 1650: fine for esports and older games, no ray tracing","Used, check fan noise and heat"]},
{n:"HP Victus 15",c:"New",s:["15.6 in","16 GB","512 GB","Core i5","RTX 3050"],u:["Gamers"],sc:8.1,lo:885000,t:955000,hi:1120000,cn:["GH"],pro:["Sold brand new","Runs modern games at 1080p"],con:["Check the GPU, cheaper listings may carry an RTX 2050","Check the RAM, some versions are only 8 GB"]},
{n:"Lenovo Legion 5",c:"Used",s:["15.6 in","16 GB","512 GB","Ryzen 5","RTX 3060"],u:["Gamers"],sc:8.6,lo:900000,t:955000,hi:1070000,cn:["GH"],pro:["RTX 3060, the strongest graphics in this price range","Good cooling"],con:["Used, check battery and fans","Many sellers ask above the cap, so check the GPU and price"]}
];
/* Operating system tags used by the Deals pages. Apple = mac, everything else = win. Add a laptop name to LINUX to list it under Linux Deals. */
var LINUX=["Lenovo ThinkPad T14 Gen 2","HP EliteBook 840 G8"];
/* Optional fields on a laptop: ad:true = this laptop exists only for one listing, so hide it when that listing dies (needs url:{...}).
   match:["thinkpad","t14"] = words a seller's title must contain for the finder to count it as this laptop. */
/* Sellers: edit here. Jumia only shows for New laptops. To link one laptop to an exact listing, add  url:{Jiji:"https://...",Jumia:"https://..."}  to that laptop above. */
var SELL={NG:[["Jiji","https://jiji.ng/search?query="],["Jumia","https://www.jumia.com.ng/catalog/?q="]],GH:[["Jiji","https://jiji.com.gh/search?query="],["Jumia","https://www.jumia.com.gh/catalog/?q="]]};
/* JJ: Jiji price bands (hand-set). A laptop listed here gets exactly this band. Prices are in the country's own money
   (cedis for GH, naira for NG). Format:  "Laptop name exactly as in P":{GH:[min,max],NG:[min,max]}
   You normally do NOT need to touch this: the script  tools/jiji-range.js  checks Jiji for every laptop in P, looks at the
   5 to 10 cheapest matching listings and writes the bands into jiji-bands.js (JJAUTO). A hand-set band here wins over the script.
   A laptop with neither keeps a plain Jiji search with no price filter. */
var JJ={};
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
/* qtext(laptop, ram, storage) = the words sent to the seller search: name + RAM + SSD, e.g. "HP EliteBook 840 G8 16GB 512GB". Without ram/storage it uses the laptop's standard ones. */
function qtext(p,r,s){return p.n+" "+String(r||p.s[1]).replace(/\s+/g,"")+" "+String(s||p.s[2]).replace(/\s+/g,"")}
function jijiLink(p,c,r,s){
  var host={GH:"https://jiji.com.gh",NG:"https://jiji.ng"}[c], b=JIJI_FILTER?jijiBand(p,c):null;
  var u=host+"/search?query="+encodeURIComponent(qtext(p,r,s)).replace(/%20/g,"+");
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
   Only add real, checked offers. */
var OFFERS=[
/* Example (copy this line, remove the slashes and fill it in):
{n:"HP EliteBook 840 G8",c:"NG",was:555000,now:480000,src:"Jiji",url:"https://jiji.ng/.../....html",upd:"2026-10-25"},
*/
];
/* Configurations shown on each laptop page. Format: [RAM, storage, processor, graphics, price multiplier, on sale?]. The first row on the page is always the laptop's standard config. Multipliers are rough estimates. */
var VARS={
 "HP EliteBook 840 G7":[["8 GB","256 GB","Core i5","Intel UHD",.88],["16 GB","256 GB","Core i5","Intel UHD",.94]],
 "Dell Latitude 5420":[["16 GB","512 GB","Core i7","Intel Iris Xe",1.3],["8 GB","256 GB","Core i5","Intel Iris Xe",.78]],
 "Acer Aspire 16":[["16 GB","512 GB","Ryzen 7","AMD Radeon",1.12]]};
/* Performance ratings: 1 = Low, 2 = Average, 3 = Solid. Memory and storage are rated by size; processors and graphics by this list (anything not listed counts as Average). */
var RL=["","Low","Average","Solid"];
var RCPU={"Apple M1":3,"Apple M4":3,"Apple M5":3,"Core i5-13420H":3,"Ryzen 7 7735HS":3,"Ryzen 5 8645HS":3,"Ryzen 7":3,"Core i7":3,"Core i5":2,"Ryzen 5":2,"Ryzen 5 Pro":2};
var RGPU={"RTX 3060":3,"RTX 3050":2,"RTX 3050 Ti":2,"GTX 1650":1,"RTX 4050":3,"RTX 4060":3,"RTX 5050":3,"RTX 5060":3,"10-core GPU":3,"Intel Iris Xe":2,"Nvidia Quadro":2,"7-core GPU":2,"8-core GPU":2,"AMD Radeon":2,"Intel UHD":1};
/* Footer. SOCIALS: paste each profile link between the quotes. Empty = shows "coming soon" when tapped. */
var SOCIALS=[
 {k:"email",label:"Email",url:"mailto:getpcnow.alerts@gmail.com?subject=Hello%20getpcnow"},          /* e.g. "mailto:hello@yourdomain.com" */
 {k:"youtube",label:"YouTube",url:""},      /* e.g. "https://youtube.com/@getpcnow" */
 {k:"x",label:"X (Twitter)",url:""},        /* e.g. "https://x.com/getpcnow" */
 {k:"instagram",label:"Instagram",url:""},  /* e.g. "https://instagram.com/getpcnow" */
 {k:"tiktok",label:"TikTok",url:""}];        /* e.g. "https://tiktok.com/@getpcnow" */
