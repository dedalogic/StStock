import React, { useState, useEffect, useMemo, useCallback } from "react";

/*  stStock v5 — Procurement for MAFIA × Street Flags
    Font: Satoshi + JetBrains Mono
    No useRef (causes bundler issues in this env)
    No arrow-function param shadowing                    */

const PAL = {
  mf: { ac:"#D63031", ac2:"#E17055", bg:"#FFF5F5", mid:"#FFD5D5", name:"MAFIA", tag:"Pizzería NY" },
  sf: { ac:"#00B894", ac2:"#55EFC4", bg:"#F0FFF4", mid:"#A3E4CB", name:"Street Flags", tag:"Hamburguesas" },
};
const DEF_CATS = {
  mf:["Lácteos","Carnes","Masas","Salsas","Verduras","Bebidas","Descartables","Limpieza"],
  sf:["Carnes","Verduras","Salsas","Pan","Bebidas","Descartables","Limpieza","Condimentos"],
};
const SUP_CATS = ["Lácteos","Carnes","Masas","Salsas","Verduras","Bebidas","Descartables","Limpieza","Condimentos","Otros"];
const DW = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
const DWF = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

const S_SUP=[
  {id:"s1",name:"ICB Food Service",contact:"Rodrigo Morales",phone:"+56999990001",address:"Av. Industrial 1200, Iquique",categories:["Carnes","Salsas","Descartables"],orderDays:["Lunes","Miércoles"],deliveryDays:["Martes","Jueves"],leadDays:1,companies:["mf","sf"],notes:"Min $50.000"},
  {id:"s2",name:"Comercial Marín",contact:"Patricio Marín",phone:"+56999990002",address:"Baquedano 340, Iquique",categories:["Lácteos"],orderDays:["Martes"],deliveryDays:["Jueves"],leadDays:2,companies:["mf"],notes:"Quesos"},
  {id:"s3",name:"Distribuidora Norte",contact:"Ana Torres",phone:"+56999990003",address:"Los Pinos 88, Iquique",categories:["Carnes","Verduras"],orderDays:["Lunes","Jueves"],deliveryDays:["Miércoles","Viernes"],leadDays:1,companies:["sf"],notes:"Carnes y cecinas"},
  {id:"s4",name:"Molino San Cristóbal",contact:"Mario Soto",phone:"+56999990004",address:"Ruta 1 km 12",categories:["Masas"],orderDays:["Viernes"],deliveryDays:["Lunes"],leadDays:3,companies:["mf"],notes:"Harina pizza"},
];
const S_PROD=[
  {id:"p1",co:"mf",name:"Mozzarella Bloque",cat:"Lácteos",unit:"kg",pUnit:"barra",pQty:5,wMin:15,cMin:5,sup:"s2",alt:"s1",img:"🧀",imgUrl:"",priceType:"net"},
  {id:"p2",co:"mf",name:"Harina Pizza 00",cat:"Masas",unit:"kg",pUnit:"saco",pQty:25,wMin:50,cMin:15,sup:"s4",alt:"",img:"🌾",imgUrl:"",priceType:"net"},
  {id:"p3",co:"mf",name:"Salsa Tomate",cat:"Salsas",unit:"kg",pUnit:"",pQty:0,wMin:20,cMin:6,sup:"s1",alt:"",img:"🍅",imgUrl:"",priceType:"net"},
  {id:"p4",co:"mf",name:"Pepperoni",cat:"Carnes",unit:"kg",pUnit:"caja",pQty:2,wMin:8,cMin:3,sup:"s1",alt:"",img:"🥩",imgUrl:"",priceType:"net"},
  {id:"p5",co:"mf",name:"Cajas Pizza 35cm",cat:"Descartables",unit:"unid",pUnit:"pack",pQty:100,wMin:200,cMin:60,sup:"s1",alt:"",img:"📦",imgUrl:"",priceType:"gross"},
  {id:"p6",co:"sf",name:"Carne Molida",cat:"Carnes",unit:"kg",pUnit:"bolsa",pQty:5,wMin:25,cMin:8,sup:"s3",alt:"s1",img:"🥩",imgUrl:"",priceType:"net"},
  {id:"p7",co:"sf",name:"Pan Brioche",cat:"Pan",unit:"unid",pUnit:"bolsa",pQty:30,wMin:150,cMin:40,sup:"s1",alt:"",img:"🍔",imgUrl:"",priceType:"gross"},
  {id:"p8",co:"sf",name:"Tomate Cherry",cat:"Verduras",unit:"kg",pUnit:"",pQty:0,wMin:5,cMin:1.5,sup:"s1",alt:"",img:"🍒",imgUrl:"",priceType:"net"},
  {id:"p9",co:"sf",name:"Queso Cheddar",cat:"Lácteos",unit:"kg",pUnit:"barra",pQty:2.5,wMin:10,cMin:3,sup:"s3",alt:"s1",img:"🧀",imgUrl:"",priceType:"net"},
  {id:"p10",co:"sf",name:"Papas Bastón",cat:"Verduras",unit:"kg",pUnit:"bolsa",pQty:10,wMin:30,cMin:10,sup:"s3",alt:"",img:"🍟",imgUrl:"",priceType:"gross"},
];
const S_PRICES=[
  {id:"pr1",pid:"p1",sid:"s2",price:9800,date:"2026-04-15"},{id:"pr2",pid:"p2",sid:"s4",price:890,date:"2026-04-20"},
  {id:"pr3",pid:"p3",sid:"s1",price:3200,date:"2026-04-18"},{id:"pr4",pid:"p4",sid:"s1",price:12500,date:"2026-04-10"},
  {id:"pr5",pid:"p5",sid:"s1",price:18000,date:"2026-04-22"},{id:"pr6",pid:"p6",sid:"s3",price:8900,date:"2026-04-19"},
  {id:"pr7",pid:"p7",sid:"s1",price:12600,date:"2026-04-17"},{id:"pr8",pid:"p8",sid:"s1",price:2800,date:"2026-04-21"},
  {id:"pr9",pid:"p9",sid:"s3",price:7600,date:"2026-04-16"},{id:"pr10",pid:"p10",sid:"s3",price:12000,date:"2026-04-20"},
];
const S_STK=[
  {id:"st1",pid:"p1",qty:3,date:"2026-05-01",who:"Marco"},{id:"st2",pid:"p2",qty:8,date:"2026-05-01",who:"Marco"},
  {id:"st3",pid:"p3",qty:18,date:"2026-05-01",who:"Marco"},{id:"st4",pid:"p4",qty:6,date:"2026-05-01",who:"Marco"},
  {id:"st5",pid:"p5",qty:180,date:"2026-05-01",who:"Marco"},{id:"st6",pid:"p6",qty:6,date:"2026-05-01",who:"SF"},
  {id:"st7",pid:"p7",qty:35,date:"2026-05-01",who:"SF"},{id:"st8",pid:"p8",qty:1.2,date:"2026-05-01",who:"SF"},
  {id:"st9",pid:"p9",qty:7,date:"2026-05-01",who:"SF"},{id:"st10",pid:"p10",qty:12,date:"2026-05-01",who:"SF"},
];
const S_EVENTS=[
  {id:"ev1",name:"Día de la Madre",date:"2026-05-10",factor:1.8},
  {id:"ev2",name:"Fiestas Patrias",date:"2026-09-18",factor:2.4},
  {id:"ev3",name:"Navidad",date:"2026-12-24",factor:1.6},
];

/* ─── Utils ────────────────────────────────────────────────────────────────── */
function useLs(k,init){
  const [val,setVal]=useState(function(){try{var s=localStorage.getItem(k);return s?JSON.parse(s):init}catch(e){return init}});
  useEffect(function(){try{localStorage.setItem(k,JSON.stringify(val))}catch(e){}},[k,val]);
  return [val,setVal];
}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,5)}
function gStk(stk,pid){var e=stk.filter(function(s){return s.pid===pid}).sort(function(a,b){return new Date(b.date)-new Date(a.date)});return e.length>0?e[0].qty:null}
function gPr(prs,pid,sid){var e=prs.filter(function(p){return p.pid===pid&&(!sid||p.sid===sid)}).sort(function(a,b){return new Date(b.date)-new Date(a.date)});return e.length>0?e[0]:null}
function sSt(c,w,m){if(c===null)return"none";if(c<=m)return"crit";if(c<w)return"low";return"ok"}
function fD(d){if(!d)return"—";var p=d.split("-");return p[2]+"/"+p[1]}
function fC(n){if(n==null)return"—";return"$"+Math.round(n).toLocaleString("es-CL")}
function dTo(ds){var t=new Date();t.setHours(0,0,0,0);return Math.ceil((new Date(ds+"T00:00:00")-t)/864e5)}
function parseCSV(text){
  var lines=text.trim().split(/\r?\n/).map(function(l){return l.split(/[,;\t]/).map(function(c){return c.trim().replace(/^"|"$/g,"")})});
  var headers=lines[0].map(function(h){return h.toLowerCase().replace(/[\s/\\]/g,"_")});
  return lines.slice(1).filter(function(r){return r.some(function(c){return c})}).map(function(row){var obj={};headers.forEach(function(h,i){obj[h]=row[i]||""});return obj});
}

/* ─── Styles ───────────────────────────────────────────────────────────────── */
function GlobalStyles(){
  return React.createElement("style",null,`
    @import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body,#root{height:100%;font-family:'Satoshi',sans-serif;color:#1a1a1a;background:#f8f9fa}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#ddd;border-radius:3px}
    input,select,textarea{background:#fff;border:1.5px solid #e0e3e8;color:#1a1a1a;font-family:'Satoshi',sans-serif;font-size:13px;border-radius:10px;padding:10px 13px;width:100%;outline:none;transition:all .15s}
    input:focus,select:focus,textarea:focus{border-color:var(--ac);box-shadow:0 0 0 3px var(--abg)}
    input::placeholder,textarea::placeholder{color:#c0c5cc}
    button{cursor:pointer;font-family:'Satoshi',sans-serif;border:none;outline:none}
    @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
    .au{animation:slideUp .25s ease both}.ai{animation:slideIn .2s ease both}
  `);
}

/* ─── Atoms ────────────────────────────────────────────────────────────────── */
function Chip(props){
  var active=props.active;var ac=props.ac||"#D63031";
  return React.createElement("button",{onClick:props.onClick,style:{padding:"6px 14px",borderRadius:99,fontSize:12,fontWeight:active?600:500,background:active?ac:"#fff",color:active?"#fff":"#666",border:"1.5px solid "+(active?ac:"#e0e3e8"),cursor:"pointer",transition:"all .12s",whiteSpace:"nowrap"}},props.children);
}
function Btn(props){
  var v=props.v||"outline";var sz=props.s||"md";
  var vs={outline:{bg:"#fff",b:"1.5px solid #e0e3e8",c:"#555"},solid:{bg:"var(--ac)",b:"1.5px solid var(--ac)",c:"#fff"},soft:{bg:"var(--abg)",b:"1.5px solid var(--amid)",c:"var(--ac)"},danger:{bg:"#FFF5F5",b:"1.5px solid #FFD5D5",c:"#D63031"},ghost:{bg:"transparent",b:"none",c:"#888"}}[v];
  var ss={sm:{p:"6px 12px",fs:12},md:{p:"9px 18px",fs:13},lg:{p:"12px 24px",fs:14}}[sz];
  return React.createElement("button",{onClick:props.onClick,disabled:props.disabled,style:Object.assign({},{background:vs.bg,border:vs.b,color:vs.c,padding:ss.p,fontSize:ss.fs,borderRadius:10,fontWeight:600,display:"inline-flex",alignItems:"center",gap:6,opacity:props.disabled?.5:1},props.style||{})},props.children);
}
function Overlay(props){
  return React.createElement("div",{onClick:function(e){if(e.target===e.currentTarget)props.onClose()},style:{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",backdropFilter:"blur(3px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}},
    React.createElement("div",{className:"au",style:{background:"#fff",borderRadius:20,width:"100%",maxWidth:props.w||520,maxHeight:"90vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.2)"}},
      React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",borderBottom:"1px solid #eee"}},
        React.createElement("span",{style:{fontWeight:700,fontSize:16}},props.title),
        React.createElement("button",{onClick:props.onClose,style:{width:30,height:30,borderRadius:8,background:"#f3f4f6",border:"none",color:"#888",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}},"✕")
      ),
      React.createElement("div",{style:{padding:"20px 24px"}},props.children)
    )
  );
}
function FG(props){
  return React.createElement("div",{style:{marginBottom:14}},
    props.label&&React.createElement("div",{style:{fontSize:11,color:"#888",fontWeight:600,letterSpacing:.5,textTransform:"uppercase",marginBottom:5}},props.label,props.hint&&React.createElement("span",{style:{color:"#bbb",fontWeight:400,textTransform:"none",letterSpacing:0,marginLeft:6}},props.hint)),
    props.children
  );
}
function G2(props){return React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}},props.children)}

