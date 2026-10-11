import { useDemoLoop } from "../hooks/useDemoLoop";

export interface AnimatedLeetCodeProps { readonly compact?: boolean }

export function AnimatedLeetCode({ compact = false }: Readonly<AnimatedLeetCodeProps>) {
  const phase = useDemoLoop();
  return <div className={`hero-visual live-demo ${phase} ${compact ? "compact" : ""}`} aria-label="Animated CodeCarnival LeetCode demo">
    <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
    <div className="browser-shell">
      <div className="browser-bar"><i/><i/><i/><span>leetcode.com/problems/two-sum</span><b>{phase === "accepted" || phase === "celebrating" ? "Accepted ✓" : "● Live session"}</b></div>
      <div className="browser-body">
        <div className="problem-pane"><div className="pane-tabs"><b>Description</b><span>Editorial</span><span>Solutions</span></div><small>01 · ARRAY / HASH TABLE</small><h3>Two Sum</h3><div className="difficulty">Easy</div><p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers that add up to target.</p><div className="constraint"><b>Example 1</b><span>Input: nums = [2,7,11,15], target = 9</span><span>Output: [0,1]</span></div><div className="problem-foot"><span>✓ 49.2% Accepted</span><span>♡ 58.4K</span></div></div>
        <div className="code-pane"><div className="code-head"><span>Code</span><div><b>C++</b><b>Auto</b><b>⋯</b></div></div><pre className="editor-code"><code><span className="ln">1</span><span><em>class</em> Solution {`{`}</span>{`\n`}<span className="ln">2</span><span><em>public</em>:</span>{`\n`}<span className="ln">3</span><span>  vector&lt;<em>int</em>&gt; <strong>twoSum</strong>(vector&lt;<em>int</em>&gt;&amp; nums, <em>int</em> target) {`{`}</span>{`\n`}<span className="ln">4</span><span>    unordered_map&lt;<em>int</em>, <em>int</em>&gt; seen;</span>{`\n`}<span className="ln">5</span><span>    <em>for</em> (<em>int</em> i = 0; i &lt; nums.size(); ++i) {`{`}</span>{`\n`}<span className="ln">6</span><span>      <em>int</em> need = target - nums[i];</span>{`\n`}<span className="ln">7</span><span>      <em>if</em> (seen.count(need))</span>{`\n`}<span className="ln">8</span><span className="code-typed">        <em>return</em> {`{`}seen[need], i{`}`};</span><span className="code-caret">|</span>{`\n`}<span className="ln">9</span><span>      seen[nums[i]] = i;</span>{`\n`}<span className="ln">10</span><span>    {`}`}</span>{`\n`}<span className="ln">11</span><span>    <em>return</em> {`{}`};</span>{`\n`}<span className="ln">12</span><span>  {`}`}</span></code></pre><div className="editor-footer"><span>{phase === "accepted" || phase === "celebrating" ? "✓ 57 / 57 testcases passed" : "Testcase · nums [2,7,11,15]"}</span><button>{phase === "submitting" ? "Running…" : phase === "accepted" || phase === "celebrating" ? "Accepted ✓" : "Submit"}</button></div></div>
      </div>
      <div className="demo-progress"><i/></div>
    </div>
    <div className="floating-badge badge-one">✦ <span><b>Midnight Ink</b>Live theme</span></div>
    <div className="floating-badge badge-two">🔥 <span><b>12 day streak</b>Keep shipping</span></div>
    <div className="demo-celebration"><i>✦</i><span>CODECARNIVAL · MIDNIGHT INK</span><strong>FLOW UNLOCKED</strong><small>ACCEPTED · 57 / 57 TESTS PASSED · 4 MS</small></div>
  </div>;
}
