import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, SlidersHorizontal } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { CATEGORIES, CATEGORY_MAP } from '../constants'
import GearModal from '../components/GearModal'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export default function GearList() {
  const [gears, setGears] = useLocalStorage('gears', [])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingGear, setEditingGear] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const toggleCategory = (id) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const filteredGears = useMemo(() => {
    const list = selectedCategories.length === 0
      ? gears
      : gears.filter(g => selectedCategories.includes(g.categoryId))
    return [...list].sort((a, b) => {
      const ai = CATEGORIES.findIndex(c => c.id === a.categoryId)
      const bi = CATEGORIES.findIndex(c => c.id === b.categoryId)
      return ai - bi || a.name.localeCompare(b.name, 'ja')
    })
  }, [gears, selectedCategories])

  const openAdd = () => {
    setEditingGear(null)
    setShowModal(true)
  }

  const openEdit = (gear) => {
    setEditingGear(gear)
    setShowModal(true)
  }

  const handleSave = ({ name, categoryId, memo, weight }) => {
    if (editingGear) {
      setGears(prev => prev.map(g => g.id === editingGear.id ? { ...g, name, categoryId, memo, weight } : g))
    } else {
      setGears(prev => [...prev, { id: generateId(), name, categoryId, memo, weight }])
    }
    setShowModal(false)
  }

  const handleDelete = (id) => {
    setGears(prev => prev.filter(g => g.id !== id))
    setDeleteConfirm(null)
  }

  return (
    <div className="flex flex-col min-h-full">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900">GearSelect</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-700 active:bg-green-800 transition-colors"
          >
            <Plus size={16} />
            追加
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategories([])}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap
              ${selectedCategories.length === 0
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
          >
            すべて
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap
                ${selectedCategories.includes(cat.id)
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 p-4">
        {filteredGears.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <span className="text-5xl mb-3">🎒</span>
            <p className="text-sm">ギアがまだ登録されていません</p>
            <button
              onClick={openAdd}
              className="mt-3 text-green-600 text-sm font-medium underline-offset-2 hover:underline"
            >
              最初のギアを追加する
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredGears.map(gear => {
              const cat = CATEGORY_MAP[gear.categoryId]
              return (
                <div key={gear.id} className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 flex items-start gap-3">
                  <span className="text-2xl mt-0.5 leading-none">{cat?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm leading-snug">{gear.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-gray-400">{cat?.label}</p>
                      {gear.weight != null && (
                        <p className="text-xs text-gray-400">{gear.weight >= 1000 ? `${(gear.weight / 1000).toFixed(1)}kg` : `${gear.weight}g`}</p>
                      )}
                    </div>
                    {gear.memo && (
                      <p className="text-xs text-gray-500 mt-1 leading-snug">{gear.memo}</p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(gear)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(gear.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showModal && (
        <GearModal
          gear={editingGear}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-xl">
            <p className="text-center text-gray-800 font-medium mb-1">このギアを削除しますか？</p>
            <p className="text-center text-xs text-gray-400 mb-5">
              {gears.find(g => g.id === deleteConfirm)?.name}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-red-600 transition-colors"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
