import Bolt from "./Bolt";

export default function Logo({ markOnly = false }) {
  return (
    <span className="brand">
      <span className="brand-mark">
        <Bolt size={15} />
      </span>
      {!markOnly && (
        <span className="brand-name">
          <em>blitz</em>cardz
        </span>
      )}
    </span>
  );
}
