-- src/db/migrations/002_add_categories_table.sql

-- Step 1: Create categories table
CREATE TABLE IF NOT EXISTS shopping_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Insert default categories
INSERT INTO shopping_categories (name, description, icon) VALUES
  ('Fruits', 'Fresh fruits and berries', '🍎'),
  ('Vegetables', 'Fresh vegetables', '🥕'),
  ('Meat', 'Meat and poultry', '🍖'),
  ('Dairy', 'Milk, cheese, and dairy products', '🥛'),
  ('Bakery', 'Bread, pastries, and baked goods', '🍞'),
  ('Snacks', 'Chips, crackers, and snacks', '🍿'),
  ('Beverages', 'Drinks and beverages', '🥤'),
  ('Other', 'Other items', '📦')
ON CONFLICT (name) DO NOTHING;

-- Step 3: Add new category_id column to shopping_items (nullable first)
ALTER TABLE shopping_items 
ADD COLUMN IF NOT EXISTS category_id UUID;

-- Step 4: Migrate existing data - map old category strings to new IDs
UPDATE shopping_items si
SET category_id = sc.id
FROM shopping_categories sc
WHERE si.category = sc.name;

-- Step 5: Set default category for items without category
UPDATE shopping_items
SET category_id = (SELECT id FROM shopping_categories WHERE name = 'Other')
WHERE category_id IS NULL;

-- Step 6: Add foreign key constraint
ALTER TABLE shopping_items
ADD CONSTRAINT fk_category
FOREIGN KEY (category_id) 
REFERENCES shopping_categories(id)
ON DELETE SET NULL;

-- Step 7: Remove old category column (optional - keep for now for safety)
-- Uncomment this line after verifying data migration is successful
-- ALTER TABLE shopping_items DROP COLUMN IF EXISTS category;

-- Step 8: Add index for faster joins
CREATE INDEX IF NOT EXISTS idx_shopping_items_category_id 
ON shopping_items(category_id);

-- Step 9: Create trigger for categories updated_at
CREATE OR REPLACE FUNCTION update_categories_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shopping_categories_updated_at 
BEFORE UPDATE ON shopping_categories 
FOR EACH ROW 
EXECUTE FUNCTION update_categories_updated_at_column();

-- Step 10: Add constraint to prevent deleting categories that are in use
-- (Optional, but good practice)
CREATE OR REPLACE FUNCTION check_category_in_use()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM shopping_items WHERE category_id = OLD.id) THEN
    RAISE EXCEPTION 'Cannot delete category that is in use';
  END IF;
  RETURN OLD;
END;
$$ language 'plpgsql';

CREATE TRIGGER prevent_delete_used_category
BEFORE DELETE ON shopping_categories
FOR EACH ROW
EXECUTE FUNCTION check_category_in_use();