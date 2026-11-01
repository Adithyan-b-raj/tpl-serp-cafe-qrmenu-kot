// Cloudflare Pages Functions - KDS (Kitchen Display System) API
// GET /api/kds?station=... (Get active KOT tickets)
// POST /api/kds (Bump ticket to next status or recall)

const INITIAL_KDS_TICKETS = [
  {
    id: 'ORD-2026-0409',
    kot_number: 'KOT-409',
    table_id: 'TBL-04',
    table_number: '04',
    table_name: 'Table 04 (Window Booth)',
    server_name: 'Rohit S.',
    status: 'NEW', // Column 1: New KOT Received
    station: 'Hot Kitchen & Grill',
    created_at: new Date(Date.now() - 3.5 * 60000).toISOString(),
    bumped_at: null,
    sla_target_mins: 15,
    notes: 'Less ice in Cold Brew. Please bring dessert after pizza.',
    items: [
      { name: 'Truffle Wild Mushroom Pizza 11"', quantity: 1, modifiers: 'Traditional Neapolitan • Truffle Oil (+₹90)', station: 'Hot Kitchen & Grill' },
      { name: 'Nitro Cold Brew Reserve', quantity: 2, modifiers: 'Original Straight Black', station: 'Espresso Bar' },
      { name: 'Basque Burnt Cheesecake Slice', quantity: 1, modifiers: 'Salted Dulce de Leche (+₹40)', station: 'Bakery & Pastry' }
    ]
  },
  {
    id: 'ORD-2026-0410',
    kot_number: 'KOT-410',
    table_id: 'TBL-09',
    table_number: '09',
    table_name: 'Table 09 (Indoor Lounge)',
    server_name: 'Rohit S.',
    status: 'PREPARING', // Column 2: In Preparation
    station: 'Hot Kitchen & Grill',
    created_at: new Date(Date.now() - 9.2 * 60000).toISOString(),
    bumped_at: new Date(Date.now() - 5 * 60000).toISOString(),
    sla_target_mins: 12,
    notes: 'Extra maple syrup for French Toast.',
    items: [
      { name: 'Brioche French Toast w/ Maple & Berries', quantity: 1, modifiers: 'Fresh Organic Berries (+₹70) • Whipped Cream (+₹50)', station: 'Hot Kitchen & Grill' },
      { name: 'Spanish Cortado', quantity: 2, modifiers: 'Oat Milk (+₹40) • 50% Sugar', station: 'Espresso Bar' }
    ]
  },
  {
    id: 'ORD-2026-0408',
    kot_number: 'KOT-408',
    table_id: 'TBL-07',
    table_number: '07',
    table_name: 'Table 07 (Garden Patio)',
    server_name: 'Priya M.',
    status: 'READY', // Column 3: Ready to Serve / Pass
    station: 'Hot Kitchen & Grill',
    created_at: new Date(Date.now() - 17.5 * 60000).toISOString(),
    bumped_at: new Date(Date.now() - 2 * 60000).toISOString(),
    sla_target_mins: 14,
    notes: 'Patio table. Ready for server pickup.',
    items: [
      { name: 'Sourdough Avocado Tartine', quantity: 2, modifiers: 'Poached Farmhouse Egg (+₹45)', station: 'Hot Kitchen & Grill' },
      { name: 'Ceremonial Matcha Latte', quantity: 1, modifiers: 'Oat Milk • Honey (+₹30)', station: 'Espresso Bar' }
    ]
  },
  {
    id: 'ORD-2026-0407',
    kot_number: 'KOT-407',
    table_id: 'TBL-02',
    table_number: '02',
    table_name: 'Table 02 (Bar Counter)',
    server_name: 'Aravind K.',
    status: 'COMPLETED', // Column 4: Completed / Archived
    station: 'Espresso Bar',
    created_at: new Date(Date.now() - 32 * 60000).toISOString(),
    bumped_at: new Date(Date.now() - 8 * 60000).toISOString(),
    sla_target_mins: 10,
    notes: 'Order served at bar counter.',
    items: [
      { name: 'Single Origin Flat White', quantity: 2, modifiers: 'Whole Milk', station: 'Espresso Bar' },
      { name: 'Twice-Baked Almond Croissant', quantity: 1, modifiers: 'Warm & Crisp', station: 'Bakery & Pastry' }
    ]
  }
];

