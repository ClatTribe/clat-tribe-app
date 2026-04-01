import React, { useState } from 'react';
import { useState as useStateHook } from 'react';

const LegalCA = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const legalNewsData = [
    {
      id: 1,
      category: 'Supreme Court',
      dataLcat: 'SC',
      date: 'Mar 25, 2026',
      headline: 'Supreme Court Upholds Digital Privacy Rights',
      summary: 'SC landmark ruling on data privacy establishing fundamental right to digital privacy under Article 21.',
    },
    {
      id: 2,
      category: 'Legislation',
      dataLcat: 'Legislation',
      date: 'Mar 20, 2026',
      headline: 'BNS Section 152 Replaces Sedition Law',
      summary: 'Criminal Law Amendment: New BNS provisions replace archaic sedition clause with modern framework.',
    },
    {
      id: 3,
      category: 'Supreme Court',
      dataLcat: 'SC',
      date: 'Mar 15, 2026',
      headline: 'Right to Sleep Recognized as Article 21 Right',
      summary: 'SC recognizes right to sleep as fundamental right, landmark judgment on quality of life.',
    },
    {
      id: 4,
      category: 'High Court',
      dataLcat: 'HC',
      date: 'Mar 10, 2026',
      headline: 'Delhi HC on Arbitration Clause Enforcement',
      summary: 'High Court rules on scope and enforceability of arbitration clauses in commercial contracts.',
    },
    {
      id: 5,
      category: 'Legislation',
      dataLcat: 'Legislation',
      date: 'Mar 5, 2026',
      headline: 'Criminal Laws Amendment Bill 2026 Passed',
      summary: 'Parliament approves comprehensive amendments to criminal procedure and substantive criminal law.',
    },
    {
      id: 6,
      category: 'International',
      dataLcat: 'International',
      date: 'Feb 28, 2026',
      headline: 'NGT Orders Against Vedanta Mining Operations',
      summary: 'National Green Tribunal imposes stringent environmental compliance orders on mining company.',
    },
    {
      id: 7,
      category: 'International',
      dataLcat: 'International',
      date: 'Feb 20, 2026',
      headline: 'ICJ Issues Climate Change Advisory Opinion',
      summary: 'International Court of Justice releases major advisory on climate change and state obligations.',
    },
    {
      id: 8,
      category: 'Supreme Court',
      dataLcat: 'SC',
      date: 'Feb 15, 2026',
      headline: 'Electoral Bonds Transparency Order',
      summary: 'SC mandates disclosure of electoral bond donors, strengthening transparency in political funding.',
    },
  ];

  const lcaFilter = (data, filter) => {
    if (filter === 'All') return data;
    return data.filter(item => item.dataLcat === filter || item.category === filter);
  };

  const filterOptions = ['All', 'Supreme Court', 'High Court', 'Legislation', 'International'];
  const filteredNews = lcaFilter(legalNewsData, activeFilter);

  const getCategoryColor = (category) => {
    const colors = {
      'Supreme Court': 'bg-orange-100 text-orange-800',
      'High Court': 'bg-amber-100 text-amber-800',
      'Legislation': 'bg-yellow-100 text-yellow-800',
      'International': 'bg-red-100 text-red-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Newsreader' }}>
            Legal Current Affairs
          </h1>
          <p className="text-gray-300" style={{ fontFamily: 'Manrope' }}>
            Stay updated with latest legal developments and judgments
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-2xl font-medium transition-all shadow-sm ${
                activeFilter === filter
                  ? 'text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: activeFilter === filter ? '#000' : undefined,
                fontFamily: 'Manrope',
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNews.map((news) => (
            <div
              key={news.id}
              className="rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(news.category)}`}
                  style={{ fontFamily: 'Manrope' }}>
                  {news.category}
                </span>
                <span className="text-gray-500 text-sm" style={{ fontFamily: 'Manrope' }}>
                  {news.date}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Newsreader' }}>
                {news.headline}
              </h3>
              <p className="text-gray-600 line-clamp-2" style={{ fontFamily: 'Manrope' }}>
                {news.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalCA;
