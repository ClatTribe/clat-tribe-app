import { useState } from 'react'

export default function Article() {
  const [markedRead, setMarkedRead] = useState(false)
  const [answers, setAnswers] = useState({})
  const [showToast, setShowToast] = useState(false)

  const handleAnswer = (qId, optIndex) => {
    setAnswers({ ...answers, [qId]: optIndex })
  }

  const handleMarkRead = () => {
    setMarkedRead(true)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const questions = [
    {
      id: 1,
      q: "According to the passage, the ICJ decision on climate obligations was based on how many sources of law?",
      opts: ["Two sources", "Three sources", "Four sources", "Five sources"],
      correct: 1
    },
    {
      id: 2,
      q: "What did India argue in response to the ICJ climate opinion?",
      opts: ["Complete non-compliance", "Common but Differentiated Responsibilities", "Climate action is optional", "Only developed nations must act"],
      correct: 1
    },
    {
      id: 3,
      q: "The Paris Agreement's temperature targets were described as:",
      opts: ["Aspirational goals", "Binding benchmarks", "Voluntary commitments", "Non-binding recommendations"],
      correct: 1
    }
  ]

  return (
    <div className="pt-6 px-0 md:px-2">
      {/* Notification Toast */}
      {showToast && (
        <div className="fixed top-8 right-8 bg-secondary text-white px-6 py-4 rounded-2xl shadow-lg z-50 flex items-center gap-3 animate-pulse">
          <span className="material-symbols-outlined">check_circle</span>
          <span className="font-bold">+30 XP</span>
        </div>
      )}

      {/* Editorial Header */}
      <header className="max-w-5xl mx-auto mb-16">
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6">
          <a className="hover:text-secondary transition-colors" href="#">Archive</a>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <a className="hover:text-secondary transition-colors" href="#">Articles</a>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-secondary">International Law</span>
        </nav>
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-on-surface leading-[1.1] mb-8 tracking-tight">
          ICJ Climate Advisory Opinion: A Binding Obligation for Global Action
        </h1>
        <div className="flex flex-wrap items-center gap-8 border-y border-slate-200 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">gavel</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Authored By</p>
              <p className="text-sm font-bold">International Law Bureau</p>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">schedule</span>
              <span className="text-sm font-medium">15 Min Read</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">description</span>
              <span className="text-sm font-medium">2,300 Words</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">calendar_today</span>
              <span className="text-sm font-medium">Mar 31, 2026</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto space-y-8 mb-16">
        <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <div className="prose prose-slate max-w-none space-y-8">
            <p className="font-headline text-xl md:text-2xl leading-[1.8] text-on-surface">
              <span className="drop-cap">I</span>n March 2026, the International Court of Justice delivered a landmark advisory opinion on climate change obligations, holding by a 12-3 vote that states have binding obligations under customary international law to mitigate greenhouse gas emissions. This decision represents a watershed moment in international environmental law, transforming climate action from a matter of political discretion into a legal imperative grounded in established principles of state responsibility and due diligence.
            </p>

            <p className="font-headline text-xl md:text-2xl leading-[1.8] text-on-surface">
              The Court identified three primary sources of obligation: the 'no harm' principle rooted in the Trail Smelter principle and the UN Declaration on the Human Environment; UNFCCC obligations requiring states to stabilize greenhouse gas concentrations; and the general duty of due diligence to prevent transboundary harm. These foundations created a comprehensive legal framework binding all UN member states, regardless of whether they were party to the Paris Agreement.
            </p>

            <div className="my-10 pl-6 border-l-4 border-secondary bg-surface-container-low py-6 pr-8 rounded-r-2xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-secondary block mb-2">Editorial Quote</span>
              <p className="text-base font-headline italic leading-relaxed text-slate-700">
                "This opinion crystallizes what legal scholars have argued for decades: that climate change, by its inherently transboundary nature, engages the fundamental principle that states cannot use their territory in a manner causing harm to other states. The Court has spoken, and the silence of inaction is no longer legally defensible."
              </p>
            </div>

            <p className="font-headline text-xl md:text-2xl leading-[1.8] text-on-surface">
              India's position during the proceedings merits particular attention. The Indian delegation maintained that while all states share responsibility for climate mitigation, the principle of Common But Differentiated Responsibilities (CBDR) must anchor any enforcement mechanism. India argued that developed nations, having industrialized for over two centuries and accumulated vast historical emissions, must bear greater responsibility and provide financial support to developing nations transitioning to green economies. The Court acknowledged this argument but ultimately held that all states must act proportionately to their historical emissions and current capacity â a position that both affirms and complicates India's CBDR stance.
            </p>

            <p className="font-headline text-xl md:text-2xl leading-[1.8] text-on-surface">
              Perhaps most significantly, the Court declared the Paris Agreement's 1.5Â°C and 2Â°C temperature targets as binding benchmarks for determining the adequacy of mitigation efforts. This redefines the nature of international climate commitments: they shift from aspirational targets to justiciable standards against which state compliance can be measured. The implications are profound. States falling behind Paris targets can now face legal challenges in international forums, creating pressure for strengthening NDCs (Nationally Determined Contributions) and enforcement mechanisms.
            </p>

            <div className="rounded-2xl overflow-hidden my-12 bg-surface-container-low border border-slate-200">
              <div className="w-full h-[300px] bg-gradient-to-br from-secondary/10 to-secondary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-secondary/30">public</span>
              </div>
              <p className="text-xs text-center py-4 text-slate-600 italic">Fig 1: The ICJ decision globalizes climate accountability, binding 195 nations to evidence-based mitigation targets.</p>
            </div>

            <p className="font-headline text-xl md:text-2xl leading-[1.8] text-on-surface">
              The opinion does not create new substantive rights; rather, it clarifies the binding nature of existing state obligations under international law. This distinction is crucial for CLAT aspirants to grasp: the ICJ did not invent climate duties through this opinion. Instead, it authoritatively declared that such duties already exist within the fabric of customary international law and treaty obligations, and states can no longer argue that climate action is merely a matter of voluntary political commitment.
            </p>

            <div className="my-10 pl-6 border-l-4 border-secondary-container bg-secondary-container/5 py-6 pr-8 rounded-r-2xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-secondary block mb-2">Key Principle</span>
              <p className="text-base font-medium leading-relaxed text-slate-700">
                <strong>Pacta sunt servanda:</strong> "Agreements must be kept." This foundational principle of treaty law means that states cannot escape obligations they have voluntarily undertaken through international agreements. Applied to climate treaties, it transforms UNFCCC commitments and Paris Agreement pledges from moral promises into legally binding obligations.
              </p>
            </div>

            <p className="font-headline text-xl md:text-2xl leading-[1.8] text-on-surface">
              For Indian law and policy, this opinion carries significant implications. India's National Action Plan on Climate Change and its NDC committing to 40% renewable energy capacity by 2030 and net-zero by 2070 have now shifted from aspirational policy statements to international legal obligations. Furthermore, India's litigation strategy in forums like the ICJ must increasingly emphasize the CBDR principle backed by legal arguments rooted in equity, historical responsibility, and development rights â a framework that extends beyond mere political negotiation.
            </p>

            <p className="font-headline text-xl md:text-2xl leading-[1.8] text-on-surface">
              The opinion also raises questions about enforcement. While the ICJ cannot compel state compliance, states falling significantly behind climate targets now face reputational, diplomatic, and potentially economic consequences. International trade agreements, investment treaties, and access to green finance mechanisms increasingly hinge on climate performance â rendering the opinion not merely a legal clarification but a trigger for practical accountability mechanisms.
            </p>
          </div>
        </div>
      </article>

      {/* Comprehension Questions */}
      <section className="max-w-5xl mx-auto mb-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm">
          <h2 className="font-headline text-3xl text-on-surface mb-8">Passage-Based Questions</h2>
          <div className="space-y-8">
            {questions.map((q) => (
              <div key={q.id} className="border-b border-slate-100 pb-8 last:border-b-0">
                <p className="font-bold text-slate-800 mb-6">Q{q.id}. {q.q}</p>
                <div className="space-y-3 mb-6">
                  {q.opts.map((opt, i) => (
                    <label key={i} className="group block cursor-pointer">
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        className="hidden peer"
                        checked={answers[q.id] === i}
                        onChange={() => handleAnswer(q.id, i)}
                      />
                      <div className={`p-4 rounded-xl border-2 transition-all ${
                        answers[q.id] === i
                          ? i === q.correct
                            ? 'bg-green-50 border-green-300'
                            : 'bg-red-50 border-red-300'
                          : 'border-slate-200 bg-white hover:border-secondary/30'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            answers[q.id] === i
                              ? i === q.correct
                                ? 'bg-green-500 border-green-500'
                                : 'bg-red-500 border-red-500'
                              : 'border-slate-300'
                          }`}>
                            {answers[q.id] === i && (
                              <span className="material-symbols-outlined text-white text-sm">check</span>
                            )}
                          </div>
                          <span className={answers[q.id] === i && i !== q.correct ? 'text-red-700' : 'text-slate-800'}>
                            {opt}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {answers[q.id] !== undefined && (
                  <div className={`p-4 rounded-xl ${
                    answers[q.id] === q.correct
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className={`text-sm font-medium ${answers[q.id] === q.correct ? 'text-green-700' : 'text-red-700'}`}>
                      {answers[q.id] === q.correct ? 'Correct!' : 'Incorrect.'} {q.opts[q.correct]} is the right answer.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mark as Read Button */}
      <div className="max-w-5xl mx-auto mb-16 flex justify-center">
        <button
          onClick={handleMarkRead}
          disabled={markedRead}
          className={`px-8 py-4 rounded-xl font-bold text-white flex items-center gap-3 transition-all ${
            markedRead
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-secondary hover:bg-secondary-container hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined">{markedRead ? 'check' : 'bookmark'}</span>
          {markedRead ? 'Article Marked as Read' : 'Mark as Read'}
        </button>
      </div>

      {/* Navigation */}
      <div className="max-w-5xl mx-auto flex items-center justify-between pt-8 border-t border-slate-200">
        <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-secondary transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
          Previous Article
        </button>
        <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-secondary transition-colors">
          Next: Tort Law Fundamentals
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  )
}
import { useState } from 'react'

export default function Article() {
  const [markedRead, setMarkedRead] = useState(false)
  const [answers, setAnswers] = useState({})
  const [showToast, setShowToast] = useState(false)

  const handleAnswer = (qId, optIndex) => {
    setAnswers({ ...answers, [qId]: optIndex })
  }

  const handleMarkRead = () => {
    setMarkedRead(true)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const questions = [
    {
      id: 1,
      q: "According to the passage, the ICJ decision on climate obligations was based on how many sources of law?",
      opts: ["Two sources", "Three sources", "Four sources", "Five sources"],
      correct: 1
    },
    {
      id: 2,
      q: "What did India argue in response to the ICJ climate opinion?",
      opts: ["Complete non-compliance", "Common but Differentiated Responsibilities", "Climate action is optional", "Only developed nations must act"],
      correct: 1
    },
    {
      id: 3,
      q: "The Paris Agreement's temperature targets were described as:",
      opts: ["Aspirational goals", "Binding benchmarks", "Voluntary commitments", "Non-binding recommendations"],
      correct: 1
    }
  ]

  return (
    <div className="pt-6 px-0 md:px-2">
      {/* Notification Toast */}
      {showToast && (
        <div className="fixed top-8 right-8 bg-secondary text-white px-6 py-4 rounded-2xl shadow-lg z-50 flex items-center gap-3 animate-pulse">
          <span className="material-symbols-outlined">check_circle</span>
          <span className="font-bold">+30 XP</span>
        </div>
      )}

      {/* Editorial Header */}
      <header className="max-w-5xl mx-auto mb-16">
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
          <a className="hover:text-secondary transition-colors" href="#">Archive</a>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <a className="hover:text-secondary transition-colors" href="#">Articles</a>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-secondary">International Law</span>
        </nav>
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-[#060818] leading-[1.1] mb-8 tracking-tight">
          ICJ Climate Advisory Opinion: A Binding Obligation for Global Action
        </h1>
        <div className="flex flex-wrap items-center gap-8 border-y border-slate-200 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">gavel</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Authored By</p>
              <p className="text-sm font-bold">International Law Bureau</p>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">schedule</span>
              <span className="text-sm font-medium">15 Min Read</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">description</span>
              <span className="text-sm font-medium">2,300 Words</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">calendar_today</span>
              <span className="text-sm font-medium">Mar 31, 2026</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto space-y-8 mb-16">
        <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <div className="prose prose-slate max-w-none space-y-8">
            <p className="font-headline text-xl md:text-2xl leading-[1.8] text-[#060818]">
              <span className="drop-cap">I</span>n March 2026, the International Court of Justice delivered a landmark advisory opinion on climate change obligations, holding by a 12-3 vote that states have binding obligations under customary international law to mitigate greenhouse gas emissions. This decision represents a watershed moment in international environmental law, transforming climate action from a matter of political discretion into a legal imperative grounded in established principles of state responsibility and due diligence.
            </p>

            <p className="font-headline text-xl md:text-2xl leading-[1.8] text-[#060818]">
              The Court identified three primary sources of obligation: the 'no harm' principle rooted in the Trail Smelter principle and the UN Declaration on the Human Environment; UNFCCC obligations requiring states to stabilize greenhouse gas concentrations; and the general duty of due diligence to prevent transboundary harm. These foundations created a comprehensive legal framework binding all UN member states, regardless of whether they were party to the Paris Agreement.
            </p>

            <div className="my-10 pl-6 border-l-4 border-secondary bg-surface-container-low py-6 pr-8 rounded-r-2xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-secondary block mb-2">Editorial Quote</span>
              <p className="text-base font-headline italic leading-relaxed text-slate-700">
                "This opinion crystallizes what legal scholars have argued for decades: that climate change, by its inherently transboundary nature, engages the fundamental principle that states cannot use their territory in a manner causing harm to other states. The Court has spoken, and the silence of inaction is no longer legally defensible."
              </p>
            </div>

            <p className="font-headline text-xl md:text-2xl leading-[1.8] text-[#060818]">
              India's position during the proceedings merits particular attention. The Indian delegation maintained that while all states share responsibility for climate mitigation, the principle of Common But Differentiated Responsibilities (CBDR) must anchor any enforcement mechanism. India argued that developed nations, having industrialized for over two centuries and accumulated vast historical emissions, must bear greater responsibility and provide financial support to developing nations transitioning to green economies. The Court acknowledged this argument but ultimately held that all states must act proportionately to their historical emissions and current capacity — a position that both affirms and complicates India's CBDR stance.
            </p>

            <p className="font-headline text-xl md:text-2xl leading-[1.8] text-[#060818]">
              Perhaps most significantly, the Court declared the Paris Agreement's 1.5°C and 2°C temperature targets as binding benchmarks for determining the adequacy of mitigation efforts. This redefines the nature of international climate commitments: they shift from aspirational targets to justiciable standards against which state compliance can be measured. The implications are profound. States falling behind Paris targets can now face legal challenges in international forums, creating pressure for strengthening NDCs (Nationally Determined Contributions) and enforcement mechanisms.
            </p>

            <div className="rounded-2xl overflow-hidden my-12 bg-surface-container-low border border-slate-200">
              <div className="w-full h-[300px] bg-gradient-to-br from-secondary/10 to-secondary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-secondary/30">public</span>
              </div>
              <p className="text-xs text-center py-4 text-slate-600 italic">Fig 1: The ICJ decision globalizes climate accountability, binding 195 nations to evidence-based mitigation targets.</p>
            </div>

            <p className="font-headline text-xl md:text-2xl leading-[1.8] text-[#060818]">
              The opinion does not create new substantive rights; rather, it clarifies the binding nature of existing state obligations under international law. This distinction is crucial for CLAT aspirants to grasp: the ICJ did not invent climate duties through this opinion. Instead, it authoritatively declared that such duties already exist within the fabric of customary international law and treaty obligations, and states can no longer argue that climate action is merely a matter of voluntary political commitment.
            </p>

            <div className="my-10 pl-6 border-l-4 border-secondary-container bg-secondary-container/5 py-6 pr-8 rounded-r-2xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-secondary block mb-2">Key Principle</span>
              <p className="text-base font-medium leading-relaxed text-slate-700">
                <strong>Pacta sunt servanda:</strong> "Agreements must be kept." This foundational principle of treaty law means that states cannot escape obligations they have voluntarily undertaken through international agreements. Applied to climate treaties, it transforms UNFCCC commitments and Paris Agreement pledges from moral promises into legally binding obligations.
              </p>
            </div>

            <p className="font-headline text-xl md:text-2xl leading-[1.8] text-[#060818]">
              For Indian law and policy, this opinion carries significant implications. India's National Action Plan on Climate Change and its NDC committing to 40% renewable energy capacity by 2030 and net-zero by 2070 have now shifted from aspirational policy statements to international legal obligations. Furthermore, India's litigation strategy in forums like the ICJ must increasingly emphasize the CBDR principle backed by legal arguments rooted in equity, historical responsibility, and development rights — a framework that extends beyond mere political negotiation.
            </p>

            <p className="font-headline text-xl md:text-2xl leading-[1.8] text-[#060818]">
              The opinion also raises questions about enforcement. While the ICJ cannot compel state compliance, states falling significantly behind climate targets now face reputational, diplomatic, and potentially economic consequences. International trade agreements, investment treaties, and access to green finance mechanisms increasingly hinge on climate performance — rendering the opinion not merely a legal clarification but a trigger for practical accountability mechanisms.
            </p>
          </div>
        </div>
      </article>

      {/* Comprehension Questions */}
      <section className="max-w-5xl mx-auto mb-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm">
          <h2 className="font-headline text-3xl text-[#060818] mb-8">Passage-Based Questions</h2>
          <div className="space-y-8">
            {questions.map((q) => (
              <div key={q.id} className="border-b border-slate-100 pb-8 last:border-b-0">
                <p className="font-bold text-slate-800 mb-6">Q{q.id}. {q.q}</p>
                <div className="space-y-3 mb-6">
                  {q.opts.map((opt, i) => (
                    <label key={i} className="group block cursor-pointer">
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        className="hidden peer"
                        checked={answers[q.id] === i}
                        onChange={() => handleAnswer(q.id, i)}
                      />
                      <div className={`p-4 rounded-xl border-2 transition-all ${
                        answers[q.id] === i
                          ? i === q.correct
                            ? 'bg-green-50 border-green-300'
                            : 'bg-red-50 border-red-300'
                          : 'border-slate-200 bg-white hover:border-secondary/30'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            answers[q.id] === i
                              ? i === q.correct
                                ? 'bg-green-500 border-green-500'
                                : 'bg-red-500 border-red-500'
                              : 'border-slate-300'
                          }`}>
                            {answers[q.id] === i && (
                              <span className="material-symbols-outlined text-white text-sm">check</span>
                            )}
                          </div>
                          <span className={answers[q.id] === i && i !== q.correct ? 'text-red-700' : 'text-slate-800'}>
                            {opt}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {answers[q.id] !== undefined && (
                  <div className={`p-4 rounded-xl ${
                    answers[q.id] === q.correct
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className={`text-sm font-medium ${answers[q.id] === q.correct ? 'text-green-700' : 'text-red-700'}`}>
                      {answers[q.id] === q.correct ? 'Correct!' : 'Incorrect.'} {q.opts[q.correct]} is the right answer.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mark as Read Button */}
      <div className="max-w-5xl mx-auto mb-16 flex justify-center">
        <button
          onClick={handleMarkRead}
          disabled={markedRead}
          className={`px-8 py-4 rounded-xl font-bold text-white flex items-center gap-3 transition-all ${
            markedRead
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-secondary hover:bg-secondary-container hover:text-[#060818]'
          }`}
        >
          <span className="material-symbols-outlined">{markedRead ? 'check' : 'bookmark'}</span>
          {markedRead ? 'Article Marked as Read' : 'Mark as Read'}
        </button>
      </div>

      {/* Navigation */}
      <div className="max-w-5xl mx-auto flex items-center justify-between pt-8 border-t border-slate-200">
        <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-secondary transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
          Previous Article
        </button>
        <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-secondary transition-colors">
          Next: Tort Law Fundamentals
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  )
}
