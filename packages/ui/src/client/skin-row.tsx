/**
 * Settings → General 的「机关大院皮肤」开关行。
 * 持久化走 localStorage（树外插件唯一可用的配置通道），token 应用在 index.tsx 统一调和。
 */
import * as React from 'react'
import type { SnapshotStore } from './types.ts'

interface SkinRowInjected {
  skin: SnapshotStore<{ enabled: boolean }>
}

/** 设置行组件。 */
export function SkinRow(props: SkinRowInjected): React.ReactNode {
  const enabled = React.useSyncExternalStore(
    props.skin.subscribe,
    () => props.skin.getSnapshot().enabled,
  )
  return (
    <div className="tz-settings-row">
      <div className="tz-settings-meta">
        <span className="tz-settings-label">机关大院皮肤</span>
        <span className="tz-settings-desc">藏蓝 · 米白纸感 · 朱红点缀，明暗模式各有一套（体制.agent）</span>
      </div>
      <button
        type="button"
        className="tz-switch"
        data-on={enabled ? 'true' : 'false'}
        role="switch"
        aria-checked={enabled}
        aria-label="机关大院皮肤"
        onClick={() => props.skin.update(draft => { draft.enabled = !enabled })}
      />
    </div>
  )
}
