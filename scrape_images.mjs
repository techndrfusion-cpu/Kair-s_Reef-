// Generate and test Aqualandia image URLs based on discovered pattern
import fs from 'fs';

// Mapping: product name -> image path (based on pattern discovered from browser)
// Pattern: https://aqualandiaanimal.com.br/wp-content/uploads/{date}/{slug}-300x300.jpg
const productImages = {
  // ── Page 1 ──
  'Anjo Imperador Juvenil': '/2023/11/Anjo-Imperador-Juvenil-1-300x300.jpg',
  'Anthia Carberryi – Fêmea': '/2023/11/Anthia-Carberryi-Femea-300x300.jpg',
  'Anthia Carberryi – Macho': '/2023/11/Anthia-Carberryi-Macho-300x300.jpg',
  'Anthia Dispar': '/2023/11/Anthia-Dispar-300x300.jpg',
  'Anthia Purple Queen': '/2023/11/Anthia-Purple-Queen-300x300.jpg',
  'Anthia Squamipinnis – Fêmea': '/2023/11/Anthis-Squamipinnis-Femea-300x300.jpg',
  'Anthia Squamipinnis – Macho': '/2023/11/Anthia-Squamipinnis-Macho-300x300.jpg',
  'Anthia Square': '/2023/11/Anthia-Square-300x300.jpg',
  'Asfur Anjo': '/2024/05/Asfur-Anjo-300x300.jpg',
  'Auriga Butterfly': '/2024/05/Auriga-Butterfly-300x300.jpg',
  'Blênio Algae Rock': '/2023/11/Blenio-Algae-Rock-300x300.jpg',
  'Blênio Bicolor': '/2023/11/Blenio-Bicolor-300x300.jpg',
  'Blênio Midas': '/2023/11/Blenio-Midas-300x300.jpg',
  'Blênio Stripe': '/2023/11/Blenio-Stripe-300x300.jpg',
  'Blue Tang M': '/2023/11/Blue-Tang-M-300x300.jpg',
  'Blue Tang P': '/2023/11/Blue-Tang-P-300x300.jpg',
  // ── Page 2 ──
  'Blue Tang Yellow Belly': '/2024/05/Blue-Tang-Yellow-Belly-300x300.jpg',
  'Butterfly Striatus': '/2023/11/Butterfly-Striatus-300x300.jpg',
  'Camarão Aranha': '/2023/11/Camarao-Aranha-300x300.jpg',
  'Camarão Bailarino': '/2023/11/Camarao-Bailarino-300x300.jpg',
  'Camarão Cleaner': '/2023/11/Camarao-Cleaner-300x300.jpg',
  'Camarão Stenopus': '/2023/11/Camarao-Stenopus-300x300.jpg',
  'Canthigaster Valentini': '/2023/11/Canthigaster-Valentini-300x300.jpg',
  'Cardinal Bangai': '/2023/11/Cardinal-Bangai-300x300.jpg',
  'Cardinal Pijama': '/2023/11/Cardinal-Pijama-300x300.jpg',
  'Cleaner Four Wrasse (Red Sea)': '/2023/11/Cleaner-Four-Wrasse-Red-Sea-300x300.jpg',
  'Cleaner Wrasse G': '/2023/11/Cleaner-Wrasse-G-300x300.jpg',
  'Cleaner Wrasse P/M': '/2023/11/Cleaner-Wrasse-P-M-300x300.jpg',
  'Cooperband Butterfly': '/2023/11/Cooperband-Butterfly-300x300.jpg',
  'Coral Beauty': '/2023/11/Coral-Beauty-300x300.jpg',
  'Desjardini Tang – G': '/2023/11/Desjardini-Tang-G-300x300.jpg',
  'Desjardini Tang – P/M': '/2023/11/Desjardini-Tang-P-M-300x300.jpg',
  // ── Page 3 ──
  'Disappearing Wrasse': '/2023/11/Disappearing-Wrasse-300x300.jpg',
  'Donzela Azul': '/2023/11/Donzela-Blue-Devil-300x300.jpg',
  'Donzela Blue Sapphire': '/2023/11/Donzela-Blue-Sapphire-300x300.jpg',
  'Donzela Domino': '/2023/11/Donzela-Domino-300x300.jpg',
  'Donzela Goldbelly': '/2023/11/Donzela-Goldbelly-300x300.jpg',
  'Donzela Green Chromis': '/2023/11/Donzela-Green-Chromis-300x300.jpg',
  'Donzela Half Moon': '/2023/11/Donzela-Half-Moon-Marginatus-300x300.jpg',
  'Donzela Kupang': '/2023/11/Donzela-Kupang-300x300.jpg',
  'Donzela Neon Blue': '/2023/11/Donzela-Neon-Blue-Alleni-300x300.jpg',
  'Donzela Neon Velvet': '/2023/11/Donzela-Neon-Velvet-300x300.jpg',
  'Donzela Roland': '/2023/11/Donzela-Roland-300x300.jpg',
  'Donzela Springeri': '/2023/11/Donzela-Springeri-Comedora-de-Planaria-300x300.jpg',
  'Donzela Stripe': '/2023/11/Donzela-Stripe-300x300.jpg',
  'Donzela Talbot': '/2023/11/Donzela-Talbot-300x300.jpg',
  'Donzela Ternate': '/2023/11/Donzela-Ternate-Staghorn-300x300.jpg',
  'Donzela Yellowtail': '/2023/11/Donzela-Yellow-Tail-300x300.jpg',
  // ── Page 4 ──
  'Dragon Wrasse': '/2024/05/Dragon-Wrasse-300x300.jpg',
  'Estrela Linckia': '/2023/11/Estrela-Linckia-Star-Spotted-300x300.jpg',
  'Estrela Sand Sifting': '/2023/11/Estrela-Sand-Cleaner-300x300.jpg',
  'Exquisite Fairy Wrasse': '/2024/05/Exquisite-Fairy-Wrasse-300x300.jpg',
  'Feather Duster': '/2023/11/Feather-Duster-Poliqueta-300x300.jpg',
  'Feather Duster Black': '/2023/11/Feather-Duster-Black-Poliqueta-300x300.jpg',
  'Fire Fish Africa': '/2023/11/Fire-Fish-Africa-300x300.jpg',
  'Fire Fish Maldivas': '/2023/11/Fire-Fish-Maldivas-300x300.jpg',
  'Flagfin Anjo': '/2024/05/Flagfin-Anjo-Trimaculatus-300x300.jpg',
  'Flame Angel': '/2023/11/Flame-Angelfish-300x300.jpg',
  'Flame Hawkfish': '/2023/11/Flame-Hawkfish-300x300.jpg',
  'Foxface G': '/2023/11/Fox-Face-G-300x300.jpg',
  'Foxface M': '/2023/11/Fox-Face-M-300x300.jpg',
  'Foxface Fiji': '/2024/05/Fox-Face-Fiji-300x300.jpg',
  'Foxface Magnificent': '/2024/05/Fox-Face-Magnificent-P-300x300.jpg',
  'Foxface One Spot': '/2024/05/Fox-Face-One-Spot-P-300x300.jpg',
  // ── Page 5 ──
  'Garoupa Panther': '/2024/05/Garoupa-Panther-300x300.jpg',
  'Goby Blue Dot': '/2023/11/Goby-Blue-Dot-300x300.jpg',
  'Goby Clown Green': '/2023/11/Goby-Clow-Green-300x300.jpg',
  'Goby Diamond': '/2023/11/Goby-Diamond-300x300.jpg',
  'Goby Gold Head': '/2023/11/Goby-Gold-Head-Slepper-300x300.jpg',
  'Goby Guttata': '/2023/11/Goby-Guttata-300x300.jpg',
  'Goby Spotted Watchman': '/2024/05/Goby-Spotted-Watchman-Blue-300x300.jpg',
  'Goby Wheelers': '/2024/05/Goby-Wheelers-Shrimp-300x300.jpg',
  'Goby Yellow Coral': '/2023/11/Goby-Yellow-Coral-300x300.jpg',
  'Goby Yellow Watchman': '/2023/11/Goby-Yellow-Watchman-300x300.jpg',
  'Gold Rimmed Tang': '/2024/05/Gold-Rimmed-Tang-300x300.jpg',
  'Golden Line Rabbitfish': '/2024/05/Golden-Line-Rabbitfish-Biota-300x300.jpg',
  'Gramma Melacara': '/2024/05/Gramma-Melacara-Cap-Black-300x300.jpg',
  'Kole Blue Eye': '/2024/05/Kole-Blue-Eye-300x300.jpg',
  'Kole Yellow Eye M': '/2023/11/Kole-Yellow-Eye-M-300x300.jpg',
  'Kole Yellow Eye': '/2023/11/Kole-Yellow-Eye-300x300.jpg',
  // ── Page 6 ──
  'Leaf Scorpionfish': '/2024/05/Leaf-Scorpionfish-300x300.jpg',
  'Mandarin Biomarine': '/2024/05/Mandarin-Criado-Biomarine-Comendo-Racao-300x300.jpg',
  'Mandarin Blue Red G': '/2023/11/Mandarin-Blue-Red-Goby-G-300x300.jpg',
  'Mandarin Green Spotted': '/2023/11/Mandarin-Green-Spotted-P-M-300x300.jpg',
  'Maroon Dot Gold': '/2024/05/Maroon-Dot-Gold-300x300.jpg',
  'Maroon Lightning': '/2024/05/Maroon-Lightning-300x300.jpg',
  'Maroon Nugget Gold': '/2024/05/Maroon-Nugget-Gold-300x300.jpg',
  'Melanuros Macho': '/2024/05/Melanuros-Macho-300x300.jpg',
  'Melanuros Wrasse Femea': '/2024/05/Melanuros-Wrasse-Femea-300x300.jpg',
  'Mimic Tang Chocolate': '/2024/05/Mimic-Tang-Chocolate-G-300x300.jpg',
  'Mini Paguro': '/2023/11/Mini-Paguro-300x300.jpg',
  'Moorish Idol': '/2024/05/Moorish-Idol-Zanclus-300x300.jpg',
  'Multicolor Angel': '/2024/05/Multcolor-Angel-Fish-300x300.jpg',
  'Naokos Fairy Wrasse': '/2024/05/Naokos-Fairy-Wrasse-300x300.jpg',
  'Naso Tang Blond Lira GG': '/2024/05/Naso-Tang-Blond-Calda-Lira-GG-300x300.jpg',
  'Naso Tang Blond M': '/2023/11/Naso-Tang-Blond-M-300x300.jpg',
  // ── Page 7 ──
  'Naso Tang Lituratus': '/2023/11/Naso-Tang-Lituratus-M-300x300.jpg',
  'Neon Blue Goby': '/2024/05/Neon-Blue-Goby-300x300.jpg',
  'Neon Yellow Goby': '/2024/05/Neon-Yellow-Goby-300x300.jpg',
  'Ocellaris Black': '/2023/11/Ocellaris-Black-300x300.jpg',
  'Ocellaris Black G': '/2024/05/Ocellaris-Black-G-300x300.jpg',
  'Ocellaris Black Ice': '/2024/05/Ocellaris-Black-Ice-300x300.jpg',
  'Ocellaris Black Snowflake': '/2024/05/Ocellaris-Black-Snowflake-300x300.jpg',
  'Ocellaris Black Storm': '/2023/11/Ocellaris-Black-Storm-300x300.jpg',
  'Ocellaris Black Storm G': '/2024/05/Ocellaris-Black-Storm-G-300x300.jpg',
  'Ocellaris Black Storm P': '/2024/05/Ocellaris-Black-Storm-P-300x300.jpg',
  'Ocellaris Chocolate': '/2024/05/Ocellaris-Chocolate-300x300.jpg',
  'Ocellaris Clark': '/2023/11/Ocellaris-Clark-300x300.jpg',
  'Ocellaris Clark Ball': '/2024/05/Ocellaris-Clark-Ball-300x300.jpg',
  'Ocellaris Common': '/2023/11/Ocellaris-Comum-300x300.jpg',
  'Ocellaris Frostbite': '/2024/05/Ocellaris-Frostbite-300x300.jpg',
  'Ocellaris Midnight': '/2024/05/Ocellaris-Midnight-300x300.jpg',
  // ── Page 8 ──
  'Ocellaris Misbar': '/2023/11/Ocellaris-Misbar-300x300.jpg',
  'Ocellaris Misbar Black': '/2024/05/Ocellaris-Misbar-Black-300x300.jpg',
  'Ocellaris Naked': '/2024/05/Ocellaris-Naked-300x300.jpg',
  'Ocellaris Nearly Naked': '/2024/05/Ocellaris-Nearly-Naked-300x300.jpg',
  'Ocellaris Orange Storm': '/2024/05/Ocellaris-Orange-Storm-300x300.jpg',
  'Ocellaris Pink Skunk': '/2024/05/Ocellaris-Pink-Skunk-300x300.jpg',
  'Ocellaris Premium Black Snow Flake': '/2024/05/Ocellaris-Premium-Black-Snow-Flake-300x300.jpg',
  'Ocellaris Premium Snowflake': '/2024/05/Ocellaris-Premium-Snowflake-300x300.jpg',
  'Ocellaris Single Domino': '/2024/05/Ocellaris-Single-Domino-300x300.jpg',
  'Ocellaris Snowflake': '/2023/11/Ocellaris-Snowflake-300x300.jpg',
  'Ocellaris True Domino': '/2024/05/Ocellaris-True-Domino-300x300.jpg',
  'Ocellaris Wyoming White': '/2024/05/Ocellaris-Wyoming-White-300x300.jpg',
  'Odonus Niger': '/2024/05/Odonus-Niger-300x300.jpg',
  'Ofiúrus Banded': '/2023/11/Ofiuros-Banded-300x300.jpg',
  'Ofiúrus Black': '/2023/11/Ofiuros-Black-300x300.jpg',
  'Ofiúrus Importado': '/2023/11/Ofiuros-Importado-300x300.jpg',
  // ── Page 9 ──
  'Ofiúrus Marmore': '/2023/11/Ofiuros-Marmore-300x300.jpg',
  'Ofiúrus Marrom': '/2023/11/Ofiuros-Marrom-300x300.jpg',
  'Orange Shoulder Tang': '/2024/05/Orange-Shoulder-Tang-300x300.jpg',
  'Ouriço Multicolor': '/2023/11/Ourico-Multicolor-300x300.jpg',
  'Ouriço Tuxedo': '/2023/11/Ourico-Tuxedo-300x300.jpg',
  'Pacific Redstripe Hogfish': '/2024/05/Pacific-Redstripe-Hogfish-300x300.jpg',
  'Paguro Pata Amarela': '/2023/11/Paguro-Pata-Amarela-300x300.jpg',
  'Paguro Pata Azul G': '/2024/05/Paguro-Pata-Azul-G-300x300.jpg',
  'Pepino de Areia': '/2023/11/Pepino-de-Areia-300x300.jpg',
  'Pepino do Mar Rosa': '/2024/05/Pepino-do-Mar-Rosa-300x300.jpg',
  'Pepino Hot Dog': '/2024/05/Pepino-Hot-Dog-300x300.jpg',
  'Pepino Sea Apple': '/2024/05/Pepino-Sea-Apple-300x300.jpg',
  'Percula Platinum': '/2024/05/Percula-Platinum-300x300.jpg',
  'Percula Premium Picasso': '/2024/05/Percula-Premium-Picasso-300x300.jpg',
  'Powder Blue Tang': '/2023/11/Powder-Blue-Tang-300x300.jpg',
  'Powder Brown Tang': '/2024/05/Powder-Brown-Tang-300x300.jpg',
  // ── Page 10 ──
  'Pseudochromis Aldabraensis': '/2023/11/Pseudochromis-Aldabraensis-300x300.jpg',
  'Pseudochromis Bicolor': '/2023/11/Pseudochromis-Bicolor-Royal-Dottyback-300x300.jpg',
  'Pseudochromis Diadema': '/2023/11/Pseudochromis-Diadema-300x300.jpg',
  'Pseudochromis Fridmani': '/2023/11/Pseudochromis-Fridmani-300x300.jpg',
  'Pseudochromis Springeri': '/2023/11/Pseudochromis-Springeri-300x300.jpg',
  'Puffer Solandri M': '/2024/05/Puffer-Solandri-M-300x300.jpg',
  'Puffer Solandri P': '/2024/05/Puffer-Solandri-P-300x300.jpg',
  'Purple Fire Fish': '/2023/11/Purple-Fire-Fish-300x300.jpg',
  'Purple Firefish Maldivas': '/2024/05/Purple-Firefish-Maldivas-300x300.jpg',
  'Purple Tang G': '/2024/05/Purple-Tang-G-300x300.jpg',
  'Purple Tang P': '/2024/05/Purple-Tang-P-300x300.jpg',
  'Raccoon Butterflyfish': '/2024/05/Raccoon-Butterflyfish-300x300.jpg',
  'Radiant Wrasse': '/2024/05/Radiant-Wrasse-300x300.jpg',
  'Red Sea Eightline Flasher': '/2024/05/Red-Sea-Eightline-Flasher-300x300.jpg',
  'Royal Gramma': '/2023/11/Royal-Gramma-300x300.jpg',
  'Sailfin Tang M': '/2023/11/Sailfin-Tang-M-300x300.jpg',
  // ── Page 11 ──
  'Sailfin Tang P': '/2024/05/Sailfin-Tang-P-300x300.jpg',
  'Scissortail Goby': '/2024/05/Scissortail-Goby-300x300.jpg',
  'Scooter Blenny': '/2023/11/Scooter-Blenny-300x300.jpg',
  'Scooter Blenny Red': '/2024/05/Scooter-Blenny-Red-300x300.jpg',
  'Scooter Blenny Red Ruby': '/2024/05/Scooter-Blenny-Red-Ruby-Dragonet-300x300.jpg',
  'Scopas Tang G': '/2024/05/Scopas-Tang-G-300x300.jpg',
  'Semi Larvatus Butterfly': '/2024/05/Semi-Larvatus-Buttlerfly-300x300.jpg',
  'Sohal Tang': '/2024/05/Sohal-Tang-300x300.jpg',
  'Solorensis Wrasse': '/2024/05/Solorensis-Wrasse-300x300.jpg',
  'Tang Gemmatum': '/2024/05/Tang-Gemmatum-300x300.jpg',
  'Tennenti Tang': '/2024/05/Tennenti-Tang-300x300.jpg',
  'Thalassoma Lunare': '/2024/05/Thalassoma-Lunare-300x300.jpg',
  'Tomini Tang': '/2024/05/Tomini-Tang-300x300.jpg',
  'Turbo Snail': '/2023/11/Turbo-Snail-300x300.jpg',
  'Wrasse Cleaner Bicolor': '/2024/05/Wrasse-Cleaner-Bicolor-300x300.jpg',
  'Wrasse Green Bird': '/2024/05/Wrasse-Green-Bird-300x300.jpg',
  // ── Page 12 ──
  'Wrasse Red Coris GG': '/2024/05/Wrasse-Red-Coris-GG-300x300.jpg',
  'Wrasse Red Coris P': '/2024/05/Wrasse-Red-Coris-P-300x300.jpg',
  'Six Line Wrasse': '/2023/11/Wrasse-Six-Line-300x300.jpg',
  'Wrasse Yellow Coris': '/2024/05/Wrasse-Yellow-Coris-P-M-300x300.jpg',
  'Wrasse Yellow Coris Branca': '/2024/05/Wrasse-Yellow-Coris-Barriga-Branca-P-M-300x300.jpg',
  'Yellow Box Fish': '/2024/05/Yellow-Box-Fish-300x300.jpg',
  'Yellow Eye Tang': '/2024/05/Yellow-Eye-Tang-300x300.jpg',
  'Yellow Longnose Butterfly': '/2023/11/Yellow-Longnose-Butterfly-300x300.jpg',
  'Yellow Mimic Tang G': '/2024/05/Yellow-Mimic-Tang-G-300x300.jpg',
  'Yellow Mimic Tang P/M': '/2024/05/Yellow-Mimic-Tang-P-M-300x300.jpg',
  'Yellow Tang': '/2023/11/Yellow-Tang-300x300.jpg',
  'Yellowfin Flasher Wrasse': '/2024/05/Yellowfin-Flasher-Wrasse-300x300.jpg',
};

