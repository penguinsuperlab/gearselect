import { useRef, useState } from 'react'
import { Download, Upload, CheckCircle, AlertCircle } from 'lucide-react'

export default function DataPage() {
  const fileInputRef = useRef(null)
  const [message, setMessage] = useState(null)

  const handleSave = () => {
    const data = {
      gears: JSON.parse(localStorage.getItem('gears') || '[]'),
      packingLists: JSON.parse(localStorage.getItem('packingLists') || '[]'),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'gearselect-backup.json'
    a.click()
    URL.revokeObjectURL(url)
    setMessage({ type: 'success', text: '保存しました' })
  }

  const handleLoad = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (!Array.isArray(data.gears)) throw new Error()
        localStorage.setItem('gears', JSON.stringify(data.gears))
        localStorage.setItem('packingLists', JSON.stringify(data.packingLists ?? []))
        window.location.reload()
      } catch {
        setMessage({ type: 'error', text: 'ファイルが正しくありません' })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col min-h-full">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">データ管理</h1>
      </header>

      <div className="flex-1 p-4 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <p className="text-sm font-semibold text-gray-700">バックアップ</p>
          <p className="text-xs text-gray-400">ギアとパッキングリストをJSONファイルに書き出します</p>
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-green-700 active:bg-green-800 transition-colors"
          >
            <Download size={16} />
            Save（書き出し）
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <p className="text-sm font-semibold text-gray-700">復元</p>
          <p className="text-xs text-gray-400">JSONファイルからデータを読み込みます。現在のデータは上書きされます</p>
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Upload size={16} />
            Load（読み込み）
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleLoad}
          />
        </div>

        {message && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium
            ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}