/* ─── Product Card ─────────────────────────────────────────────────────────── */
function PCard(props){
  var p=props.p;var stk=props.stock;var prs=props.prices;var ac=props.ac;var acbg=props.acbg;var cq=props.cartQty||0;
  var s=gStk(stk,p.id);var st=sSt(s,p.wMin,p.cMin);var pr=gPr(prs,p.id,p.sup);
  var pct=s!==null?Math.min(s/p.wMin,1):0;
  var stC={ok:"#00B894",low:"#D63031",crit:"#C0392B",none:"#ddd"}[st];
  var hasPU=p.pUnit&&p.pQty;
  var dprice=pr?(hasPU?fC(pr.price)+"/"+p.pUnit:fC(pr.price)+"/"+p.unit):null;
  var inCart=cq>0;

  return React.createElement("div",{style:{background:"#fff",borderRadius:16,overflow:"hidden",border:"1.5px solid "+(inCart?ac:"#eee"),boxShadow:inCart?"0 4px 20px "+ac+"22":"0 1px 4px rgba(0,0,0,.04)",transition:"all .15s"}},
    // Image
    React.createElement("div",{onClick:function(){props.onEdit(p)},style:{height:80,background:inCart?acbg:"#f8f9fa",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",cursor:"pointer"}},
      p.imgUrl?React.createElement("img",{src:p.imgUrl,style:{width:"100%",height:"100%",objectFit:"cover"}}):React.createElement("span",{style:{fontSize:36}},p.img||"📦"),
      st!=="none"&&React.createElement("div",{style:{position:"absolute",top:8,left:8,width:8,height:8,borderRadius:"50%",background:stC,border:"2px solid #fff"}}),
      inCart&&React.createElement("div",{style:{position:"absolute",top:6,right:6,background:ac,color:"#fff",fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:99,fontFamily:"'JetBrains Mono',monospace"}},cq)
    ),
    // Info
    React.createElement("div",{style:{padding:"10px 12px 8px"}},
      React.createElement("div",{style:{fontSize:13,fontWeight:600,lineHeight:1.2,marginBottom:4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},p.name),
      React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}},
        dprice&&React.createElement("span",{style:{fontSize:12,fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:ac}},dprice),
        React.createElement("span",{style:{fontSize:10,color:"#bbb",fontWeight:500}},p.pUnit||p.unit)
      ),
      // Stock bar
      React.createElement("div",{style:{marginBottom:6}},
        React.createElement("div",{style:{display:"flex",justifyContent:"space-between",fontSize:10,color:"#999",marginBottom:2}},
          React.createElement("span",null,"Stock: "+(s!==null?s:"-")+" "+p.unit),
          React.createElement("span",null,"Min: "+p.wMin)
        ),
        React.createElement("div",{style:{height:3,borderRadius:2,background:"#f0f0f0"}},
          React.createElement("div",{style:{height:"100%",width:pct*100+"%",background:stC,borderRadius:2}})
        )
      ),
      // Buttons
      React.createElement("div",{style:{display:"flex",gap:4}},
        React.createElement("button",{onClick:function(){props.onAdd(p.id,-1)},style:{flex:1,height:30,borderRadius:8,background:"#f5f5f5",border:"1px solid #eee",color:"#888",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}},"−"),
        React.createElement("button",{onClick:function(){props.onStock(p)},style:{flex:2,height:30,borderRadius:8,background:"#f5f5f5",border:"1px solid #eee",color:"#888",fontSize:11,fontWeight:500,cursor:"pointer"}},s!==null?s+" "+p.unit:"Contar"),
        React.createElement("button",{onClick:function(){props.onAdd(p.id,1)},style:{flex:1,height:30,borderRadius:8,background:ac,border:"none",color:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}},"+")
      )
    )
  );
}

/* ─── Dashboard ────────────────────────────────────────────────────────────── */
function Dashboard(props){
  var co=props.co;var products=props.products;var stock=props.stock;var orders=props.orders;var events=props.events;var prices=props.prices;var suppliers=props.suppliers;var pl=props.pal;
  var cp=products.filter(function(p){return p.co===co});
  var alerts=cp.filter(function(p){var s=gStk(stock,p.id);var st=sSt(s,p.wMin,p.cMin);return st==="low"||st==="crit"});
  var pending=orders.filter(function(o){return o.co===co&&(o.status==="borrador"||o.status==="enviado")});
  var upEv=events.filter(function(e){var d=dTo(e.date);return d>=0&&d<=30}).sort(function(a,b){return dTo(a.date)-dTo(b.date)});
  var wSpend=cp.reduce(function(a,p){var pr=gPr(prices,p.id,p.sup);return a+(pr?pr.price*p.wMin:0)},0);
  var byCat={};cp.forEach(function(p){var pr=gPr(prices,p.id,p.sup);if(pr){byCat[p.cat]=(byCat[p.cat]||0)+pr.price*p.wMin}});
  var catE=Object.entries(byCat).sort(function(a,b){return b[1]-a[1]});
  var maxC=catE.length>0?catE[0][1]:1;

  var kpis=[
    {n:alerts.length,l:"Alertas stock",c:alerts.length?"#C0392B":"#00B894",bg:alerts.length?"#FFF5F5":"#F0FFF4"},
    {n:pending.length,l:"Pedidos abiertos",c:pl.ac,bg:pl.bg},
    {n:cp.length,l:"Productos",c:"#2D3436",bg:"#fff"},
    {n:fC(wSpend),l:"Costo semanal",c:"#2D3436",bg:"#fff",mono:true},
  ];

  return React.createElement("div",{className:"au"},
    React.createElement("div",{style:{marginBottom:24}},
      React.createElement("div",{style:{fontSize:12,fontWeight:600,color:"#bbb",letterSpacing:.8,textTransform:"uppercase",marginBottom:4}},"Panel de control"),
      React.createElement("h1",{style:{fontWeight:900,fontSize:28,letterSpacing:-1,lineHeight:1}},pl.name)
    ),
    // KPIs
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:22}},
      kpis.map(function(k,i){return React.createElement("div",{key:i,style:{background:k.bg,borderRadius:14,padding:18,border:"1px solid #eee"}},
        React.createElement("div",{style:{fontSize:k.mono?16:28,fontWeight:800,color:k.c,fontFamily:k.mono?"'JetBrains Mono',monospace":"inherit",letterSpacing:k.mono?-.5:-1,lineHeight:1,marginBottom:4}},k.n),
        React.createElement("div",{style:{fontSize:11,color:"#999",fontWeight:500}},k.l)
      )})
    ),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}},
      // Spend by cat
      React.createElement("div",{style:{background:"#fff",borderRadius:14,padding:18,border:"1px solid #eee"}},
        React.createElement("div",{style:{fontWeight:700,fontSize:14,marginBottom:14}},"Gasto por categoría"),
        catE.slice(0,6).map(function(entry){return React.createElement("div",{key:entry[0],style:{marginBottom:10}},
          React.createElement("div",{style:{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}},
            React.createElement("span",{style:{color:"#555"}},entry[0]),
            React.createElement("span",{style:{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:pl.ac}},fC(entry[1]))
          ),
          React.createElement("div",{style:{height:4,borderRadius:2,background:"#f0f0f0"}},
            React.createElement("div",{style:{height:"100%",width:(entry[1]/maxC*100)+"%",background:pl.ac,borderRadius:2}})
          )
        )})
      ),
      // Alerts + Events column
      React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:14}},
        React.createElement("div",{style:{background:"#fff",borderRadius:14,padding:18,border:"1px solid #eee",flex:1}},
          React.createElement("div",{style:{fontWeight:700,fontSize:14,marginBottom:12}},"Alertas de stock"),
          alerts.length===0?React.createElement("div",{style:{color:"#10b981",fontSize:13,textAlign:"center",padding:12}},"Todo en orden ✓"):
          alerts.slice(0,5).map(function(p){
            var s=gStk(stock,p.id);var c=sSt(s,p.wMin,p.cMin)==="crit"?"#C0392B":"#D63031";
            return React.createElement("div",{key:p.id,style:{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #f5f5f5"}},
              React.createElement("span",{style:{fontSize:16}},p.img),
              React.createElement("span",{style:{flex:1,fontSize:12}},p.name),
              React.createElement("span",{style:{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:c,fontWeight:600}},(s!==null?s:"-")+"/"+p.wMin)
            );
          })
        ),
        React.createElement("div",{style:{background:"#fff",borderRadius:14,padding:18,border:"1px solid #eee"}},
          React.createElement("div",{style:{fontWeight:700,fontSize:14,marginBottom:12}},"Próximos eventos"),
          upEv.length===0?React.createElement("div",{style:{color:"#bbb",fontSize:12,textAlign:"center"}},"Sin eventos 30d"):
          upEv.map(function(ev){var d=dTo(ev.date);return React.createElement("div",{key:ev.id,style:{display:"flex",alignItems:"center",gap:10,padding:"6px 0"}},
            React.createElement("div",{style:{width:32,height:32,borderRadius:8,background:d<=7?"#FFF5F5":pl.bg,display:"flex",alignItems:"center",justifyContent:"center"}},
              React.createElement("span",{style:{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:d<=7?"#C0392B":pl.ac}},d)
            ),
            React.createElement("div",null,
              React.createElement("div",{style:{fontSize:12,fontWeight:500}},ev.name),
              React.createElement("div",{style:{fontSize:10,color:"#bbb"}},fD(ev.date)+" · ×"+ev.factor)
            )
          )})
        )
      )
    )
  );
}

