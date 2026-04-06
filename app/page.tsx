"use client";

import { useState } from "react";
import { fetchProduct } from "../lib/fetchProduct";
import { fallbackEcoScore } from "../lib/ecoScore";
import { saveHistory } from "../lib/history";
import { compareProducts } from "../lib/compareProducts";
import { getImpactBreakdown } from "../lib/impactBreakdown";
import { getRealAIExplanation } from "../lib/realAIExplain";
import Link from "next/link";

const SCORE_COLORS: Record<string, string> = {
  A: "score-a",
  B: "score-b",
  C: "score-c",
  D: "score-d",
  E: "score-e",
};

const SCORE_LABELS: Record<string, string> = {
  A: "Excellent",
  B: "Good",
  C: "Moderate",
  D: "Poor",
  E: "Very Poor",
};

function ScoreBadge({ score }: { score: string }) {
  const cls = SCORE_COLORS[score] || "score-c";
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${cls}`}
    >
      <span className="text-2xl font-black">{score}</span>
      <span className="opacity-80">{SCORE_LABELS[score] || "Unknown"}</span>
    </div>
  );
}

function ImpactBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-green-300/60 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-xs text-white/40">{value}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ParsedExplanation({ text }: { text: string }) {
  const lines = text.split("\n").filter((l) => l.trim());
  const parsed: { key: string; value: string }[] = [];

  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > -1) {
      parsed.push({
        key: line.substring(0, colonIdx).trim(),
        value: line.substring(colonIdx + 1).trim(),
      });
    }
  }

  if (parsed.length === 0) {
    return <p className="text-green-300/70 text-sm leading-relaxed">{text}</p>;
  }

  const icons: Record<string, string> = {
    "Impact Level": "⚡",
    "Main Concern": "⚠",
    Packaging: "📦",
    "Better Alternative": "✦",
    Tip: "→",
  };

  return (
    <div className="space-y-3">
      {parsed.map((item, i) => (
        <div key={i} className="flex gap-3">
          <span className="text-green-400 text-sm mt-0.5 shrink-0">
            {icons[item.key] || "•"}
          </span>
          <div>
            <span className="text-xs text-green-300/50 uppercase tracking-wider block mb-0.5">
              {item.key}
            </span>
            <span className="text-white/80 text-sm leading-relaxed">
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [query2, setQuery2] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [product2, setProduct2] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [aiExplanation, setAIExplanation] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setNotFound(false);
    setProduct(null);
    setProduct2(null);
    setAIExplanation("");

    try {
      const result = await fetchProduct(query);
      if (!result || !result.product_name) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProduct(result);
      const score =
        result.ecoscore_grade?.toUpperCase() || fallbackEcoScore(result);
      saveHistory(result.product_name || query, score);

      setAiLoading(true);
      const explanation = await getRealAIExplanation(result);
      setAIExplanation(explanation);
      setAiLoading(false);
    } catch (error) {
      console.error("Search failed:", error);
    }

    setLoading(false);
  }

  async function handleCompare() {
    if (!query.trim() || !query2.trim()) return;
    setComparing(true);
    setNotFound(false);

    try {
      const [resultA, resultB] = await Promise.all([
        fetchProduct(query),
        fetchProduct(query2),
      ]);

      if (!resultA?.product_name || !resultB?.product_name) {
        setNotFound(true);
        setComparing(false);
        return;
      }

      setProduct(resultA);
      setProduct2(resultB);
      setAIExplanation("");
    } catch (error) {
      console.error("Compare failed:", error);
    }

    setComparing(false);
  }

  const ecoScore =
    product?.ecoscore_grade?.toUpperCase() ||
    (product ? fallbackEcoScore(product) : null);

  const ecoScore2 =
    product2?.ecoscore_grade?.toUpperCase() ||
    (product2 ? fallbackEcoScore(product2) : null);

  const impact = product ? getImpactBreakdown(product) : null;

  return (
    <div className="min-h-screen grid-bg relative">
      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(74,222,128,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-green-400/10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-green-500/20 border border-green-400/30 flex items-center justify-center">
            <span className="text-green-400 text-xs font-bold">E</span>
          </div>
          <span
            className="font-semibold tracking-tight text-white"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            EcoLens
          </span>
          <span className="text-[10px] text-green-400/50 border border-green-400/20 rounded px-1.5 py-0.5 uppercase tracking-wider">
            AI
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <span className="text-white/40 text-xs">SDG-12 · Responsible Consumption</span>
          <Link
            href="/dashboard"
            className="text-green-400/70 hover:text-green-400 transition-colors text-sm"
          >
            History →
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs text-green-400/60 border border-green-400/15 rounded-full px-3 py-1.5 mb-6 uppercase tracking-widest">
            <span className="w-1 h-1 rounded-full bg-green-400 inline-block animate-pulse" />
            Sustainability Scanner
          </div>

          <h1
            className="text-5xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            <span className="text-white">Know before</span>
            <br />
            <span
              className="text-green-400"
              style={{ textShadow: "0 0 40px rgba(74,222,128,0.3)" }}
            >
              you buy.
            </span>
          </h1>

          <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
            Analyze real-time environmental impact of food products using
            Open Food Facts data and AI-powered sustainability insights.
          </p>
        </div>

        {/* Search */}
        <div className="eco-card rounded-2xl p-6 mb-6">
          <div className="space-y-3 mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Product name — e.g. Maggi, Coca Cola..."
                className="eco-input w-full rounded-xl px-4 py-3.5 text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Compare with another product (optional)"
                className="eco-input w-full rounded-xl px-4 py-3.5 text-sm"
                value={query2}
                onChange={(e) => setQuery2(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                "Analyze Product"
              )}
            </button>

            {query2.trim() && (
              <button
                onClick={handleCompare}
                disabled={comparing || !query.trim()}
                className="px-5 py-3 rounded-xl border border-green-400/25 text-green-400 hover:bg-green-400/10 disabled:opacity-40 text-sm font-medium transition-all"
              >
                {comparing ? "Comparing..." : "Compare"}
              </button>
            )}
          </div>
        </div>

        {/* Not found */}
        {notFound && (
          <div className="eco-card rounded-2xl p-5 mb-6 border-red-500/20 fade-up">
            <p className="text-red-400/80 text-sm text-center">
              Product not found in Open Food Facts database. Try a different name or barcode.
            </p>
          </div>
        )}

        {/* Product Result */}
        {product && !product2 && (
          <div className="space-y-4 fade-up">
            {/* Main card */}
            <div className="eco-card rounded-2xl p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2
                    className="text-lg font-bold text-white mb-1"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {product.product_name}
                  </h2>
                  <p className="text-xs text-white/35">
                    {product.brands || "Unknown brand"}{" "}
                    {product.countries_tags?.[0]
                      ? `· ${product.countries_tags[0].replace("en:", "")}`
                      : ""}
                  </p>
                </div>
                {ecoScore && <ScoreBadge score={ecoScore} />}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  {
                    label: "Packaging",
                    value: product.packaging
                      ? product.packaging.split(",")[0]
                      : "Unknown",
                  },
                  {
                    label: "Ingredients",
                    value: product.ingredients_text
                      ? `${product.ingredients_text.split(",").length} items`
                      : "Unknown",
                  },
                  {
                    label: "Nutri-Score",
                    value:
                      product.nutriscore_grade?.toUpperCase() || "N/A",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/3 border border-white/6 rounded-xl p-3"
                  >
                    <p className="text-[10px] text-white/35 uppercase tracking-wider mb-1">
                      {stat.label}
                    </p>
                    <p className="text-sm text-white/70 font-medium truncate">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Impact bars */}
              {impact && (
                <div className="border-t border-white/5 pt-5">
                  <p className="text-[10px] text-white/25 uppercase tracking-widest mb-4">
                    Environmental Impact Breakdown
                  </p>
                  <ImpactBar
                    label="Processing impact"
                    value={impact.processingImpact}
                    color="bg-red-400"
                  />
                  <ImpactBar
                    label="Packaging impact"
                    value={impact.packagingImpact}
                    color="bg-amber-400"
                  />
                  <ImpactBar
                    label="Ingredient complexity"
                    value={impact.ingredientComplexity}
                    color="bg-blue-400"
                  />
                </div>
              )}
            </div>

            {/* AI Explanation */}
            <div className="eco-card rounded-2xl p-6 delay-100 fade-up">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] text-green-400/50 uppercase tracking-widest">
                  AI Analysis
                </span>
                <span className="text-[10px] text-white/20 border border-white/10 rounded px-1.5 py-0.5">
                  Mistral 7B via HuggingFace
                </span>
              </div>

              {aiLoading ? (
                <div className="space-y-3">
                  {[40, 60, 50, 70, 55].map((w, i) => (
                    <div
                      key={i}
                      className="h-3 rounded-full loading-pulse"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                  <p className="text-xs text-white/25 mt-2">
                    Generating sustainability analysis...
                  </p>
                </div>
              ) : aiExplanation ? (
                <ParsedExplanation text={aiExplanation} />
              ) : null}
            </div>
          </div>
        )}

        {/* Comparison Result */}
        {product && product2 && (
          <div className="fade-up">
            <p className="text-[10px] text-white/25 uppercase tracking-widest text-center mb-4">
              Comparison
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { prod: product, score: ecoScore },
                { prod: product2, score: ecoScore2 },
              ].map(({ prod, score }, i) => (
                <div
                  key={i}
                  className={`eco-card rounded-2xl p-5 ${
                    compareProducts(product, product2).startsWith(
                      prod.product_name
                    )
                      ? "border-green-400/30"
                      : ""
                  }`}
                >
                  <p className="text-xs text-white/40 mb-3 uppercase tracking-wider">
                    Product {i + 1}
                  </p>
                  <h3
                    className="text-sm font-semibold mb-3 leading-tight"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {prod.product_name}
                  </h3>
                  {score && <ScoreBadge score={score} />}

                  <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                    {[
                      { k: "Brand", v: prod.brands || "Unknown" },
                      {
                        k: "Packaging",
                        v: prod.packaging?.split(",")?.[0] || "Unknown",
                      },
                    ].map(({ k, v }) => (
                      <div key={k} className="flex justify-between text-xs">
                        <span className="text-white/30">{k}</span>
                        <span className="text-white/60 truncate ml-2 max-w-[80px]">
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="eco-card rounded-2xl p-5 border-green-400/20">
              <p className="text-green-400 text-sm font-medium text-center">
                {compareProducts(product, product2)}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-white/15 text-xs">
            Data from{" "}
            <a
              href="https://world.openfoodfacts.org"
              className="text-green-400/40 hover:text-green-400/60 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              Open Food Facts
            </a>{" "}
            · AI by HuggingFace Mistral · SDG-12
          </p>
        </div>
      </main>
    </div>
  );
}
