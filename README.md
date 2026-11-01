# ROAST & CRUST ARTISAN CAFE & RESTAURANT (`tpl-serp-cafe-qrmenu-kot`)

> Movement O: High-Contrast Darkroom KDS SLA Board & Mobile Table QR Menu + Cashier POS.  
> Cloudflare Pages Serverless Edge Stack with D1 Relational SQLite Schema.

---

## 🍽️ Vertical Overview

**ROAST & CRUST ARTISAN CAFE** is a specialized cafe & casual dining management system designed for high-turnover artisan eateries, wood-fired hearths, and specialty roasteries.

### Customer Journey (`/index.html?table=04`)
- **Table-Scoped QR Menu**: Instant auto-binding to dining table (e.g. `?table=04` locks Table 04 with table badge & server assignment). Table switcher modal included.
- **Interactive Specialty Menu**: Categorized tabs for *Espresso Bar*, *All-Day Brunch*, *Artisan Pizza*, and *Bakery & Desserts* with dietary indicators (`🟢 Veg` / `🔴 Non-Veg`) and live search.
- **Dynamic Customizer Drawer**: Real-time pricing calculation as guests toggle milk selections (Whole Milk, Oatly Oat Milk +₹40, Almond Milk +₹50), sweetness levels (0%, 50%, Condensed), and gourmet add-ons (Truffle Oil +₹90, Extra Espresso Shot +₹60, Fresh Berries +₹70).
- **Sticky Table Cart & KOT Firing**: Itemized drawer with GST breakdown (2.5% CGST + 2.5% SGST) and 1-tap "SEND KOT TO KITCHEN 🔥" transmission.
- **Live Order Cooking Tracker**: 4-stage cooking pipeline (`Received` → `In Kitchen` → `Plated & Pass` → `Served`) with real-time ticking elapsed timer and automatic status sync.
- **Request Bill & UPI Simulation**: Modal with itemized bill, dynamic UPI QR code (`roastandcrust@okhdfcbank`), and diner split-bill calculator (1 to 4 ways).

### Operator & Chef Console (`/admin.html`)
- **4-Column Live Kitchen Display System (KDS)**:
  1. `1. NEW (KOT RECEIVED)`
  2. `2. IN PREPARATION (FIRING)`
  3. `3. READY TO SERVE / PASS 🔔`
  4. `4. COMPLETED / ARCHIVED`
- **Station Filter Buttons**: Filter live tickets by `All Stations`, `☕ Espresso Bar`, `🔥 Hot Kitchen & Grill`, and `🥐 Bakery & Pastry`.
- **Dynamic SLA Timers**:
  - `Green`: `< 8 mins`
  - `Amber`: `8 - 15 mins`
  - `Red (Flashing Alert)`: `> 15 mins (SLA BREACH)`
- **1-Tap Bump Ticket & Audio Chime**: Synthesized dual-tone bell chime (Web Audio API) with instant column advancement and undo/recall capability.
- **Cashier Table Register & POS View**:
  - 12-table floor plan grid with live status indicators (`VACANT`, `DINING`, `BILL_REQUESTED`, `RESERVED`).
  - Active dining balance telemetry and elapsed dining duration.
  - **Settle & Vacate Modal**: Split bill calculator (1, 2, 3, 4, 6 diners), ESC/POS 80mm monospace thermal bill preview with GSTIN and FSSAI licensing, and tender selection (UPI, Cash, Card).

---

## 🗄️ Database & Schema (`schema.sql` & `seed.sql`)

Designed for Cloudflare D1 (SQLite) with resilient in-memory fallback for local and preview environments:
- `cafe_tables`: Floor tables 01-12 across 4 zones (Bar Counter, Indoor Lounge, Window Booths, Garden Patio).
- `menu_items`: 16+ gourmet cafe items with JSON-configurable modifier groups.
- `orders`: KOT tickets with live statuses, diner tokens, server assignments, and GST totals.
- `order_items`: Line items with itemized modifiers and kitchen station routing.

---

## 🌐 Cloudflare Functions API

| Route | Method | Description |
| :--- | :--- | :--- |
| `/api/menu` | `GET` | Categorized menu items with modifier groups & pricing. |
| `/api/orders` | `GET`, `POST` | Track order by token/table or submit new table KOT. |
| `/api/kds` | `GET`, `POST` | Retrieve active KOT tickets with SLA or bump ticket status. |
| `/api/tables` | `GET`, `POST` | Table statuses, floor telemetry, request bill, settle & vacate. |

---

## 🎨 White-Label Engine (`whitelabel.js`)

Instant client personalization via URL query parameters:
- `?brand=Roast+%26+Crust`
- `?tagline=Specialty+Coffee+Roasters`
- `?primary=10B981` (hex color for buttons, badges, SLA indicators)
- `?phone=919847011223` / `?wa=919847011223`
- `?table=04` (diner table binding)
- `?reset_wl=1` (restore default template)

---

## 🚀 Deployment & Local Development

```bash
# Test locally
npx wrangler pages dev public

# Deploy to Cloudflare Pages
npx wrangler pages deploy public --project-name tpl-serp-cafe-qrmenu-kot --branch main
```
