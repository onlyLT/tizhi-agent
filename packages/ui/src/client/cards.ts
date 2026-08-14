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

/** 「体制模式」preset 的 roster id（目录名）。 */
export const PRESET_ID = 'tizhi'

/** cards 路由返回行的运行时校验（wire 边界）。 */
export function isSituationCard(row: unknown): row is SituationCard {
  if (typeof row !== 'object' || row === null) return false
  const record = row as Record<string, unknown>
  return ['key', 'title', 'hint', 'template']
    .every(field => typeof record[field] === 'string' && record[field] !== '')
}
