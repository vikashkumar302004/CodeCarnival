import type { CSSProperties } from "react";
import type { Theme } from "../data/mockData";

export interface ThemeGalleryProps { readonly themes: readonly Theme[]; readonly active: Theme; readonly onSelect: (theme: Theme) => void; readonly onCelebrate: () => void }

export function ThemeGallery({ themes, active, onSelect, onCelebrate }: Readonly<ThemeGalleryProps>) {
  const style = { "--primary":active.colors[0], "--secondary":active.colors[1], "--deep":active.colors[2], "--art":active.image } as CSSProperties;
  return <section id="themes" className="themes-section">
    <div className="section-heading"><div><span className="kicker">CHOOSE YOUR UNIVERSE</span><h2>{themes.length} WORLDS.<br/>ZERO VISUAL NOISE.</h2></div><p>{themes.length} distinctive worlds keep every line readable while changing the atmosphere, interface accents and victory choreography.</p></div>
    <div className="theme-stage"><div key={active.id} className="theme-preview cinematic-preview" style={style}><div className="theme-grid-glow"/><div className="cinematic-editor"><div className="cinematic-top"><i/><i/><i/><span>leetcode.com/problems/two-sum</span><b>LIVE LOOP · 6 SEC</b></div><div className="cinematic-workspace"><div><span>01 · ARRAY</span><strong>Two Sum</strong><p>Find two numbers that add up to target.</p><i/><i/><i/></div><pre><em>class</em> Solution {`{\n`}  <em>public</em>:{`\n`}    vector&lt;int&gt; twoSum(...) {`{\n`}      return {`{`}0, 1{`}`};{`\n`}    {`}`} {`\n`}{`}`};</pre></div></div><div className="cinema-shade"/><div className="energy-core"><i/><i/><i/><b>{active.icon}</b></div><div className="energy-sweep"/><div className="victory-shards">{Array.from({length:14},(_,index)=><i key={index} style={{"--i":index} as CSSProperties}/>)}</div><div className="inline-victory"><span>✦ {active.name} · CODECARNIVAL</span><h3>{active.title}</h3><p>ACCEPTED · 57 / 57 TESTS PASSED · 4 MS</p></div><div className="sequence-caption"><i/> PLAYING ORIGINAL VICTORY SEQUENCE</div><button className="replay-win" onClick={onCelebrate}>Open full-screen win <b>↗</b></button></div>
      <div className="theme-tabs" role="tablist">{themes.map(theme=><button key={theme.id} role="tab" aria-selected={active.id===theme.id} onClick={()=>onSelect(theme)}><i>{theme.icon}</i><span>{theme.name}</span></button>)}</div>
    </div>
  </section>;
}
