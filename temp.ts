const text = "apple,banana|cherry ddd";
// 匹配逗号 OR 竖线作为分隔符
const correctSplit = text.split(/,|\||\s/);

console.log(correctSplit);
// 输出：['apple', 'banana', 'cherry']