-- src/db/migrations/001_create_shopping_items.sql

-- Create shopping_items table
CREATE TABLE IF NOT EXISTS shopping_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  category VARCHAR(50),
  purchased BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_shopping_items_category ON shopping_items(category);

-- Create index on purchased for faster filtering
CREATE INDEX IF NOT EXISTS idx_shopping_items_purchased ON shopping_items(purchased);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_shopping_items_created_at ON shopping_items(created_at DESC);

-- Add constraint for category enum
ALTER TABLE shopping_items 
ADD CONSTRAINT check_category 
CHECK (category IS NULL OR category IN (
  'Fruits', 'Vegetables', 'Meat', 'Dairy', 
  'Bakery', 'Snacks', 'Beverages', 'Other'
));

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_shopping_items_updated_at 
BEFORE UPDATE ON shopping_items 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();


-- Insert some sample data (optional)
-- INSERT INTO shopping_items (name, quantity, category, purchased) VALUES
--   ('Apple', 5, 'Fruits', false),
--   ('Banana', 10, 'Fruits', false),
--   ('Carrot', 8, 'Vegetables', false),
--   ('Milk', 2, 'Dairy', false),
--   ('Bread', 1, 'Bakery', true)
-- ON CONFLICT DO NOTHING;
