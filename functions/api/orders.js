// Cloudflare Pages Functions - Orders API
// POST /api/orders (Create new KOT order)
// GET /api/orders?token=... or ?id=... or ?table=... (Track order status)

function getInitialOrders() {
  const now = Date.now();
  return new Map([
    [
      'ORD-2026-0409',
      {
        id: 'ORD-2026-0409',
        kot_number: 'KOT-409',
        table_id: 'TBL-04',
        table_number: '04',
        token: 'tok_409_demo',
        status: 'NEW',
        station: 'Hot Kitchen & Grill',
        customer_name: 'Aaditya & Friends',
        customer_phone: '919847011223',
        subtotal_inr: 1533.33,
        cgst_inr: 38.33,
        sgst_inr: 38.33,
        total_inr: 1610,
        payment_status: 'UNPAID',
        notes: 'Less ice in Cold Brew. Please bring dessert after pizza.',
        created_at: new Date(now - 4 * 60000).toISOString(),
        bumped_at: null,
        items: [
          {
            id: 1,
            name: 'Truffle Wild Mushroom Pizza 11"',
            quantity: 1,
            unit_price_inr: 770,
            modifiers: 'Traditional Neapolitan • Truffle Oil (+₹90)',
            item_total_inr: 770,
            station: 'Hot Kitchen & Grill'
          },
          {
            id: 2,
            name: 'Nitro Cold Brew Reserve',
            quantity: 2,
            unit_price_inr: 280,
            modifiers: 'Original Straight Black',
            item_total_inr: 560,
            station: 'Espresso Bar'
          },
          {
            id: 3,
            name: 'Basque Burnt Cheesecake Slice',
            quantity: 1,
            unit_price_inr: 380,
            modifiers: 'Salted Dulce de Leche (+₹40)',
            item_total_inr: 380,
            station: 'Bakery & Pastry'
          }
        ]
      }
    ],
    [
      'ORD-2026-0410',
      {
        id: 'ORD-2026-0410',
        kot_number: 'KOT-410',
        table_id: 'TBL-09',
        table_number: '09',
        token: 'tok_410_demo',
        status: 'PREPARING',
        station: 'Hot Kitchen & Grill',
        customer_name: 'Vikram Roy',
        customer_phone: '919895044556',
        subtotal_inr: 1066.66,
        cgst_inr: 26.67,
        sgst_inr: 26.67,
        total_inr: 1120,
        payment_status: 'UNPAID',
        notes: 'Extra maple syrup for French Toast.',
        created_at: new Date(now - 9 * 60000).toISOString(),
        bumped_at: new Date(now - 4 * 60000).toISOString(),
        items: [
          {
            id: 4,
            name: 'Brioche French Toast w/ Maple & Berries',
            quantity: 1,
            unit_price_inr: 580,
            modifiers: 'Fresh Organic Berries (+₹70) • Whipped Cream (+₹50)',
            item_total_inr: 580,
            station: 'Hot Kitchen & Grill'
          },
          {
            id: 5,
            name: 'Spanish Cortado',
            quantity: 2,
            unit_price_inr: 270,
            modifiers: 'Oat Milk (+₹40) • 50% Sugar',
            item_total_inr: 540,
            station: 'Espresso Bar'
          }
        ]
      }
    ],
    [
      'ORD-2026-0408',
      {
        id: 'ORD-2026-0408',
        kot_number: 'KOT-408',
        table_id: 'TBL-07',
        table_number: '07',
        token: 'tok_408_demo',
        status: 'READY',
        station: 'Hot Kitchen & Grill',
        customer_name: 'Dr. Meera Nambiar',
        customer_phone: '919447022334',
        subtotal_inr: 1295.24,
        cgst_inr: 32.38,
        sgst_inr: 32.38,
        total_inr: 1360,
        payment_status: 'UNPAID',
        notes: 'Table on Patio. Ready for waiter pickup.',
        created_at: new Date(now - 12 * 60000).toISOString(),
        bumped_at: new Date(now - 2 * 60000).toISOString(),
        items: [
          {
            id: 6,
            name: 'Sourdough Avocado Tartine',
            quantity: 2,
            unit_price_inr: 465,
            modifiers: 'Poached Farmhouse Egg (+₹45)',
            item_total_inr: 930,
            station: 'Hot Kitchen & Grill'
          },
          {
            id: 7,
            name: 'Ceremonial Matcha Latte',
            quantity: 1,
            unit_price_inr: 320,
            modifiers: 'Oat Milk • Honey (+₹30)',
            item_total_inr: 320,
            station: 'Espresso Bar'
          }
        ]
      }
    ],
    [
      'ORD-2026-0407',
      {
        id: 'ORD-2026-0407',
        kot_number: 'KOT-407',
        table_id: 'TBL-02',
        table_number: '02',
        token: 'tok_407_demo',
        status: 'COMPLETED',
        station: 'Espresso Bar',
        customer_name: 'Karan Singhania',
        customer_phone: '919895033445',
        subtotal_inr: 742.86,
        cgst_inr: 18.57,
        sgst_inr: 18.57,
        total_inr: 780,
        payment_status: 'BILL_REQUESTED',
        notes: 'Quick counter lunch. Bill requested.',
        created_at: new Date(now - 25 * 60000).toISOString(),
        bumped_at: new Date(now - 10 * 60000).toISOString(),
        items: [
          {
            id: 8,
            name: 'Single Origin Flat White',
            quantity: 2,
            unit_price_inr: 280,
            modifiers: 'Whole Milk',
            item_total_inr: 560,
            station: 'Espresso Bar'
          },
          {
            id: 9,
            name: 'Twice-Baked Almond Croissant',
            quantity: 1,
            unit_price_inr: 220,
            modifiers: 'Warm & Crisp',
            item_total_inr: 220,
            station: 'Bakery & Pastry'
          }
        ]
      }
    ]
  ]);
}

