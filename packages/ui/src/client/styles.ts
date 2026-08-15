/**
 * 面板与设置行样式。全部取色自 --dsw-alias-* / --dsw-specific-* 语义 token，
 * 皮肤开关只改 token 值，这里无须感知明暗。
 */
export const PANEL_CSS = `
.tz-panel {
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1);
  padding: 14px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.tz-panel-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.tz-panel-title {
  font-family: "Songti SC", "STSong", SimSun, serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: .08em;
  color: var(--dsw-alias-brand-text);
}
.tz-panel-sub {
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary);
}
.tz-panel-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
@media (max-width: 720px) {
  .tz-panel-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
.tz-card {
  text-align: left;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-base);
  padding: 9px 11px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 3px;
  transition: border-color .15s ease, background .15s ease;
}
.tz-card:hover {
  border-color: var(--dsw-alias-brand-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.tz-card:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}
.tz-card-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}
.tz-card-title::before {
  content: "";
  display: inline-block;
  width: 3px;
  height: 11px;
  margin-right: 6px;
  border-radius: 1px;
  background: var(--dsw-alias-brand-primary);
  vertical-align: -1px;
}
.tz-card-hint {
  font-size: 11px;
  color: var(--dsw-alias-label-caption);
}
.tz-panel-note {
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
}
.tz-panel-note b { color: var(--dsw-alias-brand-text); font-weight: 600; }

/* ── 品牌替换（仅皮肤开启时，body[data-tizhi-skin] 把关）────────────────
   选择器锚定 CSS Modules 的稳定 local 名（[hash]_[local]），dsh 升级改版式
   时可能失效——失效的表现是回到 DeepSeek 原品牌，无害降级。 */
/* 侧栏 wordmark 魔改：只留鲸鱼（第 10 条 path，viewBox 左端 0–23px），
   染朱砂红；负右边距吞掉字标留下的空白，后接宋体「体制 · agent」。 */
body[data-tizhi-skin] [class*="_logoRow"] [class*="_brand"] {
  display: flex;
  align-items: center;
  gap: 9px;
}
body[data-tizhi-skin] [class*="_logoRow"] svg {
  display: block;
  flex: none;
  margin-right: -155px;
  color: #b03a2e;
}
/* wordmark 结构：9 条字母 path + g(鲸鱼) + rect(徽章底) + g(徽章字) + defs。
   全部隐藏后只放出第一个 g —— 鲸鱼。 */
body[data-tizhi-skin] [class*="_logoRow"] svg > * { display: none; }
body[data-tizhi-skin] [class*="_logoRow"] svg > g:first-of-type { display: inline; }
body[data-tizhi-skin] [class*="_logoRow"] [class*="_brand"]::after {
  content: "体制 · agent";
  font-family: "Songti SC", "STSong", SimSun, serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: .14em;
  color: var(--dsw-alias-brand-text);
  white-space: nowrap;
}
/* 首屏鲸鱼：不再隐藏，朱砂红 + 盖章式微倾。 */
body[data-tizhi-skin] [class*="_fish"] {
  color: #b03a2e;
  transform: rotate(-4deg);
}
/* 深色（深夜大院）下朱砂上提一档保持可读。 */
body[data-tizhi-skin][data-ds-dark-theme] [class*="_logoRow"] svg,
body[data-tizhi-skin][data-ds-dark-theme] [class*="_fish"] {
  color: #d0685a;
}
body[data-tizhi-skin] [class*="_headlineText"] {
  font-size: 0;
  letter-spacing: 0;
}
body[data-tizhi-skin] [class*="_headlineText"]::before {
  content: "大院之内，自有章法";
  font-family: "Songti SC", "STSong", SimSun, serif;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: .1em;
  color: var(--dsw-alias-brand-text);
}

.tz-settings-card {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  text-align: left;
  padding: 14px 16px;
  border: 1.5px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1);
  cursor: pointer;
  transition: border-color .18s ease, background .18s ease, box-shadow .18s ease;
}
.tz-settings-card:hover { border-color: var(--dsw-alias-brand-primary); }
.tz-settings-card:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 2px;
}
.tz-settings-card[data-on="true"] {
  border-color: var(--dsw-alias-brand-primary);
  box-shadow: 0 0 0 3px var(--dsw-alias-interactive-bg-hover-accent);
}
.tz-seal {
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: #b03a2e;
  color: #fff8ef;
  display: grid;
  place-items: center;
  font-family: "Songti SC", "STSong", SimSun, serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: .06em;
  line-height: 1.1;
  transform: rotate(-3deg);
  box-shadow: inset 0 0 0 1.5px rgba(255, 248, 239, .55);
  filter: grayscale(1) opacity(.45);
  transition: filter .18s ease, transform .18s ease;
  user-select: none;
}
.tz-settings-card[data-on="true"] .tz-seal,
.tz-settings-card:hover .tz-seal {
  filter: none;
  transform: rotate(-3deg) scale(1.04);
}
.tz-settings-meta { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1; }
.tz-settings-label {
  font-family: "Songti SC", "STSong", SimSun, serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: .05em;
  color: var(--dsw-alias-label-primary);
}
.tz-settings-label b {
  color: var(--dsw-alias-brand-text);
  font-weight: 700;
}
.tz-settings-desc { font-size: 12px; color: var(--dsw-alias-label-tertiary); }
.tz-settings-state {
  flex: none;
  display: flex;
  align-items: center;
  gap: 10px;
}
.tz-settings-state-word {
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary);
  transition: color .18s ease;
}
.tz-settings-card[data-on="true"] .tz-settings-state-word {
  color: var(--dsw-alias-brand-text);
  font-weight: 600;
}
.tz-switch {
  flex: none;
  width: 46px;
  height: 26px;
  border-radius: 13px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-2);
  position: relative;
  pointer-events: none;
  transition: background .18s ease, border-color .18s ease;
}
.tz-switch::after {
  content: "";
  position: absolute;
  top: 2px; left: 2px;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--dsw-alias-label-tertiary);
  transition: transform .18s ease, background .18s ease;
}
.tz-switch[data-on="true"] {
  background: var(--dsw-alias-brand-primary);
  border-color: var(--dsw-alias-brand-primary);
}
.tz-switch[data-on="true"]::after {
  transform: translateX(20px);
  background: #fff;
}
`
