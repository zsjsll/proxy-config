import { Alias, isSeq, parseDocument, Scalar, visit } from "yaml";

const inputPath = new URL("../../config/clash.yaml", import.meta.url);
// const inputPath = "config/clash.yaml";
// const outputPath = "./data.json";

const d = await Bun.file(inputPath).text();

const doc = parseDocument(d);

visit(doc, {
  // Map(key, node) {
  //   console.log(`📦 映射节点, 子节点数量: ${node.items.length}`);
  // },
  // Scalar(key, node) {
  //   console.log(`💎 标量值: ${node.value}`);
  // },
  // Seq(key, node) {
  //   console.log(`📋 序列节点, 长度: ${node.items.length}`);
  // },
  Pair(_, node) {
    // console.log(node.key + ":" + node.value);

    if ((node.key.value!) === "rule-anchor") {
      console.log(node.key + ":" + node.value);
    }
  },
});
