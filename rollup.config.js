import resolve from "@rollup/plugin-node-resolve"
import swc from "rollup-plugin-swc3"
import fg from "fast-glob"

const inputFiles = await fg("substore_script/**/*.ts")

// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: inputFiles,
  output: {
    dir: "./",
    format: "es", // 常见的库格式，如 'es', 'cjs', 'umd'
    sourcemap: false,
    preserveModules: true,
    preserveModulesRoot: ".",
  },
  plugins: [
    resolve({
      extensions: [".js", ".ts", ".jsx", ".tsx"], // 支持的扩展名
      browser: false, // 使用 browser 字段
      preferBuiltins: false, // 是否优先使用 Node.js 内建模块
    }),
    swc({
      include: /\.ts$/,
      exclude: /node_modules/, // 默认排除 node_modules
      sourceMaps: false,
      tsconfig: "tsconfig.json", // 自动读取配置
      jsc: {
        parser: {
          syntax: "typescript",
        },
        target: "es2022",
      },
      minify: false, // 启用压缩
    }),
  ],
}
