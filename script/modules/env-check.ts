import { Parser } from "expr-eval"
import * as v from "valibot"

const booleanSchema = v.pipe(
  v.string(),
  v.transform((s) => s.toLowerCase().trim() === "true"),
  v.boolean(),
)

const urlSchema = v.pipe(
  v.string(),
  v.url(),
  // v.transform((s) => s),
)

const stringSchema = v.pipe(
  v.string(),
  // v.transform((s) => s),
)
const gistTokenSchema = v.pipe(
  v.string(),
  v.startsWith("ghp_", "Must start with 'ghp_'."),
  // v.transform((s) => s),
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
  }, "❌ Missing '['with start, or missing ']' with end."),

  v.transform((input) => {
    if (input === "" || input === "[]" || input === '[""]') return undefined
    if (input.startsWith("[") && input.endsWith("]")) return JSON.parse(input)
    if (!input.startsWith("[") && !input.endsWith("]")) return input.split(",").map((item) => item.trim())
  }),
  v.array(v.string()),
)

const envSchema = v.object({
  DELETE_PROPERTY: v.optional(arraySechema),
  RULE_PROVIDERS_PROXY_URL: v.optional(urlSchema),
  PROVIDER_URLS: v.optional(arraySechema),
  CHECK_URL: v.optional(urlSchema),
  PROVIDERS_INTERVAL: v.optional(mathExprSchema),
  CHECK_INTERVAL: v.optional(mathExprSchema),

  GIST_TOKEN: v.optional(gistTokenSchema),
  GIST_ID: v.optional(stringSchema),
  IS_DEPLOY_TO_GIST: v.optional(booleanSchema),
})

export function parseEnv() {
  return v.parse(envSchema, Bun.env)
}

if (import.meta.main) {
  const env = v.parse(envSchema, Bun.env)
  console.log("🚀 ~ env:", env)
}
