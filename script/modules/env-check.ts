import { Parser } from "expr-eval"
import * as v from "valibot"

const envSchema = v.object({
  DELETE_PROPERTY: v.pipe(
    v.string(),
    v.startsWith("["),
    v.endsWith("]"),
    v.transform((s) => (s === "[]" ? undefined : JSON.parse(s))),
    v.array(v.string()),
  ),

  PROVIDERS_URL: v.pipe(
    v.string(),
    v.startsWith("["),
    v.endsWith("]"),
    v.transform((s) => (s === "[]" ? undefined : JSON.parse(s))),
    v.array(v.string()),
  ),

  CHECK_URL: v.pipe(
    v.string(),
    v.url(),
    v.transform((s) => (s === "" ? undefined : s)),
  ),

  PROVIDERS_INTERVAL: v.pipe(
    v.string(),
    v.transform((s) => (s === "" ? undefined : Parser.evaluate(s))),
    v.number(),
  ),
  CHECK_INTERVAL: v.undefinedable(
    v.pipe(
      v.string(),
      v.transform((s) => (s === "" ? undefined : Parser.evaluate(s))),
      v.number(),
    ),
  ),
})

export function parseEnv() {
  return v.parse(envSchema, Bun.env)
}

if (import.meta.main) console.log(parseEnv())
