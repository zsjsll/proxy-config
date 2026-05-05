const o = { a: { b: { c: 1 } }, d: 2 }

let a = o.a.b

a.c = 2222

console.log(o)

type Method = "GET" | "POST" | "PUT" | "DELETE"

const apiConfig = {
  url: "https://api.example.com",
  method: "POST" as Method,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
}

type Config = typeof apiConfig
// Config.method 是 'GET' | 'POST' | 'PUT' | 'DELETE'
