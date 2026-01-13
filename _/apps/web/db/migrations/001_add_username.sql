-- Migration: add username column to auth_users
-- Run this against your Postgres/Neon database (e.g. using psql or the Neon dashboard)

ALTER TABLE auth_users
ADD COLUMN IF NOT EXISTS username text;

-- Add a unique index so usernames are unique (adjust null behavior per your needs)
CREATE UNIQUE INDEX IF NOT EXISTS auth_users_username_unique ON auth_users ((lower(username))) WHERE username IS NOT NULL;
