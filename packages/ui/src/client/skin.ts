/**
 * 机关大院皮肤：藏蓝 + 米白纸感 + 朱红点缀的 token 叠层。
 * 每个 token 必须给 {light, dark} 对（overrideTokens 的硬约束）；
 * 暗色是「深夜大院」——深藏蓝底、主色调亮、朱红降饱和上提。
 */
export const SKIN_SOURCE = 'tizhi-agent-ui'

export const SKIN_TOKENS: Record<string, { light: string; dark: string }> = {
  '--dsw-alias-bg-base': { light: '#faf7ef', dark: '#101724' },
  '--dsw-alias-bg-layer-1': { light: '#fffdf6', dark: '#161f30' },
  '--dsw-alias-bg-layer-2': { light: '#f4f0e3', dark: '#1b2536' },
  '--dsw-alias-brand-primary': { light: '#24406e', dark: '#8aa4d8' },
  '--dsw-alias-brand-text': { light: '#24406e', dark: '#9db4e4' },
  '--dsw-alias-button-primary-fill': { light: '#24406e', dark: '#33507e' },
  '--dsw-alias-button-primary-hover': { light: '#2d4d82', dark: '#3d5c90' },
  '--dsw-alias-interactive-bg-hover-accent': { light: 'rgba(168, 69, 58, 0.10)', dark: 'rgba(208, 90, 74, 0.16)' },
  '--dsw-specific-sidebar-fill': { light: '#f3eee1', dark: '#0c1220' },
  '--dsw-specific-bubble': { light: '#f3efe4', dark: '#182338' },
  '--dsw-specific-input-major': { light: '#fffdf6', dark: '#161f30' },
}
