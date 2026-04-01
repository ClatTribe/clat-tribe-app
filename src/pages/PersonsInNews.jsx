import React, { useState } from 'react';

const PersonsInNews = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const personsData = [
    {
      id: 1,
      name: 'Chief Justice DY Chandrachud',
      designation: 'Chief Justice of India',
      whyInNews: 'Leads landmark decisions on digital privacy and electoral transparency',
      category: 'Judiciary',
      categoryTag: 'Judiciary',
    },
    {
      id: 2,
      name: 'António Guterres',
      designation: 'UN Secretary General',
      whyInNews: 'Addressing global climate crisis and humanitarian concerns',
      category: 'International',
      categoryTag: 'International',
    },
    {
      id: 3,
      name: 'Sanjay Malhotra',
      designation: 'Governor, Reserve Bank of India',
      whyInNews: 'Monetary policy decisions and inflation management strategies',
      category: 'Economy',
      categoryTag: 'Economy',
    },
    {
      id: 4,
      name: 'Narendra Modi',
      designation: 'Prime Minister of India',
      whyInNews: "Leading India's digital transformation and economic reforms",
      category: 'Executive',
      categoryTag: 'Executive',
    },
    {
      id: 5,
      name: 'Volker Türk',
      designation: 'UN High Commissioner for Human Rights',
      whyInNews: 'Newly appointed head addressing global human rights violations',
      category: 'International',
      categoryTag: 'International',
    },
    {
      id: 6,
      name: 'Karim Khan',
      designation: 'Prosecutor, International Criminal Court',
      whyInNews: 'Investigating international crimes and war crimes allegations',
      category: 'International',
      categoryTag: 'International',
    },
    {
      id: 7,
      name: 'Nirmala Sitharaman',
      designation: 'Finance Minister, India',
      whyInNews: 'Presenting Union Budget and fiscal policy frameworks',
      category: 'Executive',
      categoryTag: 'Executive',
    },
    {
      id: 8,
      name: 'Shaktikanta Das',
      designation: 'Former RBI Governor',
      whyInNews: "Contribution to India's banking regulations and oversight policies",
      category: 'Economy',
      categoryTag: 'Economy',
    },
    {
      id: 9,
      name: 'Justice SA Bobde',
      designation: 'Senior Supreme Court Judge',
      whyInNews: 'Notable judgments on constitutional interpretation and rights',
      category: 'Judiciary',
      categoryTag: 'Judiciary',
    },
    {
      id: 10,
      name: 'Ajay Banga',
      designation: 'President, World Bank',
      whyInNews: 'Leading development initiatives and economic cooperation programs',
      category: 'International',
      categoryTag: 'International',
    },
  ];

  const filterPersons = (data, category) => {
    if (category === 'All') return data;
    return data.filter(person => person.categoryTag === category);
  };

  const categories = ['All', 'Judiciary', 'Executive', 'International', 'Economy'];
  const filteredPersons = filterPersons(personsData, activeCategory);

  const getCategoryBadgeColor = (category) => {
    const colors = {
      'Judiciary': 'bg-purple-100 text-purple-800',
      'Executive': 'bg-blue-100 text-blue-800',
      'International': 'bg-green-100 text-green-800',
      'Economy': 'bg-amber-100 text-amber-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Newsreader' }}>
            Persons in News
          </h1>
          <p className="text-gray-300" style={{ fontFamily: 'Manrope' }}>
            Key personalities shaping legal, political, and global affairs
          </p>
        </div>
      </div>

      {/* Filter Categories */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-2xl font-medium transition-all shadow-sm ${
                activeCategory === category
                  ? 'text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: activeCategory === category ? '#000' : undefined,
                fontFamily: 'Manrope',
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Persons Grid - 3 cols on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPersons.map((person) => (
            <div
              key={person.id}
              className="rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow bg-white"
            >
              {/* Category Badge */}
              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(person.categoryTag)}`}
                  style={{ fontFamily: 'Manrope' }}
                >
                  {person.categoryTag}
                </span>
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Newsreader' }}>
                {person.name}
              </h3>

              {/* Designation */}
              <p className="text-sm font-semibold mb-3" style={{ fontFamily: 'Manrope', color: '#855300' }}>
                {person.designation}
              </p>

              {/* Why in News */}
              <p className="text-gray-600 text-sm line-clamp-2" style={{ fontFamily: 'Manrope' }}>
                {person.whyInNews}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonsInNews;
