import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import swc from "rollup-plugin-swc3"

import fg from "fast-glob"
import path from "path"

const inputFiles = await fg("substore_script/**/*.ts")

// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */
export default inputFiles.map((file) => {
  const fileDir = path.dirname(file)
  return {
    input: file,
    output: {
      dir: fileDir,
      format: "es", // 常见的库格式，如 'es', 'cjs', 'umd'
      sourcemap: false,
      manualChunks: null,
      preserveModules: false,
    },
    watch: {
      // 排除整个输出目录或特定的输出文件
      exclude: [file],
      // 更好的做法是排除具体的输出文件，例如：
      // exclude: ['substore_script/bundle.js', 'node_modules/**']
    },
    plugins: [
      json(),
      resolve({
        extensions: [".js", ".ts", ".jsx", ".tsx"], // 支持的扩展名
        browser: true, // 使用 browser 字段
        preferBuiltins: false, // 是否优先使用 Node.js 内建模块
      }),
      commonjs(),
      swc({
        include: /\.ts$/,
        exclude: /node_modules/, // 默认排除 node_modules
        sourceMaps: false,
        tsconfig: "tsconfig.json", // 自动读取配置
        jsc: {
          parser: {
            syntax: "typescript",
          },
          target: "esnext",
        },
        minify: true, // 启用压缩
      }),
    ],
  }
})
