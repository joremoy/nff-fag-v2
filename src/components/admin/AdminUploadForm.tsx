"use client";

import { useMemo, useState } from "react";
import { LEAGUES, SITUATION_TYPES } from "@/lib/constants";

interface LookupPayload {
  found: boolean;
  league?: string;
  round?: number;
  message: string;
}

export function AdminUploadForm() {
  const [title, setTitle] = useState("");
  const [situationType, setSituationType] = useState<(typeof SITUATION_TYPES)[number]>(SITUATION_TYPES[0]);
  const [league, setLeague] = useState<(typeof LEAGUES)[number]>(LEAGUES[0]);
  const [round, setRound] = useState("");
  const [matchNumber, setMatchNumber] = useState("");
  const [conclusionText, setConclusionText] = useState("");
  const [published, setPublished] = useState(true);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const rounds = useMemo(() => Array.from({ length: 30 }, (_, i) => i + 1), []);

  async function lookupMatch() {
    if (!matchNumber.trim()) {
      setLookupMessage("Skriv inn kampnummer først.");
      return;
    }

    setLoadingLookup(true);
    setLookupMessage(null);

    const response = await fetch(`/api/admin/match-lookup?matchNumber=${encodeURIComponent(matchNumber)}`);
    const payload = (await response.json()) as LookupPayload;

    if (payload.league) setLeague(payload.league as (typeof LEAGUES)[number]);
    if (typeof payload.round === "number") setRound(String(payload.round));

    setLookupMessage(payload.message);
    setLoadingLookup(false);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!videoFile) {
      setMessage("Velg en .mp4-fil før opplasting.");
      return;
    }

    setLoadingSubmit(true);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("situationType", situationType);
    formData.set("league", league);
    formData.set("round", round || "");
    formData.set("matchNumber", matchNumber || "");
    formData.set("conclusionText", conclusionText);
    formData.set("published", String(published));
    formData.set("video", videoFile);

    const response = await fetch("/api/admin/clips", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(payload.message ?? "Kunne ikke laste opp klipp.");
      setLoadingSubmit(false);
      return;
    }

    setTitle("");
    setSituationType(SITUATION_TYPES[0]);
    setLeague(LEAGUES[0]);
    setRound("");
    setMatchNumber("");
    setConclusionText("");
    setPublished(true);
    setVideoFile(null);
    setMessage("Klipp publisert.");
    setLoadingSubmit(false);
  }

  return (
    <form className="panel form" onSubmit={onSubmit}>
      <h2>Last opp nytt klipp</h2>

      <label htmlFor="title">Tittel</label>
      <input id="title" value={title} onChange={(event) => setTitle(event.target.value)} required />

      <label htmlFor="video">Videofil (.mp4)</label>
      <input
        id="video"
        type="file"
        accept="video/mp4"
        onChange={(event) => setVideoFile(event.target.files?.[0] ?? null)}
        required
      />

      <div className="splitGrid">
        <div>
          <label htmlFor="situationType">Situasjonstype</label>
          <select
            id="situationType"
            value={situationType}
            onChange={(event) => setSituationType(event.target.value as (typeof SITUATION_TYPES)[number])}
          >
            {SITUATION_TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="matchNumber">Kampnummer</label>
          <div className="inlineAction">
            <input
              id="matchNumber"
              value={matchNumber}
              onChange={(event) => setMatchNumber(event.target.value)}
              placeholder="F.eks. 123456"
            />
            <button type="button" onClick={lookupMatch} disabled={loadingLookup}>
              {loadingLookup ? "Søker..." : "Hent data"}
            </button>
          </div>
          {lookupMessage ? <p className="formMessage">{lookupMessage}</p> : null}
        </div>
      </div>

      <div className="splitGrid">
        <div>
          <label htmlFor="league">Liga</label>
          <select id="league" value={league} onChange={(event) => setLeague(event.target.value as (typeof LEAGUES)[number])}>
            {LEAGUES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="round">Runde</label>
          <select id="round" value={round} onChange={(event) => setRound(event.target.value)}>
            <option value="">Velg runde</option>
            {rounds.map((item) => (
              <option key={item} value={item}>
                Runde {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label htmlFor="conclusionText">Konklusjon</label>
      <textarea
        id="conclusionText"
        rows={5}
        value={conclusionText}
        onChange={(event) => setConclusionText(event.target.value)}
        placeholder="Skriv faglig konklusjon her"
        required
      />

      <label className="checkboxRow" htmlFor="published">
        <input id="published" type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
        Publiser umiddelbart
      </label>

      <button type="submit" disabled={loadingSubmit}>
        {loadingSubmit ? "Laster opp..." : "Lagre klipp"}
      </button>

      {message ? <p className="formMessage">{message}</p> : null}
    </form>
  );
}