/* ─── Comprar ──────────────────────────────────────────────────────────────── */
function Comprar(props){
  var co=props.co;var products=props.products;var stock=props.stock;var prices=props.prices;var suppliers=props.suppliers;
  var cart=props.cart;var setCart=props.setCart;var pl=props.pal;
  var _s=useState("");var search=_s[0];var setSearch=_s[1];
  var _c=useState("Todos");var cat=_c[0];var setCat=_c[1];
  var cats=props.cats||[];
  var addCategory=props.addCategory;
  var cp=products.filter(function(p){return p.co===co}).filter(function(p){return cat==="Todos"||p.cat===cat}).filter(function(p){return !search||p.name.toLowerCase().indexOf(search.toLowerCase())>=0});

  function addToCart(pid,delta){
    setCart(function(prev){var n=Object.assign({},prev);n[pid]=Math.max(0,(n[pid]||0)+delta);if(n[pid]===0)delete n[pid];return n});
  }

  return React.createElement("div",{className:"au"},
    React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}},
      React.createElement("h2",{style:{fontWeight:900,fontSize:22,letterSpacing:-.5}},"Comprar"),
      React.createElement("div",{style:{display:"flex",gap:8,alignItems:"center"}},
        React.createElement("input",{value:search,onChange:function(e){setSearch(e.target.value)},placeholder:"🔍 Buscar insumo...",style:{width:200,height:36,fontSize:13}}),
        React.createElement(Btn,{v:"solid",s:"sm",onClick:function(){props.openProductForm({co:co,name:"",cat:cat!=="Todos"?cat:(cats[0]||""),unit:"kg",pUnit:"",pQty:"",wMin:0,cMin:0,sup:"",alt:"",img:"📦",imgUrl:"",priceType:"net"})}},"+  Producto")
      )
    ),
    React.createElement("div",{style:{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18,alignItems:"center"}},
      ["Todos"].concat(cats).map(function(c){return React.createElement(Chip,{key:c,active:cat===c,onClick:function(){setCat(c)},ac:pl.ac},c)}),
      React.createElement(CatManager,{cats:cats,onAdd:addCategory,ac:pl.ac})
    ),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}},
      cp.map(function(p){return React.createElement(PCard,{key:p.id,p:p,stock:stock,prices:prices,suppliers:suppliers,ac:pl.ac,acbg:pl.bg,cartQty:cart[p.id]||0,onAdd:addToCart,onEdit:function(pp){props.openProductForm(pp)},onStock:function(pp){props.openStockModal(pp)}})})
    )
  );
}

/* ─── Suppliers ────────────────────────────────────────────────────────────── */
function SuppliersView(props){
  var suppliers=props.suppliers;var setSup=props.setSuppliers;var co=props.co;var pl=props.pal;
  var _m=useState(false);var modal=_m[0];var setModal=_m[1];
  var _f=useState({});var form=_f[0];var setForm=_f[1];
  var _cf=useState("Todos");var catF=_cf[0];var setCatF=_cf[1];

  var cs=suppliers.filter(function(s){return s.companies.indexOf(co)>=0&&(catF==="Todos"||(s.categories&&s.categories.indexOf(catF)>=0))});

  function openNew(){setForm({name:"",contact:"",phone:"",address:"",categories:[],orderDays:[],deliveryDays:[],leadDays:1,companies:[co],notes:""});setModal(true)}
  function openEdit(s){setForm(Object.assign({},s));setModal(true)}
  function save(){
    if(form.id){setSup(function(prev){return prev.map(function(s){return s.id===form.id?form:s})})}
    else{setSup(function(prev){return prev.concat([Object.assign({},form,{id:uid()})])})}
    setModal(false);
  }
  function toggle(field,val){
    setForm(function(prev){
      var arr=prev[field]||[];
      var next=arr.indexOf(val)>=0?arr.filter(function(x){return x!==val}):arr.concat([val]);
      var out=Object.assign({},prev);out[field]=next;return out;
    });
  }
  function formSet(field,val){setForm(function(prev){var out=Object.assign({},prev);out[field]=val;return out})}

  return React.createElement("div",{className:"au"},
    React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}},
      React.createElement("h2",{style:{fontWeight:900,fontSize:22,letterSpacing:-.5}},"Proveedores"),
      React.createElement(Btn,{v:"solid",s:"sm",onClick:openNew},"+  Nuevo")
    ),
    React.createElement("div",{style:{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}},
      ["Todos"].concat(SUP_CATS).map(function(c){return React.createElement(Chip,{key:c,active:catF===c,onClick:function(){setCatF(c)},ac:pl.ac},c)})
    ),
    React.createElement("div",{style:{display:"grid",gap:8}},
      cs.length===0&&React.createElement("div",{style:{textAlign:"center",padding:60,color:"#ccc",fontSize:13}},"Sin proveedores"),
      cs.map(function(s){return React.createElement("div",{key:s.id,onClick:function(){openEdit(s)},style:{background:"#fff",borderRadius:14,padding:"14px 16px",border:"1px solid #eee",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}},
        React.createElement("div",{style:{width:40,height:40,borderRadius:10,background:pl.bg,border:"1px solid "+pl.mid,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:pl.ac,flexShrink:0}},s.name.slice(0,2).toUpperCase()),
        React.createElement("div",{style:{flex:1,minWidth:0}},
          React.createElement("div",{style:{fontWeight:600,fontSize:14,marginBottom:3}},s.name),
          React.createElement("div",{style:{fontSize:11,color:"#999",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},s.contact+" · "+s.phone),
          s.categories&&s.categories.length>0&&React.createElement("div",{style:{display:"flex",gap:4,marginTop:5,flexWrap:"wrap"}},s.categories.map(function(c){return React.createElement("span",{key:c,style:{fontSize:9,fontWeight:600,padding:"2px 6px",borderRadius:4,background:pl.bg,color:pl.ac}},c)}))
        )
      )})
    ),
    modal&&React.createElement(Overlay,{title:form.id?"Editar proveedor":"Nuevo proveedor",onClose:function(){setModal(false)},w:540},
      React.createElement(FG,{label:"Nombre"},React.createElement("input",{value:form.name||"",onChange:function(e){formSet("name",e.target.value)}})),
      React.createElement(G2,null,
        React.createElement(FG,{label:"Contacto"},React.createElement("input",{value:form.contact||"",onChange:function(e){formSet("contact",e.target.value)}})),
        React.createElement(FG,{label:"Teléfono"},React.createElement("input",{value:form.phone||"",onChange:function(e){formSet("phone",e.target.value)}}))
      ),
      React.createElement(FG,{label:"Dirección"},React.createElement("input",{value:form.address||"",onChange:function(e){formSet("address",e.target.value)}})),
      React.createElement(FG,{label:"Categorías"},React.createElement("div",{style:{display:"flex",gap:5,flexWrap:"wrap"}},SUP_CATS.map(function(c){return React.createElement(Chip,{key:c,active:form.categories&&form.categories.indexOf(c)>=0,onClick:function(){toggle("categories",c)},ac:pl.ac},c)}))),
      React.createElement(FG,{label:"Días de pedido"},React.createElement("div",{style:{display:"flex",gap:5}},DWF.map(function(d,i){return React.createElement(Chip,{key:d,active:form.orderDays&&form.orderDays.indexOf(d)>=0,onClick:function(){toggle("orderDays",d)},ac:pl.ac},DW[i])}))),
      React.createElement(FG,{label:"Días de entrega"},React.createElement("div",{style:{display:"flex",gap:5}},DWF.map(function(d,i){return React.createElement(Chip,{key:d,active:form.deliveryDays&&form.deliveryDays.indexOf(d)>=0,onClick:function(){toggle("deliveryDays",d)},ac:pl.ac},DW[i])}))),
      React.createElement(FG,{label:"Notas"},React.createElement("textarea",{value:form.notes||"",onChange:function(e){formSet("notes",e.target.value)},rows:2})),
      React.createElement("div",{style:{display:"flex",justifyContent:"space-between",paddingTop:14,borderTop:"1px solid #eee"}},
        form.id&&React.createElement(Btn,{v:"danger",s:"sm",onClick:function(){setSup(function(prev){return prev.filter(function(x){return x.id!==form.id})});setModal(false)}},"Eliminar"),
        React.createElement("div",{style:{display:"flex",gap:8,marginLeft:"auto"}},
          React.createElement(Btn,{onClick:function(){setModal(false)}},"Cancelar"),
          React.createElement(Btn,{v:"solid",onClick:save},"Guardar")
        )
      )
    )
  );
}

/* ─── Orders ───────────────────────────────────────────────────────────────── */
function OrdersView(props){
  var co=props.co;var orders=props.orders;var setOrders=props.setOrders;var products=props.products;var suppliers=props.suppliers;var prices=props.prices;var pl=props.pal;
  var _d=useState(null);var detail=_d[0];var setDetail=_d[1];
  var coO=orders.filter(function(o){return o.co===co}).sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt)});
  var SC={borrador:"#888",enviado:"#D63031",completado:"#00B894"};

  if(detail){
    var o=orders.find(function(x){return x.id===detail});
    if(!o){setDetail(null);return null}
    var sup=suppliers.find(function(s){return s.id===o.sid});
    var total=o.items.reduce(function(s,it){return s+it.qty*it.unitPrice},0);
    return React.createElement("div",{className:"au"},
      React.createElement("button",{onClick:function(){setDetail(null)},style:{background:"none",border:"none",color:"#999",fontSize:13,cursor:"pointer",marginBottom:16}},"← Volver"),
      React.createElement("div",{style:{background:"#fff",borderRadius:16,padding:20,border:"1px solid #eee",marginBottom:12}},
        React.createElement("div",{style:{fontWeight:700,fontSize:18,marginBottom:4}},o.name||(sup?sup.name:"Pedido")),
        React.createElement("div",{style:{display:"flex",gap:8,alignItems:"center"}},
          React.createElement("span",{style:{fontSize:10,fontWeight:700,color:SC[o.status]||"#888",background:(SC[o.status]||"#888")+"18",padding:"2px 8px",borderRadius:5,textTransform:"uppercase"}},o.status),
          React.createElement("span",{style:{fontSize:11,color:"#bbb"}},fD(o.createdAt))
        )
      ),
      React.createElement("div",{style:{background:"#fff",borderRadius:16,padding:20,border:"1px solid #eee"}},
        o.items.map(function(it,i){
          var p=products.find(function(x){return x.id===it.pid});
          return React.createElement("div",{key:i,style:{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #f5f5f5"}},
            React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8}},
              React.createElement("span",{style:{fontSize:18}},p?p.img:""),
              React.createElement("span",{style:{fontSize:13}},p?p.name:"—")
            ),
            React.createElement("div",{style:{display:"flex",gap:14,fontFamily:"'JetBrains Mono',monospace",fontSize:12}},
              React.createElement("span",{style:{color:"#888"}},it.qty+" "+(p?p.unit:"")),
              React.createElement("span",{style:{color:pl.ac,fontWeight:600}},fC(it.qty*it.unitPrice))
            )
          );
        }),
        React.createElement("div",{style:{textAlign:"right",paddingTop:14,fontWeight:800,fontSize:20,color:pl.ac,fontFamily:"'JetBrains Mono',monospace"}},fC(total))
      )
    );
  }

  return React.createElement("div",{className:"au"},
    React.createElement("h2",{style:{fontWeight:900,fontSize:22,letterSpacing:-.5,marginBottom:18}},"Pedidos"),
    coO.length===0&&React.createElement("div",{style:{textAlign:"center",padding:60,color:"#ccc",fontSize:14}},"Sin pedidos. Usá Comprar para armar uno."),
    coO.map(function(o){
      var sup=suppliers.find(function(s){return s.id===o.sid});
      var total=o.items.reduce(function(s,it){return s+it.qty*it.unitPrice},0);
      return React.createElement("div",{key:o.id,onClick:function(){setDetail(o.id)},style:{background:"#fff",borderRadius:14,padding:"14px 16px",border:"1px solid #eee",marginBottom:8,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}},
        React.createElement("div",{style:{flex:1}},
          React.createElement("div",{style:{fontWeight:600,fontSize:14,marginBottom:3}},o.name||(sup?sup.name:"Pedido")),
          React.createElement("div",{style:{display:"flex",gap:8,alignItems:"center"}},
            React.createElement("span",{style:{fontSize:10,fontWeight:700,color:SC[o.status]||"#888",background:(SC[o.status]||"#888")+"18",padding:"2px 7px",borderRadius:5,textTransform:"uppercase"}},o.status),
            React.createElement("span",{style:{fontSize:11,color:"#bbb"}},fD(o.createdAt)+" · "+o.items.length+" prod.")
          )
        ),
        React.createElement("span",{style:{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:600,color:pl.ac}},fC(total))
      );
    })
  );
}

