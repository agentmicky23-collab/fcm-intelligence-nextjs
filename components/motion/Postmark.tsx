export function Postmark({ color, size = 160, center = "43", sub = "BRANCHES", ring = "FCM INTELLIGENCE · OLDHAM · EST. 2011 ·" }: { color: string; size?: number; center?: string; sub?: string; ring?: string }) {
  const id = `ring-${center}-${sub}`.replace(/\W/g, "");
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden>
      <defs><path id={id} d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" /></defs>
      <circle cx="100" cy="100" r="92" fill="none" stroke={color} strokeWidth="3" />
      <circle cx="100" cy="100" r="58" fill="none" stroke={color} strokeWidth="2" />
      <text fill={color} fontSize="15" fontWeight="700" letterSpacing="3" style={{ fontFamily: "var(--f-mono)" }}><textPath href={`#${id}`}>{ring}</textPath></text>
      <text x="100" y="98" textAnchor="middle" fill={color} fontSize="32" fontWeight="800" style={{ fontFamily: "var(--f-sans)", fontStretch: "70%" }}>{center}</text>
      <text x="100" y="120" textAnchor="middle" fill={color} fontSize="11" letterSpacing="2" style={{ fontFamily: "var(--f-mono)" }}>{sub}</text>
    </svg>
  );
}
