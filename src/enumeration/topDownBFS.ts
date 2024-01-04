import { ASTNode, GRAMMAR_START } from "@/lang"
import { validateExamples } from "@/utils/misc"

export function topDownBFS(examples: ExampleType[], maxDepth = 15): ASTNode | null {
  validateExamples(examples)

  const queue: { depth: number; program: ASTNode }[] = []
  GRAMMAR_START.forEach((rule) => {
    queue.push({ depth: 0, program: new rule() })
  })

  while (queue.length > 0) {
    const next = queue.shift()
    if (!next) return null
    const { depth, program } = next

    const firstHole = findFirstHole(program)
    const isComplete = !firstHole
    if (isComplete && validateProgram(program, examples)) {
      return program
    } else if (isComplete) {
      continue
    }

    if (depth > maxDepth) continue

    const { node, holeName } = firstHole
    const newNodes = node.produceForHole(holeName, { inputLength: examples[0].input.length })

    newNodes.forEach((newNode) => {
      // kinda expensive yea?
      const newProgram = program.deepClone()
      const hole = findFirstHole(newProgram)
      // should be the same hole we found earlier
      if (!hole) throw "wtf"

      const { node: nodeInNewProgram } = hole
      nodeInNewProgram.holes[holeName] = newNode
      queue.push({ depth: depth + 1, program: newProgram })
    })
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
