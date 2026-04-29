import clash from "./module/changeclashconfig"

const c = new clash("../config/clash.yaml", "../dist")

const k = await c.load()

c.save()

const absolutePath = Bun.resolveSync("../config/clash.yaml", import.meta.dirname)
console.log("🚀 ~ absolutePath:", absolutePath)
