-- ============================================================
-- ROAST & CRUST ARTISAN CAFE & RESTAURANT D1 DATABASE SCHEMA
-- Movement: [O] High-Contrast Darkroom KDS SLA Board & Mobile Table QR
-- ============================================================

-- Cafe Floor Tables
CREATE TABLE IF NOT EXISTS cafe_tables (
  id TEXT PRIMARY KEY,                       -- e.g. 'TBL-01'
  table_number TEXT UNIQUE NOT NULL,         -- e.g. '01', '04', '12'
  table_name TEXT NOT NULL,                  -- e.g. 'Table 04 (Window Booth)'
  capacity INTEGER NOT NULL DEFAULT 4,       -- 2, 4, 6, 8
  section TEXT NOT NULL,                     -- 'Window Booths', 'Indoor Lounge', 'Garden Patio', 'Bar Counter'
  status TEXT NOT NULL DEFAULT 'VACANT',     -- 'VACANT', 'DINING', 'BILL_REQUESTED', 'RESERVED'
  active_order_id TEXT,                      -- Reference to active order
  current_total_inr REAL DEFAULT 0,          -- Running bill total
  guest_name TEXT,                           -- Active diner name if known
  server_name TEXT DEFAULT 'Rohit S.',       -- Assigned server
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food & Beverage Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,                       -- e.g. 'item_esp_01'
  name TEXT NOT NULL,                        -- e.g. 'Specialty Espresso'
  category TEXT NOT NULL,                    -- 'Espresso Bar', 'All-Day Brunch', 'Artisan Pizza', 'Bakery & Desserts'
  station TEXT NOT NULL,                     -- 'Espresso Bar', 'Hot Kitchen & Grill', 'Bakery & Pastry'
  description TEXT,
  price_inr REAL NOT NULL,                   -- Base price in INR
  is_veg INTEGER NOT NULL DEFAULT 1,         -- 1 for veg, 0 for non-veg
  available INTEGER NOT NULL DEFAULT 1,      -- 1 for in-stock, 0 for 86'd
  badge TEXT,                                -- 'Bestseller', 'Single Origin', 'Chef Signature', etc.
  prep_time_mins INTEGER DEFAULT 8,
  image_icon TEXT,                           -- Icon or image
  modifier_groups_json TEXT,                 -- JSON array of modifier group configs
  sort_order INTEGER DEFAULT 0
);

-- Dining Orders / KOT Tickets
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,                       -- e.g. 'ORD-2026-0409'
  kot_number TEXT UNIQUE NOT NULL,           -- e.g. 'KOT-409'
  table_id TEXT NOT NULL,                    -- References cafe_tables(id)
  table_number TEXT NOT NULL,                -- e.g. '04'
  token TEXT NOT NULL,                       -- Random token for diner order tracking
  status TEXT NOT NULL DEFAULT 'NEW',        -- 'NEW', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED'
  station TEXT DEFAULT 'Hot Kitchen & Grill',-- Station routing
  customer_name TEXT DEFAULT 'Table Guest',
  customer_phone TEXT,
  subtotal_inr REAL NOT NULL DEFAULT 0,
  cgst_inr REAL NOT NULL DEFAULT 0,          -- 2.5% CGST
  sgst_inr REAL NOT NULL DEFAULT 0,          -- 2.5% SGST
  total_inr REAL NOT NULL DEFAULT 0,
  payment_status TEXT DEFAULT 'UNPAID',      -- 'UNPAID', 'BILL_REQUESTED', 'PAID'
  payment_method TEXT,                       -- 'UPI', 'CASH', 'CARD'
  split_diners INTEGER DEFAULT 1,            -- For split bill calculations
  notes TEXT,                                -- Special cooking notes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  bumped_at TIMESTAMP,
  FOREIGN KEY (table_id) REFERENCES cafe_tables(id)
);

-- Individual Line Items within an Order
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL,
  menu_item_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  station TEXT NOT NULL,                     -- 'Espresso Bar', 'Hot Kitchen & Grill', 'Bakery & Pastry'
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price_inr REAL NOT NULL,
  modifiers_json TEXT,                       -- JSON string of selected modifiers
  item_total_inr REAL NOT NULL,
  status TEXT DEFAULT 'QUEUED',              -- 'QUEUED', 'COOKING', 'READY', 'SERVED'
  notes TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Fast Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_tables_status ON cafe_tables(status);
CREATE INDEX IF NOT EXISTS idx_menu_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_kot ON orders(kot_number);
CREATE INDEX IF NOT EXISTS idx_orders_table ON orders(table_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
