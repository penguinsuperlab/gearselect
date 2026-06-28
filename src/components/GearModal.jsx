import { useState, useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES } from '../constants'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { supabase } from '../lib/supabase'

function GearNameInput({ value, onChange, onSelectSuggestion }) {
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const search = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    setLoading(true)
    const { data } = await supabase
      .from('gear_master')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(8)
    setSuggestions(data || [])
    setLoading(false)
    setOpen(true)
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    onChange(val)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => search(val), 300)
  }

  const handleSelect = (item) => {
    onSelectSuggestion(item)
    setOpen(false)
    setSuggestions([])
  }

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="例: 400FD"
        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        autoFocus
      />
      {open && (loading || suggestions.length > 0) && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <li className="px-3 py-2.5 text-sm text-gray-400">検索中...</li>
          ) : suggestions.map(item => (
            <li
              key={item.id}
              onMouseDown={() => handleSelect(item)}
              className="px-3 py-2.5 text-sm text-gray-700 hover:bg-green-50 cursor-pointer"
            >
              <span className="font-medium">{item.name}</span>
              {item.brand && <span className="text-gray-400 ml-2">{item.brand}</span>}
              {item.weight_g != null && <span className="text-gray-400 ml-2">{item.weight_g}g</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function MakerInput({ value, onChange }) {
  const [makers] = useLocalStorage('makers', [])
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const suggestions = value
    ? makers.filter(m => m.toLowerCase().includes(value.toLowerCase()) && m !== value)
    : makers

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder="例: エバニュー"
        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map(m => (
            <li
              key={m}
              onMouseDown={() => { onChange(m); setOpen(false) }}
              className="px-3 py-2.5 text-sm text-gray-700 hover:bg-green-50 cursor-pointer"
            >
              {m}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function GearModal({ gear, onSave, onClose }) {
  const [makers, setMakers] = useLocalStorage('makers', [])
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id)
  const [maker, setMaker] = useState('')
  const [memo, setMemo] = useState('')
  const [weight, setWeight] = useState('')
  const [contribute, setContribute] = useState(true)
  const [fromSuggestion, setFromSuggestion] = useState(false)

  useEffect(() => {
    if (gear) {
      setName(gear.name)
      setCategoryId(gear.categoryId)
      setMaker(gear.maker || '')
      setMemo(gear.memo || '')
      setWeight(gear.weight != null ? String(gear.weight) : '')
    }
  }, [gear])

  const handleSelectSuggestion = (item) => {
    setName(item.name)
    if (item.brand) setMaker(item.brand)
    if (item.weight_g != null) setWeight(String(item.weight_g))
    if (item.category_id) setCategoryId(item.category_id)
    setFromSuggestion(true)
    setContribute(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    const makerTrimmed = maker.trim()
    if (makerTrimmed && !makers.includes(makerTrimmed)) {
      setMakers(prev => [...prev, makerTrimmed].sort((a, b) => a.localeCompare(b, 'ja')))
    }

    onSave({ name: name.trim(), categoryId, maker: makerTrimmed, memo: memo.trim(), weight: weight !== '' ? Number(weight) : null })

    if (!gear && contribute && !fromSuggestion) {
      await supabase.from('gear_master').insert({
        name: name.trim(),
        brand: makerTrimmed || null,
        weight_g: weight !== '' ? Number(weight) : null,
        category_id: categoryId,
      })
    }
  }

  const isEditing = !!gear

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl flex flex-col"
        style={{ maxHeight: 'calc(100svh - 4rem - env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-semibold text-gray-800 text-lg">
            {gear ? 'ギアを編集' : 'ギアを追加'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ギア名 *</label>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="例: 400FD"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  autoFocus
                />
              ) : (
                <GearNameInput
                  value={name}
                  onChange={(val) => { setName(val); setFromSuggestion(false); setContribute(true) }}
                  onSelectSuggestion={handleSelectSuggestion}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">メーカー</label>
              <MakerInput value={maker} onChange={setMaker} />
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

            {!isEditing && (
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={contribute}
                  onChange={e => setContribute(e.target.checked)}
                  className="rounded text-green-600"
                />
                このギアをコミュニティDBに追加する
              </label>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 flex-shrink-0">
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-green-600 text-white rounded-xl py-3 font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-700 active:bg-green-800 transition-colors"
            >
              {gear ? '変更を保存' : 'ギアを登録'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
