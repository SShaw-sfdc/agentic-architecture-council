"use client";

import { useState } from "react";

type CouncilMember = {
  name: string;
  subtitle: string;
  description: string;
};

type CouncilResponse = {
  member: string;
  response: string;
};

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
  ] satisfies CouncilMember[];

  const [scenario, setScenario] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [responses, setResponses] = useState<CouncilResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleMemberSelection = (memberName: string) => {
    setSelectedMembers((current) =>
      current.includes(memberName)
        ? current.filter((member) => member !== memberName)
        : [...current, memberName]
    );
  };

  const handleConsultCouncil = async () => {
    setErrorMessage("");
    setResponses([]);

    if (!scenario.trim()) {
      setErrorMessage("Please enter an architecture scenario before consulting.");
      return;
    }

    if (selectedMembers.length === 0) {
      setErrorMessage("Please select at least one council member.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/council", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenario,
          selectedMembers,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        responses?: CouncilResponse[];
      };

      if (!response.ok) {
        setErrorMessage(data.error ?? "Unable to consult the council right now.");
        return;
      }

      setResponses(data.responses ?? []);
    } catch {
      setErrorMessage("Network error while consulting the council.");
    } finally {
      setIsLoading(false);
    }
  };

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

        <form className="space-y-10" onSubmit={(event) => event.preventDefault()}>
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
              value={scenario}
              onChange={(event) => setScenario(event.target.value)}
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
                    checked={selectedMembers.includes(member.name)}
                    onChange={() => toggleMemberSelection(member.name)}
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
            type="button"
            onClick={handleConsultCouncil}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-sky-500 px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-sky-800/60 md:w-auto"
          >
            {isLoading ? "Consulting the Council..." : "Consult the Council"}
          </button>
          {errorMessage ? (
            <p className="text-sm font-medium text-rose-300">{errorMessage}</p>
          ) : null}
        </form>

        <section
          aria-live="polite"
          className="space-y-3 rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-6"
        >
          <h2 className="text-xl font-semibold text-white">Council Results</h2>
          {responses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {responses.map((result) => (
                <article
                  key={result.member}
                  className="rounded-xl border border-sky-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/30 p-5 shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-sky-300">
                    {result.member}
                  </h3>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-200">
                    {result.response}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="min-h-32 rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-slate-400">
              {isLoading
                ? "Gathering perspectives from your selected council members..."
                : "Results from the selected council members will appear here."}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
