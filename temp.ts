const a = new Set([1, 2, 3, 4, 5, 6])

const aa = Iterator.from(a).take(4).toArray()
console.log("🚀 ~ aa:", aa)
