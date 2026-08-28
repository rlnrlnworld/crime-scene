import { useEffect } from 'react'
import { HelpCircle } from 'lucide-react'
import { Button } from './Button'

type Props = {
  open: boolean
  onClose: () => void
}

type Section = {
  keyword: string
  desc: string
  example: string
}

const SECTIONS: Section[] = [
  {
    keyword: 'SELECT · FROM',
    desc: '테이블에서 원하는 컬럼을 조회. `*` 는 모든 컬럼.',
    example: 'SELECT name, age FROM person;',
  },
  {
    keyword: 'WHERE',
    desc: '조건에 맞는 행만 필터. `=`, `!=`, `<`, `>`, `AND`, `OR`.',
    example: "SELECT * FROM person\nWHERE age > 30 AND city = 'Seoul';",
  },
  {
    keyword: 'LIKE',
    desc: '부분 문자열 매칭. `%` 는 아무 문자열, `_` 는 한 글자.',
    example: "SELECT * FROM person\nWHERE name LIKE '김%';",
  },
  {
    keyword: 'ORDER BY · LIMIT',
    desc: '정렬 (`ASC`/`DESC`) 과 개수 제한.',
    example: 'SELECT * FROM person\nORDER BY age DESC LIMIT 5;',
  },
  {
    keyword: 'JOIN',
    desc: '두 테이블을 공통 컬럼으로 연결. `INNER JOIN` 이 기본.',
    example:
      'SELECT p.name, c.brand\nFROM person p\nJOIN car c ON c.owner_id = p.id;',
  },
  {
    keyword: 'GROUP BY · COUNT',
    desc: '그룹별 집계. `COUNT`, `SUM`, `AVG`, `MAX`, `MIN` 사용.',
    example:
      'SELECT city, COUNT(*) AS cnt\nFROM person\nGROUP BY city;',
  },
  {
    keyword: 'IN · BETWEEN',
    desc: '값 목록/범위 매칭.',
    example:
      "SELECT * FROM person\nWHERE city IN ('Seoul', 'Busan')\n  AND age BETWEEN 20 AND 40;",
  },
  {
    keyword: 'DISTINCT',
    desc: '중복 제거.',
    example: 'SELECT DISTINCT city FROM person;',
  },
]

export function HelpModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-8 md:p-12 bg-black/55 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-full flex"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-4 -left-3 z-10 px-3 py-1 border-[2.5px] border-[var(--color-line)] bg-[var(--color-teal)] text-black font-bold text-[15px] sketchy-tag -rotate-[5deg] shadow-[3px_3px_0_var(--color-shadow)] inline-flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
          SQL CHEAT SHEET
        </div>

        <div className="w-full max-h-full overflow-hidden sketchy border-[2.5px] border-[var(--color-line)] bg-[var(--color-surface)] shadow-[6px_6px_0_rgba(0,0,0,0.7)] flex flex-col">
          <div className="relative px-8 pt-8 pb-5 border-b-[2.5px] border-[var(--color-line)] shrink-0">
            <div className="flex items-center gap-2 text-[15px] text-[var(--color-muted)] font-mono">
              <span>sql</span>
              <span className="text-[var(--color-accent)]">basics</span>
            </div>
            <h2 className="mt-2 text-[28px] md:text-[32px] font-bold text-[var(--color-paper)] leading-[1.1] tracking-tight">
              SQL 기본 문법
            </h2>
            <p className="mt-3 text-[16px] text-[var(--color-paper)]/85 leading-relaxed">
              SQL 에 미숙하다면 확인하고 시작하라.
            </p>
          </div>

          <div className="overflow-auto px-8 py-6 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SECTIONS.map((s, i) => (
                <div
                  key={s.keyword}
                  className={`p-4 border-[2px] border-[var(--color-line)] sketchy-${
                    (i % 3) + 1
                  } bg-[var(--color-ink-2)] shadow-[3px_3px_0_var(--color-shadow)]`}
                >
                  <div className="text-[15px] font-bold text-[var(--color-accent)] font-mono tracking-wide mb-2">
                    {s.keyword}
                  </div>
                  <div className="text-[15px] text-[var(--color-paper)]/90 leading-relaxed mb-3">
                    {renderInline(s.desc)}
                  </div>
                  <pre className="text-[14px] font-mono text-[var(--color-paper)] bg-[var(--color-ink)] border-[1.5px] border-[var(--color-line-dim)] rounded px-3 py-2 overflow-x-auto whitespace-pre">
                    {s.example}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          <div className="px-8 py-4 border-t-[2.5px] border-[var(--color-line)] bg-[var(--color-ink-2)] flex items-center justify-between shrink-0">
            <span className="text-[15px] text-[var(--color-muted)] font-mono">
              esc 로 닫기
            </span>
            <Button variant="secondary" size="md" onClick={onClose}>
              닫기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`)/g)
  return parts.map((p, i) =>
    p.startsWith('`') && p.endsWith('`') ? (
      <code
        key={i}
        className="bg-[var(--color-accent-shadow)] text-[var(--color-accent)] px-1.5 py-0.5 rounded font-mono text-[14px]"
      >
        {p.slice(1, -1)}
      </code>
    ) : (
      <span key={i}>{p}</span>
    ),
  )
}
