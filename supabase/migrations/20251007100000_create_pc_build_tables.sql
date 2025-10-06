CREATE TABLE pc_builds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    specs JSONB,
    in_stock BOOLEAN DEFAULT true,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pc_build_wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    build_id UUID REFERENCES pc_builds(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, build_id)
);

CREATE TABLE pc_part_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon TEXT,
    count INTEGER
);

ALTER TABLE pc_builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE pc_build_wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE pc_part_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to pc_builds"
ON pc_builds
FOR SELECT
USING (true);

CREATE POLICY "Allow users to manage their own wishlist"
ON pc_build_wishlist
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to view their own wishlist"
ON pc_build_wishlist
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow public read access to pc part categories"
ON pc_part_categories
FOR SELECT
USING (true);

INSERT INTO pc_builds (name, price, original_price, specs, category, in_stock) VALUES
('Intel Gaming PC Build', 85000, 95000, '{ "processor": "Intel i7-13700K", "graphics": "RTX 4070 Super", "memory": "32GB DDR5", "storage": "1TB NVMe SSD" }', 'Gaming', true),
('AMD Workstation Build', 75000, 85000, '{ "processor": "AMD Ryzen 9 7900X", "graphics": "RTX 4060 Ti", "memory": "32GB DDR5", "storage": "2TB NVMe SSD" }', 'Workstation', true),
('Budget Gaming Build', 45000, 50000, '{ "processor": "AMD Ryzen 5 5600X", "graphics": "RTX 3060", "memory": "16GB DDR4", "storage": "500GB NVMe SSD" }', 'Gaming', true),
('Creator Pro Build', 125000, 135000, '{ "processor": "Intel i9-13900K", "graphics": "RTX 4080", "memory": "64GB DDR5", "storage": "2TB NVMe SSD" }', 'Creator', false);

INSERT INTO pc_part_categories (name, icon, count) VALUES
('Processor', 'Cpu', 24),
('Graphics Card', 'Monitor', 18),
('Memory', 'MemoryStick', 32),
('Storage', 'HardDrive', 28),
('Cooling', 'Fan', 15),
('Power Supply', 'Zap', 12),
('Accessories', 'Headphones', 45);