/* ─── Cart Drawer ──────────────────────────────────────────────────────────── */
function CartDrawer(props){
  var cart=props.cart;var products=props.products;var prices=props.prices;var suppliers=props.suppliers;var ac=props.ac;var co=props.co;
  var _n=useState("");var orderName=_n[0];var setOrderName=_n[1];
  var _g=useState(true);var grouped=_g[0];var setGrouped=_g[1];

  var items=Object.keys(cart).filter(function(pid){return cart[pid]>0}).map(function(pid){return{pid:pid,qty:cart[pid],p:products.find(function(x){return x.id===pid})}}).filter(function(x){return x.p});
  var bySup={};items.forEach(function(it){var sid=it.p.sup||"none";if(!bySup[sid])bySup[sid]=[];bySup[sid].push(it)});
  var total=items.reduce(function(s,it){var pr=gPr(prices,it.p.id,it.p.sup);return s+(pr?pr.price*it.qty:0)},0);

  function handleSave(status){
    if(!items.length)return;
    Object.entries(bySup).forEach(function(entry){
      var sid=entry[0];var its=entry[1];
      var sup=suppliers.find(function(s){return s.id===sid});
      props.onSave({co:co,sid:sid==="none"?"":sid,name:orderName||("Pedido "+(sup?sup.name:"")),status:status,createdAt:new Date().toISOString().slice(0,10),items:its.map(function(it){var pr=gPr(prices,it.p.id,it.p.sup);return{pid:it.p.id,qty:it.qty,usePU:!!(it.p.pUnit&&it.p.pQty),unitPrice:pr?pr.price:0}}),notes:""});
    });
    props.onClear();props.onClose();
  }

  return React.createElement("div",{style:{position:"fixed",inset:0,zIndex:400,display:"flex",justifyContent:"flex-end"},onClick:function(e){if(e.target===e.currentTarget)props.onClose()}},
    React.createElement("div",{className:"ai",style:{width:420,maxWidth:"95vw",height:"100%",background:"#fff",display:"flex",flexDirection:"column",boxShadow:"-8px 0 40px rgba(0,0,0,.12)"}},
      // Header
      React.createElement("div",{style:{padding:"20px 22px",borderBottom:"1px solid #eee",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}},
        React.createElement("div",null,
          React.createElement("div",{style:{fontWeight:700,fontSize:17}},"Carrito"),
          React.createElement("div",{style:{fontSize:12,color:"#888"}},items.length+" productos · "+fC(total))
        ),
        React.createElement("div",{style:{display:"flex",gap:6}},
          React.createElement(Btn,{v:"danger",s:"sm",onClick:props.onClear},"Vaciar"),
          React.createElement("button",{onClick:props.onClose,style:{width:30,height:30,borderRadius:8,background:"#f3f4f6",border:"none",color:"#888",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}},"✕")
        )
      ),
      // Items
      React.createElement("div",{style:{flex:1,overflowY:"auto",padding:"12px 22px"}},
        items.length===0&&React.createElement("div",{style:{textAlign:"center",padding:40,color:"#bbb"}},"Vacío"),
        Object.entries(bySup).map(function(entry){
          var sid=entry[0];var its=entry[1];
          var sup=suppliers.find(function(s){return s.id===sid});
          return React.createElement("div",{key:sid,style:{marginBottom:16}},
            React.createElement("div",{style:{fontSize:11,fontWeight:700,color:"#999",letterSpacing:.6,textTransform:"uppercase",marginBottom:8,paddingBottom:6,borderBottom:"1px solid #f0f0f0"}},sup?sup.name:"Sin proveedor"),
            its.map(function(it){
              var pr=gPr(prices,it.p.id,it.p.sup);var lineT=pr?fC(pr.price*it.qty):"—";
              return React.createElement("div",{key:it.p.id,style:{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #f8f8f8"}},
                React.createElement("span",{style:{fontSize:22}},it.p.img||"📦"),
                React.createElement("div",{style:{flex:1}},React.createElement("div",{style:{fontSize:13,fontWeight:500}},it.p.name)),
                React.createElement("div",{style:{display:"flex",alignItems:"center",gap:3}},
                  React.createElement("button",{onClick:function(){props.onQty(it.p.id,-1)},style:{width:24,height:24,borderRadius:6,background:"#f5f5f5",border:"1px solid #eee",color:"#888",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}},"−"),
                  React.createElement("span",{style:{width:32,textAlign:"center",fontSize:13,fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:ac}},it.qty),
                  React.createElement("button",{onClick:function(){props.onQty(it.p.id,1)},style:{width:24,height:24,borderRadius:6,background:ac,border:"none",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}},"+")
                ),
                React.createElement("span",{style:{width:70,textAlign:"right",fontSize:12,fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:ac}},lineT)
              );
            })
          );
        })
      ),
      // Footer
      React.createElement("div",{style:{borderTop:"1px solid #eee",padding:"16px 22px",flexShrink:0,background:"#fafafa"}},
        React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},
          React.createElement("span",{style:{fontSize:13,color:"#888"}},"Total"),
          React.createElement("span",{style:{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:20,color:ac}},fC(total))
        ),
        React.createElement("input",{value:orderName,onChange:function(e){setOrderName(e.target.value)},placeholder:"Nombre del pedido...",style:{marginBottom:12}}),
        React.createElement("div",{style:{display:"flex",gap:8}},
          React.createElement(Btn,{v:"outline",onClick:function(){handleSave("borrador")},disabled:!items.length,style:{flex:1}},"Borrador"),
          React.createElement(Btn,{v:"solid",onClick:function(){handleSave("enviado")},disabled:!items.length,style:{flex:1}},"Confirmar pedido")
        )
      )
    )
  );
}

/* ─── Product Form ─────────────────────────────────────────────────────────── */
function ProductForm(props){
  var product=props.product;var co=props.co;var pl=props.pal;
  var cats=props.cats||CATS[co]||[];var sups=props.suppliers.filter(function(s){return s.companies.indexOf(co)>=0});
  var _f=useState(product||{co:co,name:"",cat:cats[0]||"",unit:"kg",pUnit:"",pQty:"",wMin:0,cMin:0,sup:"",alt:"",img:"📦",imgUrl:"",priceType:"net"});
  var f=_f[0];var sF=_f[1];
  function fSet(field,val){sF(function(prev){var out=Object.assign({},prev);out[field]=val;return out})}

  function handleImg(e){
    var file=e.target.files[0];if(!file)return;
    var reader=new FileReader();
    reader.onload=function(ev){fSet("imgUrl",ev.target.result)};
    reader.readAsDataURL(file);
  }

  return React.createElement(Overlay,{title:f.id?"Editar producto":"Nuevo producto",onClose:props.onClose},
    // Image upload
    React.createElement("div",{style:{display:"flex",gap:14,marginBottom:16,alignItems:"center"}},
      React.createElement("label",{style:{width:64,height:64,borderRadius:14,background:"#f5f5f5",border:"2px dashed #ddd",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",flexShrink:0}},
        f.imgUrl?React.createElement("img",{src:f.imgUrl,style:{width:"100%",height:"100%",objectFit:"cover"}}):React.createElement("span",{style:{fontSize:28}},f.img||"📦"),
        React.createElement("input",{type:"file",accept:"image/*",onChange:handleImg,style:{display:"none"}})
      ),
      React.createElement("div",{style:{flex:1}},
        React.createElement("div",{style:{fontSize:11,color:"#aaa",marginBottom:4}},"Click para subir foto"),
        React.createElement("div",{style:{display:"flex",gap:4,flexWrap:"wrap"}},
          ["🧀","🥩","🌾","🍅","🍟","📦","🧈","🥤","🧹","🍔"].map(function(em){return React.createElement("button",{key:em,onClick:function(){fSet("img",em)},style:{width:28,height:28,borderRadius:6,background:f.img===em?pl.bg:"#f5f5f5",border:"1.5px solid "+(f.img===em?pl.ac:"#eee"),fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}},em)})
        )
      )
    ),
    React.createElement(FG,{label:"Nombre"},React.createElement("input",{value:f.name,onChange:function(e){fSet("name",e.target.value)}})),
    React.createElement(G2,null,
      React.createElement(FG,{label:"Categoría"},React.createElement("select",{value:f.cat,onChange:function(e){fSet("cat",e.target.value)}},cats.map(function(c){return React.createElement("option",{key:c},c)}))),
      React.createElement(FG,{label:"Unidad stock"},React.createElement("select",{value:f.unit,onChange:function(e){fSet("unit",e.target.value)}},["kg","g","unid","l","ml"].map(function(u){return React.createElement("option",{key:u},u)}))),
      React.createElement(FG,{label:"Mín. semanal"},React.createElement("input",{type:"number",step:".5",value:f.wMin,onChange:function(e){fSet("wMin",parseFloat(e.target.value)||0)}})),
      React.createElement(FG,{label:"Stock crítico"},React.createElement("input",{type:"number",step:".5",value:f.cMin,onChange:function(e){fSet("cMin",parseFloat(e.target.value)||0)}}))
    ),
    React.createElement("div",{style:{background:"#fafafa",borderRadius:12,padding:"12px 14px",marginBottom:14,border:"1px solid #eee"}},
      React.createElement("div",{style:{fontSize:11,color:"#999",fontWeight:600,marginBottom:8}},"UNIDAD DE COMPRA"),
      React.createElement(G2,null,
        React.createElement(FG,{label:"Nombre (saco, caja...)"},React.createElement("input",{value:f.pUnit||"",onChange:function(e){fSet("pUnit",e.target.value)}})),
        React.createElement(FG,{label:"Contenido ("+f.unit+")"},React.createElement("input",{type:"number",value:f.pQty||"",onChange:function(e){fSet("pQty",parseFloat(e.target.value)||"")}}))
      ),
      f.pUnit&&f.pQty&&React.createElement("div",{style:{fontSize:12,color:pl.ac,fontWeight:600}},"→ 1 "+f.pUnit+" = "+f.pQty+" "+f.unit)
    ),
    React.createElement(G2,null,
      React.createElement(FG,{label:"Proveedor principal"},React.createElement("select",{value:f.sup,onChange:function(e){fSet("sup",e.target.value)}},React.createElement("option",{value:""},"—"),sups.map(function(s){return React.createElement("option",{key:s.id,value:s.id},s.name)}))),
      React.createElement(FG,{label:"Alternativo"},React.createElement("select",{value:f.alt,onChange:function(e){fSet("alt",e.target.value)}},React.createElement("option",{value:""},"—"),sups.map(function(s){return React.createElement("option",{key:s.id,value:s.id},s.name)})))
    ),
    React.createElement("div",{style:{display:"flex",justifyContent:"flex-end",gap:8,paddingTop:14,borderTop:"1px solid #eee"}},
      React.createElement(Btn,{onClick:props.onClose},"Cancelar"),
      React.createElement(Btn,{v:"solid",onClick:function(){props.onSave(f.id?f:Object.assign({},f,{id:uid()}));props.onClose()}},"Guardar")
    )
  );
}

/* ─── Stock Modal ──────────────────────────────────────────────────────────── */
function StockModal(props){
  var p=props.product;
  var _q=useState("");var qty=_q[0];var setQty=_q[1];
  var _w=useState("");var who=_w[0];var setWho=_w[1];
  return React.createElement(Overlay,{title:"Contar stock — "+p.name,onClose:props.onClose,w:380},
    React.createElement("div",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:16}},
      React.createElement("span",{style:{fontSize:40}},p.img||"📦"),
      React.createElement("div",null,
        React.createElement("div",{style:{fontWeight:600,fontSize:15}},p.name),
        React.createElement("div",{style:{fontSize:12,color:"#999"}},"Min: "+p.wMin+" "+p.unit)
      )
    ),
    React.createElement(FG,{label:"Cantidad ("+p.unit+")"},React.createElement("input",{type:"number",step:".1",value:qty,onChange:function(e){setQty(e.target.value)},autoFocus:true,placeholder:"0",style:{fontSize:18,fontFamily:"'JetBrains Mono',monospace",textAlign:"center",fontWeight:700}})),
    React.createElement(FG,{label:"Registrado por"},React.createElement("input",{value:who,onChange:function(e){setWho(e.target.value)},placeholder:"Nombre"})),
    React.createElement("div",{style:{display:"flex",justifyContent:"flex-end",gap:8,paddingTop:14,borderTop:"1px solid #eee"}},
      React.createElement(Btn,{onClick:props.onClose},"Cancelar"),
      React.createElement(Btn,{v:"solid",onClick:function(){props.onSave({id:uid(),pid:p.id,qty:parseFloat(qty)||0,date:new Date().toISOString().slice(0,10),who:who});props.onClose()}},"Guardar")
    )
  );
}

