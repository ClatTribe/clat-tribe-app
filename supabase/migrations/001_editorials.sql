-- Daily Editorials table
CREATE TABLE IF NOT EXISTS editorials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('The Hindu', 'The Indian Express')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  word_count INTEGER DEFAULT 0,
  read_time_minutes INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint: max 2 per source per day
CREATE UNIQUE INDEX IF NOT EXISTS idx_editorials_date_source_title
  ON editorials (date, source, title);

-- Index for fast date lookups
CREATE INDEX IF NOT EXISTS idx_editorials_date ON editorials (date DESC);

-- Editorial MCQ Questions table
CREATE TABLE IF NOT EXISTS editorial_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  editorial_id UUID NOT NULL REFERENCES editorials(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL CHECK (question_number BETWEEN 1 AND 10),
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option TEXT NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint: one question per number per editorial
CREATE UNIQUE INDEX IF NOT EXISTS idx_eq_editorial_qnum
  ON editorial_questions (editorial_id, question_number);

-- Index for fast editorial lookups
CREATE INDEX IF NOT EXISTS idx_eq_editorial ON editorial_questions (editorial_id);

-- User editorial attempts (track which editorials user has attempted)
CREATE TABLE IF NOT EXISTS user_editorial_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  editorial_id UUID NOT NULL REFERENCES editorials(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 10,
  answers JSONB,
  time_taken INTEGER DEFAULT 0,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_uea_user ON user_editorial_attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_uea_editorial ON user_editorial_attempts (editorial_id);

-- Enable RLS
ALTER TABLE editorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE editorial_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_editorial_attempts ENABLE ROW LEVEL SECURITY;

-- Policies: editorials and questions are readable by all authenticated users
CREATE POLICY "Editorials are viewable by authenticated users"
  ON editorials FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Editorial questions are viewable by authenticated users"
  ON editorial_questions FOR SELECT
  TO authenticated
  USING (true);

-- User attempts: users can only see and insert their own
CREATE POLICY "Users can view their own editorial attempts"
  ON user_editorial_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own editorial attempts"
  ON user_editorial_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Service role can do everything (for edge function)
CREATE POLICY "Service role full access editorials"
  ON editorials FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access editorial_questions"
  ON editorial_questions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
