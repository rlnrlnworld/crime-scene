import { AlertTriangle } from 'lucide-react'

export function LiarNotice() {
  return (
    <div className="mt-4 inline-flex items-stretch">
      <span className="relative inline-flex items-center gap-1.5 px-2.5 py-0.5">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 400 40"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M6,9 C50,5 100,12 150,7 C200,3 250,13 300,8 C340,5 370,10 400,9 L400,33 C370,37 340,31 300,35 C250,39 200,30 150,36 C100,39 50,32 6,34 Z"
            fill="#ffb020"
            opacity="0.9"
          />
          <path
            d="M18,15 C80,13 140,17 200,14 C260,12 320,16 382,15"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M22,27 C82,29 142,25 202,28 C262,30 322,26 380,28"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
        <AlertTriangle
          className="relative w-4 h-4 shrink-0 text-black"
          strokeWidth={2.5}
        />
        <span className="relative text-[15px] font-bold text-black">
          범인은 거짓말을 하고 있다.
        </span>
      </span>
      <svg
        className="block w-2 self-stretch -ml-px pointer-events-none"
        viewBox="0 0 20 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,9 C5,7 10,10 15,8 C18,9 20,12 18,16 L18,26 C20,30 18,33 15,34 C10,36 5,32 0,34 Z"
          fill="#ffbe33"
        />
      </svg>
    </div>
  )
}
