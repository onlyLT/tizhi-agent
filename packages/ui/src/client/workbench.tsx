/**
 * 政务工作台 2.1：页面右侧的常驻工作区栏（体制模式下默认展开、占位排版
 * 不悬浮遮挡——空间预留由 body[data-tizhi-wb] 的 CSS 完成）。
 * 五个模块各自是一张精致卡片：朱砂小方章 + 宋体标题 + 条目列表 + 内联表单；
 * 条目动作用字段数据组装开场文本走 launchFromRoot。数据存 localStorage。
 */
import * as React from 'react'
import { WORKBENCH_MODULES, type ModuleDef, type WorkbenchEntry } from './workbench-config.ts'
import type { SnapshotStore } from './types.ts'

export interface WorkbenchData {
  entries: WorkbenchEntry[]
}

interface WorkbenchShared {
  skin: SnapshotStore<{ enabled: boolean }>
  workbench: SnapshotStore<{ open: boolean }>
}

function useEnabled(store: SnapshotStore<{ enabled: boolean }>): boolean {
  return React.useSyncExternalStore(store.subscribe, () => store.getSnapshot().enabled)
}

/** 侧栏底部的工作台开关。 */
export function WorkbenchButton(props: WorkbenchShared & { wide?: boolean }): React.ReactNode {
  const enabled = useEnabled(props.skin)
  const open = React.useSyncExternalStore(props.workbench.subscribe, () => props.workbench.getSnapshot().open)
  if (!enabled) return null
  return (
    <button
      type="button"
      className="tz-wb-btn"
      data-open={open ? 'true' : 'false'}
      title={open ? '收起政务工作台' : '展开政务工作台'}
      onClick={() => props.workbench.update(draft => { draft.open = !open })}
    >
      <span className="tz-wb-btn-seal" aria-hidden="true">政</span>
      {props.wide === true ? <span className="tz-wb-btn-text">工作台</span> : null}
    </button>
  )
}

/** 条目编辑表单（新增与编辑共用；编辑态为本地 state，提交才写 store）。 */
function EntryForm(props: {
  module: ModuleDef
  initial: Record<string, string>
  onSave(fields: Record<string, string>): void
  onCancel(): void
}): React.ReactNode {
  const [draft, setDraft] = React.useState<Record<string, string>>(props.initial)
  return (
    <div className="tz-wb-form">
      {props.module.fields.map(field => (
        <label key={field.key} className="tz-wb-field">
          <span className="tz-wb-field-label">{field.label}</span>
          {field.multiline === true ? (
            <textarea
              className="tz-wb-input"
              rows={3}
              placeholder={field.placeholder}
              value={draft[field.key] ?? ''}
              onChange={event => setDraft({ ...draft, [field.key]: event.target.value })}
            />
          ) : (
            <input
              className="tz-wb-input"
              placeholder={field.placeholder}
              value={draft[field.key] ?? ''}
              onChange={event => setDraft({ ...draft, [field.key]: event.target.value })}
            />
          )}
        </label>
      ))}
      <div className="tz-wb-form-actions">
        <button type="button" className="tz-wb-mini tz-wb-mini-primary" onClick={() => props.onSave(draft)}>保存</button>
        <button type="button" className="tz-wb-mini" onClick={props.onCancel}>取消</button>
      </div>
    </div>
  )
}

interface WorkbenchProps extends WorkbenchShared {
  data: SnapshotStore<WorkbenchData>
  launch(template: string): void
}

