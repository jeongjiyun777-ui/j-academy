export default function AcademyBrand({ onDark = false }: { onDark?: boolean }) {
  return (
    <span className="group inline-flex select-none items-center gap-2 sm:gap-3">
      <span aria-hidden="true" className="relative grid size-8 shrink-0 place-items-center rounded-lg bg-linear-to-br from-sky-400 via-blue-600 to-indigo-700 text-base font-black text-white shadow-[0_3px_0_#1e3a8a,0_6px_12px_#2563eb33] transition-transform group-hover:-translate-y-0.5 group-active:translate-y-0.5 sm:size-10 sm:rounded-xl sm:text-xl">
        <span className="pointer-events-none absolute inset-x-1 top-0.5 h-1/2 rounded-t-lg bg-linear-to-b from-white/30 to-transparent" />
        <span className="relative">J</span>
      </span>
      <span className={`whitespace-nowrap bg-linear-to-r bg-clip-text text-[17px] font-extrabold tracking-[-0.045em] text-transparent drop-shadow-[0_1px_1px_#0f172a26] sm:text-[21px] ${onDark ? "from-white to-sky-300" : "from-slate-950 to-blue-700"}`}>
        j-academy
      </span>
    </span>
  );
}
