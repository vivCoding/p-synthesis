import { topDownBFS } from "./enumeration/topDownBFS.js";
import { topDownDFS } from "./enumeration/topDownDFS.js";
import { ASTNode } from "./lang/index.js";
const examples = [
    {
        input: [5, 2, 1],
        output: 10,
    },
    {
        input: [3, 4, 6],
        output: 2,
    },
    // {
    //   input: [],
    //   output: 0,
    // },
];
// const program = topDownBFS(examples)
// if (program) {
//   console.log(program.toString())
//   console.log(program.run({ arr: [7, 8, 3] }))
//   printAST(program)
// } else {
//   console.log("no program")
// }
// expose globally
// @ts-ignore
window.topDownBFS = topDownBFS;
// @ts-ignore
window.topDownDFS = topDownDFS;
// @ts-ignore
window.ASTNode = ASTNode;
