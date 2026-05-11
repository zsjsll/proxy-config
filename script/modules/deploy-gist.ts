import isCI from "is-ci"

export class DeployGist {
  readonly #gistUrl: URL
  #headers: Bun.HeadersInit

  constructor(gistId: string, gistToken: string) {
    this.#gistUrl = new URL(gistId, "https://api.github.com/gists/")
    this.#headers = {
      Authorization: `Bearer ${gistToken}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    }
  }

  async pushToGist(fileName: string, fileContent: string) {
    const body = { files: { [fileName]: { content: fileContent } } }

    const payload: RequestInit = { method: "PATCH", headers: this.#headers, body: JSON.stringify(body) }
    try {
      const response = await Bun.fetch(this.#gistUrl, payload)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`GitHub API Error: ${response.status} ${response.statusText}\n${JSON.stringify(errorData, undefined, 2)}`)
      }
      const result = (await response.json()) as any
      console.log("✅ Update successful!")
      if (!isCI) {
        console.log(`🔗 Gist URL: ${result.html_url}`)
      }
      const date = new Date(result.updated_at)
      console.log(`🕒 Last update: ${date.toLocaleString("zh-CN")}`)
    } catch (error) {
      console.error("❌ Update failed:", error)
      process.exit(1)
    }
  }
}

if (import.meta.main) {
  // const deployGist = new DeployGist("1", "2")
}
