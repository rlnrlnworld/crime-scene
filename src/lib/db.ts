import { PGlite } from '@electric-sql/pglite'

let dbInstance: PGlite | null = null

export async function getDb(): Promise<PGlite> {
  if (dbInstance) return dbInstance
  dbInstance = new PGlite()
  await dbInstance.waitReady
  return dbInstance
}

export async function resetDb(seedSql: string): Promise<PGlite> {
  const db = await getDb()
  await db.exec(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END $$;
  `)
  await db.exec(seedSql)
  return db
}

export type QueryResult = {
  columns: string[]
  rows: unknown[][]
  rowCount: number
  elapsedMs: number
}

export async function runQuery(sql: string): Promise<QueryResult> {
  const db = await getDb()
  const start = performance.now()
  const res = await db.query(sql)
  const elapsedMs = Math.round(performance.now() - start)
  const columns = res.fields.map((f) => f.name)
  const rows = (res.rows as Record<string, unknown>[]).map((r) =>
    columns.map((c) => r[c]),
  )
  return { columns, rows, rowCount: rows.length, elapsedMs }
}
