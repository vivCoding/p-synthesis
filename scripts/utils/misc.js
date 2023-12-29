import { Term } from "../lang/index.js";
export function printAST(program) {
    console.log(program.nodeName);
    printASTdfs(program, 1);
}
function printASTdfs(node, spacing = 0) {
    const spaceStr = ": ".repeat(spacing);
    if (node instanceof Term) {
        console.log(`${spaceStr}TermValue = ${node.value}`);
    }
    for (const [holeName, childNode] of Object.entries(node.holes)) {
        console.log(`${spaceStr}(${holeName})`, childNode ? childNode.nodeName : undefined);
        if (childNode) {
            printASTdfs(childNode, spacing + 1);
        }
    }
}
