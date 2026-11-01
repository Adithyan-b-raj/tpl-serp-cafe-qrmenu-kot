// Cloudflare Pages Functions - Menu API
// GET /api/menu

const MOCK_MENU = [
  {
    id: 'item_esp_01',
    name: 'Specialty Double Espresso',
    category: 'Espresso Bar',
    station: 'Espresso Bar',
    description: 'Direct-trade Coorg Arabica single origin. Vibrant citrus brightness, dark cocoa finish.',
    price_inr: 180,
    is_veg: 1,
    available: 1,
    badge: 'Single Origin',
    prep_time_mins: 4,
    image_icon: '☕',
    modifiers: [
      {
        name: 'Roast Profile',
        required: true,
        options: [
          { label: 'Medium Coorg Washed', extra: 0, default: true },
          { label: 'Dark Chikmagalur Honey', extra: 0 }
        ]
      }
    ]
  },
  {
    id: 'item_esp_02',
    name: 'Spanish Cortado',
    category: 'Espresso Bar',
    station: 'Espresso Bar',
    description: '1:1 ratio of double ristretto cut with silky textured steamed milk. Rich & intense.',
    price_inr: 240,
    is_veg: 1,
    available: 1,
    badge: 'Barista Pick',
    prep_time_mins: 5,
    image_icon: '🥛',
    modifiers: [
      {
        name: 'Milk Choice',
        required: true,
        options: [
          { label: 'Whole Milk', extra: 0, default: true },
          { label: 'Oat Milk (Oatly)', extra: 40 },
          { label: 'Almond Milk', extra: 50 }
        ]
      },
      {
        name: 'Sweetness',
        required: false,
        options: [
          { label: '0% Sugar (Unsweetened)', extra: 0, default: true },
          { label: '50% Demerara Sugar', extra: 0 },
          { label: 'Condensed Milk (Classic Spanish)', extra: 20 }
        ]
      },
      {
        name: 'Add-ons',
        multiple: true,
        options: [
          { label: 'Extra Espresso Shot', extra: 60 },
          { label: 'Vanilla Bean Drop', extra: 40 }
        ]
      }
    ]
  },
  {
    id: 'item_esp_03',
    name: 'Ceremonial Matcha Latte',
    category: 'Espresso Bar',
    station: 'Espresso Bar',
    description: 'First-harvest Uji ceremonial matcha whisked with warm textured oat milk.',
    price_inr: 290,
    is_veg: 1,
    available: 1,
    badge: 'Superfood',
    prep_time_mins: 6,
    image_icon: '🍵',
    modifiers: [
      {
        name: 'Milk Choice',
        required: true,
        options: [
          { label: 'Oat Milk', extra: 0, default: true },
          { label: 'Almond Milk', extra: 20 },
          { label: 'Whole Milk', extra: 0 }
        ]
      },
      {
        name: 'Sweetness',
        required: false,
        options: [
          { label: 'Unsweetened (0%)', extra: 0, default: true },
          { label: 'Wild Forest Honey', extra: 30 },
          { label: '50% Organic Cane Sugar', extra: 0 }
        ]
      }
    ]
  },
  {
    id: 'item_esp_04',
    name: 'Nitro Cold Brew Reserve',
    category: 'Espresso Bar',
    station: 'Espresso Bar',
    description: 'Steeped for 18 hours in cold filtered mountain water, infused with food-grade nitrogen on tap.',
    price_inr: 280,
    is_veg: 1,
    available: 1,
    badge: 'Draft Pour',
    prep_time_mins: 3,
    image_icon: '🧊',
    modifiers: [
      {
        name: 'Syrup Infusion',
        multiple: false,
        options: [
          { label: 'Original Straight Black', extra: 0, default: true },
          { label: 'Vanilla Cream Cold Foam Float', extra: 50 },
          { label: 'Orange Tonic Splash', extra: 40 }
        ]
      }
    ]
  },
  {
    id: 'item_esp_05',
    name: 'Single Origin Flat White',
    category: 'Espresso Bar',
    station: 'Espresso Bar',
    description: 'Double ristretto crowned with microfoam velvet. Perfect harmony of coffee & milk.',
    price_inr: 260,
    is_veg: 1,
    available: 1,
    badge: 'Popular',
    prep_time_mins: 5,
    image_icon: '☕',
    modifiers: [
      {
        name: 'Milk Choice',
        required: true,
        options: [
          { label: 'Whole Milk', extra: 0, default: true },
          { label: 'Oat Milk', extra: 40 },
          { label: 'Almond Milk', extra: 50 }
        ]
      },
      {
        name: 'Add-ons',
        multiple: true,
        options: [
          { label: 'Extra Double Shot', extra: 60 },
          { label: 'Cinnamon Dust', extra: 0 }
        ]
      }
    ]
  },
  {
    id: 'item_esp_06',
    name: 'Iced Salted Caramel Latte',
    category: 'Espresso Bar',
    station: 'Espresso Bar',
    description: 'House-cooked Cornish sea salt caramel, double espresso over cracked ice with cold foam.',
    price_inr: 310,
    is_veg: 1,
    available: 1,
    badge: 'Signature',
    prep_time_mins: 5,
    image_icon: '🧋',
    modifiers: [
      {
        name: 'Milk Choice',
        required: true,
        options: [
          { label: 'Whole Milk', extra: 0, default: true },
          { label: 'Oat Milk', extra: 40 },
          { label: 'Almond Milk', extra: 50 }
        ]
      },
      {
        name: 'Sweetness',
        required: false,
        options: [
          { label: 'Standard Sweet', extra: 0, default: true },
          { label: '50% Half Sweet', extra: 0 }
        ]
      }
    ]
  },

  // All-Day Brunch
  {
    id: 'item_brunch_01',
    name: 'Sourdough Avocado Tartine',
    category: 'All-Day Brunch',
    station: 'Hot Kitchen & Grill',
    description: 'Crushed Hass avocado on 36hr fermented sourdough, Danish feta, chili flakes & dukkah.',
    price_inr: 420,
    is_veg: 1,
    available: 1,
    badge: 'Bestseller',
    prep_time_mins: 10,
    image_icon: '🥑',
    modifiers: [
      {
        name: 'Gourmet Add-ons',
        multiple: true,
        options: [
          { label: 'Poached Farmhouse Egg', extra: 45 },
          { label: 'Danish Feta Extra', extra: 60 },
          { label: 'Confit Cherry Tomatoes', extra: 50 }
        ]
      }
    ]
  },
  {
    id: 'item_brunch_02',
    name: 'Brioche French Toast w/ Maple & Berries',
    category: 'All-Day Brunch',
    station: 'Hot Kitchen & Grill',
    description: 'Golden-crusted brioche soaked in vanilla bean custard, pure Canadian maple syrup & fresh berries.',
    price_inr: 460,
    is_veg: 1,
    available: 1,
    badge: 'Sweet Brunch',
    prep_time_mins: 12,
    image_icon: '🍞',
    modifiers: [
      {
        name: 'Gourmet Add-ons',
        multiple: true,
        options: [
          { label: 'Fresh Organic Berries', extra: 70 },
          { label: 'Whipped Clotted Cream', extra: 50 },
          { label: 'Crispy Bacon Strips', extra: 120 }
        ]
      }
    ]
  },
  {
    id: 'item_brunch_03',
    name: 'Smoked Salmon Croissant Benedict',
    category: 'All-Day Brunch',
    station: 'Hot Kitchen & Grill',
    description: 'Norwegian smoked salmon, soft poached eggs & yuzu hollandaise on a buttery Parisian croissant.',
    price_inr: 560,
    is_veg: 0,
    available: 1,
    badge: 'Chef Signature',
    prep_time_mins: 14,
    image_icon: '🥐',
    modifiers: [
      {
        name: 'Gourmet Add-ons',
        multiple: true,
        options: [
          { label: 'Extra Smoked Salmon (40g)', extra: 160 },
          { label: 'Fresh Baby Spinach', extra: 40 }
        ]
      }
    ]
  },
  {
    id: 'item_brunch_04',
    name: 'Truffle Scrambled Eggs on Brioche',
    category: 'All-Day Brunch',
    station: 'Hot Kitchen & Grill',
    description: 'Slow-cooked creamy farmhouse eggs folded with black summer truffle paste on toasted brioche.',
    price_inr: 440,
    is_veg: 1,
    available: 1,
    badge: 'Gourmet',
    prep_time_mins: 10,
    image_icon: '🍳',
    modifiers: [
      {
        name: 'Add-ons',
        multiple: true,
        options: [
          { label: 'White Truffle Oil Drizzle', extra: 90 },
          { label: 'Sautéed Wild Mushrooms', extra: 90 }
        ]
      }
    ]
  },
  {
    id: 'item_brunch_05',
    name: 'Shakshuka w/ Toasted Sourdough',
    category: 'All-Day Brunch',
    station: 'Hot Kitchen & Grill',
    description: 'Spiced San Marzano tomato & bell pepper stew, baked eggs, crumbled feta & warm bread.',
    price_inr: 410,
    is_veg: 1,
    available: 1,
    badge: 'Skillet Classic',
    prep_time_mins: 12,
    image_icon: '🥘',
    modifiers: [
      {
        name: 'Spice Level',
        required: true,
        options: [
          { label: 'Mild Harissa', extra: 0, default: true },
          { label: 'Fiery Traditional', extra: 0 }
        ]
      },
      {
        name: 'Add-ons',
        multiple: true,
        options: [
          { label: 'Extra Sourdough Slices (2x)', extra: 60 },
          { label: 'Crumbled Goat Cheese', extra: 80 }
        ]
      }
    ]
  },

  // Artisan Pizza
  {
    id: 'item_pizza_01',
    name: 'Truffle Wild Mushroom Pizza 11"',
    category: 'Artisan Pizza',
    station: 'Hot Kitchen & Grill',
    description: 'Fior di latte, portobello & shiitake mushrooms, fresh thyme, finished with white truffle oil.',
    price_inr: 680,
    is_veg: 1,
    available: 1,
    badge: 'Wood-Fired',
    prep_time_mins: 15,
    image_icon: '🍄',
    modifiers: [
      {
        name: 'Crust Style',
        required: true,
        options: [
          { label: 'Traditional Neapolitan (Puffy Leopard)', extra: 0, default: true },
          { label: 'Thin & Crispy Roman Style', extra: 0 }
        ]
      },
      {
        name: 'Gourmet Toppings',
        multiple: true,
        options: [
          { label: 'Artisanal White Truffle Oil Drizzle', extra: 90 },
          { label: 'Fresh Burrata Ball on Top', extra: 160 },
          { label: 'Spicy Pickled Jalapeños', extra: 40 }
        ]
      }
    ]
  },
  {
    id: 'item_pizza_02',
    name: 'Burrata Margherita & Basil Genovese 11"',
    category: 'Artisan Pizza',
    station: 'Hot Kitchen & Grill',
    description: 'San Marzano D.O.P. tomatoes, fresh artisanal whole burrata, cold-pressed EVO & sweet basil.',
    price_inr: 620,
    is_veg: 1,
    available: 1,
    badge: 'Classic D.O.P.',
    prep_time_mins: 14,
    image_icon: '🍕',
    modifiers: [
      {
        name: 'Toppings',
        multiple: true,
        options: [
          { label: 'Extra Burrata Center', extra: 140 },
          { label: 'Hot Honey Drizzle', extra: 50 },
          { label: 'Kalamata Olives', extra: 60 }
        ]
      }
    ]
  },
  {
    id: 'item_pizza_03',
    name: 'Spicy Pepperoni & Hot Honey Napoli 11"',
    category: 'Artisan Pizza',
    station: 'Hot Kitchen & Grill',
    description: 'Crisp cupping pork pepperoni, mozzarella, chili flakes, drizzled with raw infused hot honey.',
    price_inr: 740,
    is_veg: 0,
    available: 1,
    badge: 'Fan Favorite',
    prep_time_mins: 14,
    image_icon: '🌶️',
    modifiers: [
      {
        name: 'Heat Level',
        required: false,
        options: [
          { label: 'Standard Hot Honey', extra: 0, default: true },
          { label: 'Double Hot Honey & Chili Flakes', extra: 30 }
        ]
      },
      {
        name: 'Add-ons',
        multiple: true,
        options: [
          { label: 'Extra Pepperoni Slices', extra: 120 },
          { label: 'Pickled Jalapenos', extra: 40 }
        ]
      }
    ]
  },
  {
    id: 'item_pizza_04',
    name: 'Roasted Garlic & Ricotta Bianca 11"',
    category: 'Artisan Pizza',
    station: 'Hot Kitchen & Grill',
    description: 'White garlic crema, fresh ricotta dollops, mozzarella, caramelized shallots & rosemary.',
    price_inr: 590,
    is_veg: 1,
    available: 1,
    badge: 'White Pie',
    prep_time_mins: 13,
    image_icon: '🧄',
    modifiers: [
      {
        name: 'Add-ons',
        multiple: true,
        options: [
          { label: 'Sun-dried Tomatoes', extra: 50 },
          { label: 'Sautéed Baby Spinach', extra: 40 }
        ]
      }
    ]
  },

  // Bakery & Desserts
  {
    id: 'item_bakery_01',
    name: 'Basque Burnt Cheesecake Slice',
    category: 'Bakery & Desserts',
    station: 'Bakery & Pastry',
    description: 'Caramelized blackened crust with an unctuous, molten cheese center. Served with house berry coulis.',
    price_inr: 340,
    is_veg: 1,
    available: 1,
    badge: 'Award-Winning',
    prep_time_mins: 3,
    image_icon: '🍰',
    modifiers: [
      {
        name: 'Topping Sauce',
        multiple: false,
        options: [
          { label: 'Warm Raspberry Coulis', extra: 0, default: true },
          { label: 'Salted Dulce de Leche', extra: 40 },
          { label: 'Pure Honeycomb Crumble', extra: 50 }
        ]
      }
    ]
  },
  {
    id: 'item_bakery_02',
    name: 'Warm Dark Chocolate Fondant',
    category: 'Bakery & Desserts',
    station: 'Bakery & Pastry',
    description: '70% Valrhona dark chocolate cake with a molten liquid center. Madagascar vanilla bean gelato.',
    price_inr: 360,
    is_veg: 1,
    available: 1,
    badge: 'Dessert Indulgence',
    prep_time_mins: 8,
    image_icon: '🍫',
    modifiers: [
      {
        name: 'Gelato Pairing',
        required: false,
        options: [
          { label: 'Madagascar Vanilla Bean (Included)', extra: 0, default: true },
          { label: 'Espresso Stracciatella', extra: 40 },
          { label: 'Extra Gelato Scoop', extra: 80 }
        ]
      }
    ]
  },
  {
    id: 'item_bakery_03',
    name: 'Twice-Baked Almond Croissant',
    category: 'Bakery & Desserts',
    station: 'Bakery & Pastry',
    description: 'Buttery laminate pastry filled with almond frangipane, topped with toasted sliced almonds.',
    price_inr: 220,
    is_veg: 1,
    available: 1,
    badge: 'Bakery Fresh',
    prep_time_mins: 2,
    image_icon: '🥐',
    modifiers: [
      {
        name: 'Warm Up Option',
        required: false,
        options: [
          { label: 'Warm & Crisp (Recommended)', extra: 0, default: true },
          { label: 'Room Temperature', extra: 0 }
        ]
      }
    ]
  },
  {
    id: 'item_bakery_04',
    name: 'Pistachio & Ricotta Cannoli Duo',
    category: 'Bakery & Desserts',
    station: 'Bakery & Pastry',
    description: 'Two crisp Sicilian pastry shells piped fresh with sweet sheep ricotta & Bronte pistachios.',
    price_inr: 280,
    is_veg: 1,
    available: 1,
    badge: 'Handmade',
    prep_time_mins: 3,
    image_icon: '🥖',
    modifiers: [
      {
        name: 'Dips & Dusting',
        multiple: false,
        options: [
          { label: 'Crushed Pistachio Dust', extra: 0, default: true },
          { label: 'Dark Chocolate Curls', extra: 0 }
        ]
      }
    ]
  }
];

