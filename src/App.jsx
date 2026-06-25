import { useState, useEffect } from "react"
import axios from "axios"
import Pet from "./components/Pet"
import Stats from "./components/Stats"
import Actions from "./components/Actions"
import "./App.css"

const API = import.meta.env.VITE_API_URL || "https://api.n8nstec.ru"

function getInitData() {
  return window.Telegram?.WebApp?.initData || null
}

function getUserId() {
  // Пробуем window.Telegram
  const tgId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id
  if (tgId) return String(tgId)
  
  // Пробуем hash параметры URL
  const hash = window.location.hash.slice(1)
  const params = new URLSearchParams(hash)
  const tgWebAppData = params.get('tgWebAppData')
  if (tgWebAppData) {
    const data = new URLSearchParams(decodeURIComponent(tgWebAppData))
    const user = data.get('user')
    if (user) {
      try {
        return String(JSON.parse(user).id)
      } catch {}
    }
  }
  
  return "805432032" // fallback для разработки
}

export default function App() {
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [action, setAction] = useState(null)

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
    }
    loadPet()
  }, [])

  async function loadPet() {
    try {
      const res = await axios.get(`${API}/api/pet`, { headers: getHeaders(), timeout: 8000 })
      setPet(res.data)
    } catch (e) {
      if (e.response?.status === 404) {
        setPet(null)
      } else {
        setError("Ошибка: " + (e.response?.status || e.code || e.message))
      }
    } finally {
      setLoading(false)
    }
  }

  async function createPet(name) {
    try {
      const res = await axios.post(`${API}/api/pet`, { name }, { headers: getHeaders() })
      setPet(res.data)
    } catch (e) {
      setError("Не удалось создать питомца")
    }
  }

  async function doAction(type) {
    if (action) return
    setAction(type)
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("medium")
    }
    try {
      const res = await axios.post(`${API}/api/pet/${type}`, {}, { headers: getHeaders() })
      setPet(res.data)
    } catch (e) {
      setError("Ошибка действия")
    } finally {
      setTimeout(() => setAction(null), 600)
    }
  }

  if (loading) return <div className="screen"><div className="spinner" /></div>
  if (error) return (
    <div className="screen">
      <p className="error">{error}</p>
      <p style={{fontSize:"11px",padding:"10px",wordBreak:"break-all",color:"#aaa"}}>
        initData: {getInitData() || "ПУСТО"}<br/>
        TG: {window.Telegram?.WebApp ? "YES" : "NO"}
      </p>
    </div>
  )

  if (!pet) return <CreatePet onCreate={createPet} />

  return (
    <div className="app">
      <h1 className="pet-name">{pet.name}</h1>
      <p className="pet-level">⭐ Уровень {pet.level} · {pet.xp} XP</p>
      <Pet pet={pet} action={action} />
      <Stats pet={pet} />
      <Actions onAction={doAction} disabled={!!action} />
    </div>
  )
}

function CreatePet({ onCreate }) {
  const [name, setName] = useState("")
  return (
    <div className="screen">
      <div className="create-pet">
        <div className="create-emoji">🥚</div>
        <h2>Твой питомец ждёт!</h2>
        <p>Дай ему имя чтобы начать</p>
        <input
          className="name-input"
          placeholder="Имя питомца..."
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={20}
        />
        <button
          className="btn btn-primary"
          onClick={() => name.trim() && onCreate(name.trim())}
          disabled={!name.trim()}
        >
          Создать питомца
        </button>
      </div>
    </div>
  )
}