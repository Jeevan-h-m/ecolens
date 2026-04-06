export function getAIExplanation(product: any, score: string) {
  if (!product) return "No sustainability explanation available.";

  const ingredientsCount = product.ingredients_text?.split(",").length || 1;

  const packaging = product.packaging?.toLowerCase() || "unknown";

  let explanation = `Eco Score ${score} because `;

  if (ingredientsCount > 10) {
    explanation += "this product is highly processed with many ingredients. ";
  } else {
    explanation += "this product has relatively few ingredients. ";
  }

  if (packaging.includes("plastic")) {
    explanation += "Plastic packaging increases environmental impact. ";
  } else if (packaging === "unknown") {
    explanation +=
      "Packaging information is unavailable which increases uncertainty in sustainability scoring. ";
  } else {
    explanation += "Packaging appears more environmentally manageable. ";
  }

  explanation +=
    "Consider choosing products with simpler ingredients and recyclable packaging.";

  return explanation;
}
