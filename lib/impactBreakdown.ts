export function getImpactBreakdown(product: any) {
  const ingredients = product.ingredients_text?.split(",").length || 5;

  const packaging = product.packaging?.toLowerCase() || "";

  const name = product.product_name?.toLowerCase() || "";

  let processingImpact = Math.min(ingredients * 5, 100);

  let packagingImpact = packaging.includes("plastic")
    ? 80
    : packaging.includes("paper") || packaging.includes("glass")
      ? 30
      : 50;

  let ingredientComplexity = ingredients * 6;

  if (name.includes("instant")) processingImpact += 20;

  return {
    processingImpact: Math.min(processingImpact, 100),
    packagingImpact,
    ingredientComplexity: Math.min(ingredientComplexity, 100),
  };
}
