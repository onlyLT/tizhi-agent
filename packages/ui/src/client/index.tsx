/**
 * tizhi-agent-ui 浏览器半边：
 * 1. 注入面板样式（<style>，卸载时移除）；
 * 2. 机关大院皮肤：localStorage 持久化开关 + ctx.theme.overrideTokens 调和；
 * 3. conversation.input.dock 注册情境入口面板；
 * 4. settings.general.item 注册皮肤开关行。
 */
import { createSnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'
import { PRESET_ID, SITUATION_CARDS, isSituationCard, type SituationCard } from './cards.ts'
import { BrandPanel } from './panel.tsx'
import { SkinRow } from './skin-row.tsx'
import { SKIN_SOURCE, SKIN_TOKENS } from './skin.ts'
import { PANEL_CSS } from './styles.ts'
import type { InputActionsLike, TizhiCtx } from './types.ts'

export const name = 'tizhi-agent-ui'

export const inject = ['slots', 'theme', 'connection', 'sessions', 'workspaces']

/** 浏览器插件入口。 */
export function apply(ctx: TizhiCtx): void {
  // ── 样式 ──────────────────────────────────────────────────────────────
  ctx.effect(() => {
    const tag = document.createElement('style')
    tag.dataset.plugin = name
    tag.textContent = PANEL_CSS
    document.head.appendChild(tag)
    return () => { tag.remove() }
  }, 'tizhi-agent-ui: panel styles')

  // ── 皮肤 ──────────────────────────────────────────────────────────────
  const skinStore = createSnapshotStore(
    { enabled: false },
    { persist: { name: 'tizhi-agent-ui.skin' } },
  )
  let disposeSkin: (() => void) | undefined
  const reconcileSkin = (): void => {
    const { enabled } = skinStore.getSnapshot()
    // 品牌替换 CSS 以 body[data-tizhi-skin] 为总闸，与 token 叠层同开同关。
    if (enabled) {
      document.body.dataset.tizhiSkin = ''
    } else {
      delete document.body.dataset.tizhiSkin
    }
    if (enabled && disposeSkin === undefined) {
      disposeSkin = ctx.theme.overrideTokens(SKIN_SOURCE, SKIN_TOKENS)
    } else if (!enabled && disposeSkin !== undefined) {
      disposeSkin()
      disposeSkin = undefined
    }
  }
  ctx.effect(() => {
    const stop = skinStore.subscribe(reconcileSkin)
    reconcileSkin()
    return () => {
      stop()
      delete document.body.dataset.tizhiSkin
      if (disposeSkin !== undefined) {
        disposeSkin()
        disposeSkin = undefined
      }
    }
  }, 'tizhi-agent-ui: skin reconcile')

  // ── preset 探测与卡片动作 ─────────────────────────────────────────────
  const connection = ctx.get('connection')
  if (connection === undefined) return
  const { api } = connection

  let probe: Promise<boolean> | undefined
  const probePreset = (): Promise<boolean> => {
    probe ??= api.agentPresets.list({})
      .then(response => response.result.ok
        && response.result.value.presets.some(row => row.id === PRESET_ID && row.broken === undefined))
      .catch(() => false)
    return probe
  }

  // 卡片跟着 preset 走：node 半边从 preset 目录的 cards.yml 供数，
  // 路由缺席（preset 未装 / 文件缺失）时回退到内置六卡。
  let cardsProbe: Promise<readonly SituationCard[]> | undefined
  const probeCards = (): Promise<readonly SituationCard[]> => {
    cardsProbe ??= fetch('/tizhi-agent-ui/cards')
      .then(response => (response.ok ? response.json() : { cards: [] }))
      .then((data: { cards?: unknown }) => {
        const rows = Array.isArray(data.cards) ? data.cards.filter(isSituationCard) : []
        return rows.length > 0 ? rows : SITUATION_CARDS
      })
      .catch(() => SITUATION_CARDS)
    return cardsProbe
  }

  const launch = async (
    sessionId: string,
    inputActions: InputActionsLike,
    template: string,
  ): Promise<void> => {
    const response = await api.agentPresets.select({ sessionId, agentPreset: PRESET_ID })
    if (response.result.ok) {
      ctx.sessions.noteAgentPreset(sessionId, response.result.value.agentPreset)
    }
    inputActions.setDraft(template)
  }

  // ── slot 注册 ─────────────────────────────────────────────────────────
  ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
    name: 'conversation.input.dock',
    id: 'tizhi-brand-panel',
    order: -10,
    inject: () => ({ probePreset, probeCards, launch }),
  }, BrandPanel))

  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'tizhi-skin',
    order: 60,
    inject: () => ({ skin: skinStore }),
  }, SkinRow))
}
