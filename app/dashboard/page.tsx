"use client";

import { loadHistory } from "../../lib/history";
import { useEffect, useState } from "react";
import Link from "next/link";

const SCORE_COLORS: Record<string, string> = {
  A: "text-green-400 bg-green-400/10 border-green-400/20",
  B: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  C: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  D: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  E: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function Dashboard() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const scoreCount = history.reduce(
    (acc, item) => {
      acc[item.score] = (acc[item.score] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const bestScore = history.length
    ? history.reduce((best, item) =>
        item.score < best.score ? item : best
      )
    : null;

  return (
    <div className="min-h-screen grid-bg">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(74,222,128,0.06) 0%, transparent 70%)",
        }}
      />

      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-green-400/10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-7 h-7 rounded-lg bg-green-500/20 border border-green-400/30 flex items-center justify-center">
            <span className="text-green-400 text-xs font-bold">E</span>
          </div>
          <span
            className="font-semibold tracking-tight text-white group-hover:text-green-400 transition-colors"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            EcoLens
          </span>
        </Link>
        <Link
          href="/"
          className="text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to scanner
        </Link>
      </nav>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-14">
        <div className="mb-10">
          <h1
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Scan History
          </h1>
          <p className="text-white/30 text-sm">
            Your personal sustainability tracking log
          </p>
        </div>

        {history.length === 0 ? (
          <div className="eco-card rounded-2xl p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-green-400/10 border border-green-400/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-400 text-xl">○</span>
            </div>
            <p className="text-white/40 text-sm mb-4">
              No products scanned yet.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-green-400 text-sm hover:text-green-300 transition-colors"
            >
              Start scanning →
            </Link>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="eco-card rounded-xl p-4">
                <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1">
                  Total Scans
                </p>
                <p
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {history.length}
                </p>
              </div>
              <div className="eco-card rounded-xl p-4">
                <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1">
                  Best Score
                </p>
                <p
                  className="text-2xl font-bold text-green-400"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {bestScore?.score || "—"}
                </p>
              </div>
              <div className="eco-card rounded-xl p-4">
                <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1">
                  Unique Products
                </p>
                <p
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {new Set(history.map((h) => h.product)).size}
                </p>
              </div>
            </div>

            {/* Score distribution */}
            {Object.keys(scoreCount).length > 0 && (
              <div className="eco-card rounded-xl p-5 mb-6">
                <p className="text-[10px] text-white/25 uppercase tracking-widest mb-4">
                  Score Distribution
                </p>
                <div className="flex gap-2 items-end h-12">
                  {["A", "B", "C", "D", "E"].map((s) => {
                    const count = scoreCount[s] || 0;
                    const max = Math.max(...(Object.values(scoreCount) as number[]));
                    const pct = max ? (count / max) * 100 : 0;
                    return (
                      <div key={s} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t-sm transition-all"
                          style={{
                            height: `${pct}%`,
                            minHeight: count > 0 ? "6px" : "0",
                            background:
                              s === "A"
                                ? "#4ade80"
                                : s === "B"
                                ? "#60a5fa"
                                : s === "C"
                                ? "#fbbf24"
                                : s === "D"
                                ? "#fb923c"
                                : "#f87171",
                            opacity: count > 0 ? 1 : 0.15,
                          }}
                        />
                        <span className="text-[10px] text-white/30">{s}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* History list */}
            <div className="space-y-2">
              {[...history].reverse().map((item: any, index: number) => {
                const cls =
                  SCORE_COLORS[item.score] ||
                  "text-white/50 bg-white/5 border-white/10";
                return (
                  <div
                    key={index}
                    className="eco-card rounded-xl px-5 py-4 flex items-center justify-between fade-up"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm font-bold ${cls}`}
                      >
                        {item.score}
                      </div>
                      <div>
                        <p className="text-sm text-white/80 font-medium">
                          {item.product}
                        </p>
                        {item.date && (
                          <p className="text-xs text-white/25">
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-white/20">
                      #{history.length - index}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
