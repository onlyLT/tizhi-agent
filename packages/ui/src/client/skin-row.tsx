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
        <span className="tz-settings-label">体制.agent 模式</span>
        <span className="tz-settings-desc">皮肤 + 品牌门脸 + 情境面板一键同开同关；开启期间新会话默认「体制模式」，关闭恢复原默认</span>
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
