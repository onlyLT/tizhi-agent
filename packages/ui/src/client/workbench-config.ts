/**
 * 政务工作台模块定义：字段、状态流、智能动作。
 * 新模块 = 往 WORKBENCH_MODULES 加一条配置，框架自动获得表单/列表/状态流转。
 */

export interface FieldDef {
  key: string
  label: string
  placeholder: string
  multiline?: boolean
}

export interface ActionDef {
  key: string
  label: string
  /** 用条目字段组装开场文本（空字段以「……」占位，由大前辈摸底补齐）。 */
  build(fields: Record<string, string>): string
}

export interface ModuleDef {
  key: string
  title: string
  /** 卡片头的单字印记（朱砂小方章）。 */
  icon: string
  /** 卡片头的小字注解。 */
  hint: string
  statuses: readonly string[]
  fields: readonly FieldDef[]
  actions: readonly ActionDef[]
}

/** 条目（持久化在 localStorage 的数据行）。 */
export interface WorkbenchEntry {
  id: string
  module: string
  status: string
  fields: Record<string, string>
  updatedAt: number
}

const v = (fields: Record<string, string>, key: string): string => {
  const value = (fields[key] ?? '').trim()
  return value === '' ? '……' : value
}

export const WORKBENCH_MODULES: readonly ModuleDef[] = [
  {
    key: 'meeting',
    title: '会议安排',
    icon: '会',
    hint: '通知 · 议程 · 纪要',
    statuses: ['待开', '已开'],
    fields: [
      { key: 'topic', label: '议题', placeholder: '如：二季度安全生产工作部署' },
      { key: 'time', label: '时间', placeholder: '如：周四 15:00' },
      { key: 'place', label: '地点', placeholder: '如：三楼会议室' },
      { key: 'attendees', label: '参会范围', placeholder: '如：各科室负责人' },
      { key: 'notes', label: '备注', placeholder: '议程要点、材料要求等', multiline: true },
    ],
    actions: [
      {
        key: 'notice',
        label: '生成通知·议程',
        build: f => `帮我出一份会议通知和议程。议题：${v(f, 'topic')}；时间：${v(f, 'time')}；地点：${v(f, 'place')}；参会范围：${v(f, 'attendees')}。备注：${v(f, 'notes')}`,
      },
      {
        key: 'minutes',
        label: '整理纪要',
        build: f => `这个会开完了，帮我整理会议纪要。议题：${v(f, 'topic')}；时间：${v(f, 'time')}；参会：${v(f, 'attendees')}。会上情况：……（我口述要点，你来成稿）`,
      },
    ],
  },
  {
    key: 'weekly',
    title: '每周总结',
    icon: '周',
    hint: '素材随手记 · 周五一键成稿',
    statuses: ['积累中', '已成稿'],
    fields: [
      { key: 'week', label: '周次', placeholder: '如：8月第2周' },
      { key: 'points', label: '素材要点', placeholder: '随手记，一行一条\n如：周二完成预算评审 3 项', multiline: true },
    ],
    actions: [
      {
        key: 'compose',
        label: '生成总结',
        build: f => `帮我写${v(f, 'week')}的工作总结，素材如下：\n${v(f, 'points')}\n按亮点、数据、问题、下周打算来组织，务实平实。`,
      },
    ],
  },
  {
    key: 'study',
    title: '思想学习',
    icon: '学',
    hint: '心得 · 体会 · 结合实际',
    statuses: ['待学', '已学', '已写心得'],
    fields: [
      { key: 'topic', label: '主题', placeholder: '如：全会精神专题学习' },
      { key: 'source', label: '篇目来源', placeholder: '如：报告原文、某篇讲话' },
      { key: 'require', label: '要求', placeholder: '如：1500 字，结合业务工作', multiline: true },
    ],
    actions: [
      {
        key: 'reflection',
        label: '生成心得',
        build: f => `帮我写一篇学习心得。主题：${v(f, 'topic')}；篇目来源：${v(f, 'source')}；要求：${v(f, 'require')}。结合本职工作谈体会，不空喊口号。`,
      },
    ],
  },
  {
    key: 'report',
    title: '汇报材料',
    icon: '报',
    hint: '提纲 · 口径 · 数据',
    statuses: ['准备中', '已汇报'],
    fields: [
      { key: 'matter', label: '事项', placeholder: '如：重点项目推进情况' },
      { key: 'audience', label: '汇报对象', placeholder: '如：分管县长' },
      { key: 'occasion', label: '场合', placeholder: '如：周例会 / 专题会 / 单独汇报' },
      { key: 'points', label: '要点', placeholder: '想讲的几件事，一行一条', multiline: true },
    ],
    actions: [
      {
        key: 'outline',
        label: '生成提纲',
        build: f => `要向${v(f, 'audience')}汇报「${v(f, 'matter')}」，场合是${v(f, 'occasion')}。要点：\n${v(f, 'points')}\n帮我先拉汇报提纲，把口径和重点捋清楚，按这个场合定调。`,
      },
    ],
  },
  {
    key: 'gongwen',
    title: '公文起草',
    icon: '文',
    hint: '通知 · 请示 · 报告',
    statuses: ['草拟中', '已定稿'],
    fields: [
      { key: 'type', label: '文种', placeholder: '如：请示 / 通知 / 报告 / 函' },
      { key: 'matter', label: '事由', placeholder: '如：申请追加专项经费' },
      { key: 'to', label: '主送机关', placeholder: '如：县政府办' },
    ],
    actions: [
      {
        key: 'draft',
        label: '起草',
        build: f => `帮我起草一份公文。文种：${v(f, 'type')}；事由：${v(f, 'matter')}；主送机关：${v(f, 'to')}。先出大纲我确认，再展开成稿。`,
      },
    ],
  },
]
