import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { product } = await req.json();

    const productName = product.product_name || "Unknown Product";
    const ingredients = product.ingredients_text || "Not listed";
    const packaging = product.packaging || "Unknown";
    const ecoscore = product.ecoscore_grade?.toUpperCase() || "N/A";
    const nutriscore = product.nutriscore_grade?.toUpperCase() || "N/A";
    const categories = product.categories || "Not specified";

    const prompt = `<s>[INST] You are an environmental sustainability expert. Analyze this food product and give a structured sustainability assessment.

Product: ${productName}
Eco Score: ${ecoscore}
Nutri Score: ${nutriscore}
Packaging: ${packaging}
Categories: ${categories}
Ingredients: ${ingredients.substring(0, 300)}

Respond ONLY with this exact format (no extra text):
Impact Level: [Low/Medium/High/Very High]
Main Concern: [1 sentence about the biggest environmental issue]
Packaging: [1 sentence about packaging impact]
Better Alternative: [1 specific eco-friendly product suggestion]
Tip: [1 actionable shopping tip] [/INST]`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.4,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HF API error: ${response.status}`);
    }

    const result = await response.json();
    const raw = result[0]?.generated_text || "";
    const cleaned = raw.replace(/\[INST\]|\[\/INST\]/g, "").trim();

    return NextResponse.json({ explanation: cleaned });
  } catch (error) {
    console.error("AI explain error:", error);
    return NextResponse.json(
      { explanation: "AI explanation unavailable. Please try again." },
      { status: 500 }
    );
  }
}
