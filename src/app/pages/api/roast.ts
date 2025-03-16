import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { username, profile, repos } = req.body;

    if (!username || !profile || !repos) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const prompt = `
      Roast this GitHub user based on their profile and repositories.

      Name: ${profile.name || username}
      Bio: ${profile.bio || "No bio, probably hiding their sins"}
      Repositories: ${repos.length} (wow...)

      Some repo highlights:
      ${repos.map((repo: any) => `- ${repo.name}: ${repo.description || "No description. Lazy?"}`).join("\n")}

      Now, generate a funny, sarcastic roast for this user based on their GitHub activity.
    `;

        const response = await openai.completions.create({
            model: "gpt-4o-mini",
            prompt,
            max_tokens: 100,
            temperature: 0.9,
        });

        res.status(200).json({ roast: response.choices[0].text.trim() });
    } catch (error) {
        console.error("OpenAI API error:", error);
        res.status(500).json({ error: "Failed to generate roast" });
    }
}
