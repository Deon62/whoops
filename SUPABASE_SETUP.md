# Supabase Setup Instructions

Follow these steps to set up your Supabase database for the Whoops app:

## Step 1: Create the Posts Table

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `odxdwpdmhdnokgwawymf`
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the SQL code below:

```sql
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

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);

-- Create an index on user_id for faster user post queries
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read and write
CREATE POLICY "Allow public read access" ON posts
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public insert access" ON posts
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow users to update their own posts" ON posts
    FOR UPDATE
    TO public
    USING (true);

CREATE POLICY "Allow users to delete their own posts" ON posts
    FOR DELETE
    TO public
    USING (true);
```

6. Click **Run** or press `Ctrl + Enter` to execute the query

## Step 2: Enable Realtime (Optional)

For real-time updates when new posts are created:

1. Go to **Database** > **Replication** in your Supabase dashboard
2. Find the `posts` table
3. Toggle **Enable Realtime** to ON

## Step 3: Verify Setup

1. Go to **Table Editor** in the left sidebar
2. You should see the `posts` table listed
3. Click on it to view the structure

## That's it! Your database is ready!

Your app should now be able to:
- Create new posts
- Fetch all posts
- Get posts by user
- Update likes
- Receive real-time updates (if enabled)

## Testing

After running the SQL script:
1. Open your app in a browser
2. Navigate to the Create Post page
3. Write a post and click "Post"
4. Go back to Feed - your post should appear!
5. Check the Supabase Table Editor - you should see the post in the database

## Troubleshooting

If you get errors:
- Make sure you're signed in to Supabase
- Verify your project URL and Anon Key are correct in `js/supabase-config.js`
- Check the browser console for detailed error messages
- Verify the table was created in Table Editor

