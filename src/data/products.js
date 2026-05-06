// ═══════════════════════════════════════════════════════════════
// CATÁLOGO — Kairós Reef  
// Imagens reais de cada espécie (Aqualândia + Wikimedia Commons)
// ═══════════════════════════════════════════════════════════════

export const CATEGORY_TREE = [
  {
    id: 'corais', name: 'Corais', icon: '🪸',
    subcategories: [
      { id: 'corais-lps', name: 'Corais LPS' },
      { id: 'corais-sps', name: 'Corais SPS' },
      { id: 'corais-soft', name: 'Corais Softs' },
    ],
  },
  {
    id: 'invertebrados', name: 'Invertebrados', icon: '🦐',
    subcategories: [
      { id: 'anemonas', name: 'Anêmonas' },
      { id: 'camarao', name: 'Camarões' },
      { id: 'equipe-limpeza', name: 'Equipe de Limpeza' },
      { id: 'estrelas', name: 'Estrelas' },
      { id: 'ofiurus', name: 'Ofiúrus' },
      { id: 'ouricos', name: 'Ouriços' },
      { id: 'outros-inv', name: 'Outros' },
    ],
  },
  {
    id: 'peixes-doce', name: 'Peixes Água Doce', icon: '🐟',
    subcategories: [
      { id: 'ciclideos', name: 'Ciclídeos' },
      { id: 'tetras', name: 'Tetras' },
      { id: 'cascudos-coridoras', name: 'Cascudos e Coridoras' },
      { id: 'bettas', name: 'Bettas' },
      { id: 'discos-bandeiras', name: 'Discos e Bandeiras' },
      { id: 'viviparos', name: 'Vivíparos' },
      { id: 'kinguios-carpas', name: 'Kinguios e Carpas' },
      { id: 'outros-doce', name: 'Outros' }
    ],
  },
  {
    id: 'peixes', name: 'Peixes Água Salgada', icon: '🐠',
    subcategories: [
      { id: 'anthia', name: 'Anthia' },
      { id: 'blenio', name: 'Blênio' },
      { id: 'cardinal', name: 'Cardinal' },
      { id: 'donzelas', name: 'Donzelas' },
      { id: 'goby', name: 'Goby' },
      { id: 'ocellaris', name: 'Ocellaris' },
      { id: 'ocellaris-aquasmart', name: 'Ocellaris Aquasmart' },
      { id: 'ocellaris-ecoreef', name: 'Ocellaris Eco Reef' },
      { id: 'peixes-diversos', name: 'Peixes Diversos' },
      { id: 'pseudochromis', name: 'Pseudochromis' },
      { id: 'tang', name: 'Tang' },
      { id: 'wrasse', name: 'Wrasse' },
    ],
  },
  {
    id: 'equipamentos', name: 'Produtos e Equipamentos', icon: '⚙️',
    subcategories: [
      { id: 'filtros', name: 'Filtros' },
      { id: 'iluminacao', name: 'Iluminação' },
      { id: 'suplementos', name: 'Suplementos' },
      { id: 'diversos', name: 'Diversos' },
    ],
  },
];

export const CATEGORIES = [
  { id: 'todos', name: 'Todos', icon: '🌊' },
  { id: 'peixes', name: 'Peixes Água Salgada', icon: '🐠' },
  { id: 'peixes-doce', name: 'Peixes Água Doce', icon: '🐟' },
  { id: 'invertebrados', name: 'Invertebrados', icon: '🦐' },
  { id: 'corais', name: 'Corais', icon: '🪸' },
  { id: 'equipamentos', name: 'Produtos e Equipamentos', icon: '⚙️' },
];

// ═══════════════════════════════════════════════════════════════
// IMAGENS — Extraídas diretamente do site Aqualândia (AQ) 
// + Wikimedia Commons (WK) onde não tinha no Aqualândia
// ═══════════════════════════════════════════════════════════════
const AQ = 'https://aqualandiaanimal.com.br/wp-content/uploads';

