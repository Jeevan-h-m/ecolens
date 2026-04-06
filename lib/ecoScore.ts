export function fallbackEcoScore(product: any) {
  let score = 50;

  const ingredients = product.ingredients_text?.split(",").length || 5;

  const packaging = product.packaging?.toLowerCase() || "";

  const name = product.product_name?.toLowerCase() || "";

  if (packaging.includes("plastic")) score -= 15;
  if (ingredients > 10) score -= 10;
  if (name.includes("instant")) score -= 10;
  if (name.includes("organic")) score += 10;
  if (name.includes("plant")) score += 10;

  if (score >= 80) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  if (score >= 20) return "D";

  return "E";
}
