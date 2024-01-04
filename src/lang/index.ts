import { ASTNode, Add, Div, Expr, Index, IndexConstant, Mul, Sub, Term } from "./impl"

/*
grammar:

S = expr
expr = index | math
math =
  add expr expr
  | sub expr expr
  | mul expr expr
  | div expr expr
index = expr | C
C = 0....n

*/
export const GRAMMAR_START: (typeof ASTNode)[] = [Expr]
export const NON_TERMS: (typeof ASTNode)[] = [Expr, Index, Add, Sub, Mul, Div]
export const TERMINALS: (typeof Term)[] = [IndexConstant]
