import { Parser } from "expr-eval"
import * as v from "valibot"

const envSchema = v.object({
  IS_FORMAT: v.optional(
    v.pipe(
      v.string(),
      v.transform((s) => s.toLowerCase().trim() === "true"),
      v.boolean(),
    ),
    "false",
  ),

  DELETE_PROPERTY: v.optional(
    v.pipe(
      v.string(),
      v.startsWith("[", "miss '[' with start"),
      v.endsWith("]", "miss ']' with end"),
      v.transform((s) => (s === "[]" ? undefined : JSON.parse(s))),
      v.array(v.string()),
    ),
    "[]",
  ),

  PROVIDER_URLS: v.optional(
    v.pipe(
      v.string(),
      v.startsWith("[", "miss '[' with start"),
      v.endsWith("]", "miss ']' with end"),
      v.transform((s) => (s === "[]" ? undefined : JSON.parse(s))),
      v.array(v.string()),
    ),
    "[]",
  ),

  CHECK_URL: v.optional(
    v.pipe(
      v.string(),
      v.url(),
      // v.transform((s) => s),
    ),
  ),

  PROVIDERS_INTERVAL: v.optional(
    v.pipe(
      v.string(),
      v.transform((s) => Parser.evaluate(s)),
      v.number(),
    ),
  ),

  CHECK_INTERVAL: v.optional(
    v.pipe(
      v.string(),
      v.transform((s) => Parser.evaluate(s)),
      v.number(),
    ),
  ),
})

export function parseEnv() {
  return v.parse(envSchema, Bun.env)
}

if (import.meta.main) {
  const env = v.parse(envSchema, Bun.env)
  console.log("🚀 ~ env:", env)
}
