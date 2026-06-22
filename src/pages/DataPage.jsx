import { useRef, useState } from 'react'
import { Download, Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { CATEGORIES, CATEGORY_MAP } from '../constants'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export default function DataPage() {
  const jsonLoadRef = useRef(null)
  const csvLoadRef = useRef(null)
  const [message, setMessage] = useState(null)

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleJsonSave = () => {
    const data = {
      gears: JSON.parse(localStorage.getItem('gears') || '[]'),
      packingLists: JSON.parse(localStorage.getItem('packingLists') || '[]'),
    }
    download('gearselect-backup.json', JSON.stringify(data, null, 2), 'application/json')
    showMessage('success', '保存しました')
  }

  const handleJsonLoad = (e) => {
    const file = e.target.files[0]
    if (!file) return
    readFile(file, (text) => {
      try {
        const data = JSON.parse(text)
        if (!Array.isArray(data.gears)) throw new Error()
        localStorage.setItem('gears', JSON.stringify(data.gears))
        localStorage.setItem('packingLists', JSON.stringify(data.packingLists ?? []))
        window.location.reload()
      } catch {
        showMessage('error', 'ファイルが正しくありません')
      }
    })
    e.target.value = ''
  }

  const handleCsvSave = () => {
    const gears = JSON.parse(localStorage.getItem('gears') || '[]')
    const header = '名前,カテゴリ,重さ(g),メモ'
    const rows = gears.map(g => [
      csvEscape(g.name),
      csvEscape(CATEGORY_MAP[g.categoryId]?.label ?? ''),
      g.weight ?? '',
      csvEscape(g.memo ?? ''),
    ].join(','))
    download('gearselect-gears.csv', '﻿' + [header, ...rows].join('\n'), 'text/csv')
    showMessage('success', '書き出しました')
  }

  const handleCsvLoad = (e) => {
    const file = e.target.files[0]
    if (!file) return
    readFile(file, (text) => {
      try {
        const lines = text.replace(/^﻿/, '').split('\n').filter(Boolean)
        const [, ...dataLines] = lines
        const newGears = dataLines.map(line => {
          const [name, categoryLabel, weight, memo] = parseCsvLine(line)
          const cat = CATEGORIES.find(c => c.label === categoryLabel)
          return {
            id: generateId(),
            name: name.trim(),
            categoryId: cat?.id ?? 'other',
            weight: weight !== '' ? Number(weight) : null,
            memo: memo?.trim() ?? '',
          }
        }).filter(g => g.name)
        const existing = JSON.parse(localStorage.getItem('gears') || '[]')
        localStorage.setItem('gears', JSON.stringify([...existing, ...newGears]))
        window.location.reload()
      } catch {
        showMessage('error', 'ファイルが正しくありません')
      }
    })
    e.target.value = ''
  }

  return (
    <div className="flex flex-col min-h-full">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">データ管理</h1>
      </header>

      <div className="flex-1 p-4 space-y-4">
        <Section title="JSONバックアップ" desc="ギアとパッキングリストをまるごと保存・復元">
          <Button icon={<Download size={16} />} label="Save（JSON書き出し）" onClick={handleJsonSave} />
          <Button icon={<Upload size={16} />} label="Load（JSON読み込み）" onClick={() => jsonLoadRef.current.click()} outline />
          <input ref={jsonLoadRef} type="file" accept=".json" className="hidden" onChange={handleJsonLoad} />
        </Section>

        <Section title="CSVエクスポート" desc="ギア一覧をExcelで開けるCSVで書き出し・追加インポート">
          <Button icon={<Download size={16} />} label="Export（CSV書き出し）" onClick={handleCsvSave} />
          <Button icon={<Upload size={16} />} label="Import（CSV読み込み）" onClick={() => csvLoadRef.current.click()} outline />
          <input ref={csvLoadRef} type="file" accept=".csv" className="hidden" onChange={handleCsvLoad} />
        </Section>

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

function Section({ title, desc, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      <p className="text-xs text-gray-400">{desc}</p>
      {children}
    </div>
  )
}

function Button({ icon, label, onClick, outline }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors
        ${outline
          ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'}`}
    >
      {icon}{label}
    </button>
  )
}

function download(filename, content, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function readFile(file, cb) {
  const reader = new FileReader()
  reader.onload = (e) => cb(e.target.result)
  reader.readAsText(file, 'utf-8')
}

function csvEscape(str) {
  if (!str) return ''
  return str.includes(',') || str.includes('"') || str.includes('\n')
    ? `"${str.replace(/"/g, '""')}"`
    : str
}

function parseCsvLine(line) {
  const result = []
  let cur = ''
  let inQuote = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuote) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++ }
      else if (ch === '"') inQuote = false
      else cur += ch
    } else {
      if (ch === '"') inQuote = true
      else if (ch === ',') { result.push(cur); cur = '' }
      else cur += ch
    }
  }
  result.push(cur)
  return result
}
