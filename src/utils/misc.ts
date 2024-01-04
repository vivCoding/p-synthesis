import { ASTNode, Term } from "@/lang/impl"

export function printAST(program: ASTNode) {
  console.log(program.nodeName)
  printASTdfs(program, 1)
}

function printASTdfs(node: ASTNode, spacing = 0) {
  const spaceStr = ": ".repeat(spacing)
  if (node instanceof Term) {
    console.log(`${spaceStr}TermValue = ${node.value}`)
  }
  for (const [holeName, childNode] of Object.entries(node.holes)) {
    console.log(`${spaceStr}(${holeName})`, childNode ? childNode.nodeName : undefined)
    if (childNode) {
      printASTdfs(childNode, spacing + 1)
    }
  }
}

export function validateExamples(examples: ExampleType[]) {
  // ensure examples are not empty, no empty inputs, and all inputs are same length
  if (examples.length === 0) throw "no examples given"
  if (examples[0].input.length === 0) throw "input length can't be 0"
  if (examples.find((ex) => ex.input.length !== examples[0].input.length)) throw "inputs not same length"
  if (examples.find((ex) => ex.output === undefined)) throw "all examples must have an output"
}
