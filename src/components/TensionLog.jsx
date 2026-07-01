export default function TensionLog({ value, onSet }) {
  return (
    <div className="tension">
      <div className="label">Hvor stram kjennes kroppen akkurat nå?</div>
      <div className="scale">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={`dot${value === n ? ' active' : ''}`}
            onClick={() => onSet(n)}
            aria-pressed={value === n}
            aria-label={`Spenning ${n} av 5`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="ends">
        <span>Rolig</span>
        <span>Svært stram</span>
      </div>
    </div>
  )
}
