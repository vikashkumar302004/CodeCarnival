import { useState } from "react";
import type { Theme } from "../data/mockData";

export interface ThemeGalleryProps { readonly themes: readonly Theme[]; readonly active: Theme; readonly onSelect: (theme: Theme) => void; readonly onCelebrate: () => void }

export function ThemeGallery({ themes, active, onSelect, onCelebrate }: Readonly<ThemeGalleryProps>) {
  const [videoStarted, setVideoStarted] = useState(false);
  return <section id="themes" className="themes-section">
    <div className="section-heading"><div><span className="kicker">CHOOSE YOUR UNIVERSE</span><h2>{themes.length} WORLDS.<br/>ZERO VISUAL NOISE.</h2></div><p>{themes.length} distinctive worlds keep every line readable while changing the atmosphere, interface accents and victory choreography.</p></div>
    <div className="theme-stage"><div className="worlds-showcase"><div className="showcase-bar"><i/><i/><i/><span>CODECARNIVAL · PRODUCT TOUR</span><b>CLICK TO LOAD · ZERO INITIAL VIDEO DATA</b></div>{videoStarted?<video src="/media/code-carnival-worlds.mp4" controls autoPlay playsInline preload="auto"/>:<button className="showcase-loader" onClick={()=>setVideoStarted(true)}><span>▶</span><b>Play the real extension showcase</b><small>The recording loads only after this click</small></button>}<div className="showcase-note"><span><i/> RECORDED IN THE REAL EXTENSION</span><b>{videoStarted?"Now playing the product tour":"Video is not loaded yet"}</b></div></div>
      <div className="current-choice"><span>AVAILABLE CHOICES</span><div><i>{active.icon}</i><p><b>{active.name}</b><small>{active.note}</small></p></div><button onClick={onCelebrate}>Preview this win <b>↗</b></button></div>
      <div className="theme-tabs" role="tablist">{themes.map(theme=><button key={theme.id} role="tab" aria-selected={active.id===theme.id} onClick={()=>onSelect(theme)}><i>{theme.icon}</i><span>{theme.name}</span></button>)}</div>
    </div>
  </section>;
}
