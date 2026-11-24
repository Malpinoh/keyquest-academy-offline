import { cn } from "@/lib/utils";

type KeySpec = { label: string; value: string; width?: number; shift?: string };
const k = (label: string, value = label.toLowerCase(), width = 1, shift?: string): KeySpec => ({label,value,width,shift});
const rows: KeySpec[][] = [
  ["Esc","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","PrtSc","Del"].map((v,i)=>k(v,v,i===0||i>12?1.25:1)),
  [k("`","`"),...("1234567890".split("").map((v,i)=>k(v,v,1,"!@#$%^&*()"[i]))),k("-","-"),k("=","="),k("Backspace","Backspace",2)],
  [k("Tab","Tab",1.5),...("qwertyuiop".split("").map(v=>k(v))),k("[","["),k("]","]"),k("\\","\\",1.5)],
  [k("Caps","CapsLock",1.8),...("asdfghjkl".split("").map(v=>k(v))),k(";",";"),k("'","'"),k("Enter","Enter",1.8)],
  [k("Shift","ShiftLeft",2.25),...("zxcvbnm".split("").map(v=>k(v))),k(",",","),k(".", "."),k("/","/"),k("Shift","ShiftRight",2.25)],
  [k("Ctrl","ControlLeft",1.2),k("Fn","Fn"),k("Win","Meta"),k("Alt","Alt",1.1),k("SPACE"," ",5.7),k("Alt","AltRight",1.1),k("Ctrl","ControlRight",1.2)]
];
const finger = (v:string) => {
 const c=v.toLowerCase();
 if("qaz1".includes(c)) return "pinky"; if("wsx2".includes(c)) return "ring";
 if("edc34".includes(c)) return "middle"; if("rfvtgb456".includes(c)) return "index";
 if("yhnujm678".includes(c)) return "index"; if("ik,9".includes(c)) return "middle";
 if("ol.0".includes(c)) return "ring"; if("p;/-=[]'".includes(c)) return "pinky";
 return "";
};
const fingerColor = (v:string) => {
 const role=finger(v);
 return role==="pinky" ? "#f2c46d" : role==="ring" ? "#e9a5a8" : role==="middle" ? "#b8a7d9" : role==="index" ? "#9bbf8a" : "#eee9d6";
};
export function GuidedKeyboardStudio({next=null,className}:{next?:string|null;className?:string}) {
 const active=(next??"").toLowerCase();
 return <section className={cn("w-full",className)} aria-label="Full-size QWERTY keyboard">
  <div className="w-full min-w-0 rounded-xl border-2 border-[#8b8b75] bg-gradient-to-b from-[#e4e0cc] to-[#c9c6b4] p-1.5 shadow-[inset_0_1px_0_#fff,0_5px_12px_rgba(37,45,39,.2)] sm:p-2">
   <div className="mb-3 flex items-center justify-between px-1 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#46513e]"><span>KeyQuest • Standard QWERTY</span><span className="text-[#657b4c]">Live key guide</span></div>
   <div className="w-full min-w-0 rounded-lg border border-[#777968] bg-[#a9a999] p-1 shadow-inner sm:p-1.5">
    <div className="w-full min-w-0 space-y-1 rounded-md bg-[#b9b8a8] p-1 sm:space-y-1.5 sm:p-1.5">
     {rows.map((row,ri)=><div key={ri} className="flex gap-1 sm:gap-1.5" style={{paddingLeft:ri===2?"2.5%":ri===3?"4.8%":ri===4?"7.2%":0}}>
      {row.map((item,ki)=>{
       const on=active!=="" && item.value.toLowerCase()===active;
       return <div key={ri+"-"+ki} title={finger(item.value)} className={cn(
        "relative flex h-[clamp(1.05rem,2.5vw,2.35rem)] min-w-0 flex-col items-center justify-center rounded-[4px] border border-[#aaa99d] border-b-[3px] border-r-[#929184] px-0 text-[#30372d] shadow-[0_1px_0_rgba(255,255,255,.9)_inset,0_2px_0_#77766b,0_3px_4px_rgba(0,0,0,.22)] transition-all duration-150 sm:rounded-[6px]",
        ri===0?"h-[clamp(.8rem,1.8vw,1.65rem)] text-[clamp(6px,.65vw,9px)]":"text-[clamp(7px,.85vw,12px)]",
        item.shift&&"pt-2 sm:pt-3",
        on&&"translate-y-[3px] border-[#9c8844] border-b-[1px] !bg-[#e4cd70] !text-[#283126] shadow-[inset_0_2px_5px_rgba(0,0,0,.18),0_0_12px_rgba(156,136,68,.45)] ring-2 ring-[#e4cd70]/70"
       )} style={{flex:item.width??1,minWidth:0,backgroundColor:on?undefined:fingerColor(item.value),backgroundImage:on?undefined:"linear-gradient(145deg,rgba(255,255,255,.72),rgba(255,255,255,.08) 48%,rgba(35,38,30,.10))"}}>
        {item.shift&&<span className="absolute left-1 top-0.5 text-[7px] font-normal text-[#5d5a4e] sm:text-[9px]">{item.shift}</span>}
        <span className="font-semibold">{item.label}</span>
        {["f","j"].includes(item.value)&&<span className="mt-0.5 h-[2px] w-3 rounded-full bg-slate-500"/>}
       </div>;
      })}
     </div>)}
    </div>
   </div>
   <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] font-semibold text-[#4c5545] sm:text-xs"><span>F and J have raised home-position markers</span><span>{active ? "Next key: "+(active===" "?"SPACE":active.toUpperCase()) : "Ready to practise"}</span></div>
  </div>
  <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] font-semibold text-[#515a48]"><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-[#f2c46d]"/>Pinky</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-[#e9a5a8]"/>Ring</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-[#b8a7d9]"/>Middle</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-[#9bbf8a]"/>Index</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-[#8fc5c0]"/>Thumb</span></div><p className="mt-2 text-center text-xs text-[#626a54]">A full-size QWERTY keyboard with no hands covering the keys. The highlighted key follows each exercise.</p>
 </section>;
}
