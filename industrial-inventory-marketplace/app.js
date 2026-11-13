const products=[
{id:1,name:"SKF 6205-2RS Deep Groove Bearing",sku:"BRG-SKF-6205",category:"Bearings",supplier:"ABC Industrial Supplies",price:"₹420 / pc",stock:"In Stock",spec:"25 × 52 × 15 mm"},
{id:2,name:"SS304 Hex Bolt M10 × 50",sku:"FST-SS304-M10",category:"Fasteners",supplier:"Metro Fasteners",price:"₹18 / pc",stock:"In Stock",spec:"SS304, full thread"},
{id:3,name:"Hydraulic Hose 1/2 inch",sku:"HYD-HOSE-12",category:"Hydraulics",supplier:"Prime Hydraulics",price:"₹680 / m",stock:"Limited",spec:"2-wire, 250 bar"},
{id:4,name:"MS EN8 Round Bar 40 mm",sku:"STL-EN8-40",category:"Steel",supplier:"South Metals",price:"₹96 / kg",stock:"In Stock",spec:"EN8, bright bar"},
{id:5,name:"TEFC 7.5 kW Electric Motor",sku:"MTR-TEFC-75",category:"Motors",supplier:"PowerDrive India",price:"₹28,500",stock:"Made to Order",spec:"415 V, 1440 rpm, IE3"},
{id:6,name:"Pneumatic Solenoid Valve 1/4 inch",sku:"PNE-SV-14",category:"Pneumatics",supplier:"AirTech Components",price:"₹1,250",stock:"In Stock",spec:"5/2 way, 24 VDC"},
{id:7,name:"SS316 Butterfly Valve DN100",sku:"VAL-SS316-100",category:"Valves",supplier:"FlowControl Systems",price:"₹8,900",stock:"Limited",spec:"Wafer, PN16"},
{id:8,name:"Industrial Timing Belt 8M-1200",sku:"BELT-8M-1200",category:"Power Transmission",supplier:"DriveLine Traders",price:"₹1,850",stock:"In Stock",spec:"1200 mm pitch length"}
];

const $=s=>document.querySelector(s);
const basket=JSON.parse(localStorage.getItem("industrialHubBasket")||"[]");

function save(){localStorage.setItem("industrialHubBasket",JSON.stringify(basket));updateBasket();}
function updateBasket(){
  $("#basketCount").textContent=basket.length;
  $("#basketItems").innerHTML=basket.length?basket.map(p=>`<div class="basket-row"><strong>${p.name}</strong><span>${p.sku} · ${p.supplier}</span></div>`).join(""):"<p>No products selected yet.</p>";
}
function render(){
  const q=$("#search").value.toLowerCase(), cat=$("#category").value, st=$("#stock").value;
  const list=products.filter(p=>(!q||[p.name,p.sku,p.category,p.supplier].join(" ").toLowerCase().includes(q))&&(!cat||p.category===cat)&&(!st||p.stock===st));
  $("#catalog").innerHTML=list.length?list.map(p=>`<article class="card"><span class="tag">${p.category}</span><h3>${p.name}</h3><div class="sku">SKU: ${p.sku}</div><div class="supplier">Supplier: ${p.supplier}</div><div class="price">${p.price}</div><div class="stock">${p.stock} · ${p.spec}</div><button data-id="${p.id}">Add to enquiry</button></article>`).join(""):"<p>No matching products.</p>";
  document.querySelectorAll(".card button").forEach(b=>b.onclick=()=>{const p=products.find(x=>x.id==b.dataset.id);if(!basket.some(x=>x.id===p.id))basket.push(p);save();openBasket();});
}
function openBasket(){$("#basketPanel").classList.add("open");$("#overlay").classList.add("open");$("#basketPanel").setAttribute("aria-hidden","false");}
function closeBasket(){$("#basketPanel").classList.remove("open");$("#overlay").classList.remove("open");$("#basketPanel").setAttribute("aria-hidden","true");}

[...new Set(products.map(p=>p.category))].sort().forEach(c=>$("#category").insertAdjacentHTML("beforeend",`<option>${c}</option>`));
$("#productCount").textContent=products.length;
["search","category","stock"].forEach(id=>$(`#${id}`).addEventListener("input",render));
$("#basketBtn").onclick=openBasket;$("#closeBasket").onclick=closeBasket;$("#overlay").onclick=closeBasket;
$("#enquiryForm").onsubmit=e=>{e.preventDefault();if(!basket.length){$("#formResult").textContent="Add at least one product first.";return;}const data=Object.fromEntries(new FormData(e.target));console.log("Phase 1 enquiry", {products:basket.map(p=>p.sku),...data});$("#formResult").textContent="Enquiry captured locally. Backend/RFQ submission will be connected in Phase 2.";e.target.reset();basket.length=0;save();render();};
updateBasket();render();
