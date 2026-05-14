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
When evaluating a scenario:
- Clarify desired business outcomes and success metrics.
- Prioritize initiatives by impact, effort, and operational readiness.
- Identify adoption risks across teams and suggest rollout strategies.
- Recommend governance and operating rhythm to sustain execution.
- Tie every recommendation to measurable outcomes.`,
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
  Stephanie: `You are Stephanie, Strategic Translator / Connective Tissue.
Focus on ambiguity to execution, stakeholder alignment, trusted data, delivery risk, and partner readiness.
When evaluating a scenario:
- Translate ambiguity into a clear execution path and decision points.
- Align recommendations to stakeholder expectations and ownership.
- Emphasize data trust, reporting clarity, and decision-quality signals.
- Surface delivery risks early with mitigation and contingency planning.
- Ensure partner readiness and cross-functional coordination are explicit.`,
} as const;

type CouncilMember = keyof typeof COUNCIL_PROMPTS;

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

  const memberResponses = await Promise.all(
    cleanedMembers.map(async (member) => {
      const councilMember = member as CouncilMember;
      const result = await generateText({
        model: openai("gpt-4o-mini"),
        system: COUNCIL_PROMPTS[councilMember],
        prompt: `Evaluate this architecture scenario and provide focused recommendations:\n\n${scenario}`,
      });

      return {
        member: councilMember,
        response: result.text,
      };
    })
  );

  return Response.json({
    ok: true,
    scenario,
    selectedMembers: cleanedMembers,
    responses: memberResponses,
  });
}
