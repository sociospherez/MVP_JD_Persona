import React, { useMemo, useState } from "react";

export type PersonaBankItem = {
  id: string;
  name: string;
  createdAt: string;
  snapshot: any; // the jsonPayload
};

function uid() {
  return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
}

function safeDate(d: string) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}

export default function PersonaBank({
  currentPayload,
  onLoadPayload,
}: {
  currentPayload: any;
  onLoadPayload: (payload: any) => void;
}) {
  const STORAGE_KEY = "personaBank";

  const [items, setItems] = useState<PersonaBankItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as PersonaBankItem[]) : [];
    } catch {
      return [];
    }
  });

  const [name, setName] = useState("");

  const persist = (next: PersonaBankItem[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const save = () => {
    const roleTitle = currentPayload?.role_title || "Untitled Role";
    const org = currentPayload?.organisation ? ` — ${currentPayload.organisation}` : "";
    const defaultName = `${roleTitle}${org}`;

    const item: PersonaBankItem = {
      id: uid(),
      name: name.trim() || defaultName,
      createdAt: new Date().toISOString(),
      snapshot: currentPayload,
    };

    persist([item, ...items]);
    setName("");
  };

  const remove = (id: string) => {
    persist(items.filter((x) => x.id !== id));
  };

  const [compareA, setCompareA] = useState<string>("");
  const [compareB, setCompareB] = useState<string>("");

  const a = useMemo(() => items.find((x) => x.id === compareA), [items, compareA]);
  const b = useMemo(() => items.find((x) => x.id === compareB), [items, compareB]);

  const axesA: string[] = a?.snapshot?.persona?.axes || [];
  const scoresA: number[] = a?.snapshot?.persona?.persona_scores || [];
  const axesB: string[] = b?.snapshot?.persona?.axes || [];
  const scoresB: number[] = b?.snapshot?.persona?.persona_scores || [];

  const compareRows = useMemo(() => {
    if (!a || !b) return [];
    const axes = axesA.length ? axesA : axesB;
    return axes.map((axis, i) => ({
      axis,
      a: scoresA[i] ?? "-",
      b: scoresB[i] ?? "-",
    }));
  }, [a, b, axesA, axesB, scoresA, scoresB]);

  return (
    <div className="pw-card rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold">Persona Bank</h2>
          <p className="text-sm pw-muted">
            Save personas, reload later, and compare shapes across roles.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            className="pw-input rounded-xl px-3 py-2 text-sm"
            placeholder="Optional name (e.g., Admin Officer v2)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="pw-btn-primary px-4 py-2 rounded-xl text-sm" onClick={save}>
            Save current persona
          </button>
        </div>
      </div>

      {/* Saved list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="pw-card rounded-xl p-4">
          <div className="font-semibold mb-2">Saved personas</div>

          {items.length === 0 ? (
            <div className="text-sm pw-muted">
              No saved personas yet. Save one from the wizard, then it’ll appear here.
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((x) => (
                <div key={x.id} className="pw-card rounded-xl p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{x.name}</div>
                      <div className="text-xs pw-muted">{safeDate(x.createdAt)}</div>
                      <div className="text-xs pw-muted">
                        Fit: <strong>{x.snapshot?.scoring?.fit ?? "-"}</strong> • Role:{" "}
                        <strong>{x.snapshot?.role_title ?? "-"}</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="pw-btn px-3 py-1.5 rounded-lg text-xs"
                        onClick={() => onLoadPayload(x.snapshot)}
                      >
                        Load
                      </button>
                      <button
                        className="pw-btn px-3 py-1.5 rounded-lg text-xs"
                        onClick={() => {
                          const blob = new Blob([JSON.stringify(x.snapshot, null, 2)], {
                            type: "application/json",
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${(x.snapshot?.role_title || "persona")
                            .toString()
                            .replace(/\s+/g, "_")
                            .toLowerCase()}_persona.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        Export
                      </button>
                      <button
                        className="pw-btn px-3 py-1.5 rounded-lg text-xs"
                        onClick={() => remove(x.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compare */}
        <div className="pw-card rounded-xl p-4">
          <div className="font-semibold mb-2">Quick compare</div>
          <div className="text-sm pw-muted mb-3">
            Pick two saved personas to compare slider shape.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            <select
              className="pw-select rounded-xl px-3 py-2 text-sm"
              value={compareA}
              onChange={(e) => setCompareA(e.target.value)}
            >
              <option value="">Select A…</option>
              {items.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>

            <select
              className="pw-select rounded-xl px-3 py-2 text-sm"
              value={compareB}
              onChange={(e) => setCompareB(e.target.value)}
            >
              <option value="">Select B…</option>
              {items.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

          {!a || !b ? (
            <div className="text-sm pw-muted">Select two personas to see differences.</div>
          ) : (
            <div className="pw-card rounded-xl p-3 overflow-auto">
              <div className="text-xs pw-muted mb-2">
                A: <strong>{a.name}</strong> (Fit {a.snapshot?.scoring?.fit ?? "-"})
                <br />
                B: <strong>{b.name}</strong> (Fit {b.snapshot?.scoring?.fit ?? "-"})
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="pb-2">Axis</th>
                    <th className="pb-2">A</th>
                    <th className="pb-2">B</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((r) => (
                    <tr key={r.axis} className="border-t border-white/10">
                      <td className="py-2 pr-2">{r.axis}</td>
                      <td className="py-2 pr-2">{r.a}</td>
                      <td className="py-2">{r.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Current payload preview */}
      <div className="mt-4">
        <details>
          <summary className="cursor-pointer text-sm font-semibold">
            Current payload (preview)
          </summary>
          <pre className="mt-2 text-xs pw-card p-3 rounded-xl overflow-auto max-h-72">
            {JSON.stringify(currentPayload, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
