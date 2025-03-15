-- Add last_country_change column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_country_change TIMESTAMP DEFAULT CURRENT_TIMESTAMP;