/**
 * node 半边：提供 GET /tizhi-agent-ui/cards ——从「体制模式」preset 目录读
 * cards.yml 并以 JSON 返回，让情境卡片跟着 preset 走（改 YAML 即生效）。
 * preset 或 cards.yml 缺失时返回 404，浏览器半边回退到内置六卡。
 */
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { parse } from 'yaml'

export const name = 'tizhi-agent-ui'

export const inject = ['webServer', 'agentPresets']

/** 卡片行（与浏览器半边 cards.ts 的 SituationCard 同形）。 */
interface CardRow {
  key: string
  title: string
  hint: string
  template: string
}

const PRESET_ID = 'tizhi'
/** 路由 → preset 目录内的 YAML 文件（同为 CardRow 列表）。 */
const YAML_ROUTES: Record<string, string> = {
  '/tizhi-agent-ui/cards': 'cards.yml',
  '/tizhi-agent-ui/modules': 'modules.yml',
}

function isCardRow(row: unknown): row is CardRow {
  if (typeof row !== 'object' || row === null) return false
  const record = row as Record<string, unknown>
  return ['key', 'title', 'hint', 'template']
    .every(field => typeof record[field] === 'string' && record[field] !== '')
}

/** 本插件真正触碰的 host 服务面（结构子集，见 dsh-host-webserver / dsh-agent-presets）。 */
interface HostCtx {
  effect(callback: () => () => void, label?: string): void
  webServer: {
    register(route: {
      kind: 'exact' | 'prefix'
      path: string
      handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>
    }): () => void
  }
  agentPresets: {
    resolve(id?: string): Promise<{ path: string }>
  }
}

/** Loader 挂载入口。 */
export function apply(ctx: HostCtx): void {
  for (const [route, file] of Object.entries(YAML_ROUTES)) {
    ctx.effect(() => ctx.webServer.register({
      kind: 'exact',
      path: route,
      handler: async (_req, res) => {
        try {
          const preset = await ctx.agentPresets.resolve(PRESET_ID)
          const text = await readFile(join(dirname(preset.path), file), 'utf8')
          const rows: unknown = parse(text)
          const cards = Array.isArray(rows) ? rows.filter(isCardRow) : []
          if (cards.length === 0) throw new Error(`${file} carries no valid card rows`)
          res.writeHead(200, {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'no-store',
          })
          res.end(JSON.stringify({ cards }))
        } catch {
          res.writeHead(404, { 'content-type': 'application/json; charset=utf-8' })
          res.end('{"cards":[]}')
        }
      },
    }), `tizhi-agent-ui: ${file} route`)
  }
}
