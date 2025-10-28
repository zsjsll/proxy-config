const a = undefined
function fixArray(args: undefined | string): string[] {
  if (args === "") return []
  if (typeof args === "string") return args.split(/[|, ]/)
  return []
}
console.log(fixArray(a))
