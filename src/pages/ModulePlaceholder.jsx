
export function PublicPlaceholderPage({ eyebrow, title, description }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">

      <div className="max-w-3xl">
        <span className="inline-flex rounded-full bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#DB1D2D]">
          {eyebrow}
        </span>

        <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight text-[#182131] sm:text-6xl">
          {title}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-500">
          {description}
        </p>

        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-7">
          <p className="text-sm font-semibold text-[#182131]">
            Ankvidhya official content
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This page is under development. Its final information
            and design will be prepared using the official content
            provided for Ankvidhya.
          </p>
        </div>
      </div>

    </section>
  );
}

export function AdminModulePlaceholder({ title, description }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DB1D2D]">
        Administration
      </p>

      <h1 className="mt-2 text-3xl font-extrabold text-[#182131]">
        {title}
      </h1>

      <p className="mt-3 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <h2 className="text-lg font-bold text-[#182131]">
          Module foundation ready
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          The database and administration route are prepared.
          We'll implement the module functionality in the next
          development phase.
        </p>
      </div>
    </div>
  );
}
