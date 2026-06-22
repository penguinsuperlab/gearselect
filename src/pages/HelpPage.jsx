import { List, CheckSquare, Database } from 'lucide-react'

const sections = [
  {
    icon: <List size={18} className="text-green-600" />,
    title: 'ギア一覧',
    items: [
      'ギアの追加・編集・削除ができます',
      'カテゴリ・重さ(g)・メモを登録できます',
      'カテゴリフィルターで絞り込み、ソートボタンで並び替えができます',
    ],
  },
  {
    icon: <CheckSquare size={18} className="text-green-600" />,
    title: 'パッキング',
    items: [
      'ギアにチェックを入れてパッキングリストを作成できます',
      'リストに名前をつけて保存できます',
      '選択中・保存済みリストの総重量が表示されます',
    ],
  },
  {
    icon: <Database size={18} className="text-green-600" />,
    title: 'データ管理',
    items: [
      'データはこの端末のブラウザにのみ保存され、インターネット上には送信されません',
      'ブラウザのリセットや「サイトデータを削除」を行うとデータが消えます',
      'JSONでギアとパッキングリストをまるごとバックアップ・復元できます',
      'CSVでギア一覧をExcelに書き出し・追加インポートできます',
      'データが消えないよう、JSONバックアップをこまめに取っておきましょう',
    ],
  },
]

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-full">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">ヘルプ</h1>
      </header>

      <div className="flex-1 p-4 space-y-4">
        {sections.map(({ icon, title, items }) => (
          <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              {icon}
              <p className="text-sm font-semibold text-gray-800">{title}</p>
            </div>
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
                  <span className="text-green-500 mt-0.5 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
