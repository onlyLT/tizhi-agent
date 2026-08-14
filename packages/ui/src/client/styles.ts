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
body[data-tizhi-skin] [class*="_logoRow"] svg { display: none; }
body[data-tizhi-skin] [class*="_logoRow"] [class*="_brand"]::before {
  content: "体制 · agent";
  font-family: "Songti SC", "STSong", SimSun, serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: .14em;
  color: var(--dsw-alias-brand-text);
}
body[data-tizhi-skin] [class*="_fishHitbox"] { display: none; }
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

.tz-settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.tz-settings-meta { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.tz-settings-label { font-size: 13px; font-weight: 500; color: var(--dsw-alias-label-primary); }
.tz-settings-desc { font-size: 12px; color: var(--dsw-alias-label-tertiary); }
.tz-switch {
  flex: none;
  width: 36px;
  height: 20px;
  border-radius: 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-2);
  position: relative;
  cursor: pointer;
  transition: background .15s ease, border-color .15s ease;
}
.tz-switch::after {
  content: "";
  position: absolute;
  top: 2px; left: 2px;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: var(--dsw-alias-label-tertiary);
  transition: transform .15s ease, background .15s ease;
}
.tz-switch[data-on="true"] {
  background: var(--dsw-alias-brand-primary);
  border-color: var(--dsw-alias-brand-primary);
}
.tz-switch[data-on="true"]::after {
  transform: translateX(16px);
  background: var(--dsw-alias-bg-base);
}
`
