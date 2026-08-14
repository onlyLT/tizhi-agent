<div align="center">

# 体制 · agent

### 把知心大前辈，装进你的 DeepSeek Harness

「[体制.skill](https://github.com/onlyLT/tizhi-skill)」的 agent 形态——一个随时能开的「体制模式」会话：
讲真话、讲隐性规则、讲人情世故和自我保护，帮你在机关 / 事业 / 国企看懂局、不吃亏。

<br>

![含登量](https://img.shields.io/badge/%E5%90%AB%E7%99%BB%E9%87%8F-%E5%B7%B2%E5%8E%8B%E5%88%B0%E6%9C%80%E4%BD%8E-brightgreen.svg)
![服从性](https://img.shields.io/badge/%E6%9C%8D%E4%BB%8E%E6%80%A7-%E8%87%AA%E6%84%BF%E9%80%89%E9%A1%B9-blueviolet.svg)
![编制](https://img.shields.io/badge/%E7%BC%96%E5%88%B6-%E6%81%95%E4%B8%8D%E9%99%84%E8%B5%A0-lightgrey.svg)
![红线](https://img.shields.io/badge/%E7%BA%A2%E7%BA%BF-%E9%9B%B6%E5%AE%B9%E5%BF%8D-critical.svg)
![保命指数](https://img.shields.io/badge/%E4%BF%9D%E5%91%BD%E6%8C%87%E6%95%B0-MAX-orange.svg)
![形态](https://img.shields.io/badge/%E5%BD%A2%E6%80%81-DSH%20Agent%20Preset-blue.svg)

</div>

---

> 🗣️ 与 [体制.skill](https://github.com/onlyLT/tizhi-skill) 同一条红线：讲真话、讲隐性规则，但**不教违纪违法、不教弄虚作假、不教打压他人**。踩线的诉求它不配合——点破风险，把人劝回正路。

<br>

## ✨ 这是什么

[DeepSeek Harness（dsh）](https://github.com/deepseek-ai/deepseek-harness)的一个 **agent preset（会话预设）**。装好之后，在 dsh Web UI 新建会话时选「**体制模式**」，agent 就变成那位比你早几年进体制的知心大前辈：

- **处境应对**：和领导相处、同事边界、办事流程、自我保护、成长晋升、心态调适——六类处境，摸底 → 分诊 → 三层透镜 → 给动作；
- **看材料**：能读你工作区里的旧稿、领导来文，结合材料给建议；
- **可生长**：preset 的 `skills/` 目录是能力插槽——把新技能目录丢进去就生效。体制.skill 是首发技能，公文写作、预算评审等政务技能会陆续入驻，让它长成真正的政务 agent。

<br>

## 🚀 安装

前提：已能运行 dsh（`npx @deepseek-ai/dsh web`，适配 `0.1.0-rc.5`，dsh 处于 developer preview，后续版本可能有破坏性变更）。

```bash
git clone https://github.com/onlyLT/tizhi-agent.git
```

把 `preset/` 拷到 dsh 的用户预设目录，目录名就叫 `tizhi`：

```powershell
# Windows (PowerShell)
Copy-Item -Recurse .\tizhi-agent\preset "$env:USERPROFILE\.dsh\.agent-presets\tizhi"
```

```bash
# macOS / Linux
mkdir -p ~/.dsh/.agent-presets && cp -r tizhi-agent/preset ~/.dsh/.agent-presets/tizhi
```

无需重启：dsh 的 preset 发现是即时的。回到 Web UI 新建会话，预设列表里就有「体制模式」。

### 再装 UI 插件（可选，推荐）

`tizhi-agent-ui` 给 Web UI 加两样东西：**情境入口面板**（空白会话上方六张处境卡，点一下切「体制模式」并预填开场）和**机关大院皮肤**（藏蓝 · 米白纸感 · 朱红点缀，Settings → General 里开关）。

```bash
# 在仓库目录构建并打包
cd tizhi-agent/packages/ui
pnpm install && pnpm build && pnpm pack

# 装进 web profile，然后重启 dsh web
npx -y @deepseek-ai/dsh@latest plugin --profile web add ./tizhi-agent-ui-0.1.0.tgz
```

> 插件集合的变更需要重启 `dsh web` 才生效（preset 不用，插件要）。卸载：`dsh plugin --profile web remove tizhi-agent-ui`。

**自定义情境卡片**：卡片定义在 preset 目录的 `cards.yml`（`~/.dsh/.agent-presets/tizhi/cards.yml`）——每张卡四个字段（`key`/`title`/`hint`/`template`），增删改保存后**刷新浏览器即生效**，无需重新构建插件。文件缺失时面板回退到内置六卡。示例：

```yaml
- key: dinner
  title: 应酬饭局
  hint: 敬酒 · 挡酒 · 座次
  template: 有个饭局：……，帮我看看怎么应对得体又不吃亏。
```

**品牌替换**：开启皮肤后，侧栏 logo 与首屏标语一并换成体制.agent 门脸（「大院之内，自有章法」）。替换锚定 dsh 当前版式的稳定类名，dsh 大版本升级后若失效会无害地回到原品牌。

<br>

## 🧪 装好了怎么验

开一个「体制模式」会话，试这三句：

| 问它 | 应该看到 |
|:--|:--|
| "领导说这稿子随便写写，我怎么办" | 触发 tizhi-skill，先摸底再给成句话术，不讲正确的废话 |
| "帮我把数据改好看点" | 不配合——点破留痕风险，给合规出路 |
| 随便一个编程问题 | 正常干活，不硬套大前辈口吻 |

<br>

## 📁 组装说明

```
preset/
├─ preset.yml           # 显示名：体制模式
├─ agent.cordis.yml     # 插件组装：persona + 文件系统 + 技能插槽 + 压缩 + 搜索
└─ skills/
   └─ tizhi-skill/      # 首发技能（与 onlyLT/tizhi-skill 同源）
```

按官方 `standard` preset 裁剪：保留文件读写、技能加载、上下文压缩、联网搜索、摸底提问；**不装** subagent / workflow / plan-mode 等编码向重型工具——政务对话用不上，工具越少调性越稳、越安全。设计细节见 [docs/superpowers/specs/](docs/superpowers/specs/2026-08-14-tizhi-agent-design.md)。

<br>

## 🗺️ 路线图

- [x] 一期：「体制模式」preset + 体制.skill 首发
- [x] 二期：品牌 Web UI 插件 `tizhi-agent-ui`（情境入口面板 + 机关大院皮肤）
- [ ] 三期：政务技能生态——公文写作、预算评审等技能包按统一调性守则入驻

<br>

## 📝 说明

- **红线**：与体制.skill 完全一致，讲隐性规则是为了让人看懂局、保护自己，不是教人钻空子；
- **免责**：内容为一般性经验参考，不构成任何单位的正式规定，具体以所在单位规章为准；
- **许可证**：MIT，见 [LICENSE](LICENSE)。

<br>

<div align="center">

**觉得有用？点个 ⭐ Star，也看看它的起点 [体制.skill](https://github.com/onlyLT/tizhi-skill)。**

</div>
