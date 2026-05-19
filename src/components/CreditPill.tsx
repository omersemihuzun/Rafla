"use client";

import { MaterialIcon } from "@/components/MaterialIcon";

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
    <div className="credit-pill-row">
      <span className="credit-pill">
        <MaterialIcon name="image" size={16} />
        Arka plan {bgRemaining}/3
      </span>
      <span className="credit-pill credit-pill-accent">
        <MaterialIcon name="auto_awesome" size={16} />
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
