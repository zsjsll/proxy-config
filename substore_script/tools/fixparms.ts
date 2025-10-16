export function fixBoolen(args: string | boolean): boolean {
  if (typeof args === "boolean") return args
  if (args === "true") return true
  if (args === "false") return false
  throw new Error(`传入参数错误，${args}应该为boolen`)
}
