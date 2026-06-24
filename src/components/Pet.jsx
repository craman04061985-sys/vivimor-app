export default function Pet({ pet, action }) {
  const getEmoji = () => {
    if (pet.health < 20) return "😵"
    if (pet.hunger < 20) return "😫"
    if (pet.happiness < 20) return "😢"
    if (pet.cleanliness < 20) return "🤢"
    if (pet.health > 80 && pet.happiness > 80) return "😄"
    return "🙂"
  }

  const getAnimation = () => {
    if (action === "feed") return "pet-eat"
    if (action === "play") return "pet-play"
    if (action === "clean") return "pet-clean"
    return "pet-idle"
  }

  return (
    <div className="pet-container">
      <div className={`pet-body ${getAnimation()}`}>
        <div className="pet-emoji">{getEmoji()}</div>
      </div>
    </div>
  )
}