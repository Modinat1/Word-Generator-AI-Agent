import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface WordSuggestion {
  word: string;
  usage: string;
  example?: string;
}

interface WordResponse {
  action: string;
  analysis: string;
  primaryWords: WordSuggestion[];
  formal: WordSuggestion[];
  informal: WordSuggestion[];
  creative: WordSuggestion[];
  contextSpecific?: string;
}

export const wordTool = createTool({
  id: "get-action-words",
  description: "Get appropriate words and synonyms for a given action or verb",
  inputSchema: z.object({
    action: z.string().describe("The action or verb to find words for"),
    context: z
      .string()
      .optional()
      .describe(
        "Optional context for word usage (e.g., 'professional email', 'creative writing')"
      ),
    formalityLevel: z
      .enum(["formal", "neutral", "informal", "all"])
      .optional()
      .describe("Desired formality level"),
  }),
  outputSchema: z.object({
    action: z.string(),
    analysis: z.string(),
    primaryWords: z.array(
      z.object({
        word: z.string(),
        usage: z.string(),
        example: z.string().optional(),
      })
    ),
    formal: z.array(
      z.object({
        word: z.string(),
        usage: z.string(),
        example: z.string().optional(),
      })
    ),
    informal: z.array(
      z.object({
        word: z.string(),
        usage: z.string(),
        example: z.string().optional(),
      })
    ),
    creative: z.array(
      z.object({
        word: z.string(),
        usage: z.string(),
        example: z.string().optional(),
      })
    ),
    contextSpecific: z.string().optional(),
  }),
  execute: async ({ context }) => {
    return await getActionWords(
      context.action,
      context.context,
      context.formalityLevel
    );
  },
});

const getActionWords = async (
  action: string,
  context?: string,
  formalityLevel: "formal" | "neutral" | "informal" | "all" = "all"
): Promise<WordResponse> => {
  // This is a simple implementation that returns structured data
  // In a real scenario, you might call an external API or use an LLM
  // For now, we'll return a basic structure that the agent can enhance

  const baseAnalysis = `Analyzing the action "${action}"${context ? ` in the context of ${context}` : ""}`;

  // Basic word mappings (you can expand this or remove it entirely if you want pure LLM generation)
  const wordDatabase: Record<string, Partial<WordResponse>> = {
    walk: {
      primaryWords: [
        {
          word: "walk",
          usage: "most common, neutral term",
          example: "I walk to work every day.",
        },
        {
          word: "move",
          usage: "general movement",
          example: "Move carefully through the crowd.",
        },
      ],
      formal: [
        {
          word: "proceed",
          usage: "professional, structured contexts",
          example: "Please proceed to the conference room.",
        },
        {
          word: "traverse",
          usage: "formal, often for longer distances",
          example: "We will traverse the mountain path.",
        },
      ],
      informal: [
        {
          word: "stroll",
          usage: "casual, leisurely walking",
          example: "Let's stroll through the park.",
        },
        {
          word: "wander",
          usage: "aimless, relaxed walking",
          example: "I like to wander around the city.",
        },
      ],
      creative: [
        {
          word: "saunter",
          usage: "casual confidence, leisurely pace",
          example: "He sauntered into the room.",
        },
        {
          word: "amble",
          usage: "slow, relaxed walking",
          example: "They ambled along the beach.",
        },
      ],
    },
    talk: {
      primaryWords: [
        {
          word: "talk",
          usage: "most common, neutral",
          example: "We need to talk about the project.",
        },
        {
          word: "speak",
          usage: "slightly more formal than talk",
          example: "May I speak with you?",
        },
      ],
      formal: [
        {
          word: "communicate",
          usage: "professional, structured",
          example: "We must communicate our findings clearly.",
        },
        {
          word: "discourse",
          usage: "intellectual, formal discussion",
          example: "They discoursed on philosophy.",
        },
      ],
      informal: [
        {
          word: "chat",
          usage: "casual conversation",
          example: "Let's chat over coffee.",
        },
        {
          word: "gab",
          usage: "very casual, chatty",
          example: "They were gabbing all afternoon.",
        },
      ],
      creative: [
        {
          word: "converse",
          usage: "engaging dialogue",
          example: "We conversed for hours.",
        },
        {
          word: "parley",
          usage: "discussion, negotiation",
          example: "The leaders met to parley.",
        },
      ],
    },
  };

  // Get base suggestions from database or create empty structure
  const baseSuggestions = wordDatabase[action.toLowerCase()] || {
    primaryWords: [],
    formal: [],
    informal: [],
    creative: [],
  };

  return {
    action,
    analysis: baseAnalysis,
    primaryWords: baseSuggestions.primaryWords || [],
    formal: baseSuggestions.formal || [],
    informal: baseSuggestions.informal || [],
    creative: baseSuggestions.creative || [],
    contextSpecific: context
      ? `Context-specific suggestions for ${context} will be enhanced by the agent.`
      : undefined,
  };
};
