export default function Home() {
  const councilMembers = [
    {
      name: "Hunter",
      subtitle: "Builder / Implementation Realist",
      description:
        "Feasibility, speed, reusable assets, and shipping real solutions.",
    },
    {
      name: "Ian",
      subtitle: "Strategic Operator / Outcome Driver",
      description:
        "Scale, prioritization, adoption, consumption, and measurable outcomes.",
    },
    {
      name: "Ross",
      subtitle: "Ecosystem Strategist / Transformation Narrator",
      description:
        "Executive alignment, market positioning, transformation, and partner influence.",
    },
    {
      name: "Jeff",
      subtitle: "Systems Architect / Integration Rigor",
      description:
        "Enterprise complexity, integration depth, scalability, governance, and technical soundness.",
    },
    {
      name: "Stephanie",
      subtitle: "Strategic Translator / Connective Tissue",
      description:
        "Ambiguity to execution, stakeholder alignment, trusted data, delivery risk, and partner readiness.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 md:px-10">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur md:p-10">
        <header className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-sky-300">
            Agentic Architecture Council
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Consult Your Architecture Council
          </h1>
        </header>

        <form className="space-y-10">
          <section className="space-y-4">
            <label
              htmlFor="architecture-scenario"
              className="block text-lg font-medium text-slate-100"
            >
              Architecture Scenario
            </label>
            <textarea
              id="architecture-scenario"
              name="architectureScenario"
              rows={10}
              placeholder="Paste your architecture problem, constraints, and desired outcomes here..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-4 text-base text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
            />
          </section>

          <fieldset className="space-y-4">
            <legend className="text-lg font-medium text-slate-100">
              Select Council Members
            </legend>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {councilMembers.map((member) => (
                <label
                  key={member.name}
                  className="group relative cursor-pointer rounded-xl border border-slate-700 bg-slate-950/80 p-4 transition hover:border-sky-400"
                >
                  <input
                    type="checkbox"
                    name="councilMembers"
                    value={member.name}
                    className="peer sr-only"
                  />
                  <div className="absolute inset-0 rounded-xl ring-2 ring-transparent transition peer-checked:ring-sky-400 peer-focus-visible:ring-sky-300" />
                  <div className="relative space-y-2">
                    <h2 className="text-xl font-semibold text-white">
                      {member.name}
                    </h2>
                    <p className="text-sm font-medium text-sky-300">
                      {member.subtitle}
                    </p>
                    <p className="text-sm leading-6 text-slate-300">
                      {member.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-sky-500 px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-900 md:w-auto"
          >
            Consult the Council
          </button>
        </form>

        <section
          aria-live="polite"
          className="space-y-3 rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-6"
        >
          <h2 className="text-xl font-semibold text-white">Council Results</h2>
          <div className="min-h-32 rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-slate-400">
            {/* AI response output will appear here. */}
          </div>
        </section>
      </main>
    </div>
  );
}
