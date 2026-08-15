/**
 * 政务工作台：侧栏底部入口按钮（sidebar.footer.action）+ 悬浮模块面板
 * （shell.overlay）。仅体制模式开启时渲染；点模块 = 开/复用空白会话 →
 * 切体制模式 → 预填模板（root 作用域启动链路在 index.tsx）。
 */
import * as React from 'react'
import type { SituationCard } from './cards.ts'
import type { SnapshotStore } from './types.ts'

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

interface WorkbenchPanelProps extends WorkbenchShared {
  probeModules(): Promise<readonly SituationCard[]>
  launch(template: string): void
}

/** 悬浮的模块面板。 */
export function WorkbenchPanel(props: WorkbenchPanelProps): React.ReactNode {
  const enabled = useEnabled(props.skin)
  const open = React.useSyncExternalStore(props.workbench.subscribe, () => props.workbench.getSnapshot().open)
  const [modules, setModules] = React.useState<readonly SituationCard[]>([])

  React.useEffect(() => {
    if (!open) return
    let live = true
    void props.probeModules().then(rows => { if (live) setModules(rows) })
    return () => { live = false }
    // probeModules 是注册期固定的注入面，身份稳定。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!enabled || !open) return null

  const close = (): void => props.workbench.update(draft => { draft.open = false })

  return (
    <div className="tz-wb-panel" role="dialog" aria-label="政务工作台">
      <div className="tz-wb-head">
        <span className="tz-wb-title">政务工作台</span>
        <button type="button" className="tz-wb-close" aria-label="关闭" onClick={close}>×</button>
      </div>
      <div className="tz-wb-list">
        {modules.map(mod => (
          <button
            key={mod.key}
            type="button"
            className="tz-wb-item"
            onClick={() => { props.launch(mod.template); close() }}
          >
            <span className="tz-wb-item-title">{mod.title}</span>
            <span className="tz-wb-item-hint">{mod.hint}</span>
          </button>
        ))}
      </div>
      <div className="tz-wb-foot">点一项，开一个预填好开场的体制模式会话</div>
    </div>
  )
}