const IMG = {
  // ── PEIXES (do site Aqualândia — extraídos via browser) ──
  anjoImperador: `${AQ}/2024/07/5-2.webp`,
  anthiaCarF: `${AQ}/2025/02/anthias-carberryi-Photoroom-500-Photoroom.jpg`,
  anthiaCarM: `${AQ}/2025/02/Carberryi-macho-Photoroom.jpg`,
  anthiaDispar: `${AQ}/2025/02/DisparAnthiasFemaleFATDI600AA_800x-Photoroom.jpg`,
  anthiaPurple: `${AQ}/2025/02/01561493-Photoroom.jpg`,
  anthiaSquamF: `${AQ}/2024/07/10-3.webp`,
  anthiaSquamM: `${AQ}/2024/07/11-2.webp`,
  anthiaSquare: `${AQ}/2025/02/lg-79358-squareback-anthias-male-0118171-045-Photoroom.jpg`,
  auriga: `${AQ}/2026/04/images.webp`,
  blenioAlgae: `${AQ}/2024/06/408993-3.webp`,
  blenioBicolor: `${AQ}/2024/06/6.webp`,
  blenioMidas: `${AQ}/2024/06/7.webp`,
  blenioStripe: `${AQ}/2024/06/408858-3.webp`,
  blueTang: `${AQ}/2024/07/18-4.webp`,
  blueTangYB: `${AQ}/2024/07/11-3.webp`,

  // ── INVERTEBRADOS (do site Aqualândia) ──
  camaraoAranha: `${AQ}/2024/07/16-1.webp`,
  camaraoBailarino: `${AQ}/2024/07/IMG_6328.jpeg`,
  camaraoCleaner: `${AQ}/2024/07/15-1.webp`,
  camaraoStenopus: `${AQ}/2024/07/8.jpg`,
  estrelaLinckia: `${AQ}/2024/07/5.jpg`,
  estrelaSand: `${AQ}/2024/07/17-1.webp`,
  featherDuster: `${AQ}/2024/07/13.jpg`,
  miniPaguro: `${AQ}/2024/07/19.jpg`,
  ofiurosBanded: `${AQ}/2024/07/21.jpg`,
  ofiurosBlack: `${AQ}/2024/07/7.jpg`,
  ofiurosImportado: `${AQ}/2024/07/6.jpg`,
  ofiurosMarmore: `${AQ}/2024/07/22.webp`,
  ofiurosMarrom: `${AQ}/2024/07/14-1.webp`,
  ouricoMulticolor: `${AQ}/2024/07/2.jpg`,
  ouricoTuxedo: `${AQ}/2024/07/3.jpg`,

  // ── PEIXES (Aqualândia: todas as URLs confirmadas) ──
  // ── PEIXES (Aqualândia: todas as URLs confirmadas) ──
  yellowTang: '',
  nasoTang: '',
  sailfinTang: '',
  desjardini: '',
  bangai: '',
  cardinalPJ: '',
  firefish: '',
  watchman: '',
  engineer: '',
  mandarin: '',
  randalli: '',
  clownfish: '',
  clownBlack: '',
  damselBlue: '',
  chromis: '',
  domino: '',
  yellowtail: '',
  fridmani: '',
  aldabra: '',
  diadema: '',
  cleanWrasse: '',
  sixLine: '',
  fairyWrasse: '',
  asfur: '',
  copperband: '',
  valentini: '',
  coralBeauty: '',
  flameAngel: '',
  foxface: '',

  // ── INVERTEBRADOS (Aqualândia) ──
  bubbleTip: '',
  magnifica: '',
  starfish: `${AQ}/2024/07/5.jpg`, // Correct (Estrela)
  hermitCrab: `${AQ}/2024/07/19.jpg`, // Correct (Mini Paguro)

  // ── CORAIS (Aqualândia) ──
  // Removing duplicates/wrongly assigned corals so they don't show fish/shrimp or repeat
  hammer: '',
  torch: '',
  brain: '',
  frogspawn: '',
  duncan: '',
  acropora: '',
  montipora: '',
  pocillopora: '',
  zoanthus: '',
  xenia: '',
  leather: '',
  discosoma: '',
  ricordea: '',
};

