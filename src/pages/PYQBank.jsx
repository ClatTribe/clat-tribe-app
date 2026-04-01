import React, { useState } from 'react';

const PYQBank = () => {
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const pyqData = [
    {
      id: 1,
      year: 'CLAT 2024',
      exam: 'CLAT',
      difficulty: 'Medium',
      passage: 'The principle of "substantive due process" has evolved significantly in constitutional jurisprudence. Originally emerging from American constitutional law, it protects individuals from arbitrary government action by requiring fairness in both the substance and the procedure of laws. In India, Article 21 of the Constitution provides that no person shall be deprived of life or personal liberty except according to procedure established by law. Over decades of litigation, Indian courts have expanded this interpretation to include substantive dimensions, ensuring that not only the procedure but also the substance of laws must be just and reasonable.',
      questions: [
        {
          qId: 'q1-1',
          number: 1,
          text: 'According to the passage, what is the primary difference between procedural and substantive due process?',
          options: [
            'A) Procedural due process ensures fairness of procedure; substantive due process ensures fairness of the law itself',
            'B) Procedural due process is only relevant in America; substantive due process is only relevant in India',
            'C) There is no difference between the two concepts',
            'D) Substantive due process is not recognized in Indian constitutional law',
          ],
          correctAnswer: 'A',
          explanation: 'The passage distinguishes between procedure and substance, noting that Indian courts have expanded Article 21 to include both dimensions.',
        },
        {
          qId: 'q1-2',
          number: 2,
          text: 'Which constitutional article in India provides the foundation for the concept of due process as discussed?',
          options: [
            'A) Article 14',
            'B) Article 19',
            'C) Article 21',
            'D) Article 32',
          ],
          correctAnswer: 'C',
          explanation: 'The passage explicitly states that Article 21 provides the foundation for due process protection in India.',
        },
      ],
    },
    {
      id: 2,
      year: 'CLAT 2024',
      exam: 'CLAT',
      difficulty: 'Hard',
      passage: 'The doctrine of "piercing the corporate veil" allows courts to disregard the separate legal identity of a corporation and hold shareholders personally liable for corporate debts or wrongs. However, this doctrine is not absolute. Courts pierce the veil only in cases of fraud, misuse of corporate form, or where the corporation is merely a sham or facade. The Supreme Court has consistently held that mere inadequacy of capital or dormant status of company is not sufficient grounds for piercing the veil. The burden remains on the person seeking to pierce the veil to demonstrate that the corporate form has been used as an instrument of fraud or injustice.',
      questions: [
        {
          qId: 'q2-1',
          number: 1,
          text: 'Based on the passage, which of the following would NOT be sufficient ground for piercing the corporate veil?',
          options: [
            'A) Demonstrating that the corporation engaged in fraudulent transactions',
            'B) Proving that the corporation is merely a facade',
            'C) Showing that the company has inadequate capital',
            'D) Establishing that the corporate form was used as an instrument of injustice',
          ],
          correctAnswer: 'C',
          explanation: 'The passage explicitly states that "mere inadequacy of capital" is not sufficient ground for piercing the veil.',
        },
        {
          qId: 'q2-2',
          number: 2,
          text: 'Who bears the burden of proof in a case where piercing of corporate veil is sought?',
          options: [
            'A) The corporation',
            'B) The shareholders',
            'C) The person seeking to pierce the veil',
            'D) The court',
          ],
          correctAnswer: 'C',
          explanation: 'The passage clearly states: "The burden remains on the person seeking to pierce the veil to demonstrate..."',
        },
      ],
    },
    {
      id: 3,
      year: 'CLAT 2023',
      exam: 'CLAT',
      difficulty: 'Easy',
      passage: 'Environmental law in India has evolved through various legislations including the Environment Protection Act, 1986, and the establishment of the National Green Tribunal (NGT) in 2010. The NGT has jurisdiction over civil matters relating to environmental protection, conservation of forests, and handling of hazardous substances. The NGT applies the "polluter pays" principle, which holds that the entity responsible for pollution should bear the cost of managing it to prevent environmental damage. This principle encourages industries to adopt cleaner technologies and practices.',
      questions: [
        {
          qId: 'q3-1',
          number: 1,
          text: 'In what year was the National Green Tribunal established?',
          options: [
            'A) 1986',
            'B) 2005',
            'C) 2010',
            'D) 2015',
          ],
          correctAnswer: 'C',
          explanation: 'The passage clearly states that NGT was established in 2010.',
        },
        {
          qId: 'q3-2',
          number: 2,
          text: 'What does the "polluter pays" principle suggest about environmental responsibility?',
          options: [
            'A) The government should pay for all pollution control',
            'B) The entity causing pollution should bear the cost of managing it',
            'C) Pollution costs should be shared equally among all industries',
            'D) Individuals should never pollute',
          ],
          correctAnswer: 'B',
          explanation: 'The passage defines the polluter pays principle as holding that "the entity responsible for pollution should bear the cost of managing it".',
        },
      ],
    },
    {
      id: 4,
      year: 'AILET 2024',
      exam: 'AILET',
      difficulty: 'Hard',
      passage: 'The concept of "intellectual property rights" (IPR) encompasses various forms of intangible property, including patents, trademarks, copyrights, and trade secrets. Patent law grants inventors exclusive rights to their inventions for a specified period, typically 20 years from filing date. However, patent protection has certain limitations through mechanisms like "compulsory licensing," which permits governments to authorize third parties to use patented inventions without the owner\'s consent, usually during public health emergencies or national crises. The TRIPS agreement establishes minimum standards for IPR protection globally, yet allows countries to implement flexibilities for public interest.',
      questions: [
        {
          qId: 'q4-1',
          number: 1,
          text: 'What is compulsory licensing in patent law?',
          options: [
            'A) A mandatory requirement for patent owners to register their patents',
            'B) Authorization by governments for third parties to use patented inventions without owner consent',
            'C) A process where patents automatically expire',
            'D) A tax imposed on patent holders',
          ],
          correctAnswer: 'B',
          explanation: 'The passage defines compulsory licensing as government authorization for third parties to use patents without owner consent.',
        },
        {
          qId: 'q4-2',
          number: 2,
          text: 'According to the passage, what is the typical duration of patent protection?',
          options: [
            'A) 10 years from filing date',
            'B) 15 years from filing date',
            'C) 20 years from filing date',
            'D) Lifetime of the inventor',
          ],
          correctAnswer: 'C',
          explanation: 'The passage explicitly states "typically 20 years from filing date".',
        },
      ],
    },
    {
      id: 5,
      year: 'CLAT 2023',
      exam: 'CLAT',
      difficulty: 'Medium',
      passage: 'Comparative constitutional law examines how different nations address similar constitutional challenges. One recurring theme is the protection of fundamental rights versus the restriction of rights in public interest. The Indian Constitution contains a detailed chapter on Fundamental Rights (Part III) while also providing grounds for reasonable restrictions. The courts have developed a two-tier test: first, whether the restriction falls within constitutional grounds, and second, whether the restriction is reasonable. This balancing act ensures that individual liberties are protected while accommodating legitimate state objectives.',
      questions: [
        {
          qId: 'q5-1',
          number: 1,
          text: 'According to the passage, what is the two-tier test for restrictions on fundamental rights?',
          options: [
            'A) First, whether the restriction is permanent; second, whether it affects all citizens equally',
            'B) First, whether the restriction falls within constitutional grounds; second, whether it is reasonable',
            'C) First, whether Parliament approves; second, whether courts approve',
            'D) First, whether states approve; second, whether the Centre approves',
          ],
          correctAnswer: 'B',
          explanation: 'The passage explicitly describes the two-tier test as checking if restriction falls within constitutional grounds and if it is reasonable.',
        },
        {
          qId: 'q5-2',
          number: 2,
          text: 'Which part of the Indian Constitution contains Fundamental Rights?',
          options: [
            'A) Part II',
            'B) Part III',
            'C) Part IV',
            'D) Part V',
          ],
          correctAnswer: 'B',
          explanation: 'The passage states that "The Indian Constitution contains a detailed chapter on Fundamental Rights (Part III)".',
        },
      ],
    },
    {
      id: 6,
      year: 'AILET 2023',
      exam: 'AILET',
      difficulty: 'Easy',
      passage: 'The law of negligence requires proof of four essential elements: (1) duty of care, (2) breach of that duty, (3) causation, and (4) damage or loss suffered. A duty of care exists when one person owes a legal obligation to act with reasonable care towards another. The "reasonable person" test is used to determine whether a defendant has breached this duty. This test asks whether a reasonable person in similar circumstances would have acted differently. If yes, then the defendant has breached the duty of care.',
      questions: [
        {
          qId: 'q6-1',
          number: 1,
          text: 'How many essential elements must be proven in a negligence case?',
          options: [
            'A) Two',
            'B) Three',
            'C) Four',
            'D) Five',
          ],
          correctAnswer: 'C',
          explanation: 'The passage lists four essential elements: duty of care, breach, causation, and damage.',
        },
        {
          qId: 'q6-2',
          number: 2,
          text: 'What test is used to determine if a defendant has breached duty of care?',
          options: [
            'A) The "strict liability" test',
            'B) The "reasonable person" test',
            'C) The "foreseeability" test',
            'D) The "proportionality" test',
          ],
          correctAnswer: 'B',
          explanation: 'The passage clearly states "The reasonable person test is used to determine whether a defendant has breached this duty".',
        },
      ],
    },
  ];

  const pyqAns = (questionId) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const years = ['All', 'CLAT 2024', 'CLAT 2023', 'AILET 2024', 'AILET 2023'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filterPYQs = (data) => {
    return data.filter(item => {
      const yearMatch = selectedYear === 'All' || item.year === selectedYear;
      const difficultyMatch = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
      return yearMatch && difficultyMatch;
    });
  };

  const filteredPYQs = filterPYQs(pyqData);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Hard': 'bg-red-100 text-red-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Newsreader' }}>
            Previous Year Questions Bank
          </h1>
          <p className="text-gray-300" style={{ fontFamily: 'Manrope' }}>
            Practice with passage-based questions from past CLAT and AILET exams
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Manrope' }}>
              Filter by Year/Exam:
            </label>
            <div className="flex flex-wrap gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all shadow-sm ${
                    selectedYear === year
                      ? 'text-white'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedYear === year ? '#000' : undefined,
                    fontFamily: 'Manrope',
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Manrope' }}>
              Filter by Difficulty:
            </label>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all shadow-sm ${
                    selectedDifficulty === diff
                      ? 'text-white'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedDifficulty === diff ? '#855300' : undefined,
                    fontFamily: 'Manrope',
                  }}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PYQ Sets */}
        <div className="space-y-8">
          {filteredPYQs.map((pyq) => (
            <div key={pyq.id} className="rounded-2xl shadow-sm border border-gray-200 p-8 bg-white">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Newsreader' }}>
                    {pyq.year}
                  </h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(pyq.difficulty)}`}
                    style={{ fontFamily: 'Manrope' }}>
                    {pyq.difficulty}
                  </span>
                </div>
              </div>

              {/* Passage */}
              <div className="mb-8">
                <p className="text-lg leading-relaxed text-gray-700" style={{ fontFamily: 'Manrope' }}>
                  {pyq.passage}
                </p>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {pyq.questions.map((question) => (
                  <div key={question.qId} className="bg-gray-50 rounded-xl p-6">
                    <p className="font-bold text-gray-900 mb-4" style={{ fontFamily: 'Newsreader' }}>
                      Question {question.number}: {question.text}
                    </p>

                    {/* Options */}
                    <div className="space-y-2 mb-6">
                      {question.options.map((option, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                          style={{ fontFamily: 'Manrope' }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>

                    {/* Answer Reveal Button */}
                    <button
                      onClick={() => pyqAns(question.qId)}
                      className="px-4 py-2 rounded-2xl font-semibold text-white transition-all shadow-sm"
                      style={{
                        backgroundColor: revealedAnswers[question.qId] ? '#855300' : '#000',
                        fontFamily: 'Manrope',
                      }}
                    >
                      {revealedAnswers[question.qId] ? 'Hide Answer' : 'Show Answer'}
                    </button>

                    {/* Answer */}
                    {revealedAnswers[question.qId] && (
                      <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#fea61920' }}>
                        <p className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Manrope' }}>
                          Correct Answer: {question.correctAnswer}
                        </p>
                        <p className="text-gray-700" style={{ fontFamily: 'Manrope' }}>
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredPYQs.length === 0 && (
          <p className="text-gray-500 text-center py-8" style={{ fontFamily: 'Manrope' }}>
            No questions found matching your filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default PYQBank;
