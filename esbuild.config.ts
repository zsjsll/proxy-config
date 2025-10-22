import { copy } from "esbuild-plugin-copy"
import esbuild from "esbuild"
import fg from "fast-glob"
import { performance } from "perf_hooks"
import fs from "fs/promises"
import path from "path"

const isWatchMode = process.argv.includes("-w") || process.argv.includes("--watch")
const isMinify = process.argv.includes("-m") || process.argv.includes("--minify")
const isDebug = process.argv.includes("--debug")
const entryDir = "./substore_script"

async function getEntryPoints(entryDir: string, filterFiles: string[]) {
  const entryPoints = await fg(`${entryDir}/**/*.ts`)
  filterFiles = filterFiles.map((v) => entryDir + "/" + v)
  return entryPoints.filter((point) => filterFiles.some((kw) => point.includes(kw)))
}
const entryPoints = await getEntryPoints(entryDir, ["clash"])
console.log(entryPoints)

const outDir = "dist"

function TimingPlugin(): esbuild.Plugin {
  return {
    name: "timing-and-alias-reporter",

    setup(build) {
      // 在 setup 作用域内声明一个变量来存储开始时间
      let startTime = 0
      // 钩子 1: 构建开始时触发
      build.onStart(() => {
        startTime = performance.now()
        // 注意：onStart 不需要返回任何东西
      })
      // 钩子 2: 构建结束时触发
      build.onEnd((result) => {
        // 在这里安全地计算耗时
        const duration = (performance.now() - startTime).toFixed(2)

        if (result.errors.length > 0) {
          console.error(`\n❌ 构建失败 (${duration}ms): ${result.errors.length} 个错误`)
        } else {
          console.log(`\n✅ 构建成功 (${duration}ms) - ${new Date().toLocaleTimeString()}`)
        }
      })
    },
  }
}

function BannerInjectPlugin(bannerMap: Map<string, string>): esbuild.Plugin {
  return {
    name: "banner-inject-postbuild",
    setup(build) {
      build.onEnd(async (result) => {
        if (result.errors.length > 0) return

        const outputs = Object.keys(result.metafile?.outputs || {})

        await Promise.all(
          outputs.map(async (output) => {
            const absPath = path.resolve(output)

            const sourcePath = result.metafile?.outputs[output]?.entryPoint
            if (!sourcePath) return

            const banner = bannerMap.get(path.relative("./", sourcePath))

            if (!banner) return

            try {
              const content = await fs.readFile(absPath, "utf8")

              await fs.writeFile(absPath, `${banner}\n\n${content}`)
              console.log(`📝 注释已注入: ${path.basename(absPath)}`)
            } catch (e) {
              console.warn(`⚠️ 注入失败: ${absPath}`, e)
            }
          })
        )
      })
    },
  }
}

const bannerMap = new Map<string, string>()
await Promise.all(
  entryPoints.map(async (file) => {
    try {
      const content = await fs.readFile(file, "utf8")
      const match = content.match(/\/\*!([\s\S]*?)\*\//)
      if (match) bannerMap.set(path.relative("./", file), `/*!${match[1].trim()}*/`)
    } catch (err) {
      console.warn(`⚠️ 读取失败: ${file}`, err)
    }
  })
)

const baseOptions: esbuild.BuildOptions = {
  entryPoints: entryPoints,
  bundle: true,
  outdir: outDir,
  outbase: "./substore_script",
  format: "esm", // 输出 ES Module 格式
  sourcemap: false, // 生成 Source Map
  target: ["esnext"], // 目标环境
  // platform: "node",
  logLevel: "info",
  metafile: true,
  // charset: "utf8",

  plugins: [
    BannerInjectPlugin(bannerMap),
    TimingPlugin(),
    copy({ assets: { from: "./README.md", to: "./README.md" } }),
    copy({ assets: { from: "./substore_script/sub-store_file_free.json", to: "./sub-store_file_free.json" } }),
    copy({ assets: { from: "./config/**/*", to: "./config" } }),

    // fileCopyPlugin({
    //   globs: [
    //     { from: "./config/**/*", to: "./dist/config" },
    //     { from: "./substore_script/sub-store_file_free.json", to: "./dist/" },
    //     { from: "./README.md", to: "./dist/" },
    //   ],
    // }),
  ],
  ...(!isDebug && { drop: ["console", "debugger"] }),

  ...(isMinify && {
    minify: true, // 压缩代码
    minifyIdentifiers: true,
    minifySyntax: true,
    legalComments: "none",
  }),
}

async function runEsbuild() {
  if (isWatchMode) {
    const watchOptions: esbuild.BuildOptions = {}
    const ctx = await esbuild.context({ ...baseOptions, ...watchOptions })
    console.log(`[WATCH MODE] 正在启动文件监听...`)
    await ctx.watch()

    console.log("\n======================================")
    console.log("         👁️ 文件监听已启动...")
    console.log("         🚫 按 Ctrl+C 停止。")
    console.log("======================================")

    // 监听 Ctrl+C (SIGINT) 信号，以便优雅地调用 dispose()
    process.on("SIGINT", async () => {
      console.log("\n👋 停止监听。清理 Esbuild 资源...")
      await ctx.dispose()
      process.exit(0)
    })
  } else {
    const runhOnceOptions: esbuild.BuildOptions = {}
    const ctx = await esbuild.context({ ...baseOptions, ...runhOnceOptions })
    try {
      console.log(`🛠️ [BUILD MODE] 执行单次构建...`)
      await ctx.rebuild()

      console.log(`📂 输出目录 ${outDir}`)
    } catch (e) {
      console.error("❌ 构建出错:", e)
    } finally {
      await ctx.dispose()
    }
    process.exit(0)
  }
}

runEsbuild()
