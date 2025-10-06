CREATE TABLE social_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

ALTER TABLE social_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage their own likes"
ON social_likes
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to view likes"
ON social_likes
FOR SELECT
USING (auth.role() = 'authenticated');
