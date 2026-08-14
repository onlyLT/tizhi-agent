/**
 * node 半边：不做任何事。存在的意义是让本包成为一条可挂载的 Loader entry，
 * 从而被 client-modules 扫进浏览器 roster（dsh.client + exports["./client"]）。
 */
export const name = 'tizhi-agent-ui'

/** Loader 挂载入口；浏览器半边在 ./client。 */
export function apply(): void {}
