/**
 * 情境入口面板：conversation.input.dock 的 list 项。
 * 只在空白会话渲染；点卡片 = 切「体制模式」preset + 预填开场模板（不自动发送）。
 */
import * as React from 'react'
import { PRESET_ID, SITUATION_CARDS, type SituationCard } from './cards.ts'
import type { InputActionsLike, SessionListState } from './types.ts'

interface PanelInjected {
  /** roster 中「体制模式」是否可用（缓存的一次性探测）。 */
  probePreset(): Promise<boolean>
  /** preset 目录 cards.yml 的卡片（缺席时回退内置六卡）。 */
  probeCards(): Promise<readonly SituationCard[]>
  /** 切 preset 并预填草稿。 */
  launch(sessionId: string, inputActions: InputActionsLike, template: string): Promise<void>
}

interface PanelProps extends PanelInjected {
  sessionId: string
  inputActions: InputActionsLike
  useSessions<T>(selector: (state: SessionListState) => T): T
}

/** 面板组件（默认导出给 slots.register）。 */
export function BrandPanel(props: PanelProps): React.ReactNode {
  const blank = props.useSessions(state => state.byId[props.sessionId]?.blank === true)
  const preset = props.useSessions(state => state.byId[props.sessionId]?.agentPreset)
  const [ready, setReady] = React.useState<boolean | undefined>(undefined)
  const [cards, setCards] = React.useState<readonly SituationCard[]>(SITUATION_CARDS)

  React.useEffect(() => {
    let live = true
    void props.probePreset().then(value => { if (live) setReady(value) })
    void props.probeCards().then(rows => { if (live) setCards(rows) })
    return () => { live = false }
    // probePreset/probeCards 是注册期固定的注入面，身份稳定。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!blank) return null

  const armed = preset === PRESET_ID

  return (
    <div className="tz-panel">
      <div className="tz-panel-head">
        <span className="tz-panel-title">大前辈在线</span>
        <span className="tz-panel-sub">先摸清情况再开口 · 编制恕不附赠</span>
      </div>
      {ready === false ? (
        <div className="tz-panel-note">
          还没装「体制模式」预设 —— 把 tizhi-agent 仓库的 <b>preset/</b> 拷到{' '}
          <b>~/.dsh/.agent-presets/tizhi</b> 再回来（详见 github.com/onlyLT/tizhi-agent）。
        </div>
      ) : (
        <>
          <div className="tz-panel-grid">
            {cards.map(card => (
              <button
                key={card.key}
                type="button"
                className="tz-card"
                onClick={() => { void props.launch(props.sessionId, props.inputActions, card.template) }}
              >
                <span className="tz-card-title">{card.title}</span>
                <span className="tz-card-hint">{card.hint}</span>
              </button>
            ))}
          </div>
          <div className="tz-panel-note">
            {armed
              ? <>已切到<b>体制模式</b>——把「……」补成你的实际情况，发出去就开聊。</>
              : <>点一张卡，会话切到<b>体制模式</b>并预填开场；细节你来补，主动权在你。</>}
          </div>
        </>
      )}
    </div>
  )
}
