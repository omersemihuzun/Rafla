/** İstemci + sunucu — sharp içermez */

export type SceneStyle = "white" | "flat" | "mirror" | "model" | "hanging";

export function sceneCreditCost(_style: SceneStyle): number {
  return 1;
}

export function isAiSceneStyle(style: SceneStyle): boolean {
  return style === "model" || style === "mirror";
}
