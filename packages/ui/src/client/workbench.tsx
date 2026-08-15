/**
 * 政务工作台 2.0：右侧抽屉（shell.overlay）+ 侧栏底部入口（sidebar.footer.action）。
 * 每个模块是可管理的条目集合（增删改、状态流转），条目挂「交给大前辈」动作——
 * 用字段数据组装开场文本走 launchFromRoot。数据存 localStorage，导出/导入 JSON 兜底。
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

/** 侧栏底部的工作台入口。 */
export function WorkbenchButton(props: WorkbenchShared & { wide?: boolean }): React.ReactNode {
  const enabled = useEnabled(props.skin)
  const open = React.useSyncExternalStore(props.workbench.subscribe, () => props.workbench.getSnapshot().open)
  if (!enabled) return null
  return (
    <button
      type="button"
      className="tz-wb-btn"
      data-open={open ? 'true' : 'false'}
      title="政务工作台"
      onClick={() => props.workbench.update(draft => { draft.open = !open })}
    >
      <span className="tz-wb-btn-seal" aria-hidden="true">政</span>
      {props.wide === true ? <span className="tz-wb-btn-text">工作台</span> : null}
    </button>
  )
}

interface DrawerProps extends WorkbenchShared {
  data: SnapshotStore<WorkbenchData>
  launch(template: string): void
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

/** 右侧抽屉本体。 */
export function WorkbenchDrawer(props: DrawerProps): React.ReactNode {
  const enabled = useEnabled(props.skin)
  const open = React.useSyncExternalStore(props.workbench.subscribe, () => props.workbench.getSnapshot().open)
  const entries = React.useSyncExternalStore(props.data.subscribe, () => props.data.getSnapshot().entries)
  const [activeKey, setActiveKey] = React.useState(WORKBENCH_MODULES[0]!.key)
  const [editing, setEditing] = React.useState<string | 'new' | null>(null)
  const fileRef = React.useRef<HTMLInputElement>(null)

  if (!enabled || !open) return null

  const module = WORKBENCH_MODULES.find(m => m.key === activeKey) ?? WORKBENCH_MODULES[0]!
  const rows = entries.filter(entry => entry.module === module.key)
  const countOf = (key: string): number => entries.filter(entry => entry.module === key).length

  const close = (): void => props.workbench.update(draft => { draft.open = false })

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
    setEditing(null)
  }
  const saveEdit = (id: string, fields: Record<string, string>): void => {
    props.data.update(draft => {
      const row = draft.entries.find(entry => entry.id === id)
      if (row !== undefined) { row.fields = fields; row.updatedAt = Date.now() }
    })
    setEditing(null)
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
    <div className="tz-wb-drawer" role="dialog" aria-label="政务工作台">
      <div className="tz-wb-head">
        <span className="tz-wb-title">政务工作台</span>
        <button type="button" className="tz-wb-close" aria-label="关闭" onClick={close}>×</button>
      </div>
      <div className="tz-wb-tabs">
        {WORKBENCH_MODULES.map(m => (
          <button
            key={m.key}
            type="button"
            className="tz-wb-tab"
            data-active={m.key === module.key ? 'true' : 'false'}
            onClick={() => { setActiveKey(m.key); setEditing(null) }}
          >
            {m.title}
            {countOf(m.key) > 0 ? <span className="tz-wb-tab-count">{countOf(m.key)}</span> : null}
          </button>
        ))}
      </div>
      <div className="tz-wb-body">
        {editing === 'new'
          ? <EntryForm module={module} initial={{}} onSave={saveNew} onCancel={() => setEditing(null)} />
          : (
            <button type="button" className="tz-wb-add" onClick={() => setEditing('new')}>+ 新增{module.title}</button>
          )}
        {rows.length === 0 && editing !== 'new'
          ? <div className="tz-wb-empty">还没有条目——点上面「新增」记一条</div>
          : null}
        {rows.map(entry => (
          <div key={entry.id} className="tz-wb-entry">
            {editing === entry.id
              ? (
                <EntryForm
                  module={module}
                  initial={entry.fields}
                  onSave={fields => saveEdit(entry.id, fields)}
                  onCancel={() => setEditing(null)}
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
                        onClick={() => { props.launch(action.build(entry.fields)); close() }}
                      >{action.label}</button>
                    ))}
                    <button type="button" className="tz-wb-mini" onClick={() => setEditing(entry.id)}>编辑</button>
                    <button type="button" className="tz-wb-mini tz-wb-mini-danger" onClick={() => remove(entry.id)}>删除</button>
                  </div>
                </>
              )}
          </div>
        ))}
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
    </div>
  )
}
