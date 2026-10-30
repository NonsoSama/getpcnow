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
{n:"HP EliteBook 840 G7",c:"Used",s:["14 in","16 GB","512 GB","Core i5","Intel UHD"],u:["Students","Home & Work"],sc:8.3,lo:360000,t:430000,hi:510000,cn:["GH","NG"],pro:["Sturdy build and a good keyboard","14 in full HD screen","Cheap to upgrade"],con:["Battery wear varies by unit","Check the exact RAM and SSD on the listing","The 8 GB version is not for gaming"]},
{n:"HP EliteBook 840 G8",c:"Used",s:["14 in","16 GB","512 GB","Core i7","Intel Iris Xe"],u:["Home & Work","Programmers"],sc:8.6,lo:410000,t:555000,hi:640000,cn:["GH","NG"],pro:["Best all-round office laptop on the list","Solid for Windows and Linux"],con:["Battery wear varies by unit","Confirm the RAM and SSD before you pay"]},
{n:"HP EliteBook x360 1040 G8",c:"Used",s:["14 in","16 GB","512 GB","Core i7","Intel Iris Xe"],u:["Home & Work"],sc:8.4,lo:765000,t:850000,hi:980000,cn:["GH","NG"],pro:["Premium touch 2-in-1","Top of the used business range"],con:["The priciest used business pick","Check battery health and the hinge"]},
{n:"Lenovo ThinkPad T14 Gen 2",c:"Used",s:["14 in","16 GB","512 GB","Core i5","Intel Iris Xe"],u:["Students","Programmers","Home & Work"],sc:8.5,lo:450000,t:520000,hi:620000,cn:["GH","NG"],pro:["Best keyboard on the list","Reliable and easy to service","Linux-friendly"],con:["Battery wear varies by unit","Check the exact CPU and RAM on the listing"]},
{n:"Lenovo ThinkPad X1 Carbon Gen 8",c:"Used",s:["14 in","16 GB","512 GB","Core i7","Intel UHD"],u:["Home & Work","Programmers"],sc:8.2,lo:380000,t:420000,hi:500000,cn:["GH","NG"],pro:["Very light for travel","Top keyboard"],con:["RAM is soldered, so no upgrade later","Check battery health"]},
{n:"Dell Latitude 5420",c:"Used",s:["14 in","16 GB","512 GB","Core i5","Intel Iris Xe"],u:["Students","Home & Work","Programmers"],sc:8.0,lo:340000,t:450000,hi:710000,cn:["GH"],pro:["Tough and easy to repair","Parts are easy to find","Can be upgraded to 32 GB"],con:["Price swings with RAM and CPU","The 8 GB version is not for gaming","Check battery health"]},
{n:"HP ProBook 450 G8",c:"Used",s:["15.6 in","8 GB","256 GB","Core i5","Intel Iris Xe"],u:["Home & Work"],sc:7.4,lo:305000,t:350000,hi:395000,cn:["GH"],pro:["Cheap","Add a second RAM stick later"],con:["Only 8 GB as sold, so not for gaming","Check battery health"]},
{n:"Dell Inspiron 14 7420",c:"Used",s:["14 in","16 GB","256 GB","Core i5","Intel Iris Xe"],u:["Students"],sc:7.6,lo:365000,t:405000,hi:470000,cn:["GH"],pro:["16 GB and a good display for the price"],con:["Only 256 GB of storage"]},
{n:"HP ZBook Firefly G8",c:"Used",s:["14 in","16 GB","256 GB","Core i5","Intel Iris Xe"],u:["Programmers"],sc:8.0,lo:405000,t:450000,hi:520000,cn:["GH"],pro:["Workstation build","Handles Docker and VMs well"],con:["Only 256 GB of storage"]},
/* ---- New Windows laptops ---- */
{n:"Lenovo IdeaPad V15 G4 IRU",c:"New",nj:1,s:["15.6 in","8 GB","512 GB","Core i3-1315U","Intel UHD"],u:["Students","Home & Work"],sc:7.3,lo:500000,t:540000,hi:620000,cn:["GH"],pro:["Full HD IPS screen","RAM upgradeable to 16 GB","USB-C, HDMI and Ethernet ports","New with warranty"],con:["Basic laptop, not for gaming or editing","Battery is average, carry your charger","Upgrade to 16 GB if you keep it four years"]},
{n:"ASUS Vivobook 16",c:"New",s:["16 in","16 GB","512 GB","Ryzen 7","AMD Radeon"],u:["Students","Home & Work","Programmers"],sc:7.9,lo:690000,t:760000,hi:830000,cn:["GH"],pro:["Rated best under $600 by RTINGS, in the 16 GB version","New with warranty"],con:["Get the 16 GB version, not the base model"]},
{n:"Acer Aspire 16",c:"New",s:["16 in","16 GB","512 GB","Ryzen 5","AMD Radeon"],u:["Students","Programmers"],sc:7.7,lo:620000,t:700000,hi:790000,cn:["GH"],pro:["New with warranty","Comes in Ryzen and Intel versions"],con:["Confirm the exact RAM and SSD on the listing"]},
{n:"Lenovo IdeaPad Slim 3",c:"New",s:["15.6 in","16 GB","512 GB","Ryzen 5","AMD Radeon"],u:["Students"],sc:7.4,lo:620000,t:700000,hi:790000,cn:["GH"],pro:["Light with good battery"],con:["Avoid the 8 GB soldered versions"]},
{n:"Dell Inspiron 14 Plus 7440",c:"New",s:["14 in","16 GB","1 TB","Ryzen 7","AMD Radeon"],u:["Programmers"],sc:8.1,lo:680000,t:735000,hi:800000,cn:["GH"],pro:["Newest chip on the list","Plenty of storage"],con:["Dearer than the used picks"]},
/* ---- Apple ---- */
{n:"Apple MacBook Air M1",c:"Used",s:["13.3 in","16 GB","256 GB","Apple M1","7-core GPU"],u:["Students","Programmers"],sc:8.8,lo:780000,t:815000,hi:870000,cn:["GH"],pro:["Excellent screen and battery","Strong resale","Cheapest way into Final Cut or Logic"],con:["256 GB fills up fast","Make sure it is not iCloud-locked","Check battery health"]},
{n:"Apple MacBook Pro M1",c:"Used",s:["13.3 in","16 GB","512 GB","Apple M1","8-core GPU"],u:["Students","Creators","Programmers","Home & Work"],sc:8.9,lo:844600,t:878400,hi:900900,mx:{GH:8000},cn:["GH"],pro:["Fan keeps it fast under long jobs","Brighter screen and better speakers than the Air","512 GB is roomier than the base Air"],con:["Older Touch Bar design with only two ports","Make sure it is not iCloud-locked","Check battery health"]},
/* ---- Nigeria only: used MacBooks, each linked to an exact Jiji Nigeria search (url:{Jiji:...}). Prices are in naira. ---- */
{n:"Apple MacBook Air 2020 M1",c:"Used",s:["13.3 in","8 GB","512 GB","Apple M1","8-core GPU"],u:["Students","Home & Work","Programmers"],sc:8.2,lo:650000,t:700000,hi:830000,cn:["NG"],url:{Jiji:"https://jiji.ng/search?query=Macbook+Air+M1+8gb+512+ssd++&price_min=650000&price_max=830000"},pro:["Excellent screen and battery","512 GB is roomy for a used Air","No fan, so it is silent and light","Strong resale"],con:["8 GB of RAM is tight for heavy multitasking","Make sure it is not iCloud-locked","Check battery health"]},
{n:"Apple MacBook Pro 2020 M1",c:"Used",s:["13.3 in","16 GB","256 GB","Apple M1","8-core GPU"],u:["Students","Creators","Programmers","Home & Work"],sc:8.5,lo:750000,t:800000,hi:850000,cn:["NG"],url:{Jiji:"https://jiji.ng/computers-and-laptops?filter_attr_176_type=Laptop&filter_attr_1179_brand=Apple&filter_attr_1180_model=MacBook+Pro+2020+M1&filter_attr_1173_ram=16GB&filter_attr_1176_storage_capacity=256GB&price_max=850000"},pro:["Good deal at around N800k","16 GB of RAM","Fan keeps it fast under long jobs","Brighter screen and better speakers than the Air"],con:["Only 256 GB, so creators may need an external SSD","Older Touch Bar design with only two ports","Make sure it is not iCloud-locked","Check battery health"]},
{n:"Apple MacBook Pro 2021 M1 Max",c:"Used",s:["14 or 16 in","32 GB","512 GB","Apple M1 Max","24-core GPU"],u:["Creators","Programmers"],sc:9.2,lo:1650000,t:1700000,hi:2000000,cn:["NG"],url:{Jiji:"https://jiji.ng/computers-and-laptops?query=laptops+&filter_attr_1179_brand=Apple&filter_attr_1180_model=MacBook+Pro+2021+M1+Max&filter_attr_1176_storage_capacity=512GB&filter_attr_1173_ram=32GB"},pro:["Very strong for video, 3D and heavy coding","Worth it long term, it stays fast for years","Great XDR screen, speakers and ports"],con:["On the pricy side","RAM and storage cannot be upgraded, so choose well","Heavy for daily carrying, especially the 16 in","Make sure it is not iCloud-locked","Check battery health"]},
{n:"Apple MacBook Air 2022 M2",c:"Used",s:["13.6 in","8 GB","256 GB","Apple M2","8-core GPU"],u:["Students","Home & Work","Programmers"],sc:8.4,lo:780000,t:850000,hi:980000,cn:["NG"],url:{Jiji:"https://jiji.ng/computers-and-laptops?query=laptops+&filter_attr_1179_brand=Apple&filter_attr_1180_model=MacBook+Air+2022+M2&filter_attr_1173_ram=8GB&filter_attr_1176_storage_capacity=256GB&filter_attr_1172_storage_type=SSD&price_max=980000"},pro:["Bang for buck at around N850k","Newer M2 chip in a thin, light body","Brighter 13.6 in screen and MagSafe charging","Great battery life"],con:["8 GB of RAM and 256 GB of storage, so some uses may need an external drive","Dearer than the M1 Air","Make sure it is not iCloud-locked","Check battery health"]},
{n:"Apple MacBook Pro 2022 M2",c:"Used",s:["13.3 in","16 GB","512 GB","Apple M2","10-core GPU"],u:["Students","Creators","Programmers"],sc:8.8,lo:1000000,t:1100000,hi:1200000,cn:["NG"],url:{Jiji:"https://jiji.ng/computers-and-laptops?filter_attr_1179_brand=Apple&filter_attr_1180_model=MacBook+Pro+2022+M2&filter_attr_1173_ram=16GB&filter_attr_1176_storage_capacity=512GB&price_max=1200000"},pro:["A good deal at around N1.1M","Built to last, strong long-term durability","16 GB and 512 GB, so no external drive needed","Fast M2 chip with a fan that keeps it cool","Strong for coding and editing"],con:["On the pricy side, especially for students","Older Touch Bar design with only two ports","Make sure it is not iCloud-locked","Check battery health"]},
{n:"Apple MacBook Air M4",c:"New",s:["13.6 in","16 GB","256 GB","Apple M4","8-core GPU"],u:[],sc:9.1,lo:1150000,t:1200000,hi:1350000,cn:["GH"],pro:["Great value for a new MacBook","16 GB of RAM"],con:["256 GB fills up fast","Much dearer on Jumia Ghana"]},
{n:"Apple MacBook Air M5",c:"New",s:["13.6 in","16 GB","512 GB","Apple M5","10-core GPU"],u:[],sc:9.3,lo:1450000,t:1550000,hi:1650000,cn:["GH"],pro:["Best all-round creator laptop in range"],con:["At or above the N1.5M ceiling","Jumia Ghana price is over the cap"]},
/* ---- Gaming ---- */
/* ---- Gaming: value picks only. Gamers page range is GH 5,000 to 10,000 (see CAP below) ---- */
{n:"MSI GF63",c:"Used",s:["15.6 in","16 GB","512 GB","Core i5","RTX 3050"],u:["Gamers"],sc:8.0,lo:660000,t:730000,hi:840000,cn:["GH"],pro:["The cheapest RTX laptop on the list","Backlit keyboard"],con:["Only 4 GB of graphics memory","Used, check battery and fans"]},
{n:"Acer Nitro 5",c:"Used",s:["15.6 in","16 GB","512 GB","Core i5","RTX 3050 Ti"],u:["Gamers","Creators"],sc:8.3,lo:845000,t:910000,hi:1100000,cn:["GH","NG"],pro:["Real RTX graphics at a used price","Easy to upgrade RAM and storage"],con:["Used, check battery and fan noise","Some listings are RTX 3050, others 3050 Ti"]},
{n:"ASUS TUF Gaming A15",c:"Used",s:["15.6 in","16 GB","512 GB","Ryzen 5","GTX 1650"],u:["Gamers"],sc:7.6,lo:810000,t:900000,hi:1035000,cn:["NG"],pro:["Tough build","Good battery"],con:["Older GTX 1650: fine for esports and older games, no ray tracing","Used, check fan noise and heat"]},
{n:"HP Victus 15",c:"New",s:["15.6 in","16 GB","512 GB","Core i5","RTX 3050"],u:["Gamers","Creators"],sc:8.1,lo:934700,t:1069800,hi:1114900,cn:["GH"],nj:1,pro:["Sold brand new","Runs modern games at 1080p"],con:["Check the GPU, cheaper listings may carry an RTX 2050","Check the RAM, some versions are only 8 GB"]},
{n:"Lenovo Legion 5",c:"Used",s:["15.6 in","16 GB","512 GB","Ryzen 5","RTX 3060"],u:["Gamers","Creators"],sc:8.6,lo:1182400,t:1295000,hi:1407700,cn:["GH"],est:1,pro:["RTX 3060, the strongest graphics in this price range","Good cooling"],con:["Used, check battery and fans","Many sellers ask above the cap, so check the GPU and price"]},
/* ---- Added from the min/max rules. ESTIMATE: est:1 means the prices are my estimates, scaled from your checked entries. Replace lo/t/hi with the Jiji median, then delete est:1. ---- */
{n:"HP Omen 15",c:"Used",s:["15.6 in","16 GB","512 GB","Core i7","GTX 1650"],u:["Gamers","Creators"],sc:7.6,lo:765800,t:844600,hi:889600,cn:["GH"],q:"HP Omen 15 16GB 512GB 1650",est:1,pro:["Clean look and good cooling","Plays esports and older games well"],con:["GTX 1650 has only 4 GB of graphics memory","Used, check battery and fans","Versions differ, confirm the GPU and RAM on the listing"]},
{n:"Acer Predator Helios 300",c:"Used",s:["15.6 in","16 GB","512 GB","Core i7","RTX 3060"],u:["Gamers","Creators"],sc:8.5,lo:920000,t:1064000,hi:1100000,cn:["GH"],est:1,pro:["RTX 3060 with strong cooling","144 Hz screen on most units"],con:["Heavy and loud under load","Used, check battery and fans"]},
{n:"ASUS ROG Strix G15",c:"New",s:["15.6 in","16 GB","1 TB","Ryzen 7","RTX 3060"],u:["Gamers","Creators"],sc:8.6,lo:1351400,t:1464000,hi:1520300,cn:["GH"],est:1,pro:["Ryzen 7 with an RTX 3060 is a strong pair","Good for games and video editing","1 TB of storage"],con:["Dearer than most gaming laptops here","Confirm the exact graphics card on the listing"]},
{n:"ASUS TUF Gaming F15",c:"Used",s:["15.6 in","16 GB","512 GB","Core i5","RTX 3050"],u:["Gamers"],sc:7.9,lo:820000,t:964000,hi:1000000,cn:["GH"],est:1,pro:["Tough, well-built body","Runs modern games at 1080p"],con:["RTX 3050 has only 4 GB of graphics memory","Used, check battery and fans"]},
{n:"MSI Katana GF66",c:"Used",s:["15.6 in","16 GB","512 GB","Core i7","RTX 3060"],u:["Gamers","Creators"],sc:8.3,lo:900000,t:1044000,hi:1080000,cn:["GH"],q:"MSI Katana GF66 16GB",est:1,pro:["RTX 3060 and a fast i7 at a fair price","Backlit keyboard"],con:["Runs hot under long loads","Used, check battery and fans"]},
{n:"Dell G15 5511",c:"Used",s:["15.6 in","16 GB","512 GB","Core i5","RTX 3050"],u:["Gamers"],sc:7.7,lo:730000,t:866000,hi:900000,cn:["GH"],est:1,pro:["Good cooling for the price","Parts are easy to find"],con:["RTX 3050 has only 4 GB of graphics memory","Used, check battery and fans"]},
{n:"MSI GL65 Leopard",c:"Used",s:["15.6 in","16 GB","512 GB","Core i7","RTX 2060"],u:["Gamers"],sc:7.8,lo:740000,t:884000,hi:920000,cn:["GH"],est:1,pro:["RTX 2060 still plays modern games at 1080p","Good value used"],con:["Older 9th or 10th gen processor","Short battery life"]},
{n:"Dell G7 15 7590",c:"Used",s:["15.6 in","16 GB","512 GB","Core i7","GTX 1660 Ti"],u:["Gamers"],sc:7.5,lo:660000,t:796000,hi:830000,cn:["GH"],est:1,pro:["GTX 1660 Ti has 6 GB of graphics memory","Slimmer than most gaming laptops"],con:["Older 9th gen processor","Used, check battery and fans"]},
{n:"Dell XPS 15 9500",c:"Used",s:["15.6 in","16 GB","512 GB","Core i7","GTX 1650 Ti"],u:["Creators"],sc:8.2,lo:800000,t:945900,hi:980000,cn:["GH"],est:1,pro:["Excellent screen for photo and design work","Premium build"],con:["GTX 1650 Ti has only 4 GB of graphics memory","The 4K screen drains the battery faster","Check battery health"]},
{n:"Apple MacBook Pro 14 M1 Pro",c:"Used",s:["14.2 in","16 GB","512 GB","Apple M1 Pro","14-core GPU"],u:["Creators","Programmers"],sc:9.0,lo:1103600,t:1238700,hi:1295000,cn:["GH"],mx:{GH:11500},est:1,pro:["Best screen and speakers on the list","M1 Pro stays fast and cool for video editing","Long battery life"],con:["The priciest laptop on the list","Make sure it is not iCloud-locked","Check battery health and the screen"]},
/* ---- Nigeria only: used gaming / creator laptops from checked Jiji Nigeria listings (added 2026-10-30). Each links to its exact Jiji search (url:{Jiji:...}). lo and hi are a rough 10{'a': 'https://jiji.ng/computers-and-laptops?query=laptops&filter_attr_1173_ram=16GB&filter_attr_350_graphics_card=GeForce+1050+Ti+Max-Q&filter_attr_176_type=Laptop&filter_attr_1176_storage_capacity=512GB&filter_attr_1179_brand=Dell', 'b': 'https://jiji.ng/computers-and-laptops?filter_attr_176_type=Laptop&filter_attr_1173_ram=16GB&filter_attr_1176_storage_capacity=512GB&filter_attr_1172_storage_type=SSD&filter_attr_350_graphics_card=GeForce+RTX+3050+Ti+Max-Q', 'c': 'https://jiji.ng/computers-and-laptops?filter_attr_176_type=Laptop&filter_attr_1173_ram=16GB&filter_attr_1176_storage_capacity=512GB&filter_attr_1172_storage_type=SSD&filter_attr_350_graphics_card=GeForce+RTX+3050+Ti&price_max=850000', 'd': 'https://jiji.ng/computers-and-laptops?filter_attr_176_type=Laptop&filter_attr_1173_ram=16GB&filter_attr_1176_storage_capacity=512GB&filter_attr_1172_storage_type=SSD&filter_attr_350_graphics_card=GeForce+RTX+3060&price_max=1000000&filter_attr_1179_brand=HP', 'e': 'https://jiji.ng/computers-and-laptops?price_max=1000000&filter_attr_176_type=Laptop&filter_attr_1179_brand=HP&filter_attr_1173_ram=16GB&filter_attr_1176_storage_capacity=512GB&filter_attr_1172_storage_type=SSD&filter_attr_350_graphics_card=GeForce+GTX+1650+Ti', 'f': 'https://jiji.ng/computers-and-laptops?price_max=1000000&filter_attr_176_type=Laptop&filter_attr_1179_brand=HP&filter_attr_1173_ram=16GB&filter_attr_1176_storage_capacity=512GB&filter_attr_1172_storage_type=SSD&filter_attr_350_graphics_card=GeForce+RTX+3050', 'g': 'https://jiji.ng/computers-and-laptops?price_max=1000000&filter_attr_176_type=Laptop&filter_attr_1179_brand=HP&filter_attr_1173_ram=16GB&filter_attr_1176_storage_capacity=1T&filter_attr_1172_storage_type=SSD&filter_attr_350_graphics_card=GeForce+RTX+2070+Max-Q'}pread around the price you gave. All are used. Over N1M = not tagged Students. ---- */
{n:"Dell XPS 15 9570",c:"Used",s:["15.6 in","16 GB","512 GB","Core i7","GTX 1050 Ti Max-Q"],u:["Gamers","Creators","Students","Programmers"],sc:7.8,lo:540000,t:600000,hi:660000,cn:["NG"],url:{Jiji:"https://jiji.ng/computers-and-laptops?query=laptops&filter_attr_1173_ram=16GB&filter_attr_350_graphics_card=GeForce+1050+Ti+Max-Q&filter_attr_176_type=Laptop&filter_attr_1176_storage_capacity=512GB&filter_attr_1179_brand=Dell"},pro:["Good deal at around N600k","Solid PC for gamers, creators and students","Good for engineering and programming students"],con:["Not to be used on soft surfaces because it overheats","Battery life is likely 3 to 5 hours since it is used","Check battery health, it could be worn out"]},
{n:"Dell XPS 15 9520",c:"Used",s:["15.6 in","16 GB","512 GB","Core i7","RTX 3050 Ti Max-Q"],u:["Gamers","Creators","Programmers"],sc:8.4,lo:1170000,t:1300000,hi:1430000,cn:["NG"],url:{Jiji:"https://jiji.ng/computers-and-laptops?filter_attr_176_type=Laptop&filter_attr_1173_ram=16GB&filter_attr_1176_storage_capacity=512GB&filter_attr_1172_storage_type=SSD&filter_attr_350_graphics_card=GeForce+RTX+3050+Ti+Max-Q"},pro:["Mint condition 3.5K OLED touch screen","Core i7-12700H with an RTX 3050 Ti Max-Q","Face recognition login (Windows Hello)","A good long-term buy"],con:["Pricey at around N1.3M","Only 4 GB of graphics memory, which is very little","Battery is likely weak because of the powerful graphics card"]},
{n:"MSI Prestige 15 A12UD",c:"Used",s:["15 in","16 GB","512 GB","Core i7","RTX 3050 Ti"],u:["Gamers","Creators","Students","Programmers"],sc:8.0,lo:750000,t:830000,hi:880000,cn:["NG"],url:{Jiji:"https://jiji.ng/computers-and-laptops?filter_attr_176_type=Laptop&filter_attr_1173_ram=16GB&filter_attr_1176_storage_capacity=512GB&filter_attr_1172_storage_type=SSD&filter_attr_350_graphics_card=GeForce+RTX+3050+Ti&price_max=850000"},pro:["Good deal at around N800k","Core i7-1260P, SSD upgradeable to 2 TB","Backlit keyboard, 2 Type-C ports and 2 USB ports","Good for engineering and programming students"],con:["Pricey side","Battery runs down when unplugged","Weak front-facing camera","Only 4 GB of graphics memory"]},
{n:"HP Omen 16",c:"Used",s:["16 in","16 GB","512 GB","Core i7","RTX 3060"],u:["Gamers","Creators","Students"],sc:8.2,lo:900000,t:1000000,hi:1000000,cn:["NG"],url:{Jiji:"https://jiji.ng/computers-and-laptops?filter_attr_176_type=Laptop&filter_attr_1173_ram=16GB&filter_attr_1176_storage_capacity=512GB&filter_attr_1172_storage_type=SSD&filter_attr_350_graphics_card=GeForce+RTX+3060&price_max=1000000&filter_attr_1179_brand=HP"},pro:["RTX 3060 graphics, the strongest card in this group","Good for gamers, creators and students","Good for engineering and programming students"],con:["Used, check battery and fans","Specs vary by listing, confirm the RAM, SSD and GPU"]},
{n:"HP 15-da3007nia",c:"Used",s:["15.6 in","16 GB","512 GB","Core i5","GTX 1650 Ti"],u:["Gamers","Creators","Students","Programmers"],sc:7.5,lo:680000,t:750000,hi:825000,cn:["NG"],url:{Jiji:"https://jiji.ng/computers-and-laptops?price_max=1000000&filter_attr_176_type=Laptop&filter_attr_1179_brand=HP&filter_attr_1173_ram=16GB&filter_attr_1176_storage_capacity=512GB&filter_attr_1172_storage_type=SSD&filter_attr_350_graphics_card=GeForce+GTX+1650+Ti"},pro:["Solid for gamers, creators and students","Good GPU that carries heavy workloads","Good for engineering and programming students"],con:["Boxy look","Heavy","Loud"]},
{n:"HP Victus 15 RTX 3050 (Used)",c:"Used",s:["15.6 in","16 GB","512 GB","Core i5","RTX 3050"],u:["Gamers","Creators","Students","Programmers"],sc:7.9,lo:855000,t:950000,hi:1000000,cn:["NG"],q:"HP Victus 15 16GB 512GB 3050",url:{Jiji:"https://jiji.ng/computers-and-laptops?price_max=1000000&filter_attr_176_type=Laptop&filter_attr_1179_brand=HP&filter_attr_1173_ram=16GB&filter_attr_1176_storage_capacity=512GB&filter_attr_1172_storage_type=SSD&filter_attr_350_graphics_card=GeForce+RTX+3050"},pro:["Good, newer graphics card","Good for gamers, creators, students and programmers","Good for engineering and programming students"],con:["Check the pros and cons online before you buy","Only 4 GB of graphics memory on most RTX 3050 laptops"]},
{n:"HP Omen 15-dh002nr",c:"Used",s:["15.6 in","16 GB","1 TB","Core i7","RTX 2070 Max-Q"],u:["Gamers","Creators","Students","Programmers"],sc:8.4,lo:900000,t:1000000,hi:1000000,cn:["NG"],url:{Jiji:"https://jiji.ng/computers-and-laptops?price_max=1000000&filter_attr_176_type=Laptop&filter_attr_1179_brand=HP&filter_attr_1173_ram=16GB&filter_attr_1176_storage_capacity=1T&filter_attr_1172_storage_type=SSD&filter_attr_350_graphics_card=GeForce+RTX+2070+Max-Q"},pro:["Best deal at around N1M","RTX 2070 Max-Q with 8 GB of graphics memory, as good as or better than a 3050","Most AAA games should play at 1440p 60 fps","Good for engineering and programming students"],con:["Runs hot, get ready for some heat","Older graphics architecture"]}
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
/* qtext(laptop, ram, storage) = the words sent to the seller search: name + RAM + SSD, e.g. "HP EliteBook 840 G8 16GB 512GB". Without ram/storage it uses the laptop's standard ones.
   Optional q:"..." on a laptop = use exactly these search words instead (e.g. q:"HP Omen 15 16GB 512GB 1650"). Optional nj:1 = never show the Jumia button for this laptop. */
