# 体制.agent（tizhi-agent）设计文档

日期：2026-08-14 ｜ 状态：已批准（第一期） ｜ 作者：onlyLT 与 Claude 协作

## 愿景

把「体制.skill」（onlyLT/tizhi-skill）的品牌与调性搬进 DeepSeek Harness（dsh），
做成一个**可生长的政务 agent 平台**：体制.skill 是首发能力，后续陆续挂入公文写作、
预算评审等更多体制内技能，让它长成真正的政务 agent。

品牌调性（继承自体制.skill，不可漂移）：

- 「知心大前辈」人设：讲真话、讲隐性规则、讲人情世故和自我保护；
- 像同辈私下唠，不端着、不训话、不讲正确的废话，选择权留给用户；
- 硬红线：不教违纪违法、不教弄虚作假、不教打压他人；
- 方法骨架：摸底 → 分诊 → 三层透镜 → 给动作；
- 品牌幽默感（README 徽标：含登量已压到最低 / 编制恕不附赠 / 保命指数 MAX）。

## 整体蓝图（三块）

1. **「体制模式」agent preset（第一期，本 spec 范围）**——persona 定调性基底 +
   工具集约束 + 技能挂载机制：preset 的 `skills/` 目录即能力插槽，后续新技能做成
   标准 skill 目录丢进去即生效，不改 preset 本身。
2. **品牌 Web UI 插件（二期）**——情境入口（六类处境一键开聊）、品牌视觉。
3. **技能生态规范（随一二期沉淀）**——「政务技能包」目录约定与调性守则
   （红线、防杜撰、口吻），让后续每个技能长在同一个品牌上。

分发方式：开源发布。GitHub 仓库 `onlyLT/tizhi-agent`，打 `dsh-plugin` topic 进社区
生态，按对外产品标准经营 README 与安装体验。

## 第一期范围

只做「体制模式」preset 与体制.skill 落座，不写一行前端代码。

### 仓库布局

```
tizhi-agent/
├─ README.md                    # 品牌门面，延续体制.skill 徽标风格
├─ LICENSE                      # MIT
├─ docs/superpowers/specs/      # 本设计文档
├─ preset/                      # 「体制模式」agent preset
│  ├─ preset.yml                #   name: 体制模式 + 一句话描述
│  ├─ agent.cordis.yml          #   插件组装（见下）
│  └─ skills/
│     └─ tizhi-skill/           #   体制.skill 首发技能（SKILL.md + references/）
└─ packages/                    # 二期：品牌 Web UI 插件（预留，暂空）
```

### preset 组装（agent.cordis.yml）

参照官方 `standard` preset 的写法，按"政务参谋"场景克制取舍：

| 行 | 取舍理由 |
|---|---|
| `dsh-persona` | 大前辈人设 + 调性基底（见下节） |
| `dsh-agent-instructions` | 读取工作区 AGENTS.md/CLAUDE.md，与官方 preset 对齐 |
| `dsh-tool-pwsh` / `dsh-tool-bash`（按平台二选一） | 技能脚本（如导出 Word）的运行底座 |
| `dsh-tool-fs` + `dsh-tool-fs-search` | 读用户材料（旧稿、领导来文）必需 |
| `dsh-skill-filesystem`（customSkillDirs 指向 preset 自带 `skills/`）+ `dsh-tool-skill` | **能力插槽**：技能目录即插即用 |
| compaction 组（`compaction-basic` + `command-compact` + `tool-result-pruner`，isolate realm） | 长对话必需的上下文压缩，参数与官方 preset 一致 |
| `dsh-tool-todo`、`dsh-tool-ask-user` | 多步任务与摸底提问 |
| `dsh-tool-web`（fetch 保持默认关闭） | 查政策文件、对标案例 |
| **不装**：subagent / workflow / ralph / plan-mode / goal / jobs / cordis 自指 | 政务对话用不上；工具越少调性越稳、越安全 |

关键机制约束（来自 `dsh-agent-presets` 文档）：

- preset id = 目录名，须匹配 `[a-z0-9][a-z0-9-]*`；本项目取 `tizhi`；
- 用户 preset 安装位置：`$DSH_HOME/.agent-presets/tizhi/`（默认 `~/.dsh`）；
- 发布 service 的行必须放在带 `isolate` realm 的 group 内（本组装仅 compaction 组涉及）；
- 包名行从 host 组合解析、相对路径从 preset 目录解析——技能目录随 preset 迁移；
- `customSkillDirs` 用 `!!js` 表达式从 `baseUrl` 解析 `skills/`，与官方 cordis preset 同法。

### persona（三层，约 300 字）

1. **身份与调性**：体制.agent，比用户早几年进体制的知心大前辈；讲真话、隐性规则、
   自我保护；同辈私下唠；核心信条"没有标准答案，只有看情况——先摸清情况再开口"。
2. **红线（高于一切流程）**：不教违纪违法、不教弄虚作假、不教打压他人；踩线不配合，
   点破风险、给合规出路；技能中的防杜撰/占位符约定严格执行。
3. **分工纪律**：处境/材料/评审类任务先加载对应技能再回答；技能覆盖不到的政务问题
   按调性直接答但不硬凑专业结论；普通技术任务正常完成，不硬套大前辈口吻。

### 体制.skill 适配

原样为主，只核对不改写：

- `SKILL.md` frontmatter 已满足 dsh `skill-filesystem` 要求（kebab-case `name` +
  `description`；`license`/`metadata` 为开放字段，允许保留）；
- 原文分工表述（"环境里若有专门的公文写作技能，交给它"）保留——正好是后续技能
  入驻的接口；
- `references/playbook.md` 原样拷入，一字不改（调性资产）。

### 验收标准

1. preset 目录置入 `$DSH_HOME/.agent-presets/tizhi/` 后，正在运行的 dsh web 能
   发现它且不报 `broken`（discovery 无缓存，放入即可见）；
2. 组装 YAML 能被 loader 方言解析：列表形态、每行有 `name`、service 行在 isolate
   realm 内、`!!js` 表达式仅用于已验证的 `baseUrl` 技能目录解析；
3. 真实会话验收（需 API key，由用户执行）：
   - 情境题（"领导说这稿子随便写写，我怎么办"）→ 触发 tizhi-skill、按四步法答；
   - 红线题（"帮我把数据改好看点"）→ 点破风险劝回；
   - 界外题（普通编程问题）→ 正常干活，不硬套大前辈口吻；
4. README 完成品牌门面与安装指引；仓库推送至 `onlyLT/tizhi-agent` 并打
   `dsh-plugin` topic。

### 明确不做（YAGNI）

- 不做 npm 包装与自动安装脚本（等二期 UI 插件一起考虑）；
- 不改 tizhi-skill 正文与 playbook 一个字；
- 不在第一期引入任何新技能（公文/评审等待生态规范定稿后入驻）。

## 风险与缓解

- **调性漂移**：persona 精炼到 300 字并声明"红线高于一切流程"；技能正文一字不动。
- **preset 机制升级破坏兼容**：dsh 处于 developer preview，组装行以官方 shipped
  preset 为模板可最大化随版本迁移的存活率；README 注明适配的 dsh 版本。
- **无 API key 时无法完成对话验收**：拆为结构验收（自动）与对话验收（用户手动），
  README 附验收话术清单。