/* ─── Gastos / Analytics ────────────────────────────────────────────────────── */
function GastosView(props){
  var co=props.co;var products=props.products;var prices=props.prices;var orders=props.orders;var suppliers=props.suppliers;var pl=props.pal;

  // Spend by category (from weekly minimums × prices)
  var cp=products.filter(function(p){return p.co===co});
  var byCat={};
  cp.forEach(function(p){var pr=gPr(prices,p.id,p.sup);if(pr){byCat[p.cat]=(byCat[p.cat]||0)+pr.price*p.wMin}});
  var catEntries=Object.entries(byCat).sort(function(a,b){return b[1]-a[1]});
  var totalWeekly=catEntries.reduce(function(s,e){return s+e[1]},0);
  var totalMonthly=totalWeekly*4.3;

  // Order history for tracking
  var coOrders=orders.filter(function(o){return o.co===co&&o.status==="completado"});
  var ordersByMonth={};
  coOrders.forEach(function(o){
    var month=o.createdAt?o.createdAt.slice(0,7):"";
    if(!month)return;
    var total=o.items.reduce(function(s,it){return s+it.qty*it.unitPrice},0);
    ordersByMonth[month]=(ordersByMonth[month]||0)+total;
  });
  var monthEntries=Object.entries(ordersByMonth).sort(function(a,b){return a[0].localeCompare(b[0])}).slice(-6);
  var maxMonth=monthEntries.reduce(function(m,e){return Math.max(m,e[1])},1);

  // Price tracking — for each product show latest price and trend
  var priceTracking=cp.map(function(p){
    var allPr=prices.filter(function(pr){return pr.pid===p.id}).sort(function(a,b){return new Date(b.date)-new Date(a.date)});
    var latest=allPr[0];var prev=allPr[1];
    var diff=latest&&prev?((latest.price-prev.price)/prev.price*100):null;
    return{p:p,latest:latest,diff:diff,history:allPr.slice(0,5)};
  }).filter(function(x){return x.latest});

  // Top spending products
  var topSpend=cp.map(function(p){
    var pr=gPr(prices,p.id,p.sup);
    return{p:p,weeklySpend:pr?pr.price*p.wMin:0};
  }).sort(function(a,b){return b.weeklySpend-a.weeklySpend}).slice(0,8);

  return React.createElement("div",{className:"au"},
    React.createElement("div",{style:{marginBottom:24}},
      React.createElement("div",{style:{fontSize:12,fontWeight:600,color:"#bbb",letterSpacing:.8,textTransform:"uppercase",marginBottom:4}},"Control de gastos"),
      React.createElement("h1",{style:{fontWeight:900,fontSize:28,letterSpacing:-1,lineHeight:1}},"Gastos & Precios")
    ),

    // Summary cards
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:22}},
      [{n:fC(totalWeekly),l:"Gasto semanal est.",c:pl.ac},{n:fC(totalMonthly),l:"Gasto mensual est.",c:"#2D3436"},{n:cp.length+" productos",l:"con precios registrados",c:"#888"}].map(function(k,i){
        return React.createElement("div",{key:i,style:{background:"#fff",borderRadius:14,padding:18,border:"1px solid #eee"}},
          React.createElement("div",{style:{fontSize:20,fontWeight:800,color:k.c,fontFamily:"'JetBrains Mono',monospace",letterSpacing:-.5,lineHeight:1,marginBottom:4}},k.n),
          React.createElement("div",{style:{fontSize:11,color:"#999",fontWeight:500}},k.l)
        );
      })
    ),

    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}},
      // Spend by category — bar chart
      React.createElement("div",{style:{background:"#fff",borderRadius:14,padding:18,border:"1px solid #eee"}},
        React.createElement("div",{style:{fontWeight:700,fontSize:14,marginBottom:16}},"Gasto semanal por categoría"),
        catEntries.map(function(entry){
          var pct=totalWeekly>0?(entry[1]/totalWeekly*100).toFixed(1):0;
          return React.createElement("div",{key:entry[0],style:{marginBottom:10}},
            React.createElement("div",{style:{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}},
              React.createElement("span",{style:{color:"#555",fontWeight:500}},entry[0]),
              React.createElement("span",{style:{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:pl.ac}},fC(entry[1])," ",React.createElement("span",{style:{color:"#ccc",fontWeight:400}},pct+"%"))
            ),
            React.createElement("div",{style:{height:6,borderRadius:3,background:"#f0f0f0"}},
              React.createElement("div",{style:{height:"100%",width:pct+"%",background:pl.ac,borderRadius:3,transition:"width .4s"}})
            )
          );
        })
      ),

      // Top spending products
      React.createElement("div",{style:{background:"#fff",borderRadius:14,padding:18,border:"1px solid #eee"}},
        React.createElement("div",{style:{fontWeight:700,fontSize:14,marginBottom:16}},"Top productos por gasto semanal"),
        topSpend.map(function(item,i){
          return React.createElement("div",{key:item.p.id,style:{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:"1px solid #f5f5f5"}},
            React.createElement("span",{style:{fontSize:10,fontWeight:700,color:"#ccc",width:18,textAlign:"right"}},i+1),
            React.createElement("span",{style:{fontSize:16}},item.p.img),
            React.createElement("span",{style:{flex:1,fontSize:12,fontWeight:500}},item.p.name),
            React.createElement("span",{style:{fontSize:12,fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:pl.ac}},fC(item.weeklySpend)+"/sem")
          );
        })
      )
    ),

    // Price tracking
    React.createElement("div",{style:{background:"#fff",borderRadius:14,padding:18,border:"1px solid #eee"}},
      React.createElement("div",{style:{fontWeight:700,fontSize:14,marginBottom:16}},"Seguimiento de precios"),
      React.createElement("div",{style:{display:"grid",gap:6}},
        priceTracking.map(function(item){
          var p=item.p;var sup=suppliers.find(function(s){return s.id===(item.latest?item.latest.sid:"")});
          return React.createElement("div",{key:p.id,style:{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"#fafafa",borderRadius:10}},
            React.createElement("span",{style:{fontSize:18}},p.img),
            React.createElement("div",{style:{flex:1,minWidth:0}},
              React.createElement("div",{style:{fontSize:13,fontWeight:500}},p.name),
              React.createElement("div",{style:{fontSize:10,color:"#999"}},sup?sup.name:"—"," · ",fD(item.latest.date))
            ),
            React.createElement("div",{style:{textAlign:"right"}},
              React.createElement("div",{style:{fontSize:13,fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:pl.ac}},fC(item.latest.price),"/",(p.pUnit||p.unit)),
              item.diff!==null&&React.createElement("div",{style:{fontSize:11,fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:item.diff>0?"#C0392B":"#00B894"}},item.diff>0?"▲ +":"▼ ",Math.abs(item.diff).toFixed(1),"%")
            )
          );
        })
      )
    ),

    // Monthly order history (if available)
    monthEntries.length>0&&React.createElement("div",{style:{background:"#fff",borderRadius:14,padding:18,border:"1px solid #eee",marginTop:14}},
      React.createElement("div",{style:{fontWeight:700,fontSize:14,marginBottom:16}},"Historial de gastos (pedidos completados)"),
      React.createElement("div",{style:{display:"flex",alignItems:"flex-end",gap:8,height:120}},
        monthEntries.map(function(entry){
          var pct=entry[1]/maxMonth*100;
          return React.createElement("div",{key:entry[0],style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}},
            React.createElement("span",{style:{fontSize:10,fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:pl.ac}},fC(entry[1])),
            React.createElement("div",{style:{width:"100%",height:pct+"%",minHeight:4,background:pl.ac,borderRadius:6,transition:"height .4s"}}),
            React.createElement("span",{style:{fontSize:10,color:"#bbb"}},entry[0].slice(5))
          );
        })
      )
    )
  );
}

/* ─── Category Manager (small inline component) ───────────────────────────── */
function CatManager(props){
  var cats=props.cats;var onAdd=props.onAdd;var ac=props.ac;
  var _show=useState(false);var show=_show[0];var setShow=_show[1];
  var _val=useState("");var val=_val[0];var setVal=_val[1];

  if(!show){
    return React.createElement("button",{onClick:function(){setShow(true)},style:{padding:"6px 12px",borderRadius:99,fontSize:12,fontWeight:500,background:"#fff",color:"#bbb",border:"1.5px dashed #ddd",cursor:"pointer",whiteSpace:"nowrap"}},"+  Categoría");
  }
  return React.createElement("div",{style:{display:"flex",gap:4,alignItems:"center"}},
    React.createElement("input",{value:val,onChange:function(e){setVal(e.target.value)},placeholder:"Nueva categoría...",autoFocus:true,onKeyDown:function(e){if(e.key==="Enter"&&val.trim()){onAdd(val.trim());setVal("");setShow(false)}},style:{width:140,height:30,fontSize:12,padding:"0 10px"}}),
    React.createElement("button",{onClick:function(){if(val.trim()){onAdd(val.trim());setVal("");setShow(false)}},style:{width:28,height:28,borderRadius:7,background:ac,border:"none",color:"#fff",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}},"✓"),
    React.createElement("button",{onClick:function(){setShow(false);setVal("")},style:{width:28,height:28,borderRadius:7,background:"#f5f5f5",border:"1px solid #eee",color:"#888",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}},"✕")
  );
}

