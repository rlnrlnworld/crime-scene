export type CaseSchema = {
  table: string
  columns: { name: string; type: string; note?: string }[]
}

export type Case = {
  id: string
  title: string
  brief: string
  story: string
  seedSql: string
  starterSql?: string
  schemas: CaseSchema[]
  hints: string[]
  solution: {
    question: string
    answer: string
  }
}
