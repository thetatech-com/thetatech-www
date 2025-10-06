CREATE TABLE channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    channel_id UUID REFERENCES channels(id),
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('diary', 'moment', 'short')),
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);