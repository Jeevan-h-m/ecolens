import { fallbackEcoScore } from "./ecoScore";

export function compareProducts(productA: any, productB: any) {
  const scoreA =
    productA.ecoscore_grade?.toUpperCase() || fallbackEcoScore(productA);

  const scoreB =
    productB.ecoscore_grade?.toUpperCase() || fallbackEcoScore(productB);

  const valueA = scoreA.charCodeAt(0);
  const valueB = scoreB.charCodeAt(0);

  if (valueA < valueB) {
    return `${productA.product_name} is more sustainable than ${productB.product_name}`;
  }

  if (valueB < valueA) {
    return `${productB.product_name} is more sustainable than ${productA.product_name}`;
  }

  return "Both products have similar sustainability impact.";
}
