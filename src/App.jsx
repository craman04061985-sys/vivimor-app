import { useState, useEffect } from "react"
import WebApp from "@twa-dev/sdk"
import axios from "axios"
import Pet from "./components/Pet"
import Stats from "./components/Stats"
import Actions from "./components/Actions"
import "./App.css"

const API = "https://api.n8nstec.ru"

export default function App() {
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [action, setAction] = useState(null)

  const headers = WebApp.initData
  ? { "x-telegram-init-data": WebApp.initData }
  : { "x-telegram-user-id": "805432032" }

  useEffect(() => {
  if (WebApp.ready) {
    WebApp.ready()
    WebApp.expand()
  }
  loadPet()
  }, [])

  async function loadPet() {
    try {
      const res = await axios.get(`${API}/api/pet`, { headers })
      setPet(res.data)
    } catch (e) {
      if (e.response?.status === 404) {
        setPet(null) // питомца нет — покажем экран создания
      } else {
        setError("Ошибка подключения к серверу")
      }
    } finally {
      setLoading(false)
    }
  }

  async function createPet(name) {
    try {
      const res = await axios.post(`${API}/api/pet`, { name }, { headers })
      setPet(res.data)
    } catch (e) {
      setError("Не удалось создать питомца")
    }
  }

  async function doAction(type) {
    if (action) return
    setAction(type)
    if (WebApp.HapticFeedback) WebApp.HapticFeedback.impactOccurred("medium")
    try {
      const res = await axios.post(`${API}/api/pet/${type}`, {}, { headers })
      setPet(res.data)
    } catch (e) {
      setError("Ошибка действия")
    } finally {
      setTimeout(() => setAction(null), 600)
    }
  }

  if (loading) return <div className="screen"><div className="spinner" /></div>
  if (error) return <div className="screen"><p className="error">{error}</p></div>

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