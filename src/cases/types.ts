export type CaseSchema = {
  table: string
  columns: { name: string; type: string; note?: string }[]
}

export type SolutionField = {
  id: string
  label: string
  placeholder: string
  answer: string
}

export type Case = {
  id: string
  title: string
  brief: string
  story: string
  difficulty: 1 | 2 | 3 | 4 | 5
  seedSql: string
  starterSql?: string
  schemas: CaseSchema[]
  hints: string[]
  solution: {
    question: string
    fields: SolutionField[]
  }
}
