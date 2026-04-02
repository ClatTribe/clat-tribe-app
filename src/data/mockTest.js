export const mockData = {
  passages: [
    {
      id: 1,
      category: "International Law",
      text: "The International Court of Justice (ICJ) issued a historic advisory opinion in March 2026 on Climate Change and State Obligations. The opinion reaffirms that states have a legal obligation under international law to address climate change, particularly under the UN Framework Convention on Climate Change (UNFCCC) and the Paris Agreement (2016). The ICJ emphasized that failure to mitigate greenhouse gas emissions violates the principle of permanent sovereignty and may constitute a violation of human rights obligations. The opinion also noted that developing nations are entitled to differentiated responsibilities while developed nations must lead in emissions reduction. This advisory opinion is binding on all UN member states and sets a precedent for future climate litigation at the international level.",
      qs: [
        {
          q: "According to the ICJ advisory opinion (2026), what is the primary legal obligation of states regarding climate change?",
          opts: ["Voluntary reduction of emissions", "Legal obligation to address climate change", "Optional compliance with UNFCCC", "No binding obligation"],
          c: 1,
          e: "The ICJ opinion reaffirms that states have a binding legal obligation under international law to address climate change, particularly through the UNFCCC and Paris Agreement."
        },
        {
          q: "Which international agreements did the ICJ reference in its climate opinion?",
          opts: ["Kyoto Protocol only", "UNFCCC and Paris Agreement", "Montreal Protocol only", "Geneva Conventions"],
          c: 1,
          e: "The ICJ specifically referenced the UN Framework Convention on Climate Change (UNFCCC) and the Paris Agreement (2016) as the primary legal frameworks."
        },
        {
          q: "According to the passage, what does the ICJ consider a violation of human rights?",
          opts: ["Voluntary emission reduction", "Failure to mitigate greenhouse gas emissions", "Compliance with Paris Agreement", "Participation in climate conferences"],
          c: 1,
          e: "The opinion states that failure to mitigate greenhouse gas emissions may constitute a violation of human rights obligations under international law."
        },
        {
          q: "What is the status of the ICJ advisory opinion in international law?",
          opts: ["Non-binding recommendation", "Advisory only, not binding", "Binding on all UN member states", "Applicable only to developed nations"],
          c: 2,
          e: "The passage states that the opinion 'is binding on all UN member states and sets a precedent for future climate litigation.'"
        },
        {
          q: "How does the ICJ opinion address the difference between developed and developing nations?",
          opts: ["All nations have equal obligations", "Developing nations bear full responsibility", "Developing nations entitled to differentiated responsibilities; developed nations must lead", "Developing nations are exempt"],
          c: 2,
          e: "The opinion recognizes that developing nations are entitled to differentiated responsibilities while developed nations must take the lead in emissions reduction."
        }
      ]
    },
    {
      id: 2,
      category: "Constitutional Law",
      text: "The Supreme Court of India delivered a landmark judgment on digital privacy rights in 2026, affirming that the right to informational privacy is protected under Article 21 of the Indian Constitution (Right to Life and Personal Liberty). The court recognized that in the digital age, personal data, including biometric information, financial transactions, and online communications, constitutes an extension of bodily integrity and personal autonomy. The judgment requires the government to establish safeguards for digital data collection, storage, and processing by both state and non-state actors. The court also ruled that individuals have the right to know, access, and correct their personal data held by any organization. This judgment applies the 'dignity-based approach' to privacy, similar to the landmark K.S. Puthaswamy v. Union of India (2017) decision.",
      qs: [
        {
          q: "Under which Article of the Indian Constitution is digital privacy recognized?",
          opts: ["Article 19", "Article 20", "Article 21", "Article 25"],
          c: 2,
          e: "The Supreme Court affirmed that digital privacy is protected under Article 21 (Right to Life and Personal Liberty)."
        },
        {
          q: "What types of personal data are protected under this judgment?",
          opts: ["Only financial data", "Biometric information, financial transactions, and online communications", "Only online communications", "Only biometric data"],
          c: 1,
          e: "The judgment specifically includes biometric information, financial transactions, and online communications as protected forms of personal data."
        },
        {
          q: "Who is responsible for safeguarding digital data according to the judgment?",
          opts: ["Only the government", "Only private companies", "Both state and non-state actors", "Only financial institutions"],
          c: 2,
          e: "The judgment requires safeguards by both state and non-state actors in data collection, storage, and processing."
        },
        {
          q: "What rights do individuals have regarding their personal data?",
          opts: ["No rights to personal data", "Right to access data only", "Right to know, access, and correct personal data", "Limited rights"],
          c: 2,
          e: "The court ruled that individuals have the right to know, access, and correct their personal data held by any organization."
        },
        {
          q: "Which earlier Supreme Court decision influenced the 'dignity-based approach' to privacy?",
          opts: ["Navtej Singh Johar v. Union of India", "K.S. Puthaswamy v. Union of India (2017)", "Suresh Kumar Koushal v. NAZ", "Menaka Gandhi v. Union of India"],
          c: 1,
          e: "The judgment applies the 'dignity-based approach' similar to the landmark K.S. Puthaswamy v. Union of India (2017) decision on privacy."
        }
      ]
    },
    {
      id: 3,
      category: "Corporate Law",
      text: "The Ministry of Corporate Affairs issued comprehensive guidelines on Corporate Governance in 2026, emphasizing board independence, transparency, and stakeholder accountability. Companies with market capitalization above Rs. 5000 crore must now adopt the 'comply or explain' principle under Section 134(3)(d) of the Companies Act, 2013, making board diversity (including gender diversity) and executive compensation disclosure mandatory. The guidelines further strengthen Section 135's Corporate Social Responsibility (CSR) requirements, mandating that 2% of average net profit be spent on CSR activities. Additionally, all listed companies must establish an independent audit committee, with mandatory reporting of material transactions and related-party transactions. The guidelines also introduce stringent requirements for whistle-blower protection and a mandatory internal audit function. These provisions aim to enhance corporate accountability and prevent fraudulent practices.",
      qs: [
        {
          q: "What is the threshold market capitalization for mandatory board independence requirements under the new guidelines?",
          opts: ["Rs. 1000 crore", "Rs. 2500 crore", "Rs. 5000 crore", "Rs. 10000 crore"],
          c: 2,
          e: "The guidelines apply to companies with market capitalization above Rs. 5000 crore for mandatory board independence and transparency."
        },
        {
          q: "Under Section 135 of the Companies Act, 2013, what is the CSR spending requirement?",
          opts: ["1% of average net profit", "2% of average net profit", "3% of average net profit", "5% of average net profit"],
          c: 1,
          e: "Section 135 mandates 2% of average net profit be spent on Corporate Social Responsibility activities."
        },
        {
          q: "What principle must companies follow regarding corporate governance compliance?",
          opts: ["Mandatory compliance with all rules", "Comply or explain principle", "Optional compliance", "No explanation required"],
          c: 1,
          e: "The guidelines require the 'comply or explain' principle under Section 134(3)(d), making compliance or explanation mandatory."
        },
        {
          q: "Which board committee is mandatory for all listed companies?",
          opts: ["Remuneration Committee only", "Stakeholder Committee", "Independent Audit Committee", "CSR Committee only"],
          c: 2,
          e: "All listed companies must establish an independent audit committee with mandatory reporting of material and related-party transactions."
        },
        {
          q: "What is the primary aim of the new corporate governance guidelines?",
          opts: ["Increase company profits only", "Enhance corporate accountability and prevent fraudulent practices", "Reduce CSR spending", "Eliminate board oversight"],
          c: 1,
          e: "The guidelines aim to enhance corporate accountability, prevent fraudulent practices, and strengthen stakeholder protection."
        }
      ]
    },
    {
      id: 4,
      category: "Criminal Law",
      text: "The Bharatiya Nyaya Sanhita (BNS) 2023, which came into effect on July 1, 2023, represents a comprehensive overhaul of India's criminal law system, replacing the Indian Penal Code (1860). Key changes include: (1) Redefining 'murder' under Section 103 with enhanced punishment provisions; (2) Redefining sedition under Section 152 as 'Acts Against National Integrity and Sovereignty' with stricter parameters; (3) Introduction of 'Restorative Justice' principles in Sections 193-197 for minor offenses; (4) Enhanced protections for victims under Section 3(2); and (5) Digital crimes and cyber offenses now covered under Chapters XIII-XV. The new code maintains the principle of 'mens rea' (guilty mind) for most offenses while introducing strict liability for certain regulatory violations. The Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 replaced the Code of Criminal Procedure with modern procedural safeguards.",
      qs: [
        {
          q: "When did the Bharatiya Nyaya Sanhita (BNS) 2023 come into effect?",
          opts: ["January 1, 2023", "April 1, 2023", "July 1, 2023", "October 1, 2023"],
          c: 2,
          e: "The BNS 2023 became effective on July 1, 2023, replacing the Indian Penal Code, 1860."
        },
        {
          q: "Under Section 152 of BNS 2023, sedition is now defined as:",
          opts: ["Mere criticism of government", "Acts Against National Integrity and Sovereignty", "Freedom of speech", "Political dissent"],
          c: 1,
          e: "Section 152 redefines sedition as 'Acts Against National Integrity and Sovereignty' with stricter parameters than the old law."
        },
        {
          q: "What new justice approach is introduced in Sections 193-197 of BNS 2023?",
          opts: ["Punitive justice only", "Restorative Justice for minor offenses", "Preventive detention", "Capital punishment"],
          c: 1,
          e: "The BNS introduces 'Restorative Justice' principles in Sections 193-197 for minor offenses to promote rehabilitation."
        },
        {
          q: "How are digital crimes addressed in the BNS 2023?",
          opts: ["Not covered at all", "Covered only partially", "Covered comprehensively in Chapters XIII-XV", "Separate statute required"],
          c: 2,
          e: "Digital crimes and cyber offenses are now comprehensively covered under Chapters XIII-XV of the BNS 2023."
        },
        {
          q: "What is the status of 'mens rea' (guilty mind) under BNS 2023?",
          opts: ["No longer required", "Required for all offenses", "Required for most offenses; strict liability for certain violations", "Optional"],
          c: 2,
          e: "The BNS maintains 'mens rea' for most offenses while introducing strict liability for certain regulatory violations."
        }
      ]
    },
    {
      id: 5,
      category: "Environmental Law",
      text: "The National Green Tribunal (NGT), established under the National Green Tribunal Act 2010, continued to deliver landmark environmental judgments in 2026. A significant judgment addressed air pollution in metropolitan areas, particularly Delhi, by directing the implementation of stricter vehicular emission standards (BS-VI norms) and banning diesel vehicles older than 10 years. The NGT invoked the 'Polluter Pays Principle' (Article 48-A and 51-A(g) of the Constitution) and ordered major polluting industries to relocate or install advanced pollution control equipment. The tribunal also ruled that the government must implement real-time air quality monitoring in all cities with population above 1 million. Additionally, the NGT affirmed that environmental rights are human rights, requiring proactive state intervention. These orders are enforceable under Section 15 of the NGT Act, with penalties for non-compliance up to Rs. 1 crore.",
      qs: [
        {
          q: "Under which Act was the National Green Tribunal (NGT) established?",
          opts: ["Environment Protection Act, 1986", "National Green Tribunal Act, 2010", "Air (Prevention and Control of Pollution) Act, 1981", "Water (Prevention and Control of Pollution) Act, 1974"],
          c: 1,
          e: "The NGT was established under the National Green Tribunal Act, 2010."
        },
        {
          q: "What vehicular emission standard did the NGT mandate for metropolitan areas?",
          opts: ["BS-IV norms", "BS-V norms", "BS-VI norms", "Euro 5 norms"],
          c: 2,
          e: "The NGT directed implementation of BS-VI (Bharat Stage VI) norms for stricter vehicular emission standards."
        },
        {
          q: "Which legal principle did the NGT invoke in its pollution judgment?",
          opts: ["Doctrine of Public Trust", "Right to Property", "Polluter Pays Principle", "Doctrine of Separation of Powers"],
          c: 2,
          e: "The NGT invoked the 'Polluter Pays Principle' as per Articles 48-A and 51-A(g) of the Constitution."
        },
        {
          q: "What is the penalty for non-compliance with NGT orders?",
          opts: ["Rs. 10 lakh maximum", "Rs. 25 lakh maximum", "Rs. 1 crore maximum", "No penalty provision"],
          c: 2,
          e: "NGT orders are enforceable under Section 15 of the NGT Act, with penalties for non-compliance up to Rs. 1 crore."
        },
        {
          q: "What real-time monitoring requirement did the NGT mandate?",
          opts: ["All villages must monitor air quality", "Cities with population above 1 million", "Only state capitals", "No monitoring required"],
          c: 1,
          e: "The NGT ruled that real-time air quality monitoring must be implemented in all cities with population above 1 million."
        }
      ]
    },
    {
      id: 6,
      category: "Constitutional Law",
      text: "The Indian Constitution undergoes amendments through Article 368, which provides the mechanism for constitutional modification. An amendment requires a special majority in Parliament: at least 2/3 of the members present and voting in each house. Certain constitutional provisions, known as 'basic features,' cannot be amended even with the highest parliamentary majority. This concept emerged from the landmark Kesavananda Bharati v. State of Kerala (1973) judgment, which established the 'Basic Structure Doctrine.' Amendments affecting federalism, secularism, democracy, and the separation of powers fall under this protection. In 2024-2026, various amendment proposals focused on electoral reforms, judicial independence, and environmental protection. The 'basic structure' doctrine ensures that no government can fundamentally alter the Constitution's essential character, protecting constitutional stability while allowing necessary reforms through other legislative mechanisms.",
      qs: [
        {
          q: "How many votes are required in Parliament to amend the Indian Constitution?",
          opts: ["Simple majority", "2/3 majority of all members", "2/3 of members present and voting in each house", "Unanimous consent"],
          c: 2,
          e: "Article 368 requires a special majority of at least 2/3 of members present and voting in each house for amendments."
        },
        {
          q: "Which landmark case established the 'Basic Structure Doctrine'?",
          opts: ["Minerva Mills v. Union of India", "Kesavananda Bharati v. State of Kerala", "Golaknath v. State of Punjab", "A.K. Gopalan v. State of Madras"],
          c: 1,
          e: "Kesavananda Bharati v. State of Kerala (1973) established the 'Basic Structure Doctrine.'"
        },
        {
          q: "What are 'basic features' of the Constitution that cannot be amended?",
          opts: ["Articles that can be easily amended", "Fundamental provisions like federalism, secularism, and democracy", "Preamble only", "Directive Principles only"],
          c: 1,
          e: "Basic features include federalism, secularism, democracy, and separation of powers, which are protected from amendment even with highest parliamentary majority."
        },
        {
          q: "Which Article provides the mechanism for amending the Indian Constitution?",
          opts: ["Article 360", "Article 368", "Article 375", "Article 395"],
          c: 1,
          e: "Article 368 provides the power and procedure for amending the Indian Constitution."
        },
        {
          q: "What is the purpose of the 'basic structure' doctrine?",
          opts: ["To prevent all amendments", "To allow only government-favored amendments", "To ensure constitutional stability while allowing necessary reforms", "To strengthen parliamentary power"],
          c: 2,
          e: "The doctrine protects constitutional stability by preventing fundamental alterations while allowing legislative reforms through other mechanisms."
        }
      ]
    },
    {
      id: 7,
      category: "International Trade Law",
      text: "The World Trade Organization (WTO) continues to govern international trade under the principle of Most Favored Nation (MFN) treatment, established in 1995. India, as a member since 1995, participates actively in the WTO dispute resolution mechanism. In 2026, India's ongoing cases include disputes over agricultural subsidies, tariff barriers on technology exports, and intellectual property enforcement. The WTO Appellate Body, reconstituted in 2024 after a period of dysfunction, has resumed reviewing disputes. India also benefits from the Regional Comprehensive Economic Partnership (RCEP), which entered into force on January 1, 2022. RCEP reduces tariffs on 90% of goods traded among 10 ASEAN nations and five partners (China, Japan, South Korea, Australia, New Zealand), with India joining in 2022. The agreement emphasizes rules of origin to prevent transhipment and contains chapters on services, investment, intellectual property, and labor standards.",
      qs: [
        {
          q: "Under which principle does the WTO operate?",
          opts: ["Most Favored Nation (MFN) treatment", "Reciprocal preference", "Bilateral trade only", "Unilateral tariffs"],
          c: 0,
          e: "The WTO operates under the principle of Most Favored Nation (MFN) treatment, established in 1995."
        },
        {
          q: "When did the Regional Comprehensive Economic Partnership (RCEP) come into force?",
          opts: ["January 1, 2020", "January 1, 2021", "January 1, 2022", "January 1, 2023"],
          c: 2,
          e: "RCEP entered into force on January 1, 2022, and India joined the same year."
        },
        {
          q: "How many goods are covered under tariff reduction in RCEP?",
          opts: ["50% of goods", "75% of goods", "90% of goods", "100% of goods"],
          c: 2,
          e: "RCEP reduces tariffs on 90% of goods traded among participating nations."
        },
        {
          q: "How many countries are original members of RCEP?",
          opts: ["10 countries", "15 countries", "16 countries (10 ASEAN + 5 partners, later including India)", "20 countries"],
          c: 2,
          e: "RCEP comprises 10 ASEAN nations and 5 partners (China, Japan, South Korea, Australia, New Zealand), with India joining later."
        },
        {
          q: "What is the status of the WTO Appellate Body in 2026?",
          opts: ["Still dysfunctional", "Completely abolished", "Reconstituted in 2024 and reviewing disputes", "Replaced by another body"],
          c: 2,
          e: "The WTO Appellate Body was reconstituted in 2024 after a period of dysfunction and has resumed reviewing disputes."
        }
      ]
    },
    {
      id: 8,
      category: "Banking Regulation",
      text: "The Reserve Bank of India (RBI) maintains monetary policy objectives and regulatory authority over banking institutions under the RBI Act, 1934. The RBI's primary functions include regulating money supply, managing inflation, and maintaining financial stability. In 2026, the RBI inflation target remains at 4% with a tolerance band of +/- 2% (i.e., 2-6%). The RBI's Monetary Policy Committee (MPC), constituted under the RBI Act, 2016, comprises six members with voting power, including the RBI Governor. Recent regulatory focus includes Digital Banking Security, Cyber Risk Management (now mandatory for all banks), and Non-Performing Assets (NPAs) classification and provision norms. The RBI also supervises banking regulation through Section 35 of the Banking Regulation Act, 1949, and has introduced the Prompt Corrective Action (PCA) framework for banks showing signs of deterioration. Bank deposits up to Rs. 5 lakh are protected under the Deposit Insurance and Credit Guarantee Corporation (DICGC).",
      qs: [
        {
          q: "What is the RBI's inflation target for 2026?",
          opts: ["3% +/- 1%", "4% +/- 2%", "5% +/- 1.5%", "6% +/- 2%"],
          c: 1,
          e: "The RBI maintains an inflation target of 4% with a tolerance band of +/- 2% (i.e., 2-6%)."
        },
        {
          q: "Under which Act is the RBI's Monetary Policy Committee constituted?",
          opts: ["RBI Act, 1934", "RBI Act, 2016", "Banking Regulation Act, 1949", "FEMA Act, 1999"],
          c: 1,
          e: "The Monetary Policy Committee (MPC) is constituted under the RBI Act, 2016."
        },
        {
          q: "How many voting members does the RBI's MPC have?",
          opts: ["3 members", "5 members", "6 members", "8 members"],
          c: 2,
          e: "The MPC comprises 6 members with voting power, including the RBI Governor."
        },
        {
          q: "What is the maximum deposit amount protected under DICGC?",
          opts: ["Rs. 1 lakh", "Rs. 2 lakh", "Rs. 5 lakh", "Rs. 10 lakh"],
          c: 2,
          e: "Bank deposits up to Rs. 5 lakh are protected under the Deposit Insurance and Credit Guarantee Corporation (DICGC)."
        },
        {
          q: "What framework has the RBI introduced for banks showing deterioration?",
          opts: ["Core Banking System", "Prompt Corrective Action (PCA)", "Credit Guarantee Scheme", "Priority Sector Lending"],
          c: 1,
          e: "The RBI has introduced the Prompt Corrective Action (PCA) framework for banks showing signs of financial deterioration."
        }
      ]
    },
    {
      id: 9,
      category: "Human Rights Law",
      text: "Human rights protection at the international level is facilitated by the UN Human Rights Council (UNHRC), established in 2006 as a subsidiary organ of the UN General Assembly. The UNHRC comprises 47 member states elected for three-year terms and conducts periodic reviews of all UN member states' human rights records. India has participated in the Universal Periodic Review (UPR) process multiple times, addressing concerns regarding labor rights, freedom of expression, minority protection, and implementation of human rights commitments. The UN Convention on the Rights of Persons with Disabilities (CRPD), to which India is a signatory, has influenced domestic legislation like the Rights of Persons with Disabilities Act, 2016. The UNHRC also monitors implementation of international human rights treaties, including the International Covenant on Civil and Political Rights (ICCPR) and the International Covenant on Economic, Social and Cultural Rights (ICESCR). Special Rapporteurs appointed by the UNHRC investigate violations and make country visits for fact-finding missions.",
      qs: [
        {
          q: "When was the UN Human Rights Council (UNHRC) established?",
          opts: ["2000", "2006", "2010", "2015"],
          c: 1,
          e: "The UNHRC was established in 2006 as a subsidiary organ of the UN General Assembly."
        },
        {
          q: "How many member states comprise the UNHRC?",
          opts: ["30 members", "40 members", "47 members", "50 members"],
          c: 2,
          e: "The UNHRC comprises 47 member states elected for three-year terms."
        },
        {
          q: "What is the process called through which the UNHRC reviews all UN member states?",
          opts: ["Annual Review", "Periodic Review", "Universal Periodic Review (UPR)", "Biennial Assessment"],
          c: 2,
          e: "The Universal Periodic Review (UPR) process is conducted to assess all UN member states' human rights records."
        },
        {
          q: "Which Indian law was influenced by the UN Convention on the Rights of Persons with Disabilities?",
          opts: ["Persons with Disabilities Act, 1995", "Rights of Persons with Disabilities Act, 2016", "Disability Rights Protection Act, 2010", "Social Protection for Disabled Act, 2008"],
          c: 1,
          e: "India's Rights of Persons with Disabilities Act, 2016 was influenced by the UN Convention on the Rights of Persons with Disabilities (CRPD)."
        },
        {
          q: "Which role does the UNHRC assign to investigate human rights violations?",
          opts: ["Country Monitors", "Compliance Officers", "Special Rapporteurs", "Human Rights Advocates"],
          c: 2,
          e: "Special Rapporteurs appointed by the UNHRC investigate violations and make country visits for fact-finding missions."
        }
      ]
    },
    {
      id: 10,
      category: "Electoral Law",
      text: "Electoral reforms in India are governed by the Representation of the People Act, 1951 and the Representation of the People Act, 1950. The Election Commission of India (ECI), established in 1950, is an autonomous constitutional body responsible for conducting fair and free elections. Recent electoral reforms (2024-2026) include increased use of technology for voter registration and verification, mandatory live-streaming of ballot counting, and stringent rules on campaign financing. The Model Code of Conduct, enforced during elections, restricts campaigning, prevents misuse of government resources, and ensures level playing field for all candidates. In 2026, a major reform focused on strengthening electoral bonds transparency and reducing anonymous political donations. The ECI has also mandated accessibility improvements for disabled voters, including provisions for home voting for persons with disabilities. Electoral disputes are resolved by the Election Commission and the Supreme Court under Articles 329 and 329-A of the Constitution.",
      qs: [
        {
          q: "When was the Election Commission of India (ECI) established?",
          opts: ["1950", "1951", "1952", "1960"],
          c: 0,
          e: "The Election Commission of India was established in 1950 as an autonomous constitutional body."
        },
        {
          q: "Which Act governs the conduct of elections in India?",
          opts: ["Representation of the People Act, 1950 only", "Representation of the People Act, 1951 only", "Both Representation of the People Acts of 1950 and 1951", "Election Law Unified Code"],
          c: 2,
          e: "Electoral reforms are governed by both the Representation of the People Act, 1950 and the Representation of the People Act, 1951."
        },
        {
          q: "What is the Model Code of Conduct in Indian elections?",
          opts: ["Guidelines for voter education", "Rules restricting campaigning and preventing misuse of resources", "Election expenditure limit only", "Candidate eligibility criteria"],
          c: 1,
          e: "The Model Code of Conduct restricts campaigning, prevents misuse of government resources, and ensures a level playing field for all candidates."
        },
        {
          q: "What major electoral reform was undertaken in 2026?",
          opts: ["Reducing voting age", "Strengthening electoral bonds transparency", "Eliminating paper voting", "Cancelling electoral debates"],
          c: 1,
          e: "A major reform in 2026 focused on strengthening electoral bonds transparency and reducing anonymous political donations."
        },
        {
          q: "Which constitutional articles govern resolution of electoral disputes?",
          opts: ["Articles 319 and 320", "Articles 329 and 329-A", "Articles 340 and 341", "Articles 350 and 351"],
          c: 1,
          e: "Electoral disputes are resolved by the Election Commission and the Supreme Court under Articles 329 and 329-A of the Constitution."
        }
      ]
    }
  ]
};
