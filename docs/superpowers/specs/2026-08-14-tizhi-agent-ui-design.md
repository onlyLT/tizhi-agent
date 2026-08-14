# 体制.agent 二期：品牌 UI 插件（tizhi-agent-ui）设计文档

日期：2026-08-14 ｜ 状态：已批准 ｜ 范围：情境入口面板 + 机关大院皮肤

## 目标

dsh Web UI 的树外双面插件 `tizhi-agent-ui`：

1. **情境入口面板**：空白会话上方的品牌面板，六张处境卡一键切「体制模式」preset 并预填开场模板；
2. **机关大院皮肤**：藏蓝 + 米白纸感 + 朱红点缀的 token 叠层，设置里一键开关。

## 关键技术决策（来自 0.1.0-rc.5 源码调研）

| 决策 | 依据 |
|---|---|
| 面板落 `conversation.input.dock` slot（list, session scope） | 官方指定"输入框上方整行"位；hero 与 active 都渲染；标准 props 自带 `sessionId`/`useSessions`/`inputActions.setDraft` |
| 仅空白会话显示：`useSessions(s => s.byId[sessionId]?.blank)` | 开聊后自动隐去；完全无会话时 dock 本就不渲染（zone undefined），可接受 |
| 切 preset 走 `api.agentPresets.select({sessionId, agentPreset:'tizhi'})` + `ctx.sessions.noteAgentPreset` | ui-agent-preset 同款链路；仅 blank 会话允许，否则 `agent-preset-locked` |
| 已开聊时先 `ctx.workspaces.startSession()` 起新空白会话，落地后再 select + setDraft | startSession 含 open；订阅 `sessions.list` 等 current 变为目标 blank 会话 |
| 预填不自动发送 | 摸底主动权在人；模板留「……」给用户补细节 |
| preset 缺失降级：`api.agentPresets.list({})` 查 roster，无 `tizhi` 则卡片变安装提示 | 不静默坏掉 |
| 皮肤走 `ctx.theme.overrideTokens('tizhi-agent-ui', tokens)`（每 token 给 {light,dark} 对） | 第三方主题不进内置 Appearance 行、非内置 id 不持久化——register+setTheme 不可用 |
| 皮肤开关注册 `settings.general.item` 一行；localStorage 持久化 | 树外插件无法暴露 settings namespace（host 侧 allowlist 硬编码），只有 client store persist 通道 |
| `dsh.client.immediately: true` | 刷新后首帧应用皮肤不闪白 |
| CSS 用内联 `<style>` 字符串注入（带清理），不用 CSS Modules | 免复刻官方 lightningcss 打包插件，降低构建复杂度 |
| 构建仿 turtle-ui：`prepare` 只跑 tsdown 转译，不做全量类型检查 | 官方文档点名的树外范例做法 |
| 文案硬编码中文，不接 ctx.locale | 品牌受众中文优先，v1 从简 |

## 打包契约（必须逐字复刻，错则运行期 throw）

- `lib/index.js`：node 半边 ESM，`export function apply() {}`（只为进 Loader roster）；
- `lib/client.js`：浏览器 CJS 闭包，banner `window.__ModuleLoader__.load({ id: "tizhi-agent-ui", factory: (require) => {`、footer `return module.exports; } });`、intro `var module = { exports: {} }; var exports = module.exports;`；
- externals 白名单 = react / react/jsx-runtime / react-dom / react-dom/client / @deepseek-ai/cordis / dsh-client-ui-slots / dsh-client-web-react / dsh-client-ui-primitives / dsh-client-ui-attachment / dsh-client-schema-form / dsh-client-runtime/client，其余一律内联；
- `package.json`：`dsh.bundle.patch: ./cordis.patch.yml` + `dsh.client { platform: 'web', immediately: true }` + `exports['./client']`；
- `cordis.patch.yml`：`- insert: [{ id: tizhi-ui, name: tizhi-agent-ui }]`；
- client 模块导出 `export const inject = ['slots','theme','sessions','workspaces','connection']`（service 名，决定 fiber 等待）。

## 六张处境卡与开场模板

| 卡 | 预填模板 |
|---|---|
| 领导关系 | 领导跟我说了句「……」，我拿不准他真实意思，帮我拆拆。 |
| 同事关系 | 同事这边有点为难：……，我该怎么接才不吃亏也不伤和气？ |
| 做事办事 | 接了个活：……，帮我理理先对齐什么、怎么干不跑偏。 |
| 自我保护 | 这事让我有点不安：……，帮我看看坑在哪、怎么留痕自保。 |
| 成长晋升 | 想聊聊进步的事：我的情况是……，下一步怎么走稳？ |
| 心态调适 | 最近有点憋屈：……，帮我顺顺气、也帮我看看这个局。 |

面板抬头文案延续品牌幽默：主标题「大前辈在线」，副行「先摸清情况再开口 · 编制恕不附赠」。

## 机关大院皮肤 token（叠层，~12 个）

亮色：宣纸白底（bg-base #faf8f2 / layer 逐级近白）、侧栏米白 #f3efe4、藏蓝主色 #24406e、朱红点缀 hover-accent（低饱和 #a8453a 系）；暗色：深夜大院 —— 深藏蓝底 #10182 6 系、主色调亮 #7d9bd4、朱红相应调亮。只覆盖 alias/specific 精选 token，不碰布局与字体。

## 仓库布局与分发

```
packages/ui/
├─ package.json  ├─ cordis.patch.yml  ├─ tsdown.config.ts
└─ src/  index.ts（node）  client/（index.ts + BrandPanel.tsx + skin.ts + SkinRow.tsx + styles.ts）
```

分发：① `pnpm pack` tarball → `dsh plugin --profile web add ./tizhi-agent-ui-*.tgz`（主推）；② git 直装（README 说明 allowBuilds 放行）；npm 发包留作后续（需用户 npm 登录）。

## 验收

1. 构建产物齐全（lib/index.js + lib/client.js + client.js.map）；tarball 装入 web profile，`--dump-config` 可见 `tizhi-ui` 行；
2. 浏览器实测：空白会话见面板 → 点「领导关系」卡 → preset 徽章变「体制模式」+ 输入框现模板；开聊后面板隐去；
3. 皮肤开关：开 → token 生效（亮/暗都对）；关 → 还原；刷新 → 状态保持、首帧不闪；
4. 卸载插件（dsh plugin remove）后界面回原样。

## 风险

- rc 版 API 漂移：全部 API 以安装后的 npm 包 `.d.ts` 为准复核后再写实现；
- `blank` 字段等类型细节以实际 `.d.ts` 为准，实现阶段修正；
- 权限分类器可能拦 `dsh plugin add`，届时由用户执行一条命令。
