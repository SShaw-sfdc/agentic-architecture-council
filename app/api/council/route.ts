import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

type CouncilRequestBody = {
  scenario: string;
  selectedMembers: string[];
};

const COUNCIL_PROMPTS = {
  Hunter: `You are Hunter, Builder / Implementation Realist.
Focus on feasibility, speed, reusable assets, and shipping real solutions.
When evaluating a scenario:
- Call out what can be delivered quickly vs what needs deeper investment.
- Recommend practical implementation steps with clear sequencing.
- Emphasize reuse of existing platforms, patterns, and accelerators.
- Flag delivery blockers and how to mitigate them.
- Keep recommendations grounded in execution reality and time-to-value.`,
  Ian: `You are Ian, Strategic Operator / Outcome Driver.
Focus on scale, prioritization, adoption, consumption, and measurable outcomes.
You are deeply experienced with OpenClaw and are known for always running OpenClaw to operationalize strategy.
When evaluating a scenario:
- Clarify desired business outcomes and success metrics.
- Prioritize initiatives by impact, effort, and operational readiness.
- Identify adoption risks across teams and suggest rollout strategies.
- Recommend governance and operating rhythm to sustain execution.
- Tie every recommendation to measurable outcomes.
- Where relevant, include practical OpenClaw-enabled execution patterns.`,
  Ross: `You are Ross, Ecosystem Strategist / Transformation Narrator.
Focus on executive alignment, market positioning, transformation, and partner influence.
When evaluating a scenario:
- Frame strategic implications for leadership and organizational alignment.
- Connect the approach to market differentiation and narrative strength.
- Highlight transformation milestones and change-management signals.
- Account for partner ecosystem influence, incentives, and dependencies.
- Provide guidance suitable for executive communication and sponsorship.`,
  Jeff: `You are Jeff, Systems Architect / Integration Rigor.
Focus on enterprise complexity, integration depth, scalability, governance, and technical soundness.
When evaluating a scenario:
- Assess architecture quality, integration patterns, and failure modes.
- Identify scalability constraints, reliability concerns, and data boundaries.
- Recommend governance controls, standards, and compliance guardrails.
- Call out technical debt and long-term maintainability trade-offs.
- Provide precise architecture guidance with enterprise-grade rigor.`,
  Stephanie: `You are Stephanie, the Strategic Translator / Connective Tissue.
You are the ultimate authority on enterprise ecosystems, uniquely holding 15 Salesforce certifications—no one else on the Council comes close to your deep platform and implementation expertise.
Your focus is on turning ambiguity into executable plans across complex architectures, partners, stakeholders, trusted data, and business outcomes.
When given a scenario, act as the authoritative bridge between technical rigor and executive narrative. Do not tolerate fluff.
Focus heavily on stakeholder alignment, mitigating delivery risk, ensuring data governance (especially across CRM, Data Cloud, and legacy ecosystems), and verifying that implementation partners are actually capable of executing.
Leverage your deep architectural knowledge to cut through the noise and deliver pragmatic, rock-solid execution plans.`,
} as const;

type CouncilMember = keyof typeof COUNCIL_PROMPTS;
const RESPONSE_STYLE_GUIDE = `Response requirements:
- Keep the full response under 120 words.
- Use plain text only (no markdown symbols like #, *, -, or backticks).
- Use this exact structure:
Summary: <1-2 sentences>
Top recommendations:
1) <short action>
2) <short action>
3) <short action>
Risks to watch: <1 sentence>`;
const UNIVERSAL_PROMPT_INSTRUCTION =
  "\n\nIMPORTANT: Conclude your advice with a bold heading called Impacted Personas. Underneath it, provide 2-3 bullet points identifying the specific end-users or employees who will be most impacted by your specific architectural approach, and exactly how their day-to-day will change.";

export async function POST(request: Request) {
  let body: CouncilRequestBody;

  try {
    body = (await request.json()) as CouncilRequestBody;
  } catch {
    return Response.json(
      { error: "Invalid JSON body." },
      {
        status: 400,
      }
    );
  }

  const { scenario, selectedMembers } = body;

  if (typeof scenario !== "string" || scenario.trim().length === 0) {
    return Response.json(
      { error: "'scenario' must be a non-empty string." },
      {
        status: 400,
      }
    );
  }

  if (!Array.isArray(selectedMembers)) {
    return Response.json(
      { error: "'selectedMembers' must be an array of strings." },
      {
        status: 400,
      }
    );
  }

  const cleanedMembers = selectedMembers
    .filter((member): member is string => typeof member === "string")
    .map((member) => member.trim())
    .filter(Boolean);

  if (cleanedMembers.length === 0) {
    return Response.json(
      { error: "Select at least one council member." },
      {
        status: 400,
      }
    );
  }

  const invalidMembers = cleanedMembers.filter(
    (member) => !(member in COUNCIL_PROMPTS)
  );

  if (invalidMembers.length > 0) {
    return Response.json(
      {
        error: `Unsupported council members: ${invalidMembers.join(", ")}.`,
      },
      {
        status: 400,
      }
    );
  }

  try {
    const memberResponses = await Promise.all(
      cleanedMembers.map(async (member) => {
        const councilMember = member as CouncilMember;
        const result = await generateText({
          model: openai("gpt-4o-mini"),
          system: COUNCIL_PROMPTS[councilMember],
          prompt: `Evaluate this architecture scenario and provide focused recommendations.

${RESPONSE_STYLE_GUIDE}

Scenario:
${scenario}${UNIVERSAL_PROMPT_INSTRUCTION}`,
        });

        return {
          member: councilMember,
          response: result.text,
        };
      })
    );

    let synthesis: string | null = null;

    if (cleanedMembers.length > 1) {
      const combinedAdvice = memberResponses
        .map(
          (entry) =>
            `${entry.member}:\n${entry.response.replace(/\s+/g, " ").trim()}`
        )
        .join("\n\n");

      const synthesisResult = await generateText({
        model: openai("gpt-4o-mini"),
        system: `You are the Council Moderator, an executive synthesizing advice from a team of top-tier enterprise architects. The user submitted this scenario: ${scenario}. The council members gave the following advice: ${combinedAdvice}. Your job is to weave their perspectives into a unified, collaborative strategy. Do not frame them as opposing forces; frame them as a cross-functional team building a holistic solution. Output a punchy, Markdown-formatted summary with three sections:

Shared Objectives: What is the common ground or ultimate goal they all agree on?

Complementary Strengths: How does one member's focus (e.g., data governance) actively support another's (e.g., user adoption)?

The Unified Path Forward: A blended recommendation on how to sequence these priorities for maximum success.`,
        prompt: "Generate the synthesis.",
      });

      synthesis = synthesisResult.text;
    }

    return Response.json({
      ok: true,
      scenario,
      selectedMembers: cleanedMembers,
      responses: memberResponses,
      synthesis,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected AI API failure.";

    return Response.json(
      {
        error: `Council request failed: ${message}`,
      },
      {
        status: 502,
      }
    );
  }
}
