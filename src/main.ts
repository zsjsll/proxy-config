import { doesNotMatch } from "node:assert";
import { parseArgs } from "node:util";
import { bundlerModuleNameResolver } from "typescript";

const aaaaa = [22, 55, 6678, 886678].sort();

const bbb = [22, 55, 6678, 886678];

bbb[2] = 123444;

const cc = bbb.with(0, 99);
console.log(cc);

for await (const a of [1, 2, 34]) {
  Bun.sleep(1000);
  console.log(123);
}
