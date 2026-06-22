import { useState, useMemo } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Save, Check, Pencil } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { CATEGORIES, CATEGORY_MAP } from '../constants'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function SaveListModal({ checkedIds, gears, onSave, onClose }) {
  const [listName, setListName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!listName.trim()) return
    onSave(listName.trim())
  }

  const count = checkedIds.size

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl p-6">
        <h2 className="font-semibold text-gray-800 text-lg mb-1">リストを保存</h2>
        <p className="text-sm text-gray-400 mb-4">{count}件のギアを選択中</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={listName}
            onChange={e => setListName(e.target.value)}
            placeholder="例: 8月キャンプ、北アルプス縦走"
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!listName.trim()}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-green-700 transition-colors"
            >
              保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditListModal({ list, gears, onSave, onClose }) {
  const [name, setName] = useState(list.name)
  const [selectedIds, setSelectedIds] = useState(new Set(list.gearIds))

  const toggle = (id) => setSelectedIds(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const groupedGears = useMemo(() => {
    const groups = {}
    for (const cat of CATEGORIES) {
      const items = gears.filter(g => g.categoryId === cat.id)
      if (items.length > 0) groups[cat.id] = { cat, items }
    }
    return groups
  }, [gears])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), gearIds: [...selectedIds] })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl flex flex-col max-h-[90svh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <h2 className="font-semibold text-gray-800 text-lg">リストを編集</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">リスト名</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ギア</label>
              <div className="space-y-3">
                {Object.values(groupedGears).map(({ cat, items }) => (
                  <div key={cat.id}>
                    <p className="text-xs font-semibold text-gray-400 mb-1">{cat.emoji} {cat.label}</p>
                    <div className="space-y-1.5">
                      {items.map(gear => (
                        <label
                          key={gear.id}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border cursor-pointer transition-colors
                            ${selectedIds.has(gear.id) ? 'border-green-400 bg-green-50' : 'border-gray-100 bg-white'}`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-none transition-colors
                            ${selectedIds.has(gear.id) ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                            {selectedIds.has(gear.id) && <Check size={11} color="white" strokeWidth={3} />}
                          </div>
                          <input type="checkbox" className="sr-only" checked={selectedIds.has(gear.id)} onChange={() => toggle(gear.id)} />
                          <span className="text-sm text-gray-800">
                            {gear.maker && <span className="text-gray-400">{gear.maker} </span>}{gear.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 flex gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-green-700 transition-colors"
            >
              保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SavedListCard({ list, gears, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const listGears = list.gearIds
    .map(id => gears.find(g => g.id === id))
    .filter(Boolean)

  const listWeight = listGears.reduce((sum, g) => sum + (g?.weight ?? 0), 0)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="font-medium text-gray-900 text-sm">{list.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {listGears.length}件のギア
            {listWeight > 0 && ` · ${listWeight >= 1000 ? `${(listWeight / 1000).toFixed(2)}kg` : `${listWeight}g`}`}
            {' · '}{list.createdAt}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowEdit(true)}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={15} />
          </button>
          <button
            onClick={() => setExpanded(v => !v)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3 space-y-2">
          {listGears.length === 0 ? (
            <p className="text-xs text-gray-400">ギアが見つかりません</p>
          ) : (
            listGears.map(gear => {
              const cat = CATEGORY_MAP[gear.categoryId]
              return (
                <div key={gear.id} className="flex items-center gap-2 text-sm">
                  <span className="text-base">{cat?.emoji}</span>
                  <span className="text-gray-700">{gear.name}</span>
                </div>
              )
            })
          )}
        </div>
      )}

      {showEdit && (
        <EditListModal
          list={list}
          gears={gears}
          onSave={(updated) => { onEdit(list.id, updated); setShowEdit(false) }}
          onClose={() => setShowEdit(false)}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-xl">
            <p className="text-center text-gray-800 font-medium mb-1">このリストを削除しますか？</p>
            <p className="text-center text-xs text-gray-400 mb-5">{list.name}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => onDelete(list.id)}
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

export default function PackingList() {
  const [gears] = useLocalStorage('gears', [])
  const [savedLists, setSavedLists] = useLocalStorage('packingLists', [])
  const [checkedIds, setCheckedIds] = useState(new Set())
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [activeTab, setActiveTab] = useState('select')

  const toggleGear = (id) => {
    setCheckedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const totalWeight = useMemo(() => {
    return [...checkedIds].reduce((sum, id) => {
      const g = gears.find(g => g.id === id)
      return sum + (g?.weight ?? 0)
    }, 0)
  }, [checkedIds, gears])

  const groupedGears = useMemo(() => {
    const groups = {}
    for (const cat of CATEGORIES) {
      const items = gears.filter(g => g.categoryId === cat.id)
      if (items.length > 0) groups[cat.id] = { cat, items }
    }
    return groups
  }, [gears])

  const handleSaveList = (name) => {
    const now = new Date()
    const date = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}`
    setSavedLists(prev => [
      { id: generateId(), name, gearIds: [...checkedIds], createdAt: date },
      ...prev,
    ])
    setCheckedIds(new Set())
    setShowSaveModal(false)
    setActiveTab('saved')
  }

  const handleDeleteList = (id) => {
    setSavedLists(prev => prev.filter(l => l.id !== id))
  }

  const handleEditList = (id, { name, gearIds }) => {
    setSavedLists(prev => prev.map(l => l.id === id ? { ...l, name, gearIds } : l))
  }

  return (
    <div className="flex flex-col min-h-full">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900 mb-3">パッキングリスト</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('select')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors
              ${activeTab === 'select' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            ギアを選ぶ
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors
              ${activeTab === 'saved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            保存済み ({savedLists.length})
          </button>
        </div>
      </header>

      {activeTab === 'select' && (
        <div className="flex-1 p-4">
          {gears.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <span className="text-5xl mb-3">🎒</span>
              <p className="text-sm">まずギア一覧でギアを登録してください</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {Object.values(groupedGears).map(({ cat, items }) => (
                  <div key={cat.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{cat.emoji}</span>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{cat.label}</span>
                    </div>
                    <div className="space-y-2">
                      {items.map(gear => (
                        <label
                          key={gear.id}
                          className={`flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border transition-colors cursor-pointer
                            ${checkedIds.has(gear.id) ? 'border-green-400 bg-green-50' : 'border-gray-100'}`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-none transition-colors
                            ${checkedIds.has(gear.id) ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                            {checkedIds.has(gear.id) && <Check size={11} color="white" strokeWidth={3} />}
                          </div>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={checkedIds.has(gear.id)}
                            onChange={() => toggleGear(gear.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm">
                              {gear.maker && <span className="text-gray-400 font-normal">{gear.maker} </span>}{gear.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {gear.weight != null && (
                                <span className="text-xs text-gray-400">
                                  {gear.weight >= 1000 ? `${(gear.weight / 1000).toFixed(1)}kg` : `${gear.weight}g`}
                                </span>
                              )}
                              {gear.memo && <span className="text-xs text-gray-400 truncate">{gear.memo}</span>}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {checkedIds.size > 0 && (
                <div className="fixed bottom-20 left-0 right-0 flex justify-center px-4 pointer-events-none">
                  <button
                    onClick={() => setShowSaveModal(true)}
                    className="pointer-events-auto flex items-center gap-2 bg-green-600 text-white px-6 py-3.5 rounded-2xl shadow-lg text-sm font-semibold hover:bg-green-700 active:bg-green-800 transition-colors"
                  >
                    <Save size={16} />
                    <span>{checkedIds.size}件を保存する</span>
                    {totalWeight > 0 && (
                      <span className="ml-1 bg-green-500 rounded-xl px-2 py-0.5 text-xs font-medium">
                        {totalWeight >= 1000 ? `${(totalWeight / 1000).toFixed(2)}kg` : `${totalWeight}g`}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="flex-1 p-4">
          {savedLists.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <span className="text-5xl mb-3">📋</span>
              <p className="text-sm">保存済みのリストがありません</p>
              <button
                onClick={() => setActiveTab('select')}
                className="mt-3 text-green-600 text-sm font-medium underline-offset-2 hover:underline"
              >
                ギアを選んでリストを作る
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedLists.map(list => (
                <SavedListCard
                  key={list.id}
                  list={list}
                  gears={gears}
                  onDelete={handleDeleteList}
                  onEdit={handleEditList}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {showSaveModal && (
        <SaveListModal
          checkedIds={checkedIds}
          gears={gears}
          onSave={handleSaveList}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </div>
  )
}
