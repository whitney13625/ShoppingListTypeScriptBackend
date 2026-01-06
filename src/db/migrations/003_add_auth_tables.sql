-- 1. Create Users Table (Using UUID to match your style)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Update shopping_categories
-- We add user_id to allow each user to have their own custom categories
ALTER TABLE shopping_categories ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- In the original schema, 'name' was UNIQUE. 
-- We must drop the global unique constraint and make it unique per user. (Composite Unique Constraint)
ALTER TABLE shopping_categories DROP CONSTRAINT IF EXISTS shopping_categories_name_key;
ALTER TABLE shopping_categories ADD CONSTRAINT unique_category_per_user UNIQUE (name, user_id);

-- 3. Update shopping_items
-- Link each item to a specific user
ALTER TABLE shopping_items ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Add an index on user_id for faster lookups (very common for performance)
CREATE INDEX idx_shopping_items_user_id ON shopping_items(user_id);
CREATE INDEX idx_shopping_categories_user_id ON shopping_categories(user_id);