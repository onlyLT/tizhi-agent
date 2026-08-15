/**
 * 与部署端 .d.ts 核对过的最小结构类型（0.1.0-rc.5/rc.6）。
 * 树外包不安装 @deepseek-ai 类型依赖，构建走 transpile-only（turtle-ui 先例），
 * 这里只声明本插件真正触碰的成员。
 */

/** dsh-client-runtime/client createSnapshotStore 的返回面。 */
export interface SnapshotStore<T> {
  getSnapshot(): T
  subscribe(fn: () => void): () => void
  update(mutator: (draft: T) => void): void
  set(next: T): void
}

/** SessionSummary 中本插件读取的字段。 */
export interface SessionRow {
  id: string
  blank: boolean
  agentPreset?: string
}

/** ctx.sessions.list 快照中本插件读取的字段。 */
export interface SessionListState {
  byId: Record<string, SessionRow>
  current: string | undefined
}

/** IApiClient 一元响应（payload-direct 视图）。 */
export type RpcResponseLike<T> =
  | { result: { ok: true; value: T } }
  | { result: { ok: false; error: { code?: string } } }

/** agentPreset.list 的行。 */
export interface PresetEntry {
  id: string
  name?: string
  broken?: string
  isDefault?: boolean
}

/** ConnectionHandle.api 中本插件使用的域。 */
export interface AgentPresetsApi {
  list(payload: Record<string, never>): Promise<RpcResponseLike<{ presets: readonly PresetEntry[] }>>
  select(payload: { sessionId: string; agentPreset: string }): Promise<RpcResponseLike<{ agentPreset: string }>>
}

/** 设置域：默认预设写在 agent-presets 命名空间的 default 字段。 */
export interface SettingsApi {
  update(payload: { ns: string; patch: Record<string, unknown> }): Promise<RpcResponseLike<unknown>>
}

/** 会话作用域 slot 标准 props 中的输入动作面。 */
export interface InputActionsLike {
  setDraft(text: string): void
  submit(): void
}

/** 本插件注入的 cordis 服务面（结构子集）。 */
export interface TizhiCtx {
  effect(callback: () => () => void, label?: string): void
  get(name: 'connection'): { api: { agentPresets: AgentPresetsApi; settings: SettingsApi } } | undefined
  slots: {
    register(options: object, component: unknown): () => void
    inject(key: string, callback: () => () => void): () => void
  }
  theme: {
    overrideTokens(source: string, tokens: Record<string, { light: string; dark: string }>): () => void
  }
  sessions: {
    list: { getSnapshot(): SessionListState; subscribe(fn: () => void): () => void }
    noteAgentPreset(sessionId: string, agentPreset: string): void
  }
  workspaces: { startSession(workspaceId?: string): void }
}
