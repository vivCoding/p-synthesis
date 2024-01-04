import { ASTNode, GRAMMAR_START } from "@/lang"
import { validateExamples } from "@/utils/misc"

export function topDownDFS(examples: ExampleType[], maxDepth = 15): ASTNode | null {
  validateExamples(examples)

  for (let i = 0; i < GRAMMAR_START.length; i++) {
    const program = new GRAMMAR_START[i]()
    const res = dfs(program, 0, examples, maxDepth)
    if (res) return res
  }

  return null
}

function dfs(program: ASTNode, depth: number, examples: ExampleType[], maxDepth = 15): ASTNode | null {
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
