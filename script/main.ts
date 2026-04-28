import clash from "./module/changeclashconfig"

const c = new clash("../config/clash.yaml", "123.yaml")

const k = await c.load()

c.save()