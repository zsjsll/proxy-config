import { parse, visit } from "yaml";

const inputPath = "config/clash.yaml";
const outputPath = "./data.json";

const t = await Bun.file(inputPath).text();

const tt = parse(t);
// console.log("🚀 ~ tt:", tt);

const doc = parse(`
wifi:
  ssid: lll-5G-H
  channel: 161
  width: 80
devices:
  - phone
  - laptop
`);

visit(doc, {
  Scalar(_, node) {
    console.log("Scalar:", node.value);
  },
});
