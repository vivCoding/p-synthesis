import Alpine from "alpinejs"
import { topDownBFS } from "./enumeration/topDownBFS"
import { topDownDFS } from "./enumeration/topDownDFS"
import { ASTNode } from "./lang/impl"

const initialExamples: ExampleType[][] = [
  // (arr[0] * arr[1]) / arr[2]
  [
    {
      input: [1, 1, 1],
      output: 3,
    },
    {
      input: [1, 2, 3],
      output: 6,
    },
    {
      input: [4, 5, 6],
      output: 15,
    },
  ],
  // (arr[0] * arr[1]) / arr[2]
  [
    {
      input: [5, 2, 1],
      output: 10,
    },
    {
      input: [3, 4, 6],
      output: 2,
    },
  ],
  // arr[(arr[0] + arr[2])] * arr[1]
  [
    {
      input: [1, 0, 1],
      output: 0,
    },
    {
      input: [1, 5, 1],
      output: 5,
    },
    {
      input: [1, 5, 0],
      output: 25,
    },
  ],
  // could be arr[arr[0] + arr[2]]
  [
    {
      input: [1, 0, 1],
      output: 1,
    },
    {
      input: [0, 0, 2],
      output: 2,
    },
    {
      input: [1, 0, 0],
      output: 0,
    },
    {
      input: [0, 0, 1],
      output: 0,
    },
    {
      input: [0, 0, 0],
      output: 0,
    },
    {
      input: [0, 1, 0],
      output: 0,
    },
  ],
]

document.addEventListener("alpine:init", () => {
  console.log("yooo")

  Alpine.data("psData", () => ({
    initialExamples,
    examples: initialExamples[1],
    maxDepth: 15,
    program: undefined as ASTNode | null | undefined,
    output: "None",

    currentAlgo: "topDownBFS",
    algorithms: {
      topDownBFS: {
        name: "Top Down BFS",
        program: topDownBFS,
      },
      topDownDFS: {
        name: "Top Down DFS",
        program: topDownDFS,
      },
      bottomUp: {
        name: "Bottom Up",
        program: topDownDFS,
      },
    } as Record<string, { name: string; program: (examples: ExampleType[], ...args: any[]) => ASTNode | null }>,

    addExample() {
      this.examples.push({ input: [], output: 0 })
    },
    editExampleInput(idx: number, newInput: string) {
      try {
        const parsedInput = JSON.parse(newInput)
        if (Array.isArray(parsedInput) && parsedInput.length > 0 && parsedInput.every((v) => typeof v === "number")) {
          this.examples[idx].input = parsedInput
        }
      } catch (e) {
        this.examples[idx].input = []
      }
    },
    editExampleResult(idx: number, newResult: string) {
      try {
        const parsedInput = JSON.parse(newResult)
        if (typeof parsedInput === "number") {
          this.examples[idx].output = parsedInput
        }
      } catch (e) {
        this.examples[idx].output = undefined
      }
    },
    removeExample(idx: number) {
      this.examples.splice(idx, 1)
    },
    generate() {
      this.output = "..."
      try {
        this.program = this.algorithms[this.currentAlgo].program(this.examples, this.maxDepth)
        if (!this.program) {
          this.output = "no program found in time"
        } else {
          this.output = this.program.toString()
        }
      } catch (e) {
        console.error(e)
        this.output = `${e}`
      }
    },
    useInitialExample(idx: number) {
      this.examples = this.initialExamples[idx]
    },
  }))
})

// after adding alpine event listener, start alpine
window.Alpine = Alpine
Alpine.start()
