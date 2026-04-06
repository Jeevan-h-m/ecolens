import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "No product name provided" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(name)}&search_simple=1&action=process&json=1&page_size=10&fields=product_name,brands,packaging,ingredients_text,ecoscore_grade,nutriscore_grade,categories,countries_tags`,
      { headers: { "User-Agent": "EcoLensAI/1.0" } }
    );

    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const withName = data.products.filter((p: any) => p.product_name);
    const bestMatch =
      withName.find((p: any) =>
        p.product_name?.toLowerCase().includes(name.toLowerCase())
      ) || withName[0] || data.products[0];

    return NextResponse.json(bestMatch);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}