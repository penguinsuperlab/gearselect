import { useState } from 'react'
import GearList from './pages/GearList'
import PackingList from './pages/PackingList'
import DataPage from './pages/DataPage'
import { List, CheckSquare, Database } from 'lucide-react'

const TABS = [
  { id: 'gear', label: 'ギア一覧', icon: List },
  { id: 'packing', label: 'パッキング', icon: CheckSquare },
  { id: 'data', label: 'データ', icon: Database },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('gear')

  return (
    <div className="flex flex-col min-h-svh bg-gray-50">
      <main className="flex-1 pb-20 overflow-y-auto">
        {activeTab === 'gear' && <GearList />}
        {activeTab === 'packing' && <PackingList />}
        {activeTab === 'data' && <DataPage />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors
                ${activeTab === id ? 'text-green-600' : 'text-gray-400'}`}
            >
              <Icon size={22} />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