/* ─── Recipes ───────────────────────────────────────────────────────────────── */
function RecipesView(props){
  var co=props.co;var recipes=props.recipes;var setRecipes=props.setRecipes;var products=props.products;var prices=props.prices;var pl=props.pal;
  var _modal=useState(false);var modal=_modal[0];var setModal=_modal[1];
  var _form=useState(null);var form=_form[0];var setForm=_form[1];
  var _search=useState("");var search=_search[0];var setSearch=_search[1];
  var _catFilter=useState("Todas");var catFilter=_catFilter[0];var setCatFilter=_catFilter[1];
  var _recipeCats=useLs("ss5_rcats_"+co,co==="mf"?["Pizza","Bebida","Acompañamiento","Postre"]:["Hamburguesa","Sandwich","Bebida","Acompañamiento","Postre"]);
  var recipeCats=_recipeCats[0];var setRecipeCats=_recipeCats[1];

  function addRecipeCat(newCat){
    if(recipeCats.indexOf(newCat)<0) setRecipeCats(function(prev){return prev.concat([newCat])});
  }

  var coR=recipes.filter(function(r){return r.co===co}).filter(function(r){return !search||r.name.toLowerCase().indexOf(search.toLowerCase())>=0}).filter(function(r){return catFilter==="Todas"||r.category===catFilter});
  var cp=products.filter(function(p){return p.co===co});

  function openNew(){
    setForm({co:co,name:"",category:catFilter!=="Todas"?catFilter:(recipeCats[0]||""),yield:1,yieldUnit:"unid",ingredients:[{pid:"",qty:0}]});
    setModal(true);
  }
  function openEdit(r){setForm(Object.assign({},r,{ingredients:r.ingredients.map(function(i){return Object.assign({},i)})}));setModal(true)}
  function save(){
    var rec=form.id?form:Object.assign({},form,{id:uid()});
    // Auto-add category if new
    if(rec.category&&recipeCats.indexOf(rec.category)<0) addRecipeCat(rec.category);
    if(form.id){setRecipes(function(prev){return prev.map(function(x){return x.id===form.id?rec:x})})}
    else{setRecipes(function(prev){return prev.concat([rec])})}
    setModal(false);
  }
  function addIngredient(){setForm(function(prev){var out=Object.assign({},prev);out.ingredients=prev.ingredients.concat([{pid:"",qty:0}]);return out})}
  function removeIngredient(idx){setForm(function(prev){var out=Object.assign({},prev);out.ingredients=prev.ingredients.filter(function(_,i){return i!==idx});return out})}
  function updateIngredient(idx,field,val){
    setForm(function(prev){
      var out=Object.assign({},prev);
      out.ingredients=prev.ingredients.map(function(ing,i){
        if(i!==idx) return ing;
        var n=Object.assign({},ing);n[field]=val;return n;
      });
      return out;
    });
  }
  function formSet(field,val){setForm(function(prev){var out=Object.assign({},prev);out[field]=val;return out})}

  function recipeCost(r){
    return r.ingredients.reduce(function(sum,ing){
      var pr=gPr(prices,ing.pid,"");
      var p=products.find(function(x){return x.id===ing.pid});
      if(!pr||!p) return sum;
      return sum+pr.price*(ing.qty/1000);
    },0);
  }

  return React.createElement("div",{className:"au"},
    React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}},
      React.createElement("h2",{style:{fontWeight:900,fontSize:22,letterSpacing:-.5}},"Recetas"),
      React.createElement("div",{style:{display:"flex",gap:8}},
        React.createElement("input",{value:search,onChange:function(e){setSearch(e.target.value)},placeholder:"🔍 Buscar receta...",style:{width:180,height:36,fontSize:13}}),
        React.createElement(Btn,{v:"solid",s:"sm",onClick:openNew},"+  Receta")
      )
    ),
    // Category filter chips
    React.createElement("div",{style:{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16,alignItems:"center"}},
      ["Todas"].concat(recipeCats).map(function(c){return React.createElement(Chip,{key:c,active:catFilter===c,onClick:function(){setCatFilter(c)},ac:pl.ac},c)}),
      React.createElement(CatManager,{cats:recipeCats,onAdd:addRecipeCat,ac:pl.ac})
    ),
    coR.length===0&&React.createElement("div",{style:{textAlign:"center",padding:60,color:"#ccc"}},"Sin recetas en esta categoría."),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}},
      coR.map(function(r){
        var cost=recipeCost(r);
        return React.createElement("div",{key:r.id,onClick:function(){openEdit(r)},style:{background:"#fff",borderRadius:14,padding:"16px",border:"1px solid #eee",cursor:"pointer"}},
          React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}},
            React.createElement("div",null,
              React.createElement("div",{style:{fontWeight:700,fontSize:14,marginBottom:2}},r.name),
              React.createElement("div",{style:{fontSize:11,color:"#999"}},r.category||"Sin categoría"," · Rinde: ",r.yield," ",r.yieldUnit)
            ),
            React.createElement("div",{style:{textAlign:"right"}},
              React.createElement("div",{style:{fontSize:14,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:pl.ac}},fC(cost)),
              React.createElement("div",{style:{fontSize:10,color:"#bbb"}},"costo receta")
            )
          ),
          React.createElement("div",{style:{fontSize:11,color:"#888"}},
            r.ingredients.length+" insumos: ",
            r.ingredients.slice(0,3).map(function(ing){var p=products.find(function(x){return x.id===ing.pid});return p?p.name:"?"}).join(", "),
            r.ingredients.length>3?"...":""
          )
        );
      })
    ),

    modal&&React.createElement(Overlay,{title:form.id?"Editar receta":"Nueva receta",onClose:function(){setModal(false)},w:600},
      React.createElement(G2,null,
        React.createElement(FG,{label:"Nombre receta"},React.createElement("input",{value:form.name,onChange:function(e){formSet("name",e.target.value)},placeholder:"Ej: Pizza Familiar Pepperoni"})),
        React.createElement(FG,{label:"Categoría"},
          React.createElement("select",{value:form.category||"",onChange:function(e){formSet("category",e.target.value)}},
            React.createElement("option",{value:""},"— Seleccionar —"),
            recipeCats.map(function(c){return React.createElement("option",{key:c},c)}),
            React.createElement("option",{value:"__new"},"+ Nueva categoría...")
          )
        )
      ),
      React.createElement(G2,null,
        React.createElement(FG,{label:"Rendimiento"},React.createElement("input",{type:"number",step:"1",value:form.yield,onChange:function(e){formSet("yield",parseFloat(e.target.value)||1)}})),
        React.createElement(FG,{label:"Unidad rendimiento"},React.createElement("select",{value:form.yieldUnit,onChange:function(e){formSet("yieldUnit",e.target.value)}},
          ["unid","porciones","kg","g","l"].map(function(u){return React.createElement("option",{key:u},u)})
        ))
      ),

      // Ingredients list
      React.createElement("div",{style:{marginBottom:14}},
        React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
          React.createElement("div",{style:{fontSize:11,color:"#888",fontWeight:600,letterSpacing:.5,textTransform:"uppercase"}},"INSUMOS DE LA RECETA"),
          React.createElement(Btn,{v:"soft",s:"sm",onClick:addIngredient},"+  Insumo")
        ),
        React.createElement("div",{style:{background:"#fafafa",borderRadius:10,border:"1px solid #eee",overflow:"hidden"}},
          // Header
          React.createElement("div",{style:{display:"grid",gridTemplateColumns:"2fr 100px 60px 28px",gap:6,padding:"8px 12px",borderBottom:"1px solid #eee"}},
            React.createElement("span",{style:{fontSize:10,fontWeight:600,color:"#999",textTransform:"uppercase"}},"Producto"),
            React.createElement("span",{style:{fontSize:10,fontWeight:600,color:"#999",textTransform:"uppercase"}},"Cantidad (g/ml)"),
            React.createElement("span",{style:{fontSize:10,fontWeight:600,color:"#999",textTransform:"uppercase"}},"Costo"),
            React.createElement("span",null)
          ),
          form.ingredients.map(function(ing,idx){
            var p=products.find(function(x){return x.id===ing.pid});
            var pr=gPr(prices,ing.pid,"");
            var ingCost=pr&&p?pr.price*(ing.qty/1000):0;
            return React.createElement("div",{key:idx,style:{display:"grid",gridTemplateColumns:"2fr 100px 60px 28px",gap:6,padding:"6px 12px",borderBottom:"1px solid #f0f0f0",alignItems:"center"}},
              React.createElement("select",{value:ing.pid,onChange:function(e){updateIngredient(idx,"pid",e.target.value)},style:{fontSize:12}},
                React.createElement("option",{value:""},"— Seleccionar —"),
                cp.map(function(prod){return React.createElement("option",{key:prod.id,value:prod.id},prod.name+" ("+prod.unit+")")})
              ),
              React.createElement("input",{type:"number",step:"1",value:ing.qty||"",onChange:function(e){updateIngredient(idx,"qty",parseFloat(e.target.value)||0)},placeholder:"g/ml",style:{fontSize:12}}),
              React.createElement("span",{style:{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:pl.ac}},fC(ingCost)),
              React.createElement("button",{onClick:function(){removeIngredient(idx)},style:{width:24,height:24,borderRadius:6,background:"#FFF5F5",border:"1px solid #FFD5D5",color:"#D63031",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}},"✕")
            );
          })
        ),
        // Total cost
        React.createElement("div",{style:{display:"flex",justifyContent:"flex-end",paddingTop:8}},
          React.createElement("span",{style:{fontSize:13,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:pl.ac}},"Costo total: ",fC(form.ingredients.reduce(function(s,ing){var pr=gPr(prices,ing.pid,"");return s+(pr?pr.price*(ing.qty/1000):0)},0)))
        )
      ),

      React.createElement("div",{style:{display:"flex",justifyContent:"space-between",paddingTop:14,borderTop:"1px solid #eee"}},
        form.id&&React.createElement(Btn,{v:"danger",s:"sm",onClick:function(){setRecipes(function(prev){return prev.filter(function(x){return x.id!==form.id})});setModal(false)}},"Eliminar"),
        React.createElement("div",{style:{display:"flex",gap:8,marginLeft:"auto"}},
          React.createElement(Btn,{onClick:function(){setModal(false)}},"Cancelar"),
          React.createElement(Btn,{v:"solid",onClick:save},"Guardar")
        )
      )
    )
  );
}

