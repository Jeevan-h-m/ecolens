export async function getRealAIExplanation(product: any) {
  try {
    const res = await fetch("/api/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product }),
    });

    const data = await res.json();

    return data.explanation;
  } catch {
    return "AI explanation unavailable.";
  }
}
