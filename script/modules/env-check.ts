import { Parser } from "expr-eval"
import { isArray } from "node:util"
import * as v from "valibot"

const booleanSchema = v.pipe(
  v.string(),
  v.transform((s) => s.toLowerCase().trim() === "true"),
  v.boolean(),
)

const urlSchema = v.pipe(
  v.pipe(
    v.string(),
    v.url(),
    // v.transform((s) => s),
  ),
)

const mathExprSchema = v.pipe(
  v.string(),
  v.transform((s) => Parser.evaluate(s)),
  v.number(),
)

const arraySechema = v.pipe(
  v.string(),
  v.check((input) => {
    if (input.startsWith("[") && !input.endsWith("]")) return false
    if (!input.startsWith("[") && input.endsWith("]")) return false
    return true
  }, "miss '['with start or miss ']' with end ."),

  v.transform((input) => {
    if (input === "" || input === "[]" || input === '[""]') return undefined
    if (input.startsWith("[") && input.endsWith("]")) return JSON.parse(input)
    if (!input.startsWith("[") && !input.endsWith("]")) return input.split(",").map((item) => item.trim())
  }),
)

const envSchema = v.object({
  IS_FORMAT: v.optional(booleanSchema, "false"),
  DELETE_PROPERTY: v.optional(arraySechema),
  PROVIDER_URLS: v.optional(arraySechema),
  CHECK_URL: v.optional(urlSchema),
  PROVIDERS_INTERVAL: v.optional(mathExprSchema),
  CHECK_INTERVAL: v.optional(mathExprSchema),
})

export function parseEnv() {
  return v.parse(envSchema, Bun.env)
}

if (import.meta.main) {
  const env = v.parse(envSchema, Bun.env)
  console.log("🚀 ~ env:", env)
}
