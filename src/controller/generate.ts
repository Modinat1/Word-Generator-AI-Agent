import { Request, Response } from "express";
import { wordAgent } from "../mastra/agents/word-agent";

interface GenerateWordsRequest {
  action: string;
  context?: string;
  formalityLevel?: "formal" | "neutral" | "informal" | "all";
}

const generateWord = async (req: Request, res: Response) => {
  try {
    const { action, context, formalityLevel }: GenerateWordsRequest = req.body;

    if (!action || typeof action !== "string") {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Action is required and must be a string",
      });
    }

    const prompt = `Find appropriate words and synonyms for the action: "${action}"
${context ? `Context: ${context}` : ""}
${formalityLevel && formalityLevel !== "all" ? `Formality level: ${formalityLevel}` : ""}

Please provide:
1. Primary suggestions (most common words)
2. Formal alternatives (professional vocabulary)
3. Informal alternatives (casual words)
4. Creative alternatives (vivid, descriptive options)

For each word, include:
- The word itself
- Usage context
- An example sentence`;

    const response = await wordAgent.generate(prompt);

    res.status(200).json({
      success: true,
      data: {
        action,
        context,
        formalityLevel,
        suggestions: response.text,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating words:", error);

    const message =
      error instanceof Error ? error.message : "Failed to generate words";

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message,
    });
  }
};

export default generateWord;