/* ─── Sales & Inventory Import ─────────────────────────────────────────────── */
function SalesView(props){
  var co=props.co;var sales=props.sales;var setSales=props.setSales;var inventories=props.inventories;var setInventories=props.setInventories;var pl=props.pal;
  var _tab=useState("ventas");var tab=_tab[0];var setTab=_tab[1];
  var _text=useState("");var text=_text[0];var setText=_text[1];
  var _preview=useState([]);var preview=_preview[0];var setPreview=_preview[1];

  var coSales=sales.filter(function(s){return s.co===co}).sort(function(a,b){return b.week.localeCompare(a.week)});
  var coInv=inventories.filter(function(inv){return inv.co===co}).sort(function(a,b){return b.date.localeCompare(a.date)});

  function parseAndPreview(raw){
    try{
      var rows=parseCSV(raw);
      if(rows.length>0) setPreview(rows.slice(0,5));
    }catch(e){setPreview([])}
  }

  function importSales(){
    try{
      var rows=parseCSV(text);
      // Expected: producto, cantidad, semana (or fecha)
      var entry={id:uid(),co:co,week:new Date().toISOString().slice(0,10),items:rows.map(function(r){
        return{product:r.producto||r.product||r.nombre||"",qty:parseFloat(r.cantidad||r.qty||r.unidades||0)||0};
      }).filter(function(x){return x.product&&x.qty})};
      setSales(function(prev){return prev.concat([entry])});
      setText("");setPreview([]);
    }catch(e){}
  }

  function importInventory(){
    try{
      var rows=parseCSV(text);
      // Expected: producto, cantidad, unidad
      var entry={id:uid(),co:co,date:new Date().toISOString().slice(0,10),items:rows.map(function(r){
        return{product:r.producto||r.product||r.nombre||"",qty:parseFloat(r.cantidad||r.qty||r.stock||0)||0,unit:r.unidad||r.unit||""};
      }).filter(function(x){return x.product&&x.qty})};
      setInventories(function(prev){return prev.concat([entry])});
      setText("");setPreview([]);
    }catch(e){}
  }

  return React.createElement("div",{className:"au"},
    React.createElement("div",{style:{marginBottom:18}},
      React.createElement("h2",{style:{fontWeight:900,fontSize:22,letterSpacing:-.5,marginBottom:4}},"Datos de operación"),
      React.createElement("div",{style:{fontSize:12,color:"#999"}},"Importá ventas semanales e inventarios de bodega para alimentar el forecast")
    ),

    // Tab switch
    React.createElement("div",{style:{display:"flex",gap:6,marginBottom:16}},
      React.createElement(Chip,{active:tab==="ventas",onClick:function(){setTab("ventas")},ac:pl.ac},"📈 Ventas semanales"),
      React.createElement(Chip,{active:tab==="inventario",onClick:function(){setTab("inventario")},ac:pl.ac},"📦 Inventario bodega")
    ),

    // Import area
    React.createElement("div",{style:{background:"#fff",borderRadius:14,padding:18,border:"1px solid #eee",marginBottom:16}},
      React.createElement("div",{style:{fontWeight:700,fontSize:14,marginBottom:12}},tab==="ventas"?"Importar ventas":"Importar inventario de bodega"),
      React.createElement("div",{style:{background:"#fafafa",borderRadius:8,padding:10,marginBottom:10,border:"1px solid #eee"}},
        React.createElement("div",{style:{fontSize:11,color:pl.ac,fontFamily:"'JetBrains Mono',monospace",fontWeight:600,marginBottom:4}},"Formato CSV requerido:"),
        React.createElement("div",{style:{fontSize:10,color:"#999",fontFamily:"'JetBrains Mono',monospace"}},
          tab==="ventas"?"producto, cantidad":"producto, cantidad, unidad"
        ),
        React.createElement("div",{style:{fontSize:10,color:"#bbb",fontFamily:"'JetBrains Mono',monospace",marginTop:4}},
          tab==="ventas"?"Ej: Pizza Familiar Pepperoni, 85":"Ej: Mozzarella Bloque, 3, kg"
        )
      ),
      React.createElement("textarea",{value:text,onChange:function(e){setText(e.target.value);parseAndPreview(e.target.value)},placeholder:"Pegar CSV aquí o copiar desde Excel...",rows:4,style:{fontFamily:"'JetBrains Mono',monospace",fontSize:11,marginBottom:10}}),
      preview.length>0&&React.createElement("div",{style:{marginBottom:10,fontSize:11,color:"#10b981",fontWeight:500}},preview.length+" filas detectadas ✓"),
      React.createElement("div",{style:{display:"flex",gap:8}},
        React.createElement(Btn,{v:"solid",onClick:tab==="ventas"?importSales:importInventory,disabled:!preview.length},"Importar ",tab==="ventas"?"ventas":"inventario")
      )
    ),

    // History
    React.createElement("div",{style:{background:"#fff",borderRadius:14,padding:18,border:"1px solid #eee"}},
      React.createElement("div",{style:{fontWeight:700,fontSize:14,marginBottom:12}},tab==="ventas"?"Historial de ventas importadas":"Inventarios importados"),
      (tab==="ventas"?coSales:coInv).length===0&&React.createElement("div",{style:{textAlign:"center",padding:24,color:"#ccc",fontSize:13}},"Sin datos importados aún"),
      (tab==="ventas"?coSales:coInv).map(function(entry){
        return React.createElement("div",{key:entry.id,style:{padding:"10px 0",borderBottom:"1px solid #f5f5f5"}},
          React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}},
            React.createElement("span",{style:{fontSize:12,fontWeight:500}},fD(tab==="ventas"?entry.week:entry.date)),
            React.createElement("span",{style:{fontSize:11,color:"#999"}},entry.items.length," productos"),
            React.createElement("button",{onClick:function(){
              if(tab==="ventas") setSales(function(prev){return prev.filter(function(x){return x.id!==entry.id})});
              else setInventories(function(prev){return prev.filter(function(x){return x.id!==entry.id})});
            },style:{background:"none",border:"none",color:"#ccc",fontSize:11,cursor:"pointer"}},"✕ eliminar")
          ),
          React.createElement("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},
            entry.items.slice(0,6).map(function(it,i){
              return React.createElement("span",{key:i,style:{fontSize:10,padding:"2px 8px",borderRadius:6,background:"#f5f5f5",color:"#666"}},it.product,": ",it.qty,it.unit?" "+it.unit:"");
            }),
            entry.items.length>6&&React.createElement("span",{style:{fontSize:10,color:"#bbb"}},"+",entry.items.length-6," más")
          )
        );
      })
    )
  );
}

/* ─── Forecast / Purchase Plan ─────────────────────────────────────────────── */
function ForecastView(props){
  var co=props.co;var products=props.products;var recipes=props.recipes;var sales=props.sales;var inventories=props.inventories;var stock=props.stock;var prices=props.prices;var suppliers=props.suppliers;var pl=props.pal;

  var _period=useState("weekly");var period=_period[0];var setPeriod=_period[1];
  var _factor=useState(1.0);var factor=_factor[0];var setFactor=_factor[1];
  var _groupBy=useState("product");var groupBy=_groupBy[0];var setGroupBy=_groupBy[1];

  var cp=products.filter(function(p){return p.co===co});
  var coRecipes=recipes.filter(function(r){return r.co===co});
  var coSales=sales.filter(function(s){return s.co===co}).sort(function(a,b){return b.week.localeCompare(a.week)});
  var latestSales=coSales.length>0?coSales[0]:null;
  var coInv=inventories.filter(function(inv){return inv.co===co}).sort(function(a,b){return b.date.localeCompare(a.date)});
  var latestInv=coInv.length>0?coInv[0]:null;

  var multiplier=period==="monthly"?4.3:1;

  // Step 1: From sales data, calculate how many of each recipe were sold
  // Step 2: For each recipe, multiply ingredients × qty sold
  // Step 3: Aggregate total ingredient needs
  // Step 4: Subtract current inventory/stock
  // Step 5: Result = what to buy

  var ingredientNeeds={};// {pid: {need: grams, name, unit, recipes:[]}}

  if(latestSales){
    latestSales.items.forEach(function(saleItem){
      // Find matching recipe
      var recipe=coRecipes.find(function(r){return r.name.toLowerCase()===saleItem.product.toLowerCase()});
      if(!recipe) return;
      var qtySold=saleItem.qty*factor*multiplier;
      var batchesNeeded=qtySold/recipe.yield;

      recipe.ingredients.forEach(function(ing){
        if(!ing.pid) return;
        var p=products.find(function(x){return x.id===ing.pid});
        if(!p) return;
        if(!ingredientNeeds[ing.pid]){
          ingredientNeeds[ing.pid]={pid:ing.pid,need:0,name:p.name,unit:p.unit,cat:p.cat,sup:p.sup,img:p.img,pUnit:p.pUnit,pQty:p.pQty,recipes:[]};
        }
        ingredientNeeds[ing.pid].need+=ing.qty*batchesNeeded; // in grams
        if(ingredientNeeds[ing.pid].recipes.indexOf(recipe.name)<0) ingredientNeeds[ing.pid].recipes.push(recipe.name);
      });
    });
  }

  // Convert grams to kg for display and subtract inventory
  var forecast=Object.values(ingredientNeeds).map(function(item){
    var needKg=item.unit==="kg"?item.need/1000:item.unit==="g"?item.need:item.need;
    // Get current stock from latest inventory import or stock counts
    var invItem=latestInv?latestInv.items.find(function(inv){return inv.product.toLowerCase()===item.name.toLowerCase()}):null;
    var stkVal=gStk(stock,item.pid);
    var currentStock=invItem?invItem.qty:(stkVal!==null?stkVal:0);
    var toBuy=Math.max(0,needKg-currentStock);
    // Convert to purchase units if available
    var hasPU=item.pUnit&&item.pQty;
    var toBuyPU=hasPU?Math.ceil(toBuy/item.pQty):toBuy;
    var pr=gPr(prices,item.pid,"");
    var cost=pr?pr.price*toBuyPU:0;
    return Object.assign({},item,{needKg:needKg,currentStock:currentStock,toBuy:toBuy,toBuyPU:toBuyPU,cost:cost,hasPU:hasPU});
  }).sort(function(a,b){return b.cost-a.cost});

  var totalCost=forecast.reduce(function(s,f){return s+f.cost},0);

  // Group by supplier or category
  var grouped={};
  forecast.forEach(function(item){
    var key=groupBy==="supplier"?(item.sup||"none"):item.cat;
    if(!grouped[key]) grouped[key]=[];
    grouped[key].push(item);
  });

  return React.createElement("div",{className:"au"},
    React.createElement("div",{style:{marginBottom:18}},
      React.createElement("h2",{style:{fontWeight:900,fontSize:22,letterSpacing:-.5,marginBottom:4}},"Forecast de compras"),
      React.createElement("div",{style:{fontSize:12,color:"#999"}},"Proyección basada en ventas × recetas − inventario actual")
    ),

    // Controls
    React.createElement("div",{style:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16,alignItems:"center"}},
      React.createElement(Chip,{active:period==="weekly",onClick:function(){setPeriod("weekly")},ac:pl.ac},"Semanal"),
      React.createElement(Chip,{active:period==="monthly",onClick:function(){setPeriod("monthly")},ac:pl.ac},"Mensual"),
      React.createElement("div",{style:{width:1,height:20,background:"#eee"}}),
      React.createElement(Chip,{active:groupBy==="product",onClick:function(){setGroupBy("product")},ac:pl.ac},"Por producto"),
      React.createElement(Chip,{active:groupBy==="supplier",onClick:function(){setGroupBy("supplier")},ac:pl.ac},"Por proveedor"),
      React.createElement(Chip,{active:groupBy==="category",onClick:function(){setGroupBy("category")},ac:pl.ac},"Por categoría"),
      React.createElement("div",{style:{width:1,height:20,background:"#eee"}}),
      React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6}},
        React.createElement("span",{style:{fontSize:11,color:"#888"}},"Factor ajuste:"),
        React.createElement("input",{type:"range",min:"0.5",max:"2.5",step:"0.1",value:factor,onChange:function(e){setFactor(parseFloat(e.target.value))},style:{width:100,accentColor:pl.ac}}),
        React.createElement("span",{style:{fontSize:12,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:pl.ac}},"×",factor.toFixed(1))
      )
    ),

    // Status
    !latestSales&&React.createElement("div",{style:{background:"#FFF5F5",borderRadius:14,padding:"20px",border:"1px solid #FFD5D5",marginBottom:16}},
      React.createElement("div",{style:{fontWeight:600,fontSize:13,color:"#D63031",marginBottom:4}},"⚠ Sin datos de venta"),
      React.createElement("div",{style:{fontSize:12,color:"#888"}},"Importá ventas semanales en la sección Datos para que el forecast funcione. Sin ventas, el sistema no puede calcular cuánto producir ni cuánto comprar.")
    ),
    !coRecipes.length&&React.createElement("div",{style:{background:"#FFF5F5",borderRadius:14,padding:"20px",border:"1px solid #FFD5D5",marginBottom:16}},
      React.createElement("div",{style:{fontWeight:600,fontSize:13,color:"#D63031",marginBottom:4}},"⚠ Sin recetas"),
      React.createElement("div",{style:{fontSize:12,color:"#888"}},"Creá recetas en la sección Recetas con sus ingredientes y gramajes para conectar ventas → insumos.")
    ),

    // Summary KPIs
    forecast.length>0&&React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}},
      React.createElement("div",{style:{background:"#fff",borderRadius:14,padding:16,border:"1px solid #eee"}},
        React.createElement("div",{style:{fontSize:22,fontWeight:800,color:pl.ac,fontFamily:"'JetBrains Mono',monospace",letterSpacing:-.5}},fC(totalCost)),
        React.createElement("div",{style:{fontSize:11,color:"#999"}},"Costo total ",period==="weekly"?"semanal":"mensual")
      ),
      React.createElement("div",{style:{background:"#fff",borderRadius:14,padding:16,border:"1px solid #eee"}},
        React.createElement("div",{style:{fontSize:22,fontWeight:800,letterSpacing:-.5}},forecast.length),
        React.createElement("div",{style:{fontSize:11,color:"#999"}},"Insumos requeridos")
      ),
      React.createElement("div",{style:{background:"#fff",borderRadius:14,padding:16,border:"1px solid #eee"}},
        React.createElement("div",{style:{fontSize:22,fontWeight:800,letterSpacing:-.5}},latestSales?latestSales.items.length:0),
        React.createElement("div",{style:{fontSize:11,color:"#999"}},"Productos vendidos (base)")
      )
    ),

    // Forecast table
    forecast.length>0&&Object.entries(grouped).map(function(entry){
      var groupKey=entry[0];var items=entry[1];
      var sup=groupBy==="supplier"?suppliers.find(function(s){return s.id===groupKey}):null;
      var groupLabel=groupBy==="supplier"?(sup?sup.name:"Sin proveedor"):groupKey;
      var groupTotal=items.reduce(function(s,it){return s+it.cost},0);

      return React.createElement("div",{key:groupKey,style:{background:"#fff",borderRadius:14,border:"1px solid #eee",marginBottom:12,overflow:"hidden"}},
        React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"#fafafa",borderBottom:"1px solid #eee"}},
          React.createElement("span",{style:{fontWeight:700,fontSize:13}},groupLabel),
          React.createElement("span",{style:{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:13,color:pl.ac}},fC(groupTotal))
        ),
        items.map(function(item){
          return React.createElement("div",{key:item.pid,style:{display:"grid",gridTemplateColumns:"30px 2fr 80px 80px 80px 80px",gap:8,padding:"10px 16px",borderBottom:"1px solid #f5f5f5",alignItems:"center",fontSize:12}},
            React.createElement("span",{style:{fontSize:16}},item.img),
            React.createElement("div",null,
              React.createElement("div",{style:{fontWeight:500}},item.name),
              React.createElement("div",{style:{fontSize:10,color:"#bbb"}},item.recipes.join(", "))
            ),
            React.createElement("div",{style:{textAlign:"right",color:"#888"}},
              React.createElement("div",{style:{fontSize:10,color:"#bbb"}},"Necesita"),
              React.createElement("div",{style:{fontFamily:"'JetBrains Mono',monospace"}},Math.round(item.needKg*10)/10," ",item.unit)
            ),
            React.createElement("div",{style:{textAlign:"right",color:"#888"}},
              React.createElement("div",{style:{fontSize:10,color:"#bbb"}},"Stock"),
              React.createElement("div",{style:{fontFamily:"'JetBrains Mono',monospace",color:item.currentStock<=0?"#C0392B":"inherit"}},item.currentStock," ",item.unit)
            ),
            React.createElement("div",{style:{textAlign:"right"}},
              React.createElement("div",{style:{fontSize:10,color:"#bbb"}},"Comprar"),
              React.createElement("div",{style:{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:item.toBuy>0?pl.ac:"#10b981"}},
                item.hasPU?(item.toBuyPU+" "+item.pUnit):(Math.round(item.toBuy*10)/10+" "+item.unit)
              )
            ),
            React.createElement("div",{style:{textAlign:"right"}},
              React.createElement("div",{style:{fontSize:10,color:"#bbb"}},"Costo"),
              React.createElement("div",{style:{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:pl.ac}},fC(item.cost))
            )
          );
        })
      );
    })
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════════════════════════ */
var NAV=[
  {id:"dashboard",label:"Resumen",icon:"◈"},
  {id:"comprar",label:"Comprar",icon:"🛒"},
  {id:"recipes",label:"Recetas",icon:"📖"},
  {id:"forecast",label:"Forecast",icon:"🎯"},
  {id:"datos",label:"Datos",icon:"📈"},
  {id:"orders",label:"Pedidos",icon:"📋"},
  {id:"suppliers",label:"Proveedores",icon:"🏢"},
  {id:"gastos",label:"Gastos",icon:"📊"},
];

