/**
 * WholesaleLink Seed Script
 * Tailored for Food Vendors sourcing Fresh Farm Produce from Farmers & Market Aggregators in Ghana.
 * Run: node src/db/seed.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding WholesaleLink fresh farm produce & food vendor demo data...');

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const HASH = await bcrypt.hash('Password123!', 12);

  // ── WHOLESALERS / FARMERS / AGGREGATORS ───────────────────────────────────
  const [accraFresh, techimanYam, easternPlantain, agyeiGrains, kponeLivestock, adaOrchards] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'accrafreshproduce@demo.wl',
        passwordHash: HASH,
        role: 'WHOLESALER',
        profile: {
          create: {
            businessName: 'Accra Fresh Produce & Farm Hub',
            supplierType: 'Fresh Vegetables, Tomatoes & Peppers Aggregator',
            contactName: 'Efua Boateng (Demo Farmer Aggregator)',
            phone: '024 100 0001',
            location: 'Agbogbloshie Market & Ada Farms, Accra',
            description:
              'Direct farm aggregator connecting Ada and Navrongo vegetable farmers with Accra chop bars and restaurants. Fresh daily harvests of tomatoes, kpakpo shito, garden eggs, and onions.',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'techimanyam@demo.wl',
        passwordHash: HASH,
        role: 'WHOLESALER',
        profile: {
          create: {
            businessName: 'Techiman Tuber & Yam Cooperative',
            supplierType: 'Yam, Cassava & Root Crops Aggregator',
            contactName: 'Kwabena Mensah (Demo Aggregator)',
            phone: '024 100 0002',
            location: 'Techiman Central Market Depot, Bono East',
            description:
              'Wholesale source for grade-A Pona yams, yellow and white cassava for fufu joints, sweet potatoes, and cocoyam. Supplies major chop bars and caterers in Accra and Kumasi.',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'easternplantain@demo.wl',
        passwordHash: HASH,
        role: 'WHOLESALER',
        profile: {
          create: {
            businessName: 'Eastern Plantain & Leafy Greens Co-op',
            supplierType: 'Plantains, Kontomire & Palm Nuts Cooperative',
            contactName: 'Abena Osei (Demo Co-op Lead)',
            phone: '024 100 0003',
            location: 'Asesewa & Suhum Farm Hub, Eastern Region',
            description:
              'Direct cooperative of over 40 smallholder farmers producing green Apem plantains, ripe Apantu, fresh daily-harvested kontomire, and fresh palm nuts for soup prep.',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'agyeitrading@demo.wl',
        passwordHash: HASH,
        role: 'WHOLESALER',
        profile: {
          create: {
            businessName: 'Agyei Grains & Artisanal Palm Oil Hub',
            supplierType: 'Local Rice, Maize, Beans & Zomi Palm Oil',
            contactName: 'Kwame Agyei (Demo)',
            phone: '024 100 0004',
            location: 'Makola & Ashaiman Wholesale Depot, Greater Accra',
            description:
              'Bulk supplier of local Ghana brown and white rice, white cowpeas for waakye, dried yellow maize for kenkey/banku, and pure unadulterated artisanal Zomi palm oil.',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'kponelivestock@demo.wl',
        passwordHash: HASH,
        role: 'WHOLESALER',
        profile: {
          create: {
            businessName: 'Kpone & Amrahia Livestock, Poultry & Dairy Hub',
            supplierType: 'Poultry, Butchery Meat, Farm Eggs & Fresh Cow Milk',
            contactName: 'Alhaji Haruna Yakubu (Demo Livestock Farmer)',
            phone: '024 100 0005',
            location: 'Amrahia Dairy Farms & Kpone Abattoir Depot, Greater Accra',
            description:
              'Licensed livestock and poultry farm supplying farm-dressed fresh chickens, tender goat meat cuts for light soups, beef soup cuts, fresh cow milk, and crates of farm eggs to chop bars and restaurants.',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'adaorchards@demo.wl',
        passwordHash: HASH,
        role: 'WHOLESALER',
        profile: {
          create: {
            businessName: 'Ada & Nsawam Valley Fresh Orchards',
            supplierType: 'Fresh Tropical Fruits, Pineapples & Melons',
            contactName: 'Kojo Mensah (Demo Fruit Farmer)',
            phone: '024 100 0006',
            location: 'Nsawam & Ada Fruit Belt, Eastern Region',
            description:
              'Farmer cooperative delivering sweet Sugarloaf pineapples, seedless watermelons, ripe Solo pawpaw, sweet oranges, and seasonal mangoes directly to commercial food kitchens, juice joints, and caterers.',
          },
        },
      },
    }),
  ]);

  // ── RETAILERS / FOOD VENDORS ──────────────────────────────────────────────
  const [amasChopBar, bukomKitchen] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'retailer1@demo.wl',
        passwordHash: HASH,
        role: 'RETAILER',
        profile: {
          create: {
            businessName: "Ama's Traditional Chop Bar",
            contactName: 'Ama Serwaa (Demo Food Vendor)',
            phone: '024 200 0001',
            location: 'Madina Zongo Junction, Accra',
            description: 'Popular neighborhood chop bar serving fufu, banku, and waakye to over 400 patrons daily.',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'retailer2@demo.wl',
        passwordHash: HASH,
        role: 'RETAILER',
        profile: {
          create: {
            businessName: 'Bukom Street Food Kitchen & Grills',
            contactName: 'Kofi Tackie (Demo Restaurant Chef)',
            phone: '024 200 0002',
            location: 'Osu Oxford Street, Accra',
            description: 'High-volume Ghanaian street food kitchen and restaurant serving grilled tilapia, banku, and jollof.',
          },
        },
      },
    }),
  ]);

  // ── PRODUCTS / HARVESTS ───────────────────────────────────────────────────

  // 1. Accra Fresh Produce Hub (Vegetables, Tomatoes, Peppers)
  const vegProducts = [
    {
      wholesalerId: accraFresh.id,
      name: 'Navrongo Fresh Red Tomatoes',
      category: 'Fresh Vegetables & Peppers',
      description: 'Firm, ripe, large Navrongo red tomatoes packed in standard wooden crates. Freshly harvested, excellent for rich tomato gravies and jollof.',
      unit: 'Wooden Crate',
      price: 320.0,
      minimumOrderQuantity: 1,
      availableQuantity: 45,
    },
    {
      wholesalerId: accraFresh.id,
      name: 'Legon 18 Fresh Red Chili Peppers',
      category: 'Fresh Vegetables & Peppers',
      description: 'Fiery, aromatic Legon 18 fresh red chili peppers in 50kg sacks. Handpicked from Ada farms.',
      unit: 'Mini Sack (50kg)',
      price: 260.0,
      minimumOrderQuantity: 1,
      availableQuantity: 30,
    },
    {
      wholesalerId: accraFresh.id,
      name: 'Fresh Green Kpakpo Shito Peppers',
      category: 'Fresh Vegetables & Peppers',
      description: 'Fragrant and spicy local green Kpakpo Shito (habanero) peppers. Crucial for authentic raw pepper sauce and banku gravy.',
      unit: 'Wooden Crate',
      price: 195.0,
      minimumOrderQuantity: 1,
      availableQuantity: 25,
    },
    {
      wholesalerId: accraFresh.id,
      name: 'Bawku Dry Red Onions',
      category: 'Fresh Vegetables & Peppers',
      description: 'Top-grade, dry, long-lasting Bawku red onions in maxi sacks. Essential daily kitchen staple for stews and soups.',
      unit: 'Maxi Sack (100kg)',
      price: 520.0,
      minimumOrderQuantity: 1,
      availableQuantity: 40,
    },
    {
      wholesalerId: accraFresh.id,
      name: 'Fresh Garden Eggs (Antroba)',
      category: 'Fresh Vegetables & Peppers',
      description: 'Crisp, white garden eggs for traditional garden egg stews and fufu soups. Harvested fresh every morning.',
      unit: 'Wooden Crate',
      price: 140.0,
      minimumOrderQuantity: 1,
      availableQuantity: 35,
    },
    {
      wholesalerId: accraFresh.id,
      name: 'Lady Finger Fresh Okra',
      category: 'Fresh Vegetables & Peppers',
      description: 'Tender, fresh green okra for slimy, rich okra soups and stews. Washed and packed in large baskets.',
      unit: 'Basket',
      price: 110.0,
      minimumOrderQuantity: 1,
      availableQuantity: 20,
    },
    {
      wholesalerId: accraFresh.id,
      name: 'Anloga Purple Shallots',
      category: 'Fresh Vegetables & Peppers',
      description: 'Sweet, pungent small red shallots from Anloga, Volta Region. Imparts rich traditional aroma to shito and gravies.',
      unit: 'Mini Sack (50kg)',
      price: 340.0,
      minimumOrderQuantity: 1,
      availableQuantity: 18,
    },
  ];

  // 2. Techiman Tuber & Yam Cooperative
  const tuberProducts = [
    {
      wholesalerId: techimanYam.id,
      name: 'Grade-A Pona White Yam',
      category: 'Tubers & Roots',
      description: 'Sweet, floury, premium Pona yams direct from Techiman. Perfect texture for boiling, frying, or pounding fufu. Sold in batches of 100 large tubers.',
      unit: '100 Tubers',
      price: 1850.0,
      minimumOrderQuantity: 1,
      availableQuantity: 25,
    },
    {
      wholesalerId: techimanYam.id,
      name: 'Fresh White Cassava for Fufu',
      category: 'Tubers & Roots',
      description: 'High-starch freshly uprooted white cassava with thin pink bark. Excellent poundability and elasticity for chop bar fufu.',
      unit: 'Maxi Sack (100kg)',
      price: 280.0,
      minimumOrderQuantity: 2,
      availableQuantity: 60,
    },
    {
      wholesalerId: techimanYam.id,
      name: 'Red Sweet Potatoes',
      category: 'Tubers & Roots',
      description: 'Nutritious sweet potatoes from Northern Ghana. High sugar content, ideal for roasting, boiling, and frying.',
      unit: 'Maxi Sack (100kg)',
      price: 310.0,
      minimumOrderQuantity: 1,
      availableQuantity: 20,
    },
    {
      wholesalerId: techimanYam.id,
      name: 'Fresh Cocoyam (Mankani)',
      category: 'Tubers & Roots',
      description: 'Creamy local cocoyam tubers for thick soups and traditional ampesi.',
      unit: 'Mini Sack (50kg)',
      price: 240.0,
      minimumOrderQuantity: 1,
      availableQuantity: 22,
    },
  ];

  // 3. Eastern Plantain & Leafy Greens Co-op
  const plantainProducts = [
    {
      wholesalerId: easternPlantain.id,
      name: 'Fresh Green Apem Plantains',
      category: 'Plantains & Bananas',
      description: 'Firm, thick-fingered green Apem plantains. The gold standard for pounding smooth, golden fufu and serving ampesi.',
      unit: 'Large Bunch',
      price: 95.0,
      minimumOrderQuantity: 3,
      availableQuantity: 80,
    },
    {
      wholesalerId: easternPlantain.id,
      name: 'Semi-Ripe & Ripe Apantu Plantains',
      category: 'Plantains & Bananas',
      description: 'Large, sweet Apantu plantains ideal for frying kelewele, tatale, and red-red (plantain and beans).',
      unit: 'Large Bunch',
      price: 85.0,
      minimumOrderQuantity: 2,
      availableQuantity: 65,
    },
    {
      wholesalerId: easternPlantain.id,
      name: 'Fresh Cocoyam Leaves (Kontomire)',
      category: 'Leafy Greens & Fresh Herbs',
      description: 'Tender, organic, unbruised dark green cocoyam leaves harvested at dawn. Vital for authentic palaver sauce and ebunu ebunu.',
      unit: 'Bundle (50 Stems)',
      price: 45.0,
      minimumOrderQuantity: 2,
      availableQuantity: 120,
    },
    {
      wholesalerId: easternPlantain.id,
      name: 'Fresh Palm Nuts (Abenkwan)',
      category: 'Cooking Oils & Essentials',
      description: 'Rich, oily, freshly harvested palm nut bunches. Yields thick, aromatic palm nut soup.',
      unit: 'Maxi Sack (100kg)',
      price: 270.0,
      minimumOrderQuantity: 1,
      availableQuantity: 35,
    },
    {
      wholesalerId: easternPlantain.id,
      name: 'Fresh Gboma & Green Leafy Greens',
      category: 'Leafy Greens & Fresh Herbs',
      description: 'Fresh indigenous Gboma leaves for traditional soup preparation. Crisp and bitter-sweet.',
      unit: 'Bundle (50 Stems)',
      price: 40.0,
      minimumOrderQuantity: 2,
      availableQuantity: 50,
    },
    {
      wholesalerId: easternPlantain.id,
      name: 'Fresh Spring Onions & Celery',
      category: 'Leafy Greens & Fresh Herbs',
      description: 'Lush green spring onions and local aromatics for meat and fish marinades and fried rice.',
      unit: 'Bundle',
      price: 35.0,
      minimumOrderQuantity: 3,
      availableQuantity: 40,
    },
  ];

  // 4. Agyei Grains & Artisanal Palm Oil Hub
  const grainProducts = [
    {
      wholesalerId: agyeiGrains.id,
      name: 'Pure Artisanal Zomi Palm Oil',
      category: 'Cooking Oils & Essentials',
      description: 'Authentic spiced red palm oil (Zomi) from Volta artisanal presses. Rich aroma, clear red color, no artificial additives. Packed in 25L yellow gallons.',
      unit: 'Yellow Gallon (25L)',
      price: 380.0,
      minimumOrderQuantity: 1,
      availableQuantity: 50,
    },
    {
      wholesalerId: agyeiGrains.id,
      name: 'Local Ghana Brown Rice',
      category: 'Local Grains & Legumes',
      description: 'Nutritious local brown rice from the Volta plains. Excellent aroma and water absorption for waakye and local rice stews.',
      unit: '50kg Bag',
      price: 480.0,
      minimumOrderQuantity: 1,
      availableQuantity: 40,
    },
    {
      wholesalerId: agyeiGrains.id,
      name: 'White Cowpea / Black-Eyed Beans',
      category: 'Local Grains & Legumes',
      description: 'Clean, stone-free white cowpea beans. The quintessential ingredient for waakye, red-red, and koose.',
      unit: '50kg Bag',
      price: 520.0,
      minimumOrderQuantity: 1,
      availableQuantity: 35,
    },
    {
      wholesalerId: agyeiGrains.id,
      name: 'Dried Yellow Maize for Kenkey & Banku',
      category: 'Local Grains & Legumes',
      description: 'Sun-dried yellow flint maize. Ferments with rich sour notes required for premium Ga kenkey and banku dough.',
      unit: '100kg Maxi Sack',
      price: 390.0,
      minimumOrderQuantity: 1,
      availableQuantity: 55,
    },
    {
      wholesalerId: agyeiGrains.id,
      name: 'Soup Groundnuts (Raw Shelled)',
      category: 'Cooking Oils & Essentials',
      description: 'Clean, sweet, golden raw groundnuts for rich groundnut soup (nkatenkwan) and waakye stew base.',
      unit: '50kg Bag',
      price: 610.0,
      minimumOrderQuantity: 1,
      availableQuantity: 28,
    },
    {
      wholesalerId: agyeiGrains.id,
      name: 'Fresh Ghana Ginger Root',
      category: 'Spices & Fresh Aromatics',
      description: 'Pungent, highly aromatic raw ginger root. Washed and packed in sacks for daily spice blending and meat steaming.',
      unit: 'Mini Sack (50kg)',
      price: 330.0,
      minimumOrderQuantity: 1,
      availableQuantity: 30,
    },
    {
      wholesalerId: agyeiGrains.id,
      name: 'Fresh Garlic Bulbs',
      category: 'Spices & Fresh Aromatics',
      description: 'Whole white garlic bulbs for rich kitchen marinade paste.',
      unit: 'Carton (10kg)',
      price: 180.0,
      minimumOrderQuantity: 1,
      availableQuantity: 40,
    },
  ];

  // 5. Kpone & Amrahia Livestock, Poultry & Dairy Hub
  const livestockAndDairyProducts = [
    {
      wholesalerId: kponeLivestock.id,
      name: 'Farm-Dressed Broiler Chickens (10 Birds)',
      category: 'Poultry & Farm-Dressed Birds',
      description: 'Freshly slaughtered, cleaned, and eviscerated whole broiler chickens (~1.3kg each). Delivered chilled in a 10-bird master carton. Ideal for stews, fried chicken, and jollof.',
      unit: 'Carton (10 Birds)',
      price: 460.0,
      minimumOrderQuantity: 1,
      availableQuantity: 35,
    },
    {
      wholesalerId: kponeLivestock.id,
      name: 'Fresh Dressed Local Guinea Fowls (5 Birds)',
      category: 'Poultry & Farm-Dressed Birds',
      description: 'Singed, washed, and dressed local Ghanaian guinea fowls. Rich, gamey flavor prized by chop bars for light soup and grilled specials.',
      unit: 'Batch (5 Birds)',
      price: 380.0,
      minimumOrderQuantity: 1,
      availableQuantity: 25,
    },
    {
      wholesalerId: kponeLivestock.id,
      name: 'Fresh Goat Meat Bone-In Soup Cuts',
      category: 'Butchery & Fresh Meat',
      description: 'Clean, tender goat meat bone-in cuts with skin singed to traditional Ghanaian flavor profile. Essential for chop bar goat light soup and fufu.',
      unit: '10kg Meat Carton',
      price: 680.0,
      minimumOrderQuantity: 1,
      availableQuantity: 30,
    },
    {
      wholesalerId: kponeLivestock.id,
      name: 'Fresh Beef Bone-In Soup Cuts',
      category: 'Butchery & Fresh Meat',
      description: 'Freshly butchered local beef soup cuts and marrow bones for rich, savory soup bases, stews, and gravies.',
      unit: '10kg Meat Carton',
      price: 550.0,
      minimumOrderQuantity: 1,
      availableQuantity: 28,
    },
    {
      wholesalerId: kponeLivestock.id,
      name: 'Fresh Pork Belly & Chops Cuts',
      category: 'Butchery & Fresh Meat',
      description: 'Fresh succulent pork cuts for grilled pork joints, street roast meat, and rich soups.',
      unit: '10kg Meat Carton',
      price: 490.0,
      minimumOrderQuantity: 1,
      availableQuantity: 22,
    },
    {
      wholesalerId: kponeLivestock.id,
      name: 'Grade-A Farm Fresh Brown Eggs (Crate of 30)',
      category: 'Eggs & Fresh Farm Dairy',
      description: 'Clean, large brown farm-fresh eggs from battery-cage layers. Thick shells, high yolk quality. Daily essential for waakye, fried rice, and salads.',
      unit: 'Crate of 30 Eggs',
      price: 65.0,
      minimumOrderQuantity: 3,
      availableQuantity: 150,
    },
    {
      wholesalerId: kponeLivestock.id,
      name: 'Commercial Eggs Master Carton (10 Crates / 300 Eggs)',
      category: 'Eggs & Fresh Farm Dairy',
      description: 'Bulk wholesale carton containing 10 crates (300 large brown eggs). Direct farm-gate price for commercial food kitchens and caterers.',
      unit: 'Carton (300 Eggs)',
      price: 620.0,
      minimumOrderQuantity: 1,
      availableQuantity: 40,
    },
    {
      wholesalerId: kponeLivestock.id,
      name: 'Fresh Raw Cow Milk (Amrahia Dairy)',
      category: 'Eggs & Fresh Farm Dairy',
      description: '100% pure, unadulterated fresh morning cow milk collected from healthy Amrahia cattle. Delivered chilled in sealed 5L gallons for beverage prep and culinary dairy.',
      unit: 'Gallon (5L)',
      price: 95.0,
      minimumOrderQuantity: 1,
      availableQuantity: 30,
    },
  ];

  // 6. Ada & Nsawam Valley Fresh Orchards
  const fruitProducts = [
    {
      wholesalerId: adaOrchards.id,
      name: 'Sugarloaf Sweet Pineapples',
      category: 'Fresh Fruits & Citrus',
      description: 'Sweet, low-acid, juicy Sugarloaf pineapples from the Eastern pineapple belt. Harvested ripe for fresh fruit salads, fresh juices, and desserts.',
      unit: 'Wooden Crate (20 Pineapples)',
      price: 130.0,
      minimumOrderQuantity: 1,
      availableQuantity: 45,
    },
    {
      wholesalerId: adaOrchards.id,
      name: 'Sweet Navel Local Oranges',
      category: 'Fresh Fruits & Citrus',
      description: 'Thin-skinned, sweet, high-juice local oranges from Nsawam orchards. Packed in standard 50kg mini sacks.',
      unit: 'Mini Sack (50kg)',
      price: 140.0,
      minimumOrderQuantity: 1,
      availableQuantity: 35,
    },
    {
      wholesalerId: adaOrchards.id,
      name: 'Sweet Seedless Red Watermelons',
      category: 'Fresh Fruits & Citrus',
      description: 'Crisp, deep-red, sweet watermelons harvested from Ada irrigated plains. Sold in batches of 10 large melons.',
      unit: 'Batch (10 Large Melons)',
      price: 190.0,
      minimumOrderQuantity: 1,
      availableQuantity: 25,
    },
    {
      wholesalerId: adaOrchards.id,
      name: 'Ripe Solo Pawpaw (Papaya)',
      category: 'Fresh Fruits & Citrus',
      description: 'Golden-orange, firm and sweet Solo pawpaw for fresh fruit cuts and breakfast juice prep.',
      unit: 'Wooden Crate',
      price: 105.0,
      minimumOrderQuantity: 1,
      availableQuantity: 25,
    },
  ];

  const allProducts = [
    ...vegProducts,
    ...tuberProducts,
    ...plantainProducts,
    ...grainProducts,
    ...livestockAndDairyProducts,
    ...fruitProducts,
  ];

  await prisma.product.createMany({ data: allProducts });

  // ── DEMO ORDER ────────────────────────────────────────────────────────────
  // Create a realistic sample order from Ama's Chop Bar with Accra Fresh Hub
  const createdVeg = await prisma.product.findMany({
    where: { wholesalerId: accraFresh.id },
  });

  if (createdVeg.length >= 2) {
    const t1 = createdVeg[0]; // Tomatoes
    const t2 = createdVeg[1]; // Pepper
    const t3 = createdVeg[2]; // Kpakpo Shito

    const subtotal =
      parseFloat(t1.price) * 2 +
      parseFloat(t2.price) * 1 +
      parseFloat(t3.price) * 2;

    await prisma.order.create({
      data: {
        reference: 'WL-202611-FARM1',
        retailerId: amasChopBar.id,
        wholesalerId: accraFresh.id,
        status: 'PROCESSING',
        deliveryMethod: 'DELIVERY',
        deliveryAddress: "Ama's Chop Bar, Madina Zongo Junction near Total, Accra",
        notes: 'Please dispatch before 5:30 AM so we can begin prep for lunch service. Prefer firm red tomatoes.',
        subtotal: subtotal.toFixed(2),
        items: {
          create: [
            {
              productId: t1.id,
              productName: t1.name,
              productUnit: t1.unit,
              priceAtOrder: t1.price,
              quantity: 2,
            },
            {
              productId: t2.id,
              productName: t2.name,
              productUnit: t2.unit,
              priceAtOrder: t2.price,
              quantity: 1,
            },
            {
              productId: t3.id,
              productName: t3.name,
              productUnit: t3.unit,
              priceAtOrder: t3.price,
              quantity: 2,
            },
          ],
        },
      },
    });
  }

  console.log('✅ Fresh Farm Produce, Poultry, Butchery, Dairy & Fruits seed complete!');
  console.log('\n📋 Demo accounts for Food Vendors & Farm Produce Wholesalers:');
  console.log('   Farmers / Produce Wholesalers:');
  console.log('     accrafreshproduce@demo.wl   | Password123! (Accra Fresh Farm Produce Hub)');
  console.log('     techimanyam@demo.wl         | Password123! (Techiman Yam & Tuber Co-op)');
  console.log('     easternplantain@demo.wl     | Password123! (Eastern Plantain & Greens Co-op)');
  console.log('     agyeitrading@demo.wl        | Password123! (Agyei Grains & Zomi Palm Oil Hub)');
  console.log('     kponelivestock@demo.wl      | Password123! (Kpone & Amrahia Livestock, Poultry & Dairy Hub)');
  console.log('     adaorchards@demo.wl         | Password123! (Ada & Nsawam Valley Fresh Orchards)');
  console.log('   Food Vendors / Restaurants:');
  console.log("     retailer1@demo.wl           | Password123! (Ama's Traditional Chop Bar)");
  console.log('     retailer2@demo.wl           | Password123! (Bukom Street Food Kitchen & Grills)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
