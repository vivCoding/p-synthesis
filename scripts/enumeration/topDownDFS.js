import { GRAMMAR_START } from "../lang/index.js";
const MAX_DEPTH = 15;
export function topDownDFS(examples) {
    if (examples.length === 0)
        return null;
    for (let i = 0; i < GRAMMAR_START.length; i++) {
        const program = new GRAMMAR_START[i]();
        const res = dfs(program, 0, examples);
        if (res)
            return res;
    }
    return null;
}
function dfs(program, depth, examples) {
    console.log(depth, program.toString());
    const firstHole = findFirstHole(program);
    const isComplete = !firstHole;
    if (isComplete && validateProgram(program, examples)) {
        return program;
    }
    else if (isComplete) {
        return null;
    }
    if (depth > MAX_DEPTH)
        return null;
    const { node, holeName } = firstHole;
    const newNodes = node.produceForHole(holeName, { inputLength: examples[0].input.length });
    for (let i = 0; i < newNodes.length; i++) {
        node.holes[holeName] = newNodes[i];
        const res = dfs(program, depth + 1, examples);
        if (res)
            return res;
        node.holes[holeName] = undefined;
    }
    return null;
}
function findFirstHole(program) {
    for (const [holeName, node] of Object.entries(program.holes)) {
        if (node === undefined)
            return { node: program, holeName };
        const firstHole = findFirstHole(node);
        if (firstHole)
            return firstHole;
    }
    return null;
}
function validateProgram(program, examples) {
    return examples.every(({ input, output }) => program.run({ arr: input }) === output);
}
