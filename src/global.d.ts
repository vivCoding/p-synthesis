import { Alpine } from "alpinejs"
import { topDownBFS } from "./enumeration/topDownBFS.js"
import { topDownDFS } from "./enumeration/topDownDFS.js"
import { ASTNode } from "./lang/index.js"

declare global {
  interface Window {
    topDownBFS: typeof topDownBFS
    topDownDFS: typeof topDownDFS
    ASTNode: typeof ASTNode
    Alpine: Alpine
  }
  type ExampleType = {
    input: number[]
    output?: number
  }
}

export {}
