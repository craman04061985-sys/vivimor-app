function StatBar({ label, value, color }) {
  return (
    <div className="stat">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
      <div className="stat-track">
        <div
          className="stat-fill"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  )
}

export default function Stats({ pet }) {
  return (
    <div className="stats">
      <StatBar label="❤️ Здоровье" value={pet.health}      color="#e74c3c" />
      <StatBar label="🍎 Голод"    value={pet.hunger}      color="#e67e22" />
      <StatBar label="😄 Счастье"  value={pet.happiness}   color="#f1c40f" />
      <StatBar label="🧼 Чистота"  value={pet.cleanliness} color="#3498db" />
    </div>
  )
}