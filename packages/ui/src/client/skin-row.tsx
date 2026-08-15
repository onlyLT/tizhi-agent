/**
 * Settings → General 的「体制.agent 模式」开关卡片。
 * 朱砂印章 + 宋体标题的品牌卡：整卡可点、开启时藏蓝描边点亮。
 * 持久化走 localStorage（树外插件唯一可用的配置通道），token 应用在 index.tsx 统一调和。
 */
import * as React from 'react'
import type { SnapshotStore } from './types.ts'

interface SkinRowInjected {
  skin: SnapshotStore<{ enabled: boolean }>
}

/** 设置卡片组件。 */
export function SkinRow(props: SkinRowInjected): React.ReactNode {
  const enabled = React.useSyncExternalStore(
    props.skin.subscribe,
    () => props.skin.getSnapshot().enabled,
  )
  return (
    <button
      type="button"
      className="tz-settings-card"
      data-on={enabled ? 'true' : 'false'}
      role="switch"
      aria-checked={enabled}
      aria-label="体制.agent 模式"
      title="皮肤 + 品牌门脸 + 情境面板一键同开同关；开启期间新会话默认「体制模式」，关闭恢复原默认"
      onClick={() => props.skin.update(draft => { draft.enabled = !enabled })}
    >
      <span className="tz-seal" aria-hidden="true">体制</span>
      <span className="tz-settings-meta">
        <span className="tz-settings-label"><b>体制 · agent</b> 模式</span>
      </span>
      <span className="tz-settings-state">
        <span className="tz-settings-state-word">{enabled ? '已开启' : '未开启'}</span>
        <span className="tz-switch" data-on={enabled ? 'true' : 'false'} />
      </span>
    </button>
  )
}
