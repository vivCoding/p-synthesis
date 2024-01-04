import { NON_TERMS, TERMINALS } from "@/lang"
import { ASTNode } from "@/lang/impl"
import { validateExamples } from "@/utils/misc"

export function bottomUp(examples: ExampleType[], maxDepth = 3): ASTNode | null {
  validateExamples(examples)

  const bank: ASTNode[] = []
  TERMINALS.forEach((term) => {
    bank.push(...term.produceAllTerms({ inputLength: examples[0].input.length }))
  })

  for (let depth = 0; depth < maxDepth; depth++) {
    const newPrograms: ASTNode[] = []

    for (const nonTerm of NON_TERMS) {
      const program = new nonTerm()
      for (let it = fillHole(program, bank), x = it.next(); !x.done; x = it.next()) {
        // check if complete and not a duplicate
        if (
          Object.values(program.holes).every((val) => val !== undefined) &&
          bank.every((p) => !program.isEquivalentTo(p)) &&
          newPrograms.every((p) => !program.isEquivalentTo(p))
          // bank.every((p) => !isObsEquivalent(program, p, examples)) &&
          // newPrograms.every((p) => !isObsEquivalent(program, p, examples))
        ) {
          if (validateProgram(program, examples)) {
            return program
          }
          newPrograms.push(program.deepClone())
        }
      }
    }

    bank.push(...newPrograms)
  }

  return null
}

function* fillHole(currentProgram: ASTNode, bank: ASTNode[]): Generator<ASTNode, undefined, ASTNode> {
  for (const [holeName, holeEntry] of Object.entries(currentProgram.holes)) {
    if (holeEntry !== undefined) continue
    for (const rule of currentProgram.rules[holeName]) {
      for (const term of bank) {
        if (term instanceof rule) {
          currentProgram.holes[holeName] = term
          yield* fillHole(currentProgram, bank)
          currentProgram.holes[holeName] = undefined
        }
      }
    }
  }
  yield currentProgram
}

function validateProgram(program: ASTNode, examples: ExampleType[]): boolean {
  return examples.every(({ input, output }) => program.run({ arr: input }) === output)
}

function isObsEquivalent(p: ASTNode, p2: ASTNode, examples: ExampleType[]): boolean {
  return examples.every(({ input }) => p.run({ arr: input }) === p2.run({ arr: input }))
}
