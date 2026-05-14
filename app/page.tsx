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

type MemberTheme = {
  accentText: string;
  hoverBorder: string;
  selectedBorder: string;
  selectedBg: string;
  selectedRing: string;
  responseTopBorder: string;
  responseBadge: string;
  responseGradient: string;
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
  const memberThemeByName: Record<string, MemberTheme> = {
    Hunter: {
      accentText: "text-amber-300",
      hoverBorder: "hover:border-amber-400/70",
      selectedBorder: "border-amber-500/80",
      selectedBg: "bg-amber-500/10",
      selectedRing: "ring-amber-400/80",
      responseTopBorder: "border-t-amber-400",
      responseBadge: "border border-amber-400/40 bg-amber-500/20 text-amber-200",
      responseGradient: "from-amber-950/35",
    },
    Ian: {
      accentText: "text-emerald-300",
      hoverBorder: "hover:border-emerald-400/70",
      selectedBorder: "border-emerald-500/80",
      selectedBg: "bg-emerald-500/10",
      selectedRing: "ring-emerald-400/80",
      responseTopBorder: "border-t-emerald-400",
      responseBadge:
        "border border-emerald-400/40 bg-emerald-500/20 text-emerald-200",
      responseGradient: "from-emerald-950/35",
    },
    Ross: {
      accentText: "text-indigo-300",
      hoverBorder: "hover:border-indigo-400/70",
      selectedBorder: "border-indigo-500/80",
      selectedBg: "bg-indigo-500/10",
      selectedRing: "ring-indigo-400/80",
      responseTopBorder: "border-t-indigo-400",
      responseBadge: "border border-indigo-400/40 bg-indigo-500/20 text-indigo-200",
      responseGradient: "from-indigo-950/35",
    },
    Jeff: {
      accentText: "text-slate-300",
      hoverBorder: "hover:border-slate-400/80",
      selectedBorder: "border-slate-400/90",
      selectedBg: "bg-slate-500/10",
      selectedRing: "ring-slate-300/80",
      responseTopBorder: "border-t-slate-300",
      responseBadge: "border border-slate-300/40 bg-slate-500/20 text-slate-200",
      responseGradient: "from-slate-800/50",
    },
    Stephanie: {
      accentText: "text-sky-300",
      hoverBorder: "hover:border-sky-400/70",
      selectedBorder: "border-sky-500/80",
      selectedBg: "bg-sky-500/10",
      selectedRing: "ring-sky-400/80",
      responseTopBorder: "border-t-sky-400",
      responseBadge: "border border-sky-400/40 bg-sky-500/20 text-sky-200",
      responseGradient: "from-sky-950/40",
    },
  };

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

      let data: {
        error?: string;
        responses?: CouncilResponse[];
      } = {};

      const rawBody = await response.text();
      if (rawBody) {
        try {
          data = JSON.parse(rawBody) as {
            error?: string;
            responses?: CouncilResponse[];
          };
        } catch {
          data = {};
        }
      }

      if (!response.ok) {
        setErrorMessage(data.error ?? "Unable to consult the council right now.");
        return;
      }

      setResponses(data.responses ?? []);
    } catch {
      setErrorMessage(
        "Unable to reach /api/council. Confirm the dev server is running and try again."
      );
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
          <p className="text-sm text-slate-300">
            Just for fun. Want more context? Visit{" "}
            <a
              href="/mylinks"
              className="font-medium text-sky-300 underline decoration-sky-400/60 underline-offset-2 transition hover:text-sky-200"
            >
              mylinks
            </a>
            .
          </p>
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
              {councilMembers.map((member) => {
                const isSelected = selectedMembers.includes(member.name);
                const theme = memberThemeByName[member.name];

                return (
                  <label
                    key={member.name}
                    className={`group relative cursor-pointer rounded-xl border bg-slate-950/80 p-4 transition ${theme.hoverBorder} ${
                      isSelected
                        ? `${theme.selectedBorder} ${theme.selectedBg}`
                        : "border-slate-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="councilMembers"
                      value={member.name}
                      checked={isSelected}
                      onChange={() => toggleMemberSelection(member.name)}
                      className="peer sr-only"
                    />
                    <div
                      className={`absolute inset-0 rounded-xl ring-2 transition ${
                        isSelected ? theme.selectedRing : "ring-transparent"
                      } peer-focus-visible:ring-slate-300`}
                    />
                    <div className="relative space-y-2">
                      <h2 className="text-xl font-semibold text-white">
                        {member.name}
                      </h2>
                      <p className={`text-sm font-medium ${theme.accentText}`}>
                        {member.subtitle}
                      </p>
                      <p className="text-sm leading-6 text-slate-300">
                        {member.description}
                      </p>
                    </div>
                  </label>
                );
              })}
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
                (() => {
                  const theme =
                    memberThemeByName[result.member] ??
                    memberThemeByName.Stephanie;

                  return (
                    <article
                      key={result.member}
                      className={`rounded-xl border border-slate-700 border-t-4 ${theme.responseTopBorder} bg-gradient-to-br ${theme.responseGradient} via-slate-900 to-slate-950 p-5 shadow-lg`}
                    >
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${theme.responseBadge}`}
                      >
                        {result.member}
                      </span>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-200">
                        {result.response}
                      </p>
                    </article>
                  );
                })()
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
