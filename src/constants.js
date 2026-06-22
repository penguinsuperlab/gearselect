export const CATEGORIES = [
  { id: 'cooker', label: 'クッカー／バーナー', emoji: '🍳' },
  { id: 'tableware', label: '食器／カトラリー', emoji: '🍽️' },
  { id: 'lighting', label: 'ライティング', emoji: '💡' },
  { id: 'wear', label: 'ウェア', emoji: '👕' },
  { id: 'insulation', label: 'インサレーション', emoji: '🧥' },
  { id: 'shelter', label: 'シェルター', emoji: '⛺' },
  { id: 'sleeping', label: 'スリーピング', emoji: '🛌' },
  { id: 'bag', label: 'バッグ／パック', emoji: '🎒' },
  { id: 'tool', label: 'ツール／ギア', emoji: '🧰' },
  { id: 'firstaid', label: 'ファーストエイド', emoji: '🩹' },
  { id: 'other', label: 'その他', emoji: '📦' },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]))
