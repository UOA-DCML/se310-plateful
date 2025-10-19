// src/recommendations/useRecommendations.js
import { useEffect, useState } from "react";
import { buildApiUrl } from "../lib/config";

/**
 * Simple content-based recommender:
 * - Build a user profile from upvoted (+1) and downvoted (-1) restaurants using tags + cuisine.
 * - Score each catalog restaurant by matching its tags/cuisine to the profile.
 * - Exclude items the user already voted on.
 */
export default function useRecommendations({ restaurants, enabled = true, pageSize = 200 }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recommended, setRecommended] = useState([]);

  // 👇 NEW: diagnostics state (top tags/cuisines + raw maps)
  const [diagnostics, setDiagnostics] = useState({
    topTags: [],
    topCuisines: [],
    tagScore: {},
    cuisineScore: {},
  });

  useEffect(() => {
    if (!enabled) {
      setRecommended([]);
      setDiagnostics({ topTags: [], topCuisines: [], tagScore: {}, cuisineScore: {} });
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setRecommended([]); // guest: no personalized recs
      setDiagnostics({ topTags: [], topCuisines: [], tagScore: {}, cuisineScore: {} });
      return;
    }

    let cancelled = false;
    const fetchVotes = async () => {
      try {
        setLoading(true);
        setError("");

        // pull both in parallel (bump size to get more signal; your API caps internally)
        const [upRes, downRes] = await Promise.all([
          fetch(buildApiUrl(`/api/me/votes/up?page=0&size=${pageSize}`), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(buildApiUrl(`/api/me/votes/down?page=0&size=${pageSize}`), {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // read bodies safely (handles empty/non-JSON)
        const safeJson = async (res) => {
          const text = await res.text();
          return text ? JSON.parse(text) : null;
        };
        const upJson = await safeJson(upRes);
        const downJson = await safeJson(downRes);

        // spring data Page payload ⇒ content[]
        const upvoted = upJson?.content ?? [];
        const downvoted = downJson?.content ?? [];

        if (cancelled) return;

        // ---- Build profile ----
        // weights: upvote +1, downvote -1
        const tagScore = new Map();
        const cuisineScore = new Map();

        const addMany = (items, weight) => {
          for (const r of items) {
            // tags
            if (Array.isArray(r.tags)) {
              for (const t of r.tags) {
                if (!t) continue;
                const key = String(t).trim().toLowerCase();
                tagScore.set(key, (tagScore.get(key) ?? 0) + weight);
              }
            }
            // cuisine
            if (r.cuisine) {
              const c = String(r.cuisine).trim().toLowerCase();
              cuisineScore.set(c, (cuisineScore.get(c) ?? 0) + weight);
            }
          }
        };
        addMany(upvoted, +1);
        addMany(downvoted, -1);

        // 👇 Compute diagnostics (top tags & cuisines)
        const sortDesc = (map) => [...map.entries()].sort((a, b) => b[1] - a[1]);
        const topTags = sortDesc(tagScore).slice(0, 10);
        const topCuisines = sortDesc(cuisineScore).slice(0, 10);

        // Optional: nice console output for quick debugging
        if ((topTags.length || topCuisines.length) && process.env.NODE_ENV !== "production") {
          console.group("[recs] profile");
          if (topTags.length) {
            console.table(topTags.map(([tag, score]) => ({ tag, score })));
          }
          if (topCuisines.length) {
            console.table(topCuisines.map(([cuisine, score]) => ({ cuisine, score })));
          }
          console.groupEnd();
        }

        // sets to avoid recommending already-voted items
        const votedIds = new Set([
          ...upvoted.map((r) => r.id),
          ...downvoted.map((r) => r.id),
        ]);

        // normalization helper
        const norm = (x) => x; // try Math.tanh(x) for softer scores

        // derive median preferred price from upvotes (optional)
        const upPrices = upvoted
          .map((r) => r.priceLevel)
          .filter((p) => typeof p === "number");
        const medianUpPrice =
          upPrices.length > 0
            ? [...upPrices].sort((a, b) => a - b)[Math.floor(upPrices.length / 2)]
            : null;

        // ---- score catalog ----
        const scored = [];
        for (const r of restaurants ?? []) {
          if (!r || votedIds.has(r.id)) continue;

          let s = 0;

          // tag match
          if (Array.isArray(r.tags)) {
            for (const t of r.tags) {
              if (!t) continue;
              const key = String(t).trim().toLowerCase();
              s += norm(tagScore.get(key) ?? 0);
            }
          }

          // cuisine match
          if (r.cuisine) {
            const c = String(r.cuisine).trim().toLowerCase();
            s += 1.5 * norm(cuisineScore.get(c) ?? 0); // cuisine a bit heavier
          }

          // optional: mild price affinity to user's median
          if (typeof r.priceLevel === "number" && medianUpPrice != null) {
            const diff = Math.abs(r.priceLevel - medianUpPrice);
            s += 0.75 * Math.exp(-0.5 * (diff * diff)); // small gaussian-like bump
          }

          // tiny diversity noise to break ties deterministically (by id)
          if (r.id) {
            const hash = [...String(r.id)].reduce(
              (acc, ch) => (acc * 33 + ch.charCodeAt(0)) >>> 0,
              5381
            );
            const jitter = (hash % 1000) / 1000; // 0..0.999
            s += 0.01 * jitter;
          }

          if (s !== 0) {
            scored.push({ r, s });
          }
        }

        // sort & take top
        scored.sort((a, b) => b.s - a.s);
        const top = scored.slice(0, 12).map(({ r }) => r);

        if (!cancelled) {
          setRecommended(top);
          setDiagnostics({
            topTags,
            topCuisines,
            tagScore: Object.fromEntries(tagScore),
            cuisineScore: Object.fromEntries(cuisineScore),
          });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || "Failed to build recommendations");
          setRecommended([]);
          setDiagnostics({ topTags: [], topCuisines: [], tagScore: {}, cuisineScore: {} });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchVotes();
    return () => {
      cancelled = true;
    };
  }, [enabled, restaurants, pageSize]);

  return { recommended, loading, error, diagnostics };
}
