// 错误/不理想的定义 (允许值是 undefined)
// const ppp: Map<string, string | undefined> = new Map();

// 正确的定义 (如果你的业务逻辑保证不会存 undefined)
const ppp: Map<string, string> = new Map();

if (ppp.has("someKey")) {
    const obj = ppp.get("someKey"); // 此时 obj 的类型是 string | undefined
    // 在 TypeScript 4.0 之前，即使是 Map<string, string>，get 的返回值依然是 string | undefined，
    // 因为它必须涵盖 key 不存在的情况。你需要使用方案一或方案二。
}