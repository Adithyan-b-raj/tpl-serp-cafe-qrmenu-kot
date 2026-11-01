// Cloudflare Pages Functions - Fallback & Health API
// Handles /api and /api/* fallbacks

export async function onRequest({ request }) {
  const url = new URL(request.url);

  return new Response(JSON.stringify({
    service: 'tpl-serp-cafe-qrmenu-kot',
    title: 'ROAST & CRUST Artisan Cafe & KDS Engine',
    status: 'ok',
    timestamp: new Date().toISOString(),
    path: url.pathname,
    endpoints: {
      menu: '/api/menu (GET)',
      orders: '/api/orders (GET, POST)',
      kds: '/api/kds (GET, POST)',
      tables: '/api/tables (GET, POST)'
    },
    sample_kots: [
      { id: "KOT-409", name: "Table #04 (Window Booth — 3 Guests)", phone: "919847011223", detail: "1x Truffle Wild Mushroom Pizza, 2x Nitro Cold Brew Reserve, 1x Basque Burnt Cheesecake • Note: Less Ice", status: "FIRING IN OVEN", amount: "₹1,610" },
      { id: "KOT-408", name: "Table #07 (Garden Patio — 2 Guests)", phone: "919447022334", detail: "2x Sourdough Avocado Tartine, 1x Ceremonial Matcha Latte", status: "READY TO SERVE 🔔", amount: "₹1,360" },
      { id: "KOT-407", name: "Table #02 (Bar Counter — 1 Guest)", phone: "919895033445", detail: "2x Single Origin Flat White, 1x Twice-Baked Almond Croissant • Paid via UPI QR", status: "TABLE SETTLED", amount: "₹780" }
    ]
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=15, s-maxage=30'
    }
  });
}
