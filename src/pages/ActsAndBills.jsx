import React, { useState } from 'react';

const ActsAndBills = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const billsData = [
    {
      id: 1,
      title: 'Criminal Laws Amendment Bill 2026',
      year: 2026,
      keyProvisions: [
        'Comprehensive amendments to Bharatiya Nyaya Sanhita (BNS)',
        'Enhanced provisions for cybercrime and digital fraud',
        'New procedures for eco-sensitive crime investigation',
      ],
      status: 'Passed',
      type: 'Bill',
    },
    {
      id: 2,
      title: 'Digital Personal Data Protection Act 2023',
      year: 2023,
      keyProvisions: [
        'Establishes framework for personal data protection',
        'Defines rights of data principals and duties of data processors',
        'Creates regulatory authority for data protection',
      ],
      status: 'Enacted',
      type: 'Bill',
    },
    {
      id: 3,
      title: 'Mediation Act 2023',
      year: 2023,
      keyProvisions: [
        'Promotes mediation as alternative dispute resolution mechanism',
        'Protects confidentiality of mediation communications',
        'Harmonizes with UNCITRAL Model Law on Mediation',
      ],
      status: 'Enacted',
      type: 'Bill',
    },
  ];

  const actsData = [
    {
      id: 4,
      title: 'Constitution of India 1950',
      year: 1950,
      keyProvisions: [
        'Fundamental Rights (Articles 12-35)',
        'Directive Principles of State Policy (Articles 36-51)',
        'Separation of Powers and Federal Structure',
      ],
      status: 'Enacted',
      type: 'Act',
    },
    {
      id: 5,
      title: 'Bharatiya Nyaya Sanhita (BNS) 2023 / Indian Penal Code 1860',
      year: 2023,
      keyProvisions: [
        'Substantive criminal law and punishment provisions',
        'Definitions of offences against person and property',
        'Progressive criminal justice approach in BNS',
      ],
      status: 'Enacted',
      type: 'Act',
    },
    {
      id: 6,
      title: 'Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 / Criminal Procedure Code 1973',
      year: 2023,
      keyProvisions: [
        'Procedure for criminal investigations and trials',
        'Rights of accused and witnesses',
        'Enhanced victim protection in BNSS',
      ],
      status: 'Enacted',
      type: 'Act',
    },
    {
      id: 7,
      title: 'Bharatiya Sakshya Act (BSA) 2023 / Indian Evidence Act 1872',
      year: 2023,
      keyProvisions: [
        'Rules of evidence in judicial proceedings',
        'Admissibility of documentary and oral evidence',
        'Digital evidence provisions in BSA',
      ],
      status: 'Enacted',
      type: 'Act',
    },
    {
      id: 8,
      title: 'Right to Information Act 2005',
      year: 2005,
      keyProvisions: [
        'Establishes citizen right to access government information',
        'Creates Central Information Commission',
        'Defines exemptions and appeal procedures',
      ],
      status: 'Enacted',
      type: 'Act',
    },
    {
      id: 9,
      title: 'Forest (Conservation) Act 1980',
      year: 1980,
      keyProvisions: [
        'Regulates forest land diversion for non-forest purposes',
        'Requires central government clearance for forest use',
        'Mandates compensatory afforestation requirements',
      ],
      status: 'Enacted',
      type: 'Act',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Enacted': 'bg-green-100 text-green-800',
      'Passed': 'bg-blue-100 text-blue-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filterData = (data, term) => {
    if (!term.trim()) return data;
    const lowerTerm = term.toLowerCase();
    return data.filter(item =>
      item.title.toLowerCase().includes(lowerTerm) ||
      item.keyProvisions.some(prov => prov.toLowerCase().includes(lowerTerm))
    );
  };

  const filteredBills = filterData(billsData, searchTerm);
  const filteredActs = filterData(actsData, searchTerm);

  const CardItem = ({ item }) => (
    <div className="rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold flex-1" style={{ fontFamily: 'Newsreader' }}>
          {item.title}
        </h3>
        <span
          className={`ml-4 inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(item.status)}`}
          style={{ fontFamily: 'Manrope' }}
        >
          {item.status}
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-4" style={{ fontFamily: 'Manrope' }}>
        Year: {item.year}
      </p>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-700" style={{ fontFamily: 'Manrope' }}>
          Key Provisions:
        </p>
        <ul className="space-y-1">
          {item.keyProvisions.map((provision, idx) => (
            <li
              key={idx}
              className="text-sm text-gray-600 flex gap-2"
              style={{ fontFamily: 'Manrope' }}
            >
              <span className="text-gray-400">&#x2022;</span>
              <span>{provision}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Newsreader' }}>
            Acts & Bills Reference
          </h1>
          <p className="text-gray-300" style={{ fontFamily: 'Manrope' }}>
            Key legislation shaping India's legal framework
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search acts, bills, or provisions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
            style={{ fontFamily: 'Manrope' }}
          />
        </div>

        {/* Recent Bills Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Newsreader' }}>
            Recent Bills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBills.length > 0 ? (
              filteredBills.map((bill) => <CardItem key={bill.id} item={bill} />)
            ) : (
              <p className="text-gray-500 col-span-full" style={{ fontFamily: 'Manrope' }}>
                No bills found matching your search.
              </p>
            )}
          </div>
        </section>

        {/* Key Acts Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Newsreader' }}>
            Key Acts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredActs.length > 0 ? (
              filteredActs.map((act) => <CardItem key={act.id} item={act} />)
            ) : (
              <p className="text-gray-500 col-span-full" style={{ fontFamily: 'Manrope' }}>
                No acts found matching your search.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ActsAndBills;
