// rspack.config.js

import { SwcJsMinimizerRspackPlugin } from "@rspack/core"
import type { Configuration } from "@rspack/core"
import path from "path/posix"
import fg from "fast-glob"

const entryDir = "./substore_script"

async function createEntries(entryDir: string): Promise<Record<string, string>> {
  const entryPoints = await fg(`${entryDir}/**/*.ts`, { absolute: true })
  const entries: Record<string, string> = {}

  entryPoints.forEach((entryPath) => {
    const baseName = path.basename(entryPath, ".ts")
    entries[baseName] = entryPath
  })

  console.log(`找到 ${entryPoints.length} 个文件，将分别打包。`)
  return entries
}

// 确保将配置对象断言或指定为 Configuration 类型
const config: Configuration = {
  devtool: false,
  entry: await createEntries(entryDir),

  output: {
    path: entryDir,
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                },
                target: "esnext",
              },
              sourceMaps: false,
            },
          },
        ],
      },
    ],
  },

  optimization: {
    minimize: true,
    minimizer: [
      new SwcJsMinimizerRspackPlugin({
        test: /\.js$/, // 可根据需要定制压缩范围
        extractComments: false, // 移除所有注释
        minimizerOptions: {
          ecma: "2022", // 输出 ES5 代码，兼容旧浏览器
          compress: {
            drop_console: true, // 移除 console
            drop_debugger: true, // 移除 debugger
            passes: 3, // 多轮压缩，默认是 2，可提高为 3
            unused: true, // 移除未使用变量
            dead_code: true, // 移除死代码
            evaluate: true, // 编译期计算常量表达式
            join_vars: true, // 合并 var 声明
            properties: true, // 优化属性访问
            side_effects: true, // 移除无副作用代码
            keep_infinity: true, // 保留 Infinity，避免变成 1/0
            comparisons: true, // 禁用比较优化，兼容性更好
          },
          mangle: {
            reserved: ["$", "exports", "require", "_c", "_v", "_s", "_e"], // 保留关键变量名
            keep_fnames: false, // 不保留函数名，进一步压缩
          },
          format: {
            comments: false,
            ascii_only: true, // 避免中文字符转义后体积变大
          },
        },
      }),
    ],
    splitChunks: false,
  },

  target: ["web", "es2025"],
}

export default config
