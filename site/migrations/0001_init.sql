CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'replied', 'won', 'archived')),
  source TEXT NOT NULL CHECK (source IN ('start', 'concierge')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  pillars TEXT NOT NULL DEFAULT '[]',
  stage TEXT,
  timeline TEXT,
  budget TEXT,
  message TEXT,
  voice_key TEXT,
  voice_mime TEXT,
  transcript TEXT,
  chat_id TEXT,
  ai_summary TEXT,
  ai_score INTEGER,
  ai_tags TEXT,
  reply_draft TEXT,
  notes TEXT,
  consent INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries (status);

CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  page TEXT,
  ip_hash TEXT,
  message_count INTEGER NOT NULL DEFAULT 0,
  enquiry_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_chats_updated ON chats (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chats_ip ON chats (ip_hash, updated_at);

CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chat_id TEXT NOT NULL REFERENCES chats (id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_chat ON chat_messages (chat_id, id);

CREATE TABLE IF NOT EXISTS content_blocks (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  updated_by TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS content_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  saved_at INTEGER NOT NULL,
  saved_by TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_content_history_key ON content_history (key, id DESC);

CREATE TABLE IF NOT EXISTS pageviews (
  day TEXT NOT NULL,
  path TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, path)
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at INTEGER NOT NULL,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  detail TEXT
);

CREATE TABLE IF NOT EXISTS login_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_hash TEXT NOT NULL,
  at INTEGER NOT NULL,
  ok INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts (ip_hash, at);
