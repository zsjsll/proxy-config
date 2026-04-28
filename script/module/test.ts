import { Alias, isMap, isPair, isScalar, isSeq, Pair, parse, parseDocument, Scalar, stringify, visit } from "yaml";

const inputPath = new URL("../../config/clash.yaml", import.meta.url)
const filename = inputPath.pathname.split("/").at(-1)
const outputPath = new URL(`../../dist/${filename}`, import.meta.url)

const d = await Bun.file(inputPath).text()

const t = stringify(parse(d))

console.log(t)

const doc = parseDocument(d)

parse(d,{})


function changeConfig(proxyUrls: string[]) {
  visit(doc, {
    Pair(_, node, path) {
      if (isScalar(node.key) && node.key.value === "interval") {
        console.log(`${node.key.value}:${node.value.value}  tamen de father :${path.at(-2)?.key}`)
      }
    },
  })
}
// changeConfig(["1`23"]);

function deleteComment() {
  visit(doc, {
    // Map(_, node) {
    //   node.comment = null;
    //   node.commentBefore = null;
    // },
    Scalar(_, node) {
      node.comment = null
      node.commentBefore = null
    },
    // Seq(_, node) {
    //   node.comment = null;
    //   node.commentBefore = null;
    // },
    Collection(_, node) {
      node.comment = null
      node.commentBefore = null
    },
  })
}
deleteComment()
// visit(doc, {
//   // Map(key, node) {
//   //   console.log(`📦 映射节点, 子节点数量: ${node.items.length}`);
//   // },
//   // Scalar(key, node) {
//   //   console.log(`💎 标量值: ${node.value}`);
//   // },
//   // Seq(key, node) {
//   //   console.log(`📋 序列节点, 长度: ${node.items.length}`);
//   // },
//   Pair(_, node, path) {
//     // console.log(node.key + ":" + node.value);

//     let parentPair = path.at(-2);
//     const parentKey = parentPair?.key?.value;

//     if (node.value?.anchor) {
//       console.log(`键 "${node.key?.value}" 的值定义了锚点: ${node.value.anchor}`);
//     }

//     // if (parentKey === "tun") {

//     //   console.log(node.key + ":" + node.value);
//     //   // console.log(parentKey);
//     // }
//   },
// });

await Bun.write(outputPath, doc.toString({ lineWidth: 0, minContentWidth: 0 }).replaceAll(/^\s*[\r\n]+/gm, ""))
