type Props = {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
};

const ICON_FONT =
  '"Material Symbols Outlined Variable", "Material Symbols Outlined", sans-serif';

export function MaterialIcon({ name, className = "", filled, size = 20 }: Props) {
  return (
    <span
      className={`material-symbols-outlined ${className}`.trim()}
      aria-hidden
      style={{
        fontFamily: ICON_FONT,
        fontWeight: "normal",
        fontStyle: "normal",
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "normal",
        textTransform: "none",
        display: "inline-block",
        whiteSpace: "nowrap",
        fontFeatureSettings: '"liga"',
        WebkitFontFeatureSettings: '"liga"',
        fontVariationSettings: filled
          ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
          : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      }}
    >
      {name}
    </span>
  );
}
