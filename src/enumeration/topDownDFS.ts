import { ASTNode, GRAMMAR_START } from "../lang/index.js"

export function topDownDFS(examples: ExampleType[], maxDepth = 15): ASTNode | null {
  // ensure examples are not empty, no empty inputs, and all inputs are same length
  if (examples.length === 0) throw "no examples given"
  if (examples[0].input.length === 0) throw "input length can't be 0"
  if (examples.find((ex) => ex.input.length !== examples[0].input.length)) throw "inputs not same length"

  for (let i = 0; i < GRAMMAR_START.length; i++) {
    const program = new GRAMMAR_START[i]()
    const res = dfs(program, 0, examples, maxDepth)
    if (res) return res
  }

  return null
}

function dfs(program: ASTNode, depth: number, examples: ExampleType[], maxDepth = 15): ASTNode | null {
  // console.log(depth, program.toString())
  const firstHole = findFirstHole(program)
  const isComplete = !firstHole

  if (isComplete && validateProgram(program, examples)) {
    return program
  } else if (isComplete) {
    return null
  }

  if (depth > maxDepth) return null

  const { node, holeName } = firstHole
  const newNodes = node.produceForHole(holeName, { inputLength: examples[0].input.length })

  for (let i = 0; i < newNodes.length; i++) {
    node.holes[holeName] = newNodes[i]
    const res = dfs(program, depth + 1, examples, maxDepth)
    if (res) return res
    node.holes[holeName] = undefined
  }

  return null
}

function findFirstHole(program: ASTNode): { node: ASTNode; holeName: string } | null {
  for (const [holeName, node] of Object.entries(program.holes)) {
    if (node === undefined) return { node: program, holeName }
    const firstHole = findFirstHole(node)
    if (firstHole) return firstHole
  }
  return null
}

function validateProgram(program: ASTNode, examples: ExampleType[]): boolean {
  return examples.every(({ input, output }) => program.run({ arr: input }) === output)
}