function qtext(p,r,s){if(p.q)return p.q; return p.n+" "+String(r||p.s[1]).replace(/\s+/g,"")+" "+String(s||p.s[2]).replace(/\s+/g,"")}
/* Every Jiji button gets &price_max=... so sellers asking far too much are filtered out.
   The cap is in the country's own money (cedis for GH, naira for NG). Where the cap comes from, first match wins:
   1. a hand-set mx on the laptop in P, e.g.  mx:{GH:8000,NG:900000}   <- put your own researched number here
   2. the laptop's high price (hi) in naira, turned into cedis with RATE for Ghana, rounded up to the next 100 (GH) or 10,000 (NG) */
function jijiMax(p,c){
  var h=(p.mx||{})[c]; if(h) return h;
  if(!p.hi) return null;
  return c==="GH"? Math.ceil(p.hi*RATE/100)*100 : Math.ceil(p.hi/10000)*10000}
function jijiLink(p,c,r,s){
  var host={GH:"https://jiji.com.gh",NG:"https://jiji.ng"}[c], b=JIJI_FILTER?jijiBand(p,c):null, m=jijiMax(p,c);
  var u=host+"/search?query="+encodeURIComponent(qtext(p,r,s)).replace(/%20/g,"+");
  if(b) return u+"&price_min="+b[0]+"&price_max="+(p.mx&&p.mx[c]?p.mx[c]:b[1]);
  return m? u+"&price_max="+m : u}
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
var RCPU={"Apple M1 Pro":3,"Apple M2":3,"Apple M1 Max":3,"Core i9":3,"Ryzen 9":3,"Apple M1":3,"Apple M4":3,"Apple M5":3,"Core i5-13420H":3,"Ryzen 7 7735HS":3,"Ryzen 5 8645HS":3,"Ryzen 7":3,"Core i7":3,"Core i5":2,"Ryzen 5":2,"Ryzen 5 Pro":2};
/* GPU RULES for Gamers and Creators (dedicated card needed, Intel Iris / UHD do not count):
   Windows minimum: GTX 1060.  Mac minimum: M1 Pro.  Maximum: RTX 4070 (laptop).
   Older Ti cards are allowed up to that maximum: RTX 3070 Ti and RTX 3080 Ti. 4080, 4090 and the 5000 series are left out on purpose (too costly in West Africa). */