export default function App(){
  var _co=useState("mf");var co=_co[0];var setCo=_co[1];
  var _tab=useState("dashboard");var tab=_tab[0];var setTab=_tab[1];
  var _cart=useState({});var cart=_cart[0];var setCart=_cart[1];
  var _cartOpen=useState(false);var cartOpen=_cartOpen[0];var setCartOpen=_cartOpen[1];
  var _stkM=useState(null);var stkM=_stkM[0];var setStkM=_stkM[1];
  var _prdF=useState(null);var prdF=_prdF[0];var setPrdF=_prdF[1];

  var _products=useLs("ss5_prod",S_PROD);var products=_products[0];var setProducts=_products[1];
  var _suppliers=useLs("ss5_sup",S_SUP);var suppliers=_suppliers[0];var setSuppliers=_suppliers[1];
  var _prices=useLs("ss5_pr",S_PRICES);var prices=_prices[0];var setPrices=_prices[1];
  var _stock=useLs("ss5_stk",S_STK);var stock=_stock[0];var setStock=_stock[1];
  var _orders=useLs("ss5_ord",[]);var orders=_orders[0];var setOrders=_orders[1];
  var _events=useLs("ss5_ev",S_EVENTS);var events=_events[0];
  var _customCats=useLs("ss5_cats",DEF_CATS);var customCats=_customCats[0];var setCustomCats=_customCats[1];
  var _recipes=useLs("ss5_recipes",[]);var recipes=_recipes[0];var setRecipes=_recipes[1];
  var _sales=useLs("ss5_sales",[]);var sales=_sales[0];var setSales=_sales[1];
  var _inventories=useLs("ss5_inv",[]);var inventories=_inventories[0];var setInventories=_inventories[1];

  function addCategory(newCat){
    setCustomCats(function(prev){
      var out=Object.assign({},prev);
      var arr=(out[co]||[]).slice();
      if(arr.indexOf(newCat)<0) arr.push(newCat);
      out[co]=arr;
      return out;
    });
  }

  var pl=PAL[co];
  var cartCount=Object.values(cart).reduce(function(s,q){return s+q},0);
  var alertCount=products.filter(function(p){if(p.co!==co)return false;var s=gStk(stock,p.id);var st=sSt(s,p.wMin,p.cMin);return st==="low"||st==="crit"}).length;

  function addToCart(pid,delta){
    setCart(function(prev){var n=Object.assign({},prev);n[pid]=Math.max(0,(n[pid]||0)+delta);if(n[pid]===0)delete n[pid];return n});
  }
  function saveOrder(data){setOrders(function(prev){return prev.concat([Object.assign({},data,{id:uid()})])})}
  function saveProduct(p){
    if(products.find(function(x){return x.id===p.id})){setProducts(function(prev){return prev.map(function(x){return x.id===p.id?p:x})})}
    else{setProducts(function(prev){return prev.concat([p])})}
  }

  var shared={co:co,products:products,stock:stock,prices:prices,suppliers:suppliers,orders:orders,events:events,pal:pl,cats:customCats[co]||[],addCategory:addCategory,recipes:recipes,setRecipes:setRecipes,sales:sales,setSales:setSales,inventories:inventories,setInventories:setInventories};

  return React.createElement(React.Fragment,null,
    React.createElement(GlobalStyles),
    React.createElement("style",null,":root{--ac:"+pl.ac+";--ac2:"+pl.ac2+";--abg:"+pl.bg+";--amid:"+pl.mid+"}"),

    React.createElement("div",{style:{minHeight:"100vh",display:"flex"}},

      // SIDEBAR
      React.createElement("aside",{style:{width:220,background:"#0d0d0d",display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",flexShrink:0}},
        React.createElement("div",{style:{padding:"22px 18px 16px",borderBottom:"1px solid #ffffff10"}},
          React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:16}},
            React.createElement("div",{style:{width:30,height:30,borderRadius:9,background:pl.ac,display:"flex",alignItems:"center",justifyContent:"center"}},React.createElement("span",{style:{fontWeight:900,fontSize:14,color:"#fff"}},"S")),
            React.createElement("span",{style:{fontWeight:800,fontSize:16,color:"#fff",letterSpacing:-.3}},"stStock")
          ),
          React.createElement("div",{style:{background:"#ffffff10",borderRadius:10,padding:3,display:"flex",gap:2}},
            Object.keys(PAL).map(function(k){return React.createElement("button",{key:k,onClick:function(){setCo(k);setTab("dashboard");setCart({})},style:{flex:1,padding:"7px 0",borderRadius:8,fontSize:12,fontWeight:700,background:co===k?PAL[k].ac:"transparent",color:co===k?"#fff":"#ffffff90",border:"none",cursor:"pointer"}},k==="mf"?"MAFIA":"STREET")})
          )
        ),
        React.createElement("nav",{style:{padding:"12px 10px",flex:1}},
          NAV.map(function(item){
            var active=tab===item.id;var badge=item.id==="comprar"?alertCount:0;
            return React.createElement("button",{key:item.id,onClick:function(){setTab(item.id)},style:{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"none",fontSize:13,fontWeight:active?600:400,background:active?"#ffffff18":"transparent",color:active?"#fff":"#ffffffbb",textAlign:"left",marginBottom:2,cursor:"pointer"}},
              React.createElement("span",{style:{fontSize:14}},item.icon),
              React.createElement("span",{style:{flex:1}},item.label),
              badge>0&&React.createElement("span",{style:{background:pl.ac,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:8}},badge)
            );
          })
        ),
        cartCount>0&&React.createElement("div",{style:{padding:"12px 18px",borderTop:"1px solid #ffffff10"}},
          React.createElement("button",{onClick:function(){setCartOpen(true)},style:{width:"100%",padding:12,borderRadius:12,background:pl.ac,border:"none",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:14,fontWeight:700}},"🛒 ",cartCount," productos")
        ),
        React.createElement("div",{style:{padding:"14px 18px",borderTop:"1px solid #ffffff10"}},
          React.createElement("div",{style:{fontSize:10,color:"#ffffff55",fontFamily:"'JetBrains Mono',monospace"}},new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"2-digit",year:"numeric"}))
        )
      ),

      // MAIN
      React.createElement("main",{style:{flex:1,overflow:"auto",minHeight:"100vh"}},
        React.createElement("div",{style:{maxWidth:940,margin:"0 auto",padding:"28px 24px"}},
          tab==="dashboard"&&React.createElement(Dashboard,shared),
          tab==="comprar"&&React.createElement(Comprar,Object.assign({},shared,{cart:cart,setCart:setCart,openProductForm:setPrdF,openStockModal:setStkM})),
          tab==="recipes"&&React.createElement(RecipesView,shared),
          tab==="forecast"&&React.createElement(ForecastView,shared),
          tab==="datos"&&React.createElement(SalesView,shared),
          tab==="orders"&&React.createElement(OrdersView,Object.assign({},shared,{setOrders:setOrders})),
          tab==="suppliers"&&React.createElement(SuppliersView,{suppliers:suppliers,setSuppliers:setSuppliers,co:co,pal:pl}),
          tab==="gastos"&&React.createElement(GastosView,shared)
        )
      )
    ),

    cartOpen&&React.createElement(CartDrawer,{cart:cart,products:products,prices:prices,suppliers:suppliers,onClose:function(){setCartOpen(false)},onSave:saveOrder,onClear:function(){setCart({})},onQty:addToCart,ac:pl.ac,acbg:pl.bg,co:co}),
    stkM&&React.createElement(StockModal,{product:stkM,onClose:function(){setStkM(null)},onSave:function(entry){setStock(function(prev){return prev.concat([entry])})}}),
    prdF&&React.createElement(ProductForm,{product:prdF,onSave:saveProduct,onClose:function(){setPrdF(null)},suppliers:suppliers,co:co,pal:pl,cats:customCats[co]||[]})
  );
}