const BASE = 'https://aqualandiaanimal.com.br/wp-content/uploads';

async function testURL(url) {
  try {
    const res = await fetch(url, { 
      method: 'GET', 
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://aqualandiaanimal.com.br/',
      }
    });
    return res.status;
  } catch { return 0; }
}

async function main() {
  const working = {};
  const broken = [];
  const entries = Object.entries(productImages);
  
  // Test in batches of 3 with delay to avoid rate limiting
  for (let i = 0; i < entries.length; i += 3) {
    const batch = entries.slice(i, i + 3);
    const results = await Promise.all(
      batch.map(async ([name, path]) => {
        const url = BASE + path;
        const status = await testURL(url);
        return { name, path, status, url };
      })
    );
    
    for (const { name, status, url } of results) {
      if (status === 200) {
        working[name] = url;
        process.stdout.write('✓');
      } else {
        broken.push(name);
        process.stdout.write('✗');
      }
    }
    
    // Small delay between batches
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`\n\nWorking: ${Object.keys(working).length}/${entries.length}`);
  console.log(`Broken: ${broken.length}`);
  if (broken.length > 0) console.log('Broken items:', broken.join(', '));
  
  fs.writeFileSync('verified_images.json', JSON.stringify(working, null, 2));
  console.log('Saved to verified_images.json');
}

main();