var RGPU={"GTX 1050 Ti Max-Q":3,"RTX 3050 Ti Max-Q":3,"RTX 2070 Max-Q":3,"GTX 1060":1,"GTX 1650 Ti":3,"GTX 1660 Ti":2,"RTX 2060":2,"14-core GPU":3,"RTX 3070 Ti":3,"RTX 3080 Ti":3,"RTX 4070":3,"RTX 3060":3,"RTX 3050":3,"RTX 3050 Ti":2,"GTX 1650":1,"RTX 4050":3,"RTX 4060":3,"RTX 5050":3,"RTX 5060":3,"10-core GPU":3,"24-core GPU":3,"32-core GPU":3,"Intel Iris Xe":2,"Nvidia Quadro":2,"7-core GPU":2,"8-core GPU":2,"AMD Radeon":2,"Intel UHD":1};
/* Footer. SOCIALS: paste each profile link between the quotes. Empty = shows "coming soon" when tapped. */
var SOCIALS=[
 {k:"email",label:"Email",url:"mailto:getpcnow.alerts@gmail.com?subject=Hello%20getpcnow"},          /* e.g. "mailto:hello@yourdomain.com" */
 {k:"youtube",label:"YouTube",url:"https://www.youtube.com/@getpcnowhq"},      /* e.g. "https://youtube.com/@getpcnow" */
 {k:"x",label:"X (Twitter)",url:"https://x.com/getpcnowhq"},        /* e.g. "https://x.com/getpcnow" */
 {k:"instagram",label:"Instagram",url:"https://www.instagram.com/getpcnowhq/"},  /* e.g. "https://instagram.com/getpcnow" */
 {k:"tiktok",label:"TikTok",url:"https://www.tiktok.com/@getpcnowhq"}];        /* e.g. "https://tiktok.com/@getpcnow" */
