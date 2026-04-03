import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.100.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Editorial {
  title: string
  summary: string
  content: string
  category: string
  wordCount: number
  readTimeMinutes: number
}

interface MCQ {
  questionNumber: number
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption: string
  explanation: string
}

interface GeminiEditorialResponse {
  editorials: {
    source: string
    editorial1: Editorial & { questions: MCQ[] }
    editorial2: Editorial & { questions: MCQ[] }
  }[]
}

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 16000,
          responseMimeType: 'application/json',
        },
      }),
    }
  )

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Gemini API error: ${response.status} - ${err}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

function getTodayDateString(): string {
  const now = new Date()
  // Use IST (UTC+5:30) since this is for Indian students
  const istOffset = 5.5 * 60 * 60 * 1000
  const istDate = new Date(now.getTime() + istOffset)
  return istDate.toISOString().split('T')[0]
}

function getFormattedDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z')
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Determine which date to generate for
    let targetDate = getTodayDateString()

    // Allow manual date override via query param or body
    try {
      const body = await req.json()
      if (body.date) targetDate = body.date
    } catch {
      // No body, use today
    }

    const url = new URL(req.url)
    const dateParam = url.searchParams.get('date')
    if (dateParam) targetDate = dateParam

    // Check if editorials already exist for this date
    const { data: existing } = await supabase
      .from('editorials')
      .select('id')
      .eq('date', targetDate)

    if (existing && existing.length >= 4) {
      return new Response(
        JSON.stringify({ message: `Editorials already exist for ${targetDate}`, count: existing.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const formattedDate = getFormattedDate(targetDate)

    const prompt = `You are an expert CLAT exam coach and editorial analyst for Indian law entrance exam preparation.

Today's date is ${formattedDate}.

Generate 4 editorial summaries and analysis pieces based on REAL, current editorial topics that would appear in The Hindu and The Indian Express on or around this date. These should cover topics relevant to CLAT preparation: Constitutional Law, International Law, Indian Polity, Economy, Environment, Social Justice, Legal Affairs, or Current Affairs.

For EACH editorial, generate:
1. A compelling title
2. A 2-line summary
3. A detailed editorial analysis (800-1200 words) written in a scholarly, accessible style suitable for CLAT aspirants. Include legal principles, case references, constitutional articles, and policy implications where relevant.
4. The category (e.g., "Constitutional Law", "International Law", "Indian Polity", "Economy", "Environment", "Social Justice")
5. Approximate word count
6. Estimated read time in minutes
7. Exactly 10 passage-based MCQ questions that test comprehension, legal reasoning, and analytical ability. Each question must have 4 options (A, B, C, D), one correct answer, and a brief explanation.

Return STRICTLY in this JSON format:
{
  "editorials": [
    {
      "source": "The Hindu",
      "editorial1": {
        "title": "...",
        "summary": "...",
        "content": "...",
        "category": "...",
        "wordCount": 1000,
        "readTimeMinutes": 10,
        "questions": [
          {
            "questionNumber": 1,
            "questionText": "...",
            "optionA": "...",
            "optionB": "...",
            "optionC": "...",
            "optionD": "...",
            "correctOption": "A",
            "explanation": "..."
          }
        ]
      },
      "editorial2": {
        "title": "...",
        "summary": "...",
        "content": "...",
        "category": "...",
        "wordCount": 1000,
        "readTimeMinutes": 10,
        "questions": [...]
      }
    },
    {
      "source": "The Indian Express",
      "editorial1": { ... same structure ... },
      "editorial2": { ... same structure ... }
    }
  ]
}

IMPORTANT RULES:
- Topics must be realistic for ${formattedDate} — use actual trending themes in Indian law, politics, economy, and international affairs
- Questions should be passage-based, testing comprehension of the editorial content
- Mix difficulty: 4 easy, 4 medium, 2 hard questions per editorial
- Include references to specific Articles, Acts, or legal principles in the content
- Ensure all 10 questions per editorial are unique and cover different aspects of the passage
- The content should read like a professional newspaper editorial, not like AI-generated text`

    console.log(`Generating editorials for ${targetDate}...`)
    const rawResponse = await callGemini(prompt, geminiApiKey)
    console.log(`Gemini response received, length: ${rawResponse.length}`)

    let parsed: GeminiEditorialResponse
    try {
      parsed = JSON.parse(rawResponse)
    } catch (parseErr) {
      console.error('Failed to parse Gemini response:', rawResponse.substring(0, 500))
      throw new Error(`Failed to parse Gemini response: ${parseErr}`)
    }

    let insertedCount = 0

    for (const sourceGroup of parsed.editorials) {
      const source = sourceGroup.source

      for (const editorialKey of ['editorial1', 'editorial2'] as const) {
        const ed = sourceGroup[editorialKey]
        if (!ed || !ed.title) continue

        // Insert editorial
        const { data: insertedEditorial, error: editError } = await supabase
          .from('editorials')
          .upsert(
            {
              date: targetDate,
              source,
              title: ed.title,
              summary: ed.summary,
              content: ed.content,
              category: ed.category,
              word_count: ed.wordCount || 1000,
              read_time_minutes: ed.readTimeMinutes || 10,
            },
            { onConflict: 'date,source,title' }
          )
          .select()
          .single()

        if (editError) {
          console.error(`Error inserting editorial: ${editError.message}`)
          continue
        }

        // Insert questions
        if (ed.questions && ed.questions.length > 0) {
          const questionsToInsert = ed.questions.map((q) => ({
            editorial_id: insertedEditorial.id,
            question_number: q.questionNumber,
            question_text: q.questionText,
            option_a: q.optionA,
            option_b: q.optionB,
            option_c: q.optionC,
            option_d: q.optionD,
            correct_option: q.correctOption,
            explanation: q.explanation,
          }))

          const { error: qError } = await supabase
            .from('editorial_questions')
            .upsert(questionsToInsert, { onConflict: 'editorial_id,question_number' })

          if (qError) {
            console.error(`Error inserting questions: ${qError.message}`)
          }
        }

        insertedCount++
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        date: targetDate,
        editorialsInserted: insertedCount,
        message: `Successfully generated ${insertedCount} editorials for ${targetDate}`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