// In-memory KDS ticket state
let kdsState = [...INITIAL_KDS_TICKETS];

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const station = url.searchParams.get('station'); // 'Espresso Bar', 'Hot Kitchen & Grill', 'Bakery & Pastry', or null/'all'

  try {
    let tickets = [];

    if (env && env.DB) {
      try {
        let query = `
          SELECT o.*, t.table_name, t.server_name
          FROM orders o
          LEFT JOIN cafe_tables t ON o.table_id = t.id
          ORDER BY o.created_at ASC
        `;
        const res = await env.DB.prepare(query).all();
        if (res.results && res.results.length > 0) {
          for (const ord of res.results) {
            const itemsRes = await env.DB.prepare("SELECT * FROM order_items WHERE order_id = ?").bind(ord.id).all();
            ord.items = (itemsRes.results || []).map(it => ({
              name: it.name,
              quantity: it.quantity,
              modifiers: it.modifiers_json || '',
              station: it.station
            }));
            ord.sla_target_mins = 15;
            tickets.push(ord);
          }
        }
      } catch (dbErr) {
        console.warn('DB KDS query fallback:', dbErr.message);
      }
    }

    if (tickets.length === 0) {
      tickets = [...kdsState];
    }

    // Filter by station if specified
    if (station && station !== 'all' && station !== 'All Stations') {
      tickets = tickets.filter(t => {
        // Match order station or if any line item belongs to station
        if (t.station === station) return true;
        if (t.items && t.items.some(i => i.station === station)) return true;
        return false;
      });
    }

    // Attach computed SLA minutes
    const now = Date.now();
    const enrichedTickets = tickets.map(t => {
      const createdTime = new Date(t.created_at).getTime();
      const elapsedSec = Math.max(0, Math.floor((now - createdTime) / 1000));
      const elapsedMins = (elapsedSec / 60).toFixed(1);
      return {
        ...t,
        elapsed_seconds: elapsedSec,
        elapsed_minutes: parseFloat(elapsedMins),
        is_breached: elapsedSec > (15 * 60)
      };
    });

    return new Response(JSON.stringify({
      ok: true,
      timestamp: new Date().toISOString(),
      active_count: enrichedTickets.filter(t => t.status !== 'COMPLETED').length,
      tickets: enrichedTickets
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const { kot_number, order_id, action = 'bump' } = body;

    if (!kot_number && !order_id) {
      return new Response(JSON.stringify({ ok: false, error: 'kot_number or order_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Find ticket in memory
    const ticket = kdsState.find(t => t.kot_number === kot_number || t.id === order_id);
    if (!ticket) {
      // Create or locate in fallback
      return new Response(JSON.stringify({ ok: false, error: 'Ticket not found in active KDS queue' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Transition state: NEW -> PREPARING -> READY -> COMPLETED
    const transitions = {
      'NEW': 'PREPARING',
      'PREPARING': 'READY',
      'READY': 'COMPLETED',
      'COMPLETED': 'COMPLETED'
    };

    if (action === 'bump') {
      ticket.status = transitions[ticket.status] || 'COMPLETED';
      ticket.bumped_at = new Date().toISOString();
    } else if (action === 'recall') {
      // Revert status for chef error recovery
      const recalls = {
        'COMPLETED': 'READY',
        'READY': 'PREPARING',
        'PREPARING': 'NEW',
        'NEW': 'NEW'
      };
      ticket.status = recalls[ticket.status] || 'NEW';
      ticket.bumped_at = new Date().toISOString();
    }

    // Sync to D1 if available
    if (env && env.DB) {
      try {
        await env.DB.prepare(
          "UPDATE orders SET status = ?, bumped_at = CURRENT_TIMESTAMP WHERE kot_number = ? OR id = ?"
        ).bind(ticket.status, kot_number || '', order_id || '').run();
      } catch (dbErr) {
        console.warn('DB update failed, kept in memory:', dbErr.message);
      }
    }

    return new Response(JSON.stringify({
      ok: true,
      action,
      kot_number: ticket.kot_number,
      new_status: ticket.status,
      bumped_at: ticket.bumped_at,
      ticket
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
