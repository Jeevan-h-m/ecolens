export function saveHistory(product: string, score: string) {
  if (typeof window === "undefined") return;
  const existing = loadHistory();
  const updated = [
    ...existing,
    { product, score, date: new Date().toISOString() },
  ].slice(-50); // keep last 50
  localStorage.setItem("ecoHistory", JSON.stringify(updated));
}

export function loadHistory(): any[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("ecoHistory") || "[]");
  } catch {
    return [];
  }
}
