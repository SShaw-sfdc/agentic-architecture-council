import { openai } from "@ai-sdk/openai";

type CouncilRequestBody = {
  scenario: string;
  selectedMembers: string[];
};

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

  // Basic Vercel AI SDK setup; this model is ready for future generateText/streamText calls.
  const model = openai("gpt-4o-mini");

  const memberResponses = await Promise.all(
    cleanedMembers.map(async (member) => {
      // Placeholder for future AI SDK call per member.
      return {
        member,
        response: `Mock advice from ${member} for scenario: "${scenario}".`,
      };
    })
  );

  return Response.json({
    ok: true,
    scenario,
    selectedMembers: cleanedMembers,
    modelConfigured: !!model,
    responses: memberResponses,
  });
}
