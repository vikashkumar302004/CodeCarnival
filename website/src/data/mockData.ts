export interface Theme {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly title: string;
  readonly note: string;
  readonly image: string;
  readonly colors: readonly [string, string, string];
}

export const themes: readonly Theme[] = [
  { id:"midnight-ink",name:"Midnight Ink",icon:"✦",title:"FLOW UNLOCKED",note:"Deep focus · Zero noise",image:"radial-gradient(circle at 80% 12%,#283f73,transparent 32%),linear-gradient(145deg,#070b16,#10182b)",colors:["#7aa2ff","#b7c9ff","#070b16"] },
  { id:"mono-paper",name:"Mono Paper",icon:"▤",title:"SOLVED CLEAN",note:"Maximum readability",image:"linear-gradient(145deg,#15171b,#2a2e35)",colors:["#f1f3f5","#aeb6c2","#15171b"] },
  { id:"cyber-ronin",name:"Cyber Ronin",icon:"刀",title:"PERFECT STRIKE",note:"Precision under pressure",image:"linear-gradient(#06040e55,#06040ebb),url('/assets/cyber-ronin-shrine.png')",colors:["#ff365f","#a85cff","#0c0915"] },
  { id:"lofi-rain",name:"Lo-Fi Rain",icon:"☂",title:"NIGHT CLEARED",note:"Slow night · Steady progress",image:"linear-gradient(#04091444,#040914aa),url('/assets/lofi-rain-loft.png')",colors:["#83b7ff","#d3b6ff","#0a1019"] },
  { id:"volt-ranger",name:"Volt Ranger",icon:"⚡",title:"THREAT CLEARED",note:"Lock on · Fire · Solve",image:"linear-gradient(#01080666,#010806bb),url('/assets/volt-city-v2.png')",colors:["#32f5b0","#7dffe0","#03110d"] },
  { id:"shadow-hacker",name:"Shadow Hacker",icon:"◈",title:"BUGS ELIMINATED",note:"Breach · Slash · Vanish",image:"linear-gradient(#02030c55,#02030cbb),url('/assets/null-district.png')",colors:["#42dcff","#bd42ff","#050510"] },
  { id:"sakura-sanctuary",name:"Sakura Sanctuary",icon:"🌸",title:"A QUIET VICTORY",note:"Breathe · Focus · Bloom",image:"linear-gradient(#12091855,#120918aa),url('/assets/sakura-sanctuary.png')",colors:["#f39ab3","#ffd4a3","#211020"] },
  { id:"moonlit-last-train",name:"Moonlit Last Train",icon:"🌙",title:"NEXT STOP: SUCCESS",note:"One more stop forward",image:"linear-gradient(#030a1844,#030a18aa),url('/assets/moonlit-station.png')",colors:["#73a9dc","#ffc36f","#071426"] },
  { id:"floating-sky-library",name:"Floating Sky Library",icon:"📖",title:"ANOTHER CHAPTER COMPLETE",note:"Think beyond the horizon",image:"linear-gradient(#0a142d44,#0a142daa),url('/assets/floating-sky-library.png')",colors:["#8eb9e8","#ffd28f","#102347"] },
  { id:"festival-rooftop",name:"Summer Festival Rooftop",icon:"🎆",title:"LIGHT UP THE NIGHT",note:"One more spark",image:"linear-gradient(#050d2344,#050d23aa),url('/assets/festival-rooftop.png')",colors:["#ff765d","#ffd172","#081631"] }
];

export const installSteps = [
  ["Download and unzip","Get the latest CodeCarnival package."],
  ["Open Chrome Extensions","Visit chrome://extensions and enable Developer mode."],
  ["Load unpacked","Select the unzipped extension folder."],
  ["Start solving","Open LeetCode and choose your first world."]
] as const;