let memoryOrders = null;

function getOrdersStore() {
  if (!memoryOrders) {
    memoryOrders = getInitialOrders();
  }
  const now = Date.now();
  for (const ord of memoryOrders.values()) {
    const createdMs = new Date(ord.created_at).getTime();
    if (isNaN(createdMs) || createdMs < 1672531199000 || createdMs > now) {
      ord.created_at = new Date(now - 4 * 60000).toISOString();
    }
  }
  return memoryOrders;
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const id = url.searchParams.get('id');
  const table = url.searchParams.get('table');
  const kot = url.searchParams.get('kot');

  try {
    // If D1 is connected, attempt DB lookup
    if (env && env.DB) {
      try {
        let query = "SELECT * FROM orders WHERE 1=1";
        const params = [];
        if (token) {
          query += " AND token = ?";
          params.push(token);
        } else if (id) {
          query += " AND id = ?";
          params.push(id);
        } else if (kot) {
          query += " AND kot_number = ?";
          params.push(kot);
        } else if (table) {
          query += " AND table_number = ? ORDER BY created_at DESC LIMIT 1";
          params.push(table.padStart(2, '0'));
        } else {
          query += " ORDER BY created_at DESC LIMIT 10";
        }

        const res = await env.DB.prepare(query).bind(...params).all();
        if (res.results && res.results.length > 0) {
          const order = res.results[0];
          // Get items
          const itemsRes = await env.DB.prepare("SELECT * FROM order_items WHERE order_id = ?").bind(order.id).all();
          order.items = itemsRes.results || [];
          return new Response(JSON.stringify({ ok: true, order }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } catch (dbErr) {
        console.warn('DB lookup fallback:', dbErr.message);
      }
    }

    // Fallback: Check memory cache
    const store = getOrdersStore();
    for (const ord of store.values()) {
      if (
        (token && ord.token === token) ||
        (id && ord.id === id) ||
        (kot && ord.kot_number === kot) ||
        (table && ord.table_number === table.padStart(2, '0'))
      ) {
        return new Response(JSON.stringify({ ok: true, order: ord }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Default to latest table order if table requested or Table 04 demo
    const defaultOrd = store.get('ORD-2026-0409');
    return new Response(JSON.stringify({ ok: true, order: defaultOrd }), {
      headers: { 'Content-Type': 'application/json' }
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
    const tableNum = String(body.table_number || body.table || '04').padStart(2, '0');
    const tableId = `TBL-${tableNum}`;
    const rawItems = Array.isArray(body.items) ? body.items : [];

    if (rawItems.length === 0) {
      return new Response(JSON.stringify({ ok: false, error: 'Cannot submit empty order' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate KOT ID & Order ID
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const kotNumber = `KOT-${randomSuffix}`;
    const orderId = `ORD-2026-${randomSuffix}`;
    const orderToken = `tok_${randomSuffix}_${Math.random().toString(36).substring(2, 9)}`;

    // Calculate totals
    let subtotal = 0;
    const processedItems = rawItems.map((it, idx) => {
      const qty = parseInt(it.quantity) || 1;
      const unitPrice = parseFloat(it.unit_price || it.price || 0);
      const itemTotal = unitPrice * qty;
      subtotal += itemTotal;

      let modStr = '';
      if (typeof it.modifiers === 'string') {
        modStr = it.modifiers;
      } else if (typeof it.modifiers === 'object' && it.modifiers !== null) {
        modStr = Object.entries(it.modifiers)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join(' • ');
      }

      return {
        id: idx + 1,
        menu_item_id: it.item_id || `item_${idx}`,
        name: it.name || 'Gourmet Dish',
        category: it.category || 'Kitchen',
        station: it.station || 'Hot Kitchen & Grill',
        quantity: qty,
        unit_price_inr: unitPrice,
        modifiers: modStr,
        item_total_inr: itemTotal,
        status: 'QUEUED'
      };
    });

    // 5% GST (2.5% CGST + 2.5% SGST)
    const cgst = Math.round(subtotal * 0.025 * 100) / 100;
    const sgst = Math.round(subtotal * 0.025 * 100) / 100;
    const total = Math.round((subtotal + cgst + sgst));

    const newOrder = {
      id: orderId,
      kot_number: kotNumber,
      table_id: tableId,
      table_number: tableNum,
      token: orderToken,
      status: 'NEW',
      station: processedItems[0]?.station || 'Hot Kitchen & Grill',
      customer_name: body.customer_name || `Table ${tableNum} Guests`,
      customer_phone: body.customer_phone || '',
      subtotal_inr: subtotal,
      cgst_inr: cgst,
      sgst_inr: sgst,
      total_inr: total,
      payment_status: 'UNPAID',
      notes: body.notes || 'Order placed via Table QR Menu',
      created_at: new Date().toISOString(),
      bumped_at: null,
      items: processedItems
    };

    // Store in D1 if available
    if (env && env.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO orders (id, kot_number, table_id, table_number, token, status, station, customer_name, customer_phone, subtotal_inr, cgst_inr, sgst_inr, total_inr, payment_status, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          orderId, kotNumber, tableId, tableNum, orderToken, 'NEW', newOrder.station,
          newOrder.customer_name, newOrder.customer_phone, subtotal, cgst, sgst, total,
          'UNPAID', newOrder.notes
        ).run();

        // Update table
        await env.DB.prepare(
          `UPDATE cafe_tables SET status = 'DINING', active_order_id = ?, current_total_inr = ?, guest_name = ?, updated_at = CURRENT_TIMESTAMP WHERE table_number = ?`
        ).bind(orderId, total, newOrder.customer_name, tableNum).run();

        // Insert items
        for (const item of processedItems) {
          await env.DB.prepare(
            `INSERT INTO order_items (order_id, menu_item_id, name, category, station, quantity, unit_price_inr, modifiers_json, item_total_inr, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(
            orderId, item.menu_item_id, item.name, item.category, item.station,
            item.quantity, item.unit_price_inr, item.modifiers, item.item_total_inr, 'QUEUED'
          ).run();
        }
      } catch (dbErr) {
        console.warn('D1 write error, using memory store:', dbErr.message);
      }
    }

    // Always update memory store
    const store = getOrdersStore();
    store.set(orderId, newOrder);

    return new Response(JSON.stringify({
      ok: true,
      message: 'Order transmitted to Kitchen Display System (KOT Created)',
      order_id: orderId,
      kot_number: kotNumber,
      token: orderToken,
      table_number: tableNum,
      total_inr: total,
      status: 'NEW',
      order: newOrder
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
