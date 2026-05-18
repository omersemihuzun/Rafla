"use client";

type Props = {
  bgRemaining: number;
  sceneCredits: number;
  onRefill?: () => void;
  showRefill?: boolean;
};

export function CreditPill({
  bgRemaining,
  sceneCredits,
  onRefill,
  showRefill,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        alignItems: "center",
      }}
    >
      <span className="badge">Arka plan {bgRemaining}/3</span>
      <span className="badge" style={{ opacity: 0.85 }}>
        Sahne {sceneCredits}
      </span>
      {showRefill && bgRemaining === 0 && onRefill && (
        <button type="button" className="btn btn-sm btn-ghost" onClick={onRefill}>
          Hak yenile
        </button>
      )}
    </div>
  );
}
