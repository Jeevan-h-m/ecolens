import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { error: "No product name provided" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${name}&json=true`,
    );

    const data = await response.json();

    if (!data.products.length) {
      return NextResponse.json({});
    }

    // Try to find best English match first
    const bestMatch =
      data.products.find((p: any) =>
        p.product_name?.toLowerCase().includes(name.toLowerCase()),
      ) || data.products[0];

    return NextResponse.json(bestMatch);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
