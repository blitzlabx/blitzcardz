export default function Bolt({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="bc-bolt" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4cc2ff" />
          <stop offset="1" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" fill="url(#bc-bolt)" />
    </svg>
  );
}
