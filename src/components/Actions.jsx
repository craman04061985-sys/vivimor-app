export default function Actions({ onAction, disabled }) {
  return (
    <div className="actions">
      <button className="btn btn-feed"  onClick={() => onAction("feed")}  disabled={disabled}>
        🍎<span>Покормить</span>
      </button>
      <button className="btn btn-play"  onClick={() => onAction("play")}  disabled={disabled}>
        🎮<span>Поиграть</span>
      </button>
      <button className="btn btn-clean" onClick={() => onAction("clean")} disabled={disabled}>
        🧼<span>Помыть</span>
      </button>
    </div>
  )
}