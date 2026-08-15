/** 六类处境卡：与 tizhi-skill playbook 的六类分诊一一对应。 */
export interface SituationCard {
  key: string
  title: string
  hint: string
  template: string
}

export const SITUATION_CARDS: readonly SituationCard[] = [
  {
    key: 'leader',
    title: '领导关系',
    hint: '汇报 · 揣摩意图 · 被批评',
    template: '领导跟我说了句「……」，我拿不准他真实意思，帮我拆拆。',
  },
  {
    key: 'peer',
    title: '同事关系',
    hint: '新人姿态 · 边界 · 口碑',
    template: '同事这边有点为难：……，我该怎么接才不吃亏也不伤和气？',
  },
  {
    key: 'work',
    title: '做事办事',
    hint: '写材料 · 办会办文 · 接任务',
    template: '接了个活：……，帮我理理先对齐什么、怎么干不跑偏。',
  },
  {
    key: 'guard',
    title: '自我保护',
    hint: '留痕 · 担责 · 说话分寸',
    template: '这事让我有点不安：……，帮我看看坑在哪、怎么留痕自保。',
  },
  {
    key: 'grow',
    title: '成长晋升',
    hint: '考核 · 考察 · 节奏',
    template: '想聊聊进步的事：我的情况是……，下一步怎么走稳？',
  },
  {
    key: 'mind',
    title: '心态调适',
    hint: '落差 · 委屈 · 熬',
    template: '最近有点憋屈：……，帮我顺顺气、也帮我看看这个局。',
  },
]

/** 政务工作台模块（modules.yml 缺席时的内置回退）。 */
export const WORK_MODULES: readonly SituationCard[] = [
  {
    key: 'meeting',
    title: '会议安排',
    hint: '通知 · 议程 · 纪要',
    template: '帮我安排一个会议：主题「……」，参会范围……，时间……。先出会议通知和议程，开完我再找你整理纪要。',
  },
  {
    key: 'weekly',
    title: '每周总结',
    hint: '亮点 · 数据 · 下周',
    template: '帮我写本周工作总结：本周主要做了……。按亮点、数据、问题、下周打算来组织。',
  },
  {
    key: 'study',
    title: '思想学习',
    hint: '心得 · 体会 · 结合实际',
    template: '帮我整理一篇学习心得：学习主题是「……」，要求结合本职工作谈体会，不空喊口号。',
  },
  {
    key: 'report',
    title: '汇报材料',
    hint: '提纲 · 口径 · 数据',
    template: '要向领导汇报「……」，帮我先拉一个汇报提纲，把口径和重点捋清楚。',
  },
  {
    key: 'gongwen',
    title: '公文起草',
    hint: '通知 · 请示 · 报告',
    template: '帮我起草一份公文：文种是……，事由是……。先出大纲我确认再展开。',
  },
]

/** 「体制模式」preset 的 roster id（目录名）。 */
export const PRESET_ID = 'tizhi'

/** cards 路由返回行的运行时校验（wire 边界）。 */
export function isSituationCard(row: unknown): row is SituationCard {
  if (typeof row !== 'object' || row === null) return false
  const record = row as Record<string, unknown>
  return ['key', 'title', 'hint', 'template']
    .every(field => typeof record[field] === 'string' && record[field] !== '')
}
