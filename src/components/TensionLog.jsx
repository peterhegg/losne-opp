export default function TensionLog({ value, onSet }) {
  return (
    <div className="tension">
      <div id="tension-label" className="label">
        Hvor stram kjennes kroppen akkurat nå?
      </div>
      <div
        className="scale"
        role="group"
        aria-labelledby="tension-label"
      >
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
      <div className="ends" aria-hidden="true">
        <span>Rolig</span>
        <span>Svært stram</span>
      </div>
    </div>
  )
}
