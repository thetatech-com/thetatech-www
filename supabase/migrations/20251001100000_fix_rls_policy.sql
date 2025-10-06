
-- 1. Drop the existing policy if it exists. This might fail if the policy name is different, which is okay.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Enable read access for own posts' AND polrelid = 'social_posts'::regclass) THEN
    DROP POLICY "Enable read access for own posts" ON social_posts;
  END IF;
END
$$;

-- 2. Create a new policy that allows all authenticated users to read all posts
CREATE POLICY "Enable read access for all authenticated users" ON "social_posts"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (true);
