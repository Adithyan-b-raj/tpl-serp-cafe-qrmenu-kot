// Cloudflare Pages Functions - Tables API
// GET /api/tables (Get all 12 cafe table statuses)
// POST /api/tables (Actions: 'request_bill', 'settle', 'seat')

const INITIAL_TABLES = [
  { id: 'TBL-01', table_number: '01', table_name: 'Table 01 (Bar Counter)', capacity: 2, section: 'Bar Counter', status: 'VACANT', active_order_id: null, current_total_inr: 0, guest_name: null, server_name: 'Aravind K.' },
  { id: 'TBL-02', table_number: '02', table_name: 'Table 02 (Bar Counter)', capacity: 2, section: 'Bar Counter', status: 'BILL_REQUESTED', active_order_id: 'ORD-2026-0407', current_total_inr: 780, guest_name: 'Karan Singhania', server_name: 'Aravind K.' },
  { id: 'TBL-03', table_number: '03', table_name: 'Table 03 (Indoor Lounge)', capacity: 4, section: 'Indoor Lounge', status: 'VACANT', active_order_id: null, current_total_inr: 0, guest_name: null, server_name: 'Rohit S.' },
  { id: 'TBL-04', table_number: '04', table_name: 'Table 04 (Window Booth)', capacity: 4, section: 'Window Booths', status: 'DINING', active_order_id: 'ORD-2026-0409', current_total_inr: 1610, guest_name: 'Aaditya & Friends', server_name: 'Rohit S.' },
  { id: 'TBL-05', table_number: '05', table_name: 'Table 05 (Window Booth)', capacity: 4, section: 'Window Booths', status: 'VACANT', active_order_id: null, current_total_inr: 0, guest_name: null, server_name: 'Rohit S.' },
  { id: 'TBL-06', table_number: '06', table_name: 'Table 06 (Indoor Lounge)', capacity: 6, section: 'Indoor Lounge', status: 'VACANT', active_order_id: null, current_total_inr: 0, guest_name: null, server_name: 'Priya M.' },
  { id: 'TBL-07', table_number: '07', table_name: 'Table 07 (Garden Patio)', capacity: 4, section: 'Garden Patio', status: 'DINING', active_order_id: 'ORD-2026-0408', current_total_inr: 1360, guest_name: 'Dr. Meera Nambiar', server_name: 'Priya M.' },
  { id: 'TBL-08', table_number: '08', table_name: 'Table 08 (Garden Patio)', capacity: 2, section: 'Garden Patio', status: 'VACANT', active_order_id: null, current_total_inr: 0, guest_name: null, server_name: 'Priya M.' },
  { id: 'TBL-09', table_number: '09', table_name: 'Table 09 (Indoor Lounge)', capacity: 4, section: 'Indoor Lounge', status: 'DINING', active_order_id: 'ORD-2026-0410', current_total_inr: 1120, guest_name: 'Vikram Roy', server_name: 'Rohit S.' },
  { id: 'TBL-10', table_number: '10', table_name: 'Table 10 (Garden Patio)', capacity: 6, section: 'Garden Patio', status: 'RESERVED', active_order_id: null, current_total_inr: 0, guest_name: 'Party of 6 (08:00 PM)', server_name: 'Priya M.' },
  { id: 'TBL-11', table_number: '11', table_name: 'Table 11 (Window Booth)', capacity: 2, section: 'Window Booths', status: 'VACANT', active_order_id: null, current_total_inr: 0, guest_name: null, server_name: 'Aravind K.' },
  { id: 'TBL-12', table_number: '12', table_name: 'Table 12 (Private Mezzanine)', capacity: 8, section: 'Indoor Lounge', status: 'VACANT', active_order_id: null, current_total_inr: 0, guest_name: null, server_name: 'Aravind K.' }
];

let tablesState = [...INITIAL_TABLES];

export async function onRequestGet({ env }) {
  try {
    let tables = [];

    if (env && env.DB) {
      try {
        const res = await env.DB.prepare("SELECT * FROM cafe_tables ORDER BY table_number ASC").all();
        if (res.results && res.results.length > 0) {
          tables = res.results;
        }
      } catch (dbErr) {
        console.warn('DB tables query fallback:', dbErr.message);
      }
    }

    if (tables.length === 0) {
      tables = [...tablesState];
    }

    const summary = {
      total: tables.length,
      vacant: tables.filter(t => t.status === 'VACANT').length,
      dining: tables.filter(t => t.status === 'DINING').length,
      bill_requested: tables.filter(t => t.status === 'BILL_REQUESTED').length,
      reserved: tables.filter(t => t.status === 'RESERVED').length,
      active_revenue: tables.reduce((acc, t) => acc + (t.current_total_inr || 0), 0)
    };

    return new Response(JSON.stringify({
      ok: true,
      summary,
      tables
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
    const { action, table_number, table_id, payment_mode = 'UPI', guest_name } = body;
    const tNum = String(table_number || '').padStart(2, '0');

    let table = tablesState.find(t => t.table_number === tNum || t.id === table_id);
    if (!table) {
      return new Response(JSON.stringify({ ok: false, error: 'Table not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'request_bill') {
      table.status = 'BILL_REQUESTED';
      if (env && env.DB) {
        try {
          await env.DB.prepare(
            "UPDATE cafe_tables SET status = 'BILL_REQUESTED', updated_at = CURRENT_TIMESTAMP WHERE table_number = ?"
          ).bind(tNum).run();
        } catch (e) {}
      }
      return new Response(JSON.stringify({
        ok: true,
        message: `Bill requested for Table ${tNum}. Cashier has been alerted.`,
        table
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'settle') {
      const settledAmount = table.current_total_inr;
      const prevOrderId = table.active_order_id;

      table.status = 'VACANT';
      table.current_total_inr = 0;
      table.active_order_id = null;
      table.guest_name = null;

      if (env && env.DB) {
        try {
          await env.DB.prepare(
            `UPDATE cafe_tables SET status = 'VACANT', current_total_inr = 0, active_order_id = NULL, guest_name = NULL, updated_at = CURRENT_TIMESTAMP WHERE table_number = ?`
          ).bind(tNum).run();

          if (prevOrderId) {
            await env.DB.prepare(
              `UPDATE orders SET payment_status = 'PAID', payment_method = ?, status = 'COMPLETED' WHERE id = ?`
            ).bind(payment_mode, prevOrderId).run();
          }
        } catch (e) {}
      }

      return new Response(JSON.stringify({
        ok: true,
        message: `Table ${tNum} settled via ${payment_mode} and marked VACANT.`,
        settled_amount: settledAmount,
        table
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'seat') {
      table.status = 'DINING';
      table.guest_name = guest_name || 'Walk-in Guests';

      if (env && env.DB) {
        try {
          await env.DB.prepare(
            `UPDATE cafe_tables SET status = 'DINING', guest_name = ?, updated_at = CURRENT_TIMESTAMP WHERE table_number = ?`
          ).bind(table.guest_name, tNum).run();
        } catch (e) {}
      }

      return new Response(JSON.stringify({
        ok: true,
        message: `Table ${tNum} seated successfully.`,
        table
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ ok: false, error: 'Unknown action specified' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
