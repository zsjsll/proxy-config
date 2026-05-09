import { dirname, resolve } from "node:path"

export function formatStringToNumber(val: string) {
  if (!val.includes("*")) return Number(val)
  return val.split("*").reduce((prev, curr) => (prev *= Number(curr)), 1)
}

export function formatPathToResolvePath<T extends boolean>(path: string, isCheck: T): T extends true ? Promise<string> : string
export function formatPathToResolvePath(path: string, isCheck: true) {
  const mainDir = dirname(Bun.main)
  return isCheck ? Bun.resolve(path, mainDir) : resolve(mainDir, path)
}