/** 一张模块卡片：方章头 + 条目列表 + 内联新增/编辑。 */
function ModuleCard(props: {
  module: ModuleDef
  rows: readonly WorkbenchEntry[]
  editing: string | null
  onEdit(id: string | 'new' | null): void
  data: SnapshotStore<WorkbenchData>
  launch(template: string): void
}): React.ReactNode {
  const { module, rows } = props
  const adding = props.editing === 'new'

  const saveNew = (fields: Record<string, string>): void => {
    props.data.update(draft => {
      draft.entries.unshift({
        id: crypto.randomUUID(),
        module: module.key,
        status: module.statuses[0]!,
        fields,
        updatedAt: Date.now(),
      })
    })
    props.onEdit(null)
  }
  const saveEdit = (id: string, fields: Record<string, string>): void => {
    props.data.update(draft => {
      const row = draft.entries.find(entry => entry.id === id)
      if (row !== undefined) { row.fields = fields; row.updatedAt = Date.now() }
    })
    props.onEdit(null)
  }
  const cycleStatus = (id: string): void => {
    props.data.update(draft => {
      const row = draft.entries.find(entry => entry.id === id)
      if (row === undefined) return
      const index = module.statuses.indexOf(row.status)
      row.status = module.statuses[(index + 1) % module.statuses.length]!
      row.updatedAt = Date.now()
    })
  }
  const remove = (id: string): void => {
    props.data.update(draft => {
      draft.entries = draft.entries.filter(entry => entry.id !== id)
    })
  }

  return (
    <section className="tz-mod-card">
      <header className="tz-mod-head">
        <span className="tz-mod-seal" aria-hidden="true">{module.icon}</span>
        <span className="tz-mod-meta">
          <span className="tz-mod-title">{module.title}</span>
          <span className="tz-mod-hint">{module.hint}</span>
        </span>
        {rows.length > 0 ? <span className="tz-mod-count">{rows.length}</span> : null}
        <button
          type="button"
          className="tz-mod-add"
          title={'新增' + module.title}
          onClick={() => props.onEdit(adding ? null : 'new')}
        >{adding ? '×' : '+'}</button>
      </header>
      {adding
        ? <EntryForm module={module} initial={{}} onSave={saveNew} onCancel={() => props.onEdit(null)} />
        : null}
      {rows.map(entry => (
        <div key={entry.id} className="tz-wb-entry">
          {props.editing === entry.id
            ? (
              <EntryForm
                module={module}
                initial={entry.fields}
                onSave={fields => saveEdit(entry.id, fields)}
                onCancel={() => props.onEdit(null)}
              />
            )
            : (
              <>
                <div className="tz-wb-entry-head">
                  <span className="tz-wb-entry-title">
                    {(entry.fields[module.fields[0]!.key] ?? '').trim() || '（未填' + module.fields[0]!.label + '）'}
                  </span>
                  <button
                    type="button"
                    className="tz-wb-status"
                    title="点击切换状态"
                    onClick={() => cycleStatus(entry.id)}
                  >{entry.status}</button>
                </div>
                {module.fields.slice(1).map(field => {
                  const value = (entry.fields[field.key] ?? '').trim()
                  return value === '' ? null : (
                    <div key={field.key} className="tz-wb-entry-line">
                      <span className="tz-wb-entry-key">{field.label}</span>
                      <span className="tz-wb-entry-value">{value}</span>
                    </div>
                  )
                })}
                <div className="tz-wb-entry-actions">
                  {module.actions.map(action => (
                    <button
                      key={action.key}
                      type="button"
                      className="tz-wb-mini tz-wb-mini-primary"
                      onClick={() => props.launch(action.build(entry.fields))}
                    >{action.label}</button>
                  ))}
                  <button type="button" className="tz-wb-mini" onClick={() => props.onEdit(entry.id)}>编辑</button>
                  <button type="button" className="tz-wb-mini tz-wb-mini-danger" onClick={() => remove(entry.id)}>删除</button>
                </div>
              </>
            )}
        </div>
      ))}
      {rows.length === 0 && !adding
        ? <div className="tz-wb-empty">暂无条目，点右上「+」记一条</div>
        : null}
    </section>
  )
}

/** 右侧工作区栏本体。 */
export function WorkbenchDrawer(props: WorkbenchProps): React.ReactNode {
  const enabled = useEnabled(props.skin)
  const open = React.useSyncExternalStore(props.workbench.subscribe, () => props.workbench.getSnapshot().open)
  const entries = React.useSyncExternalStore(props.data.subscribe, () => props.data.getSnapshot().entries)
  // 编辑态全局唯一：'new:<moduleKey>' 或条目 id 或 null。
  const [editing, setEditing] = React.useState<string | null>(null)
  const fileRef = React.useRef<HTMLInputElement>(null)

  if (!enabled || !open) return null

  const exportJson = (): void => {
    const blob = new Blob([JSON.stringify({ entries }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `tizhi-workbench-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }
  const importJson = (file: File): void => {
    void file.text().then(text => {
      const parsed: unknown = JSON.parse(text)
      const list = (parsed as { entries?: unknown }).entries
      if (!Array.isArray(list)) throw new Error('bad file')
      const valid = list.filter((row): row is WorkbenchEntry =>
        typeof row === 'object' && row !== null
        && typeof (row as WorkbenchEntry).id === 'string'
        && typeof (row as WorkbenchEntry).module === 'string'
        && typeof (row as WorkbenchEntry).status === 'string'
        && typeof (row as WorkbenchEntry).fields === 'object')
      props.data.set({ entries: valid })
    }).catch(() => { /* 坏文件：不动现有数据 */ })
  }

  return (
    <aside className="tz-wb-drawer" aria-label="政务工作台">
      <div className="tz-wb-head">
        <span className="tz-wb-title">政务工作台</span>
        <button
          type="button"
          className="tz-wb-close"
          aria-label="收起"
          title="收起（侧栏「政」按钮可再展开）"
          onClick={() => props.workbench.update(draft => { draft.open = false })}
        >×</button>
      </div>
      <div className="tz-wb-body">
        {WORKBENCH_MODULES.map(module => {
          const rows = entries.filter(entry => entry.module === module.key)
          const editingHere = editing === 'new:' + module.key
            ? 'new' as const
            : rows.some(row => row.id === editing) ? editing : null
          return (
            <ModuleCard
              key={module.key}
              module={module}
              rows={rows}
              editing={editingHere}
              onEdit={value => setEditing(value === 'new' ? 'new:' + module.key : value)}
              data={props.data}
              launch={props.launch}
            />
          )
        })}
      </div>
      <div className="tz-wb-foot">
        <button type="button" className="tz-wb-mini" onClick={exportJson}>导出 JSON</button>
        <button type="button" className="tz-wb-mini" onClick={() => fileRef.current?.click()}>导入 JSON</button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={event => {
            const file = event.target.files?.[0]
            if (file !== undefined) importJson(file)
            event.target.value = ''
          }}
        />
        <span className="tz-wb-foot-note">数据存于本浏览器</span>
      </div>
    </aside>
  )
}
