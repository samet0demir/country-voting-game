-- Add nickname column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname VARCHAR(50);

-- Update existing users to have nickname based on email
UPDATE users 
SET nickname = SUBSTRING(email FROM 1 FOR POSITION('@' IN email) - 1)
WHERE nickname IS NULL;