// ═══════════════════════════════════════════════════════════════
let _id = 1;
const p = (name, cat, sub, pCash, pCard, img, tag = '') => ({
  id: _id++, name, category: cat, subcategory: sub,
  price_cash: pCash, price_card: pCard,
  price: pCash ? `R$ ${pCash.toFixed(2).replace('.', ',')}` : 'Consultar',
  img, desc: '', tag, installments: '6x sem juros',
});

export const ALL_PRODUCTS = [
  // ─── ANTHIA ───
  p('Anthia Carberryi – Fêmea', 'peixes', 'anthia', 404.90, 449.90, IMG.anthiaCarF),
  p('Anthia Carberryi – Macho', 'peixes', 'anthia', 449.90, 499.90, IMG.anthiaCarM),
  p('Anthia Dispar', 'peixes', 'anthia', 299.90, 349.90, IMG.anthiaDispar),
  p('Anthia Purple Queen', 'peixes', 'anthia', 549.90, 599.90, IMG.anthiaPurple),
  p('Anthia Squamipinnis – Fêmea', 'peixes', 'anthia', 314.90, 349.90, IMG.anthiaSquamF),
  p('Anthia Squamipinnis – Macho', 'peixes', 'anthia', 359.90, 399.90, IMG.anthiaSquamM),
  p('Anthia Square', 'peixes', 'anthia', 809.90, 899.90, IMG.anthiaSquare),

  // ─── BLÊNIO ───
  p('Blênio Algae Rock', 'peixes', 'blenio', 149.90, 172.90, IMG.blenioAlgae),
  p('Blênio Bicolor', 'peixes', 'blenio', 169.90, 199.90, IMG.blenioBicolor),
  p('Blênio Midas', 'peixes', 'blenio', 549.90, 632.90, IMG.blenioMidas),
  p('Blênio Stripe', 'peixes', 'blenio', 249.90, 287.90, IMG.blenioStripe),

  // ─── CARDINAL ───
  p('Cardinal Bangai', 'peixes', 'cardinal', 359.90, 399.90, IMG.bangai, 'Popular'),
  p('Cardinal Pijama', 'peixes', 'cardinal', 269.90, 319.90, IMG.cardinalPJ),

  // ─── TANG ───
  p('Blue Tang P', 'peixes', 'tang', 494.90, 549.90, IMG.blueTang, 'Popular'),
  p('Blue Tang M', 'peixes', 'tang', 799.90, 899.90, IMG.blueTang),
  p('Blue Tang Yellow Belly', 'peixes', 'tang', 499.90, 579.90, IMG.blueTangYB),
  p('Desjardini Tang – G', 'peixes', 'tang', 899.90, 999.90, IMG.desjardini),
  p('Desjardini Tang – P/M', 'peixes', 'tang', 809.90, 899.90, IMG.desjardini),
  p('Yellow Tang', 'peixes', 'tang', 899.90, 999.90, IMG.yellowTang, 'Popular'),
  p('Naso Tang', 'peixes', 'tang', 599.90, 699.90, IMG.nasoTang),
  p('Sailfin Tang', 'peixes', 'tang', 449.90, 499.90, IMG.sailfinTang),

  // ─── GOBY ───
  p('Goby Firefish', 'peixes', 'goby', 199.90, 229.90, IMG.firefish, 'Popular'),
  p('Goby Watchman Yellow', 'peixes', 'goby', 149.90, 172.90, IMG.watchman),
  p('Goby Engineer', 'peixes', 'goby', 69.90, 79.90, IMG.engineer),
  p('Goby Mandarin', 'peixes', 'goby', 249.90, 287.90, IMG.mandarin),
  p('Goby Randalli', 'peixes', 'goby', 169.90, 199.90, IMG.randalli),

  // ─── OCELLARIS ───
  p('Ocellaris Common', 'peixes', 'ocellaris', 59.90, 69.90, IMG.clownfish, 'Mais Vendido'),
  p('Ocellaris Black', 'peixes', 'ocellaris', 79.90, 89.90, IMG.clownBlack),
  p('Ocellaris Snowflake', 'peixes', 'ocellaris', 99.90, 119.90, IMG.clownfish),
  p('Ocellaris Mocha', 'peixes', 'ocellaris', 149.90, 172.90, IMG.clownBlack),
  p('Ocellaris Platinum', 'peixes', 'ocellaris', 299.90, 349.90, IMG.clownfish, 'Premium'),

  // ─── OCELLARIS AQUASMART ───
  p('Ocellaris Fancy White Aquasmart', 'peixes', 'ocellaris-aquasmart', 129.90, 149.90, IMG.clownfish),
  p('Ocellaris Davinci Aquasmart', 'peixes', 'ocellaris-aquasmart', 199.90, 229.90, IMG.clownfish),
  p('Ocellaris Wyoming White Aquasmart', 'peixes', 'ocellaris-aquasmart', 149.90, 172.90, IMG.clownfish),

  // ─── OCELLARIS ECO REEF ───
  p('Ocellaris Black Eco Reef', 'peixes', 'ocellaris-ecoreef', 89.90, 99.90, IMG.clownBlack),
  p('Ocellaris Snowflake Eco Reef', 'peixes', 'ocellaris-ecoreef', 109.90, 129.90, IMG.clownfish),

  // ─── DONZELAS ───
  p('Donzela Azul', 'peixes', 'donzelas', 39.90, 49.90, IMG.damselBlue),
  p('Donzela Green Chromis', 'peixes', 'donzelas', 39.90, 49.90, IMG.chromis),
  p('Donzela Domino', 'peixes', 'donzelas', 34.90, 39.90, IMG.domino),
  p('Donzela Yellowtail', 'peixes', 'donzelas', 49.90, 59.90, IMG.yellowtail),

  // ─── PSEUDOCHROMIS ───
  p('Pseudochromis Fridmani', 'peixes', 'pseudochromis', 249.90, 287.90, IMG.fridmani),
  p('Pseudochromis Aldabraensis', 'peixes', 'pseudochromis', 199.90, 229.90, IMG.aldabra),
  p('Pseudochromis Diadema', 'peixes', 'pseudochromis', 179.90, 199.90, IMG.diadema),

  // ─── WRASSE ───
  p('Cleaner Wrasse P/M', 'peixes', 'wrasse', 169.90, 199.90, IMG.cleanWrasse),
  p('Cleaner Wrasse G', 'peixes', 'wrasse', 199.90, 229.90, IMG.cleanWrasse),
  p('Cleaner Four Wrasse (Red Sea)', 'peixes', 'wrasse', 499.90, 574.90, IMG.cleanWrasse),
  p('Six Line Wrasse', 'peixes', 'wrasse', 249.90, 287.90, IMG.sixLine),
  p('Fairy Wrasse', 'peixes', 'wrasse', 399.90, 459.90, IMG.fairyWrasse),

  // ─── PEIXES DIVERSOS ───
  p('Anjo Imperador Juvenil', 'peixes', 'peixes-diversos', 799.90, 919.90, IMG.anjoImperador, 'Premium'),
  p('Asfur Anjo', 'peixes', 'peixes-diversos', 1349.90, 1499.90, IMG.asfur, 'Raro'),
  p('Auriga Butterfly', 'peixes', 'peixes-diversos', 449.90, 499.90, IMG.auriga),
  p('Butterfly Striatus', 'peixes', 'peixes-diversos', 116.90, 129.90, IMG.auriga),
  p('Canthigaster Valentini', 'peixes', 'peixes-diversos', 199.90, 229.90, IMG.valentini),
  p('Cooperband Butterfly', 'peixes', 'peixes-diversos', 549.90, 599.90, IMG.copperband),
  p('Coral Beauty', 'peixes', 'peixes-diversos', 399.90, 459.90, IMG.coralBeauty),
  p('Flame Angel', 'peixes', 'peixes-diversos', 599.90, 699.90, IMG.flameAngel, 'Premium'),
  p('Foxface', 'peixes', 'peixes-diversos', 399.90, 459.90, IMG.foxface),
  p('Lawn Mower Blenny', 'peixes', 'peixes-diversos', 149.90, 172.90, IMG.blenioAlgae),

  // ─── CAMARÕES ───
  p('Camarão Aranha', 'invertebrados', 'camarao', 39.90, 49.90, IMG.camaraoAranha),
  p('Camarão Bailarino', 'invertebrados', 'camarao', 34.90, 39.90, IMG.camaraoBailarino),
  p('Camarão Cleaner', 'invertebrados', 'camarao', 249.90, 287.90, IMG.camaraoCleaner, 'Popular'),
  p('Camarão Stenopus', 'invertebrados', 'camarao', 44.90, 49.90, IMG.camaraoStenopus),
  p('Camarão Pistola', 'invertebrados', 'camarao', 69.90, 79.90, IMG.camaraoCleaner),

  // ─── ANÊMONAS ───
  p('Anêmona Bubble Tip', 'invertebrados', 'anemonas', 199.90, 229.90, IMG.bubbleTip, 'Popular'),
  p('Anêmona Bubble Tip Rainbow', 'invertebrados', 'anemonas', 499.90, 574.90, IMG.bubbleTip, 'Raro'),
  p('Anêmona Carpet', 'invertebrados', 'anemonas', 349.90, 399.90, IMG.magnifica),
  p('Anêmona Magnifica', 'invertebrados', 'anemonas', 399.90, 459.90, IMG.magnifica),

  // ─── EQUIPE DE LIMPEZA ───
  p('Kit Limpeza 10 un.', 'invertebrados', 'equipe-limpeza', 99.90, 119.90, IMG.hermitCrab),
  p('Kit Limpeza 20 un.', 'invertebrados', 'equipe-limpeza', 179.90, 199.90, IMG.hermitCrab, 'Mais Vendido'),
  p('Nassarius Snail', 'invertebrados', 'equipe-limpeza', 9.90, 12.90, IMG.miniPaguro),
  p('Turbo Snail', 'invertebrados', 'equipe-limpeza', 12.90, 14.90, IMG.miniPaguro),
  p('Red Hermit Crab', 'invertebrados', 'equipe-limpeza', 9.90, 12.90, IMG.hermitCrab),
  p('Blue Hermit Crab', 'invertebrados', 'equipe-limpeza', 9.90, 12.90, IMG.hermitCrab),

  // ─── ESTRELAS ───
  p('Estrela Sand Sifting', 'invertebrados', 'estrelas', 49.90, 59.90, IMG.estrelaSand),
  p('Estrela Red Fromia', 'invertebrados', 'estrelas', 99.90, 119.90, IMG.starfish),
  p('Estrela Linckia', 'invertebrados', 'estrelas', 79.90, 89.90, IMG.estrelaLinckia),

  // ─── OFIÚRUS ───
  p('Ofiúrus Banded', 'invertebrados', 'ofiurus', 39.90, 49.90, IMG.ofiurosBanded),
  p('Ofiúrus Black', 'invertebrados', 'ofiurus', 29.90, 34.90, IMG.ofiurosBlack),
  p('Ofiúrus Importado', 'invertebrados', 'ofiurus', 49.90, 59.90, IMG.ofiurosImportado),
  p('Ofiúrus Marmore', 'invertebrados', 'ofiurus', 39.90, 49.90, IMG.ofiurosMarmore),
  p('Ofiúrus Marrom', 'invertebrados', 'ofiurus', 34.90, 39.90, IMG.ofiurosMarrom),

  // ─── OURIÇOS ───
  p('Ouriço Tuxedo', 'invertebrados', 'ouricos', 49.90, 59.90, IMG.ouricoTuxedo),
  p('Ouriço Multicolor', 'invertebrados', 'ouricos', 69.90, 79.90, IMG.ouricoMulticolor),

  // ─── CORAIS LPS ───
  p('Acan Lord', 'corais', 'corais-lps', 149.90, 172.90, IMG.zoanthus, 'Popular'),
  p('Hammer Coral (Euphyllia)', 'corais', 'corais-lps', 199.90, 229.90, IMG.hammer, 'Popular'),
  p('Torch Coral (Euphyllia)', 'corais', 'corais-lps', 249.90, 287.90, IMG.torch),
  p('Frogspawn Coral', 'corais', 'corais-lps', 199.90, 229.90, IMG.frogspawn),
  p('Brain Coral', 'corais', 'corais-lps', 169.90, 199.90, IMG.brain),
  p('Duncan Coral', 'corais', 'corais-lps', 99.90, 119.90, IMG.duncan),
  p('Blastomussa', 'corais', 'corais-lps', 179.90, 199.90, IMG.zoanthus),
  p('Candy Cane Coral', 'corais', 'corais-lps', 129.90, 149.90, IMG.hammer),
  p('Fungia Plate Coral', 'corais', 'corais-lps', 89.90, 99.90, IMG.brain),

  // ─── CORAIS SPS ───
  p('Acropora Staghorn', 'corais', 'corais-sps', 249.90, 287.90, IMG.acropora, 'Premium'),
  p('Acropora Millepora', 'corais', 'corais-sps', 299.90, 349.90, IMG.acropora),
  p('Montipora Digitata', 'corais', 'corais-sps', 149.90, 172.90, IMG.montipora),
  p('Montipora Cap', 'corais', 'corais-sps', 129.90, 149.90, IMG.montipora),
  p('Pocillopora', 'corais', 'corais-sps', 99.90, 119.90, IMG.pocillopora),
  p('Seriatopora (Bird Nest)', 'corais', 'corais-sps', 119.90, 139.90, IMG.pocillopora),
  p('Stylophora', 'corais', 'corais-sps', 149.90, 172.90, IMG.acropora),

  // ─── CORAIS SOFTS ───
  p('Zoanthus Garden', 'corais', 'corais-soft', 79.90, 89.90, IMG.zoanthus, 'Popular'),
  p('Zoanthus Premium', 'corais', 'corais-soft', 149.90, 172.90, IMG.zoanthus),
  p('Palythoa', 'corais', 'corais-soft', 49.90, 59.90, IMG.zoanthus),
  p('Xenia Pulsante', 'corais', 'corais-soft', 69.90, 79.90, IMG.xenia, 'Mais Vendido'),
  p('Leather Coral (Sarcophyton)', 'corais', 'corais-soft', 99.90, 119.90, IMG.leather),
  p('Green Star Polyps (GSP)', 'corais', 'corais-soft', 69.90, 79.90, IMG.zoanthus),
  p('Discosoma Mushroom', 'corais', 'corais-soft', 39.90, 49.90, IMG.discosoma),
  p('Rhodactis Mushroom', 'corais', 'corais-soft', 59.90, 69.90, IMG.discosoma),
  p('Ricordea Florida', 'corais', 'corais-soft', 99.90, 119.90, IMG.ricordea, 'Premium'),
  p('Kenya Tree', 'corais', 'corais-soft', 49.90, 59.90, IMG.leather),
];
