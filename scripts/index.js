"use strict";
const initialExamples = [
    {
        input: [5, 2, 1],
        output: 10,
    },
    {
        input: [3, 4, 6],
        output: 2,
    },
];
document.addEventListener("alpine:init", () => {
    console.log("yooo");
    // TODO add proper typign to globals
    const w = window;
    const topDownBFS = w.topDownBFS;
    const topDownDFS = w.topDownDFS;
    // @ts-ignore
    Alpine.data("myData", () => ({
        examples: initialExamples,
        program: undefined,
        output: "None",
        addExample() {
            this.examples.push({ input: [], output: 0 });
        },
        editExampleInput(idx, newInput) {
            const parsedInput = JSON.parse(newInput);
            if (Array.isArray(parsedInput) && parsedInput.length > 0 && parsedInput.every((v) => typeof v === "number")) {
                this.examples[idx].input = parsedInput;
            }
        },
        editExampleResult(idx, newResult) {
            const parsedInput = JSON.parse(newResult);
            if (typeof parsedInput === "number") {
                this.examples[idx].output = parsedInput;
            }
        },
        removeExample(idx) {
            this.examples.splice(idx, 1);
        },
        generate() {
            this.output = "...";
            try {
                this.program = topDownBFS(this.examples);
                if (!this.program) {
                    this.output = "no program found in time";
                }
                else {
                    this.output = this.program.toString();
                }
            }
            catch (e) {
                console.error(e);
                this.output = `${e}`;
            }
        },
    }));
});
