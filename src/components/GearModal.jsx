import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES } from '../constants'

export default function GearModal({ gear, onSave, onClose }) {
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id)
  const [memo, setMemo] = useState('')
  const [weight, setWeight] = useState('')

  useEffect(() => {
    if (gear) {
      setName(gear.name)
      setCategoryId(gear.categoryId)
      setMemo(gear.memo || '')
      setWeight(gear.weight != null ? String(gear.weight) : '')
    }
  }, [gear])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), categoryId, memo: memo.trim(), weight: weight !== '' ? Number(weight) : null })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 text-lg">
            {gear ? 'ギアを編集' : 'ギアを追加'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ギア名 *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例: スノーピーク チタンマグ"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
            <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-colors text-left
                    ${categoryId === cat.id
                      ? 'border-green-500 bg-green-50 text-green-700 font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  <span className="text-base">{cat.emoji}</span>
                  <span className="leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">重さ <span className="text-gray-400 font-normal">(g)</span></label>
            <input
              type="number"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="例: 350"
              min="0"
              step="1"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="色・サイズ・購入場所など"
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-green-600 text-white rounded-xl py-3 font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-700 active:bg-green-800 transition-colors"
          >
            {gear ? '変更を保存' : 'ギアを登録'}
          </button>
        </form>
      </div>
    </div>
  )
}
