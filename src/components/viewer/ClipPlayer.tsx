"use client";

import { useState } from "react";

interface Props {
  title: string;
  videoUrl: string;
  conclusionText: string;
}

export function ClipPlayer({ title, videoUrl, conclusionText }: Props) {
  const [showConclusion, setShowConclusion] = useState(false);

  return (
    <section className="clipPlayerWrap">
      <h1>{title}</h1>
      <div className="playerFrame">
        <video src={videoUrl} controls preload="metadata" />
      </div>

      <div className="playerActions">
        <button type="button" onClick={() => setShowConclusion(true)}>
          Konklusjon
        </button>
      </div>

      {showConclusion ? (
        <div className="modalBackdrop" onClick={() => setShowConclusion(false)}>
          <div className="modalPanel" onClick={(event) => event.stopPropagation()}>
            <h2>Faglig konklusjon</h2>
            <p>{conclusionText}</p>
            <button type="button" onClick={() => setShowConclusion(false)}>
              Lukk
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
