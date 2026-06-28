import { List, CheckSquare, Database, Download, Upload, HardDrive, Users } from 'lucide-react'

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
    subsections: [
      {
        icon: <Download size={14} className="text-gray-400" />,
        label: 'JSONバックアップ',
        items: [
          'Save：ギア一覧とパッキングリストをまるごとJSONファイルに書き出します',
          'Load：JSONファイルから復元します（既存のデータはすべて置き換わります）',
        ],
      },
      {
        icon: <Upload size={14} className="text-gray-400" />,
        label: 'CSVエクスポート',
        items: [
          'Export：ギア一覧のみをCSVで書き出してExcelなどで開けます',
          'Import：CSVからギアを追加インポートします（既存データに追記されます）',
        ],
      },
      {
        icon: <HardDrive size={14} className="text-gray-400" />,
        label: 'データの保存について',
        items: [
          'データはこの端末のブラウザに保存されます',
          'ブラウザの「サイトデータを削除」を行うとデータが消えます',
          'データが消えないよう、JSONバックアップをこまめに取っておきましょう',
        ],
      },
      {
        icon: <Users size={14} className="text-gray-400" />,
        label: 'コミュニティ機能について',
        items: [
          'ギア登録時に「コミュニティDBに追加する」をオンにすると、ギア名・メーカー・重さがサーバーに送信されます',
          '他のユーザーが登録したギアをギア名入力時に候補として参照できます',
        ],
      },
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
        {sections.map(({ icon, title, items, subsections }) => (
          <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              {icon}
              <p className="text-sm font-semibold text-gray-800">{title}</p>
            </div>
            {items && (
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
                    <span className="text-green-500 mt-0.5 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {subsections && (
              <div className="space-y-4">
                {subsections.map(({ icon: subIcon, label, items: subItems }) => (
                  <div key={label}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {subIcon}
                      <p className="text-xs font-semibold text-gray-600">{label}</p>
                    </div>
                    <ul className="space-y-1.5 pl-1">
                      {subItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
                          <span className="text-green-500 mt-0.5 shrink-0">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
