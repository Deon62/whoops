-- Whoops App - Database Setup Script
-- Run this in Supabase SQL Editor

-- Create the posts table
CREATE TABLE IF NOT EXISTS posts (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access" ON posts
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public insert access" ON posts
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow public update access" ON posts
    FOR UPDATE
    TO public
    USING (true);

CREATE POLICY "Allow public delete access" ON posts
    FOR DELETE
    TO public
    USING (true);

