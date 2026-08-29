export type CaseSchema = {
  table: string
  columns: { name: string; type: string; note?: string }[]
}

export type SolutionField = {
  id: string
  label: string
  placeholder: string
  answer: string
  options?: string[]
}

export type PersonProfile = {
  id: number
  name: string
  avatar: string
  role?: string
  disabled?: boolean
}

export type Case = {
  id: string
  title: string
  brief: string
  story: string
  resolution: string
  difficulty: 1 | 2 | 3 | 4 | 5
  seedSql: string
  starterSql?: string
  schemas: CaseSchema[]
  persons?: PersonProfile[]
  hints: string[]
  solution: {
    question: string
    fields: SolutionField[]
  }
}
