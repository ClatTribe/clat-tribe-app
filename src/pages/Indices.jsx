import React, { useState } from 'react';

const Indices = () => {
  const [sortBy, setSortBy] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');

  const indicesData = [
    {
      id: 1,
      name: 'Human Development Index (HDI)',
      category: 'Development',
      indiaRank: 134,
      score: 0.633,
      releasedBy: 'United Nations Development Programme',
      keyInsight: 'India in medium HDI category; focus on education and health improvements needed',
    },
    {
      id: 2,
      name: 'Global Hunger Index',
      category: 'Development',
      indiaRank: 107,
      score: 27.3,
      releasedBy: 'Welthungerhilfe & Concern Worldwide',
      keyInsight: 'Serious hunger level; requires targeted intervention in rural regions',
    },
    {
      id: 3,
      name: 'World Press Freedom Index',
      category: 'Democracy',
      indiaRank: 111,
      score: 36.89,
      releasedBy: 'Reporters Without Borders',
      keyInsight: 'Challenges to press freedom; declining scores impact on free expression',
    },
    {
      id: 4,
      name: 'Ease of Doing Business Index',
      category: 'Economy',
      indiaRank: 63,
      score: 70.5,
      releasedBy: 'World Bank',
      keyInsight: 'Improved ranking through business reforms; still room for improvement',
    },
    {
      id: 5,
      name: 'Democracy Index',
      category: 'Democracy',
      indiaRank: 46,
      score: 6.62,
      releasedBy: 'The Economist Intelligence Unit',
      keyInsight: 'Classified as flawed democracy; concerns on electoral process and civil liberties',
    },
    {
      id: 6,
      name: 'Corruption Perceptions Index (CPI)',
      category: 'Governance',
      indiaRank: 93,
      score: 41,
      releasedBy: 'Transparency International',
      keyInsight: 'Moderate corruption perception; anti-corruption efforts ongoing',
    },
    {
      id: 7,
      name: 'Global Peace Index',
      category: 'Security',
      indiaRank: 120,
      score: 2.661,
      releasedBy: 'Institute for Economics & Peace',
      keyInsight: 'Moderate peace rating; security challenges in conflict zones',
    },
    {
      id: 8,
      name: 'Global Gender Gap Report',
      category: 'Development',
      indiaRank: 127,
      score: 0.601,
      releasedBy: 'World Economic Forum',
      keyInsight: 'Gender parity challenges; improvements in political representation needed',
    },
  ];

  const categories = ['All', 'Development', 'Democracy', 'Economy', 'Governance', 'Security'];

  const filterIndices = (data, term) => {
    if (!term.trim()) return data;
    const lowerTerm = term.toLowerCase();
    return data.filter(item =>
      item.name.toLowerCase().includes(lowerTerm) ||
      item.category.toLowerCase().includes(lowerTerm)
    );
  };

  const sortIndices = (data, sortType) => {
    const sorted = [...data];
    switch (sortType) {
      case 'rank-asc':
        return sorted.sort((a, b) => a.indiaRank - b.indiaRank);
      case 'rank-desc':
        return sorted.sort((a, b) => b.indiaRank - a.indiaRank);
      case 'score-asc':
        return sorted.sort((a, b) => a.score - b.score);
      case 'score-desc':
        return sorted.sort((a, b) => b.score - a.score);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  };

  let processedData = filterIndices(indicesData, searchTerm);
  processedData = sortIndices(processedData, sortBy);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Newsreader' }}>
            Important Indices & Rankings
          </h1>
          <p className="text-gray-300" style={{ fontFamily: 'Manrope' }}>
            Track India's performance across global indices
          </p>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search indices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-6 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
            style={{ fontFamily: 'Manrope' }}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-6 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
            style={{ fontFamily: 'Manrope' }}
          >
            <option value="default">Sort by Default</option>
            <option value="rank-asc">Rank (Best First)</option>
            <option value="rank-desc">Rank (Worst First)</option>
            <option value="score-asc">Score (Ascending)</option>
            <option value="score-desc">Score (Descending)</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        {/* Indices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {processedData.map((index) => (
            <div
              key={index.id}
              className="rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold" style={{ fontFamily: 'Newsreader' }}>
                    {index.name}
                  </h3>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Manrope' }}>
                    {index.category}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Manrope' }}>
                    India's Rank:
                  </span>
                  <span className="text-2xl font-bold" style={{ color: '#855300', fontFamily: 'Newsreader' }}>
                    #{index.indiaRank}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Manrope' }}>
                    Score:
                  </span>
                  <span className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Newsreader' }}>
                    {index.score}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs font-semibold text-gray-600 mb-2" style={{ fontFamily: 'Manrope' }}>
                  Released by:
                </p>
                <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Manrope' }}>
                  {index.releasedBy}
                </p>
                <p className="text-sm text-gray-700 italic border-l-4" style={{ borderColor: '#fea619', fontFamily: 'Manrope', paddingLeft: '12px' }}>
                  {index.keyInsight}
                </p>
              </div>
            </div>
          ))}
        </div>

        {processedData.length === 0 && (
          <p className="text-gray-500 text-center py-8" style={{ fontFamily: 'Manrope' }}>
            No indices found matching your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default Indices;
