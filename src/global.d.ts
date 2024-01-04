import { Alpine } from "alpinejs"

declare global {
  interface Window {
    Alpine: Alpine
  }
  type ExampleType = {
    input: number[]
    output?: number
  }
}

export {}
