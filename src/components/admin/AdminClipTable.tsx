"use client";

import { useState } from "react";
import type { Clip } from "@/lib/types";

interface Props {
  clips: Clip[];
}

export function AdminClipTable({ clips }: Props) {
  const [localClips, setLocalClips] = useState(clips);
  const [message, setMessage] = useState<string | null>(null);

  async function updateClip(clipId: string, patch: Partial<Clip>) {
    setMessage(null);

    const response = await fetch(`/api/admin/clips/${clipId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });

    const payload = (await response.json()) as { message?: string; clip?: Clip };
    if (!response.ok) {
      setMessage(payload.message ?? "Kunne ikke oppdatere klipp.");
      return;
    }

    if (payload.clip) {
      setLocalClips((prev) => prev.map((item) => (item.id === clipId ? payload.clip! : item)));
    }

    setMessage("Klipp oppdatert.");
  }

  async function deleteClip(clipId: string) {
    const response = await fetch(`/api/admin/clips/${clipId}`, {
      method: "DELETE",
    });

    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(payload.message ?? "Kunne ikke slette klipp.");
      return;
    }

    setLocalClips((prev) => prev.filter((item) => item.id !== clipId));
    setMessage("Klipp slettet.");
  }

  async function editTitle(clip: Clip) {
    const nextTitle = window.prompt("Ny tittel", clip.title);
    if (!nextTitle || nextTitle === clip.title) return;

    setLocalClips((prev) => prev.map((item) => (item.id === clip.id ? { ...item, title: nextTitle } : item)));
    await updateClip(clip.id, { title: nextTitle });
  }

  async function editConclusion(clip: Clip) {
    const nextConclusion = window.prompt("Ny konklusjon", clip.conclusion_text);
    if (!nextConclusion || nextConclusion === clip.conclusion_text) return;

    setLocalClips((prev) => prev.map((item) => (item.id === clip.id ? { ...item, conclusion_text: nextConclusion } : item)));
    await updateClip(clip.id, { conclusion_text: nextConclusion });
  }

  return (
    <section className="panel">
      <h2>Nylige opplastinger</h2>
      {message ? <p className="formMessage">{message}</p> : null}

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Tittel</th>
              <th>Type</th>
              <th>Liga</th>
              <th>Runde</th>
              <th>Publisert</th>
              <th>Handling</th>
            </tr>
          </thead>
          <tbody>
            {localClips.map((clip) => (
              <tr key={clip.id}>
                <td>{clip.title}</td>
                <td>{clip.situation_type}</td>
                <td>{clip.league}</td>
                <td>{clip.round ? `Runde ${clip.round}` : "-"}</td>
                <td>
                  <label className="checkboxRow compact">
                    <input
                      type="checkbox"
                      checked={clip.published}
                      onChange={(event) => {
                        const next = event.target.checked;
                        setLocalClips((prev) => prev.map((item) => (item.id === clip.id ? { ...item, published: next } : item)));
                        void updateClip(clip.id, { published: next });
                      }}
                    />
                    {clip.published ? "Ja" : "Nei"}
                  </label>
                </td>
                <td>
                  <div className="buttonRow">
                    <button type="button" onClick={() => void editTitle(clip)}>
                      Tittel
                    </button>
                    <button type="button" onClick={() => void editConclusion(clip)}>
                      Konklusjon
                    </button>
                    <button className="danger" type="button" onClick={() => void deleteClip(clip.id)}>
                      Slett
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
