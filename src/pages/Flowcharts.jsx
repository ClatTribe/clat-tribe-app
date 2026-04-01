import { useState } from 'react'

export default function Flowcharts() {
  const [activeChart, setActiveChart] = useState('amendments')

  const charts = {
    amendments: {
      title: 'Constitutional Amendments',
      subtitle: 'How a Bill becomes an Amendment',
      nodes: [
        { id: 1, label: 'Bill Introduced in Parliament', icon: 'description', color: 'bg-blue-100' },
        { id: 2, label: 'Discussion in Both Houses', icon: 'forum', color: 'bg-blue-50' },
        { id: 3, label: 'Approved by 2/3 Majority in Each House', icon: 'how_to_vote', color: 'bg-purple-100' },
        { id: 4, label: 'Sent to President', icon: 'person', color: 'bg-amber-50' },
        { id: 5, label: 'Ratified by State Legislatures (1/2)', icon: 'location_on', color: 'bg-green-100' },
        { id: 6, label: 'Amendment Becomes Part of Constitution', icon: 'check_circle', color: 'bg-green-50' }
      ]
    },
    judiciary: {
      title: 'Judiciary Hierarchy',
      subtitle: 'Structure of Indian Courts',
      nodes: [
        { id: 1, label: 'Supreme Court', icon: 'account_balance', color: 'bg-secondary/20' },
        { id: 2, label: 'High Courts (28)', icon: 'domain', color: 'bg-blue-100' },
        { id: 3, label: 'District Courts', icon: 'gavel', color: 'bg-blue-50' },
        { id: 4, label: 'Subordinate Courts', icon: 'mediation', color: 'bg-slate-100' }
      ]
    },
    billlaw: {
      title: 'How a Bill becomes Law',
      subtitle: 'Legislative Process in India',
      nodes: [
        { id: 1, label: 'Bill Introduced (1st Reading)', icon: 'description', color: 'bg-orange-100' },
        { id: 2, label: '2nd Reading: Discussion & Amendment', icon: 'edit', color: 'bg-orange-50' },
        { id: 3, label: '3rd Reading: Final Vote', icon: 'how_to_vote', color: 'bg-amber-100' },
        { id: 4, label: 'Sent to Other House', icon: 'send', color: 'bg-amber-50' },
        { id: 5, label: 'Repeat Readings (2nd House)', icon: 'sync', color: 'bg-yellow-100' },
        { id: 6, label: 'Sent to President for Assent', icon: 'person', color: 'bg-yellow-50' },
        { id: 7, label: 'Becomes Law', icon: 'check_circle', color: 'bg-green-100' }
      ]
    },
    bodies: {
      title: 'Constitutional vs Statutory vs Non-Statutory Bodies',
      subtitle: 'Classification of Indian Bodies',
      nodes: [
        { id: 1, label: 'Constitutional Bodies (Parliament, SC, HC)', icon: 'account_balance', color: 'bg-purple-100' },
        { id: 2, label: 'Created Directly by Constitution', icon: 'check', color: 'bg-purple-50' },
        { id: 3, label: 'Statutory Bodies (RBI, SEBI, CCI)', icon: 'domain', color: 'bg-blue-100' },
        { id: 4, label: 'Created by Acts of Parliament', icon: 'check', color: 'bg-blue-50' },
        { id: 5, label: 'Non-Statutory Bodies (Commissions)', icon: 'group_work', color: 'bg-slate-100' },
        { id: 6, label: 'Created by Executive Orders/Notifications', icon: 'check', color: 'bg-slate-50' }
      ]
    }
  }

  const chartTitles = [
    { id: 'amendments', label: 'Constitutional Amendments' },
    { id: 'judiciary', label: 'Judiciary Hierarchy' },
    { id: 'billlaw', label: 'How a Bill becomes Law' },
    { id: 'bodies', label: 'Constitutional Bodies' }
  ]

  const currentChart = charts[activeChart]

  return (
    <div className="pt-6 px-0 md:px-2 pb-16">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Visual Learning</p>
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-[#060818] mb-8">Constitutional Flowcharts</h1>

        {/* Chart Selector */}
        <div className="flex flex-wrap gap-3">
          {chartTitles.map((chart) => (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                activeChart === chart.id
                  ? 'bg-secondary text-white shadow-lg'
                  : 'bg-surface-container-low text-slate-600 hover:bg-slate-200'
              }`}
            >
              {chart.label}
            </button>
          ))}
        </div>
      </div>

      {/* Flowchart */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mb-8">
          <h2 className="font-headline text-3xl font-bold text-[#060818] mb-2">{currentChart.title}</h2>
          <p className="text-slate-600 mb-12">{currentChart.subtitle}</p>

          {/* Flowchart Layout */}
          <div className="space-y-6">
            {currentChart.nodes.map((node, idx) => (
              <div key={node.id}>
                {/* Node */}
                <div className={`fc-node rounded-2xl p-6 border-l-4 border-secondary shadow-sm flex items-center gap-4 ${node.color}`}>
                  <span className="material-symbols-outlined text-3xl text-secondary flex-shrink-0">
                    {node.icon}
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{node.label}</p>
                  </div>
                  <span className="text-xs font-bold bg-white px-3 py-1 rounded-full text-slate-600">
                    Step {idx + 1}
                  </span>
                </div>

                {/* Arrow (except last) */}
                {idx < currentChart.nodes.length - 1 && (
                  <div className="flex justify-center py-4">
                    <svg width="40" height="30" viewBox="0 0 40 30" className="text-secondary">
                      <path
                        d="M 20 0 L 20 20 M 20 20 L 15 15 M 20 20 L 25 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-12 bg-secondary-container/10 border border-secondary/20 rounded-2xl p-6">
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-secondary flex-shrink-0">info</span>
              <div>
                <p className="font-bold text-slate-800 mb-1">Key Point</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeChart === 'amendments' && 'Amendment bills require a special majority (2/3 in both Houses) and ratification by at least half of state legislatures, making constitutional change deliberately difficult.'}
                  {activeChart === 'judiciary' && 'The Supreme Court has final appellate jurisdiction over all courts in India. High Courts have supervisory jurisdiction over lower courts in their respective states.'}
                  {activeChart === 'billlaw' && 'A bill can be rejected at any stage. If the President returns it, both Houses must reconsider with a simple majority in each House to pass it again.'}
                  {activeChart === 'bodies' && 'Constitutional bodies derive authority directly from the Constitution and cannot be abolished by simple legislative action, while statutory bodies can be modified or repealed.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
