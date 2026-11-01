export async function onRequest() {
  return new Response(JSON.stringify({ service: 'tpl-serp-cafe-qrmenu-kot', status: 'ok', items: [{"id":"KOT-409","name":"Table #04 (Window Booth — 3 Guests)","phone":"919847011223","detail":"1x Burrata Pizza, 2x Coorg V60 Iced, 1x Basque Cheesecake • Note: Less Ice","status":"FIRING IN OVEN","amount":"₹1,610"},{"id":"KOT-408","name":"Table #07 (Garden Patio — 2 Guests)","phone":"919447022334","detail":"2x Avocado Tartine, 2x Passionfruit Kombucha","status":"READY TO SERVE 🔔","amount":"₹1,360"},{"id":"KOT-407","name":"Table #02 (Bar Counter — 1 Guest)","phone":"919895033445","detail":"1x Pesto Tagliatelle, 1x Espresso Tonic • Paid via UPI QR","status":"TABLE SETTLED","amount":"₹780"}] }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=120' }
  });
}
