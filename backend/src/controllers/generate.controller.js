import { generateResponse } from "../services/generate.service.js";

export const generate = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid prompt.",
      });
    }

    const answer = await generateResponse(prompt.trim());

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("Groq API error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Failed to generate a response.",
    });
  }
};