export async function onRequestGet({ env }) {
  try {
    if (env && env.DB) {
      try {
        const res = await env.DB.prepare("SELECT * FROM menu_items WHERE available = 1 ORDER BY sort_order ASC").all();
        if (res.results && res.results.length > 0) {
          const items = res.results.map(row => {
            let modifiers = [];
            try {
              if (row.modifier_groups_json) {
                modifiers = JSON.parse(row.modifier_groups_json);
              }
            } catch (e) {}
            return {
              id: row.id,
              name: row.name,
              category: row.category,
              station: row.station,
              description: row.description,
              price_inr: row.price_inr,
              is_veg: row.is_veg === 1,
              available: row.available === 1,
              badge: row.badge,
              prep_time_mins: row.prep_time_mins,
              image_icon: row.image_icon,
              modifiers: modifiers
            };
          });

          const categories = ['Espresso Bar', 'All-Day Brunch', 'Artisan Pizza', 'Bakery & Desserts'];
          return new Response(JSON.stringify({ ok: true, categories, items }), {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'public, max-age=10, s-maxage=30'
            }
          });
        }
      } catch (dbErr) {
        console.warn('D1 query fallback to mock data:', dbErr.message);
      }
    }

    const categories = ['Espresso Bar', 'All-Day Brunch', 'Artisan Pizza', 'Bakery & Desserts'];
    return new Response(JSON.stringify({ ok: true, categories, items: MOCK_MENU }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=10, s-maxage=30'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
