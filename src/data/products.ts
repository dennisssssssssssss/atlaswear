import {
  getLocalizedText,
  localize,
  type Lang,
  type LocalizedText,
} from '@/lib/i18n';

export { getLocalizedText } from '@/lib/i18n';

export type Category = 'dresses' | 'clothing' | 'bags' | 'shoes';

export interface ProductColor {
  id: string;
  name: LocalizedText;
  hex: string;
}

export interface Product {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  details: LocalizedText[];
  priceUSD: number;
  category: Category;
  images: string[];
  imageFit: 'contain' | 'cover';
  youtubeUrl?: string;
  sizes: string[];
  colors: ProductColor[];
  featured: boolean;
  onSale: boolean;
  salePrice?: number;
}

export interface ProductCategory {
  id: Category;
  label: LocalizedText;
  image: string;
}

const catalog = (fileName: string) => `/catalog/${fileName}`;

export const categories: ProductCategory[] = [
  {
    id: 'dresses',
    label: localize('Dresses', 'Rochii'),
    image: catalog('zimmermann-blossom-corset-midi.jpg'),
  },
  {
    id: 'clothing',
    label: localize('Sets & Separates', 'Seturi si piese'),
    image: catalog('miumiu-polo-skirt-set.jpg'),
  },
  {
    id: 'bags',
    label: localize('Bags', 'Posete'),
    image: catalog('prada-bonnie-buckle-tote.jpg'),
  },
  {
    id: 'shoes',
    label: localize('Shoes', 'Pantofi'),
    image: catalog('lv-sneakerina-ballet-sneaker.jpg'),
  },
];

const color = (
  id: string,
  en: string,
  ro: string,
  hex: string,
): ProductColor => ({
  id,
  name: localize(en, ro),
  hex,
});

export const getProductPrice = (product: Product) =>
  product.onSale && product.salePrice ? product.salePrice : product.priceUSD;

export const getProductColor = (product: Product, colorId: string) =>
  product.colors.find((entry) => entry.id === colorId);

export const getProductColorLabel = (
  product: Product,
  colorId: string,
  lang: Lang,
) => {
  const entry = getProductColor(product, colorId);
  return entry ? getLocalizedText(entry.name, lang) : colorId;
};

const dressSizes = ['XS', 'S', 'M', 'L'];
const setSizes = ['XS', 'S', 'M', 'L', 'XL'];
const bagSizes = ['One Size'];

export const products: Product[] = [
  {
    id: 'zimmermann-scarlet-organza-mini',
    name: localize(
      'Zimmermann Scarlet Organza Mini',
      'Rochie Zimmermann Scarlet Organza Mini',
    ),
    description: localize(
      'A dramatic mini with a fitted corset feel, sheer sleeves, and a bright scarlet finish built for statement evening styling.',
      'O mini-rochie spectaculoasa, cu aer de corset, maneci transparente si un rosu intens, perfecta pentru aparitii de seara.',
    ),
    details: [
      localize('Structured bodice with sheer volume', 'Bust structurat cu volum transparent'),
      localize('Short statement silhouette for events', 'Silueta mini statement pentru evenimente'),
      localize('Launch-price category favorite', 'Una dintre cele mai tari piese la pret de lansare'),
    ],
    priceUSD: 589,
    salePrice: 269,
    category: 'dresses',
    images: [catalog('zimmermann-scarlet-organza-mini.jpg')],
    imageFit: 'cover',
    sizes: dressSizes,
    colors: [color('scarlet', 'Scarlet Red', 'Rosu scarlet', '#B71C1C')],
    featured: false,
    onSale: true,
  },
  {
    id: 'zimmermann-blossom-corset-midi',
    name: localize(
      'Zimmermann Blossom Corset Midi',
      'Rochie Zimmermann Blossom Corset Midi',
    ),
    description: localize(
      'A soft floral midi with tied shoulders, corset shaping, and a romantic resort look that reads instantly premium.',
      'O rochie midi florala, cu bretele legate si talie de inspiratie corset, cu aer romantic si premium.',
    ),
    details: [
      localize('Romantic floral palette with soft peach base', 'Paleta florala romantica pe baza peach'),
      localize('Defined waist and fuller skirt line', 'Talie definita si fusta ampla'),
      localize('Easy hero piece for daytime luxury styling', 'Piesa hero foarte buna pentru styling feminin de zi'),
    ],
    priceUSD: 729,
    salePrice: 329,
    category: 'dresses',
    images: [catalog('zimmermann-blossom-corset-midi.jpg')],
    imageFit: 'cover',
    sizes: dressSizes,
    colors: [color('peach-floral', 'Peach Floral', 'Peach floral', '#E9B9A8')],
    featured: true,
    onSale: true,
  },
  {
    id: 'zimmermann-leopard-corset-midi',
    name: localize(
      'Zimmermann Leopard Corset Midi',
      'Rochie Zimmermann Leopard Corset Midi',
    ),
    description: localize(
      'A clean corset midi with leopard print impact, fine straps, and an elevated silhouette that balances boldness with polish.',
      'O rochie midi cu print leopard, linii curate si bretele fine, care combina impactul vizual cu un look foarte bine finisat.',
    ),
    details: [
      localize('Leopard print with dressy structure', 'Print leopard pe constructie eleganta'),
      localize('Flattering fitted top with fluid volume', 'Partea de sus mulata cu volum fluid in fusta'),
      localize('Strong editorial piece for the women edit', 'Piesa editoriala puternica pentru editia de femei'),
    ],
    priceUSD: 759,
    salePrice: 349,
    category: 'dresses',
    images: [catalog('zimmermann-leopard-corset-midi.jpg')],
    imageFit: 'cover',
    sizes: dressSizes,
    colors: [color('leopard', 'Leopard', 'Leopard', '#8A5C3B')],
    featured: true,
    onSale: true,
  },
  {
    id: 'miumiu-ruffled-poplin-blouse',
    name: localize(
      'Miu Miu Ruffled Poplin Blouse',
      'Bluza Miu Miu Ruffled Poplin',
    ),
    description: localize(
      'A light feminine blouse with ruffled finishing, soft structure, and an easy premium-casual attitude for spring dressing.',
      'O bluza feminina cu finisaje cu volan, structura usoara si un vibe premium-casual foarte usor de purtat.',
    ),
    details: [
      localize('Ruffled collar and cuffs', 'Guler si mansete cu volan'),
      localize('Works as a refined standalone top', 'Functioneaza foarte bine ca top principal'),
      localize('Best paired with clean skirts or denim', 'Merge foarte bine cu fuste curate sau denim'),
    ],
    priceUSD: 289,
    salePrice: 149,
    category: 'clothing',
    images: [catalog('miumiu-ruffled-poplin-blouse.jpg')],
    imageFit: 'contain',
    sizes: setSizes,
    colors: [
      color('white', 'White', 'Alb', '#F7F7F4'),
      color('ice-blue', 'Ice Blue', 'Albastru pal', '#E4EFF4'),
    ],
    featured: false,
    onSale: true,
  },
  {
    id: 'miumiu-crystal-lounge-pant',
    name: localize(
      'Miu Miu Crystal Lounge Pant',
      'Pantalon Miu Miu Crystal Lounge',
    ),
    description: localize(
      'A relaxed wide-leg pant with subtle sparkle detailing and a soft lounge silhouette elevated for premium daywear.',
      'Un pantalon wide-leg relaxat, cu detalii discrete stralucitoare si o silueta lejera ridicata spre zona premium.',
    ),
    details: [
      localize('Wide-leg shape with easy drape', 'Croiala wide-leg cu cadere usoara'),
      localize('Soft embellished side finish', 'Finisaj discret decorativ pe lateral'),
      localize('Good anchor piece for soft monochrome outfits', 'Piesa foarte buna pentru tinute monocrome soft'),
    ],
    priceUSD: 239,
    salePrice: 129,
    category: 'clothing',
    images: [catalog('miumiu-crystal-lounge-pant.jpg')],
    imageFit: 'contain',
    sizes: setSizes,
    colors: [
      color('butter', 'Butter Cream', 'Crem unt', '#F2E6B4'),
      color('ice-blue', 'Ice Blue', 'Albastru pal', '#BFD9E2'),
    ],
    featured: false,
    onSale: true,
  },
  {
    id: 'miumiu-polo-skirt-set',
    name: localize(
      'Miu Miu Stripe Trim Polo Set',
      'Set Miu Miu Stripe Trim Polo',
    ),
    description: localize(
      'A sporty-luxe two-piece with a clean polo top and matching skirt, designed for a younger polished look.',
      'Un set sporty-luxe din doua piese, cu top polo si fusta asortata, gandit pentru un look tineresc si bine finisat.',
    ),
    details: [
      localize('Matching top and skirt styling', 'Styling complet cu top si fusta'),
      localize('Contrast trim for a collegiate finish', 'Contrast discret pentru un aer colegial premium'),
      localize('Very strong for social-first product drops', 'Foarte bun pentru lansari si content social'),
    ],
    priceUSD: 319,
    salePrice: 169,
    category: 'clothing',
    images: [catalog('miumiu-polo-skirt-set.jpg')],
    imageFit: 'contain',
    sizes: setSizes,
    colors: [
      color('cream', 'Cream', 'Crem', '#F5F1E8'),
      color('navy', 'Navy', 'Bleumarin', '#1F243D'),
    ],
    featured: true,
    onSale: true,
  },
  {
    id: 'prada-bonnie-buckle-tote',
    name: localize(
      'Prada Bonnie Buckle Tote',
      'Poseta Prada Bonnie Buckle Tote',
    ),
    description: localize(
      'A polished east-west tote with glossy leather, structured handles, and the kind of silhouette that reads current and expensive.',
      'O poseta east-west cu piele lucioasa, manere structurate si o silueta foarte actuala, cu aer clar premium.',
    ),
    details: [
      localize('Strong east-west tote direction', 'Directie east-west foarte puternica'),
      localize('Glossy burgundy finish with hardware accents', 'Finisaj burgundy lucios cu accente metalice'),
      localize('Chosen as a key high-interest women bag', 'Aleasa ca una dintre gentile cu cel mai bun potential de interes'),
    ],
    priceUSD: 2900,
    salePrice: 849,
    category: 'bags',
    images: [catalog('prada-bonnie-buckle-tote.jpg')],
    imageFit: 'cover',
    sizes: bagSizes,
    colors: [color('oxblood', 'Oxblood', 'Bordo inchis', '#4F1F24')],
    featured: true,
    onSale: true,
  },
  {
    id: 'prada-shearling-hobo',
    name: localize(
      'Prada Shearling Hobo',
      'Poseta Prada Shearling Hobo',
    ),
    description: localize(
      'A soft hobo shape with plush texture and a creamy neutral palette that feels warmer, softer, and more lifestyle-driven.',
      'O poseta hobo moale, cu textura plush si paleta crem, potrivita pentru un look mai cald si mai lifestyle.',
    ),
    details: [
      localize('Soft crescent hobo profile', 'Profil hobo moale, in forma de semiluna'),
      localize('Cream shearling finish', 'Finisaj crem cu efect shearling'),
      localize('Ideal as a softer seasonal bag option', 'Foarte buna ca varianta mai soft si mai cozy'),
    ],
    priceUSD: 2190,
    salePrice: 689,
    category: 'bags',
    images: [catalog('prada-shearling-hobo.jpg')],
    imageFit: 'cover',
    sizes: bagSizes,
    colors: [color('cream', 'Cream', 'Crem', '#D8C7A0')],
    featured: false,
    onSale: true,
  },
  {
    id: 'ysl-le-5-a-7-shoulder-bag',
    name: localize(
      'Saint Laurent Le 5 a 7 Shoulder Bag',
      'Poseta Saint Laurent Le 5 a 7',
    ),
    description: localize(
      'A sleek shoulder bag with a compact east-west line and minimal hardware presence, made to convert with clean day-to-night styling.',
      'O poseta de umar supla, cu linie east-west compacta si hardware minimalist, foarte buna pentru styling de zi pana seara.',
    ),
    details: [
      localize('Compact east-west shoulder shape', 'Forma compacta east-west'),
      localize('Black grain texture with gold hardware', 'Textura granulata neagra cu hardware auriu'),
      localize('One of the strongest women bag silhouettes right now', 'Una dintre cele mai puternice siluete de geanta acum'),
    ],
    priceUSD: 2500,
    salePrice: 799,
    category: 'bags',
    images: [catalog('ysl-le-5-a-7-shoulder-bag.jpg')],
    imageFit: 'cover',
    sizes: bagSizes,
    colors: [color('black', 'Black', 'Negru', '#111111')],
    featured: true,
    onSale: true,
  },
  {
    id: 'ysl-niki-chain-bag',
    name: localize(
      'Saint Laurent Niki Chain Bag',
      'Poseta Saint Laurent Niki Chain',
    ),
    description: localize(
      'A softer quilted chain bag with rich texture and a darker finish that keeps it versatile, desirable, and easy to move in volume.',
      'O geanta matlasata, mai moale, cu textura bogata si finisaj inchis, usor de vandut datorita versatilitatii.',
    ),
    details: [
      localize('Supple quilted body with chain carry', 'Corp matlasat moale cu purtare pe lant'),
      localize('Clean black styling for easy conversion', 'Stil negru curat, usor de convertit'),
      localize('Good cross-over model for multiple age groups', 'Model foarte bun pentru mai multe categorii de cliente'),
    ],
    priceUSD: 3200,
    salePrice: 899,
    category: 'bags',
    images: [catalog('ysl-niki-chain-bag.jpg')],
    imageFit: 'cover',
    sizes: bagSizes,
    colors: [color('black', 'Black', 'Negru', '#151515')],
    featured: false,
    onSale: true,
  },
  {
    id: 'loewe-puzzle-biker-bag',
    name: localize(
      'Loewe Puzzle Biker Bag',
      'Poseta Loewe Puzzle Biker',
    ),
    description: localize(
      'A more directional take on the Puzzle family with sharp geometry, matte black leather, and a stronger editorial attitude.',
      'O interpretare mai puternica din familia Puzzle, cu geometrie clara, piele neagra mata si atitudine mai editoriala.',
    ),
    details: [
      localize('Angular body with statement strap detail', 'Corpul angular cu curea statement'),
      localize('Black leather finish with premium structure', 'Finisaj negru cu structura premium'),
      localize('Higher-ticket hero bag for the women edit', 'Geanta hero din zona premium pentru editia de femei'),
    ],
    priceUSD: 4400,
    salePrice: 1090,
    category: 'bags',
    images: [catalog('loewe-puzzle-biker-bag.jpg')],
    imageFit: 'cover',
    sizes: bagSizes,
    colors: [color('black', 'Black', 'Negru', '#141414')],
    featured: false,
    onSale: true,
  },
  {
    id: 'loewe-flamenco-soft-bag',
    name: localize(
      'Loewe Flamenco Soft Bag',
      'Poseta Loewe Flamenco Soft',
    ),
    description: localize(
      'A slouchy drawstring bag with a softer silhouette and olive tone that feels luxurious, contemporary, and easy to style.',
      'O geanta moale, cu silueta slouchy si ton olive, care arata luxos, contemporan si foarte usor de purtat.',
    ),
    details: [
      localize('Soft body with signature knot detail', 'Corp moale cu detaliu de nod specific'),
      localize('Olive tone for a refined neutral option', 'Nuanta olive pentru o optiune neutra rafinata'),
      localize('Excellent modern alternative to logo-heavy bags', 'Alternativa foarte buna la gentile prea incarcate vizual'),
    ],
    priceUSD: 3150,
    salePrice: 899,
    category: 'bags',
    images: [catalog('loewe-flamenco-soft-bag.jpg')],
    imageFit: 'cover',
    sizes: bagSizes,
    colors: [color('olive', 'Olive', 'Olive', '#4B5A48')],
    featured: true,
    onSale: true,
  },
  {
    id: 'lv-sneakerina-ballet-sneaker',
    name: localize(
      'Louis Vuitton Sneakerina Ballet Sneaker',
      'Sneaker Louis Vuitton Sneakerina Ballet',
    ),
    description: localize(
      'A feminine hybrid sneaker with ballet influence, soft cream suede, and blush detailing chosen for trend relevance and visual impact.',
      'Un sneaker feminin cu influenta de balerini, piele intoarsa crem si detalii blush, ales pentru trend si impact vizual.',
    ),
    details: [
      localize('Ballet-sneaker hybrid silhouette', 'Silueta hibrid intre balerini si sneaker'),
      localize('Soft neutral body with blush lacing', 'Corp neutru moale cu siret blush'),
      localize('Picked to match the strongest current footwear trend', 'Ales sa prinda unul dintre cele mai puternice trenduri actuale'),
    ],
    priceUSD: 920,
    salePrice: 329,
    category: 'shoes',
    images: [catalog('lv-sneakerina-ballet-sneaker.jpg')],
    imageFit: 'cover',
    sizes: ['35', '36', '37', '38', '39', '40', '41'],
    colors: [color('cream-blush', 'Cream / Blush', 'Crem / Blush', '#E7D7C5')],
    featured: true,
    onSale: true,
  },
  {
    id: 'lv-time-out-blush-sneaker',
    name: localize(
      'Louis Vuitton Time Out Blush Sneaker',
      'Sneaker Louis Vuitton Time Out Blush',
    ),
    description: localize(
      'A clean platform sneaker in blush and white, selected for broad appeal, easy styling, and high conversion potential.',
      'Un sneaker cu talpa inalta, in blush si alb, ales pentru atractivitate larga si potential bun de vanzare.',
    ),
    details: [
      localize('Platform sole with soft blush panels', 'Talpa inalta cu panouri blush'),
      localize('Easy everyday premium styling', 'Foarte usor de purtat zilnic in styling premium'),
      localize('Commercial colorway for broad customer appeal', 'Combinatie de culoare foarte comerciala'),
    ],
    priceUSD: 980,
    salePrice: 349,
    category: 'shoes',
    images: [catalog('lv-time-out-blush-sneaker.jpg')],
    imageFit: 'cover',
    sizes: ['35', '36', '37', '38', '39', '40', '41'],
    colors: [color('blush-white', 'Blush / White', 'Blush / Alb', '#D9C4BF')],
    featured: true,
    onSale: true,
  },
  {
    id: 'lv-groovy-platform-sneaker',
    name: localize(
      'Louis Vuitton Groovy Platform Sneaker',
      'Sneaker Louis Vuitton Groovy Platform',
    ),
    description: localize(
      'A stronger black platform sneaker that anchors the women edit with a darker, more street-led option.',
      'Un sneaker cu platforma, mai puternic si mai inchis, care aduce o varianta mai street in editia de femei.',
    ),
    details: [
      localize('Chunkier platform profile', 'Profil mai chunky cu platforma'),
      localize('Dark upper with clean white lace contrast', 'Upper inchis cu contrast alb la siret'),
      localize('Good counterweight to softer pastel pairs', 'Foarte bun ca balans fata de modelele pastelate'),
    ],
    priceUSD: 950,
    salePrice: 339,
    category: 'shoes',
    images: [catalog('lv-groovy-platform-sneaker.jpg')],
    imageFit: 'cover',
    sizes: ['35', '36', '37', '38', '39', '40', '41'],
    colors: [color('black', 'Black', 'Negru', '#101010')],
    featured: false,
    onSale: true,
  },
  {
    id: 'gucci-double-g-slide-white',
    name: localize(
      'Gucci Double G Slide',
      'Papuc Gucci Double G',
    ),
    description: localize(
      'A bright white slide with bold hardware, ideal as a fast-moving summer option with clean logo recognition.',
      'Un papuc alb curat, cu hardware puternic, foarte bun ca optiune de vara usor de vandut.',
    ),
    details: [
      localize('Clean white base with oversized hardware', 'Baza alba curata cu hardware mare'),
      localize('Simple summer-friendly silhouette', 'Silueta simpla, buna pentru vara'),
      localize('Strong entry-point luxury sandal', 'Varianta foarte buna ca sandal entry-point'),
    ],
    priceUSD: 690,
    salePrice: 239,
    category: 'shoes',
    images: [catalog('gucci-double-g-slide-white.jpg')],
    imageFit: 'cover',
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    colors: [color('white', 'White', 'Alb', '#F3F2ED')],
    featured: false,
    onSale: true,
  },
  {
    id: 'gucci-horsebit-mule-oxblood',
    name: localize(
      'Gucci Horsebit Mule',
      'Mule Gucci Horsebit',
    ),
    description: localize(
      'A sleek mule in oxblood leather with classic horsebit hardware, selected for its versatility and polished finish.',
      'Un mule elegant din piele bordo, cu hardware horsebit clasic, ales pentru versatilitate si finisaj curat.',
    ),
    details: [
      localize('Closed mule shape with timeless trim', 'Forma mule inchisa cu detaliu clasic'),
      localize('Rich oxblood tone for premium styling', 'Nuanta bordo bogata pentru styling premium'),
      localize('Easy match for minimalist wardrobes', 'Foarte usor de integrat in garderobe minimal'),
    ],
    priceUSD: 920,
    salePrice: 289,
    category: 'shoes',
    images: [catalog('gucci-horsebit-mule-oxblood.jpg')],
    imageFit: 'cover',
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: [color('oxblood', 'Oxblood', 'Bordo inchis', '#8C3B40')],
    featured: false,
    onSale: true,
  },
  {
    id: 'gucci-platform-loafer-rose',
    name: localize(
      'Gucci Platform Loafer',
      'Loafer Gucci Platform',
    ),
    description: localize(
      'A platform loafer with a soft rose finish and horsebit detail, chosen as a more fashion-forward option for the women page.',
      'Un loafer cu platforma, in nuanta rose, cu detaliu horsebit, ales ca optiune mai fashion-forward.',
    ),
    details: [
      localize('Loafer profile on a lifted sole', 'Profil de loafer pe talpa inalta'),
      localize('Soft rose tone with polished trim', 'Nuanta rose cu detalii bine finisate'),
      localize('Great crossover between casual and dressy looks', 'Trece foarte bine intre tinute casual si mai elegante'),
    ],
    priceUSD: 980,
    salePrice: 349,
    category: 'shoes',
    images: [catalog('gucci-platform-loafer-rose.jpg')],
    imageFit: 'cover',
    sizes: ['35', '36', '37', '38', '39', '40', '41', '42'],
    colors: [color('rose', 'Rose', 'Rose', '#BA6875')],
    featured: false,
    onSale: true,
  },
  {
    id: 'hermes-kelly-slide-black',
    name: localize(
      'Hermes Kelly Slide',
      'Papuc Hermes Kelly',
    ),
    description: localize(
      'A minimal leather slide with signature hardware and a darker premium finish that works as the cleanest sandal in the edit.',
      'Un papuc minimalist din piele, cu hardware specific si finisaj inchis, una dintre cele mai curate sandale din selectie.',
    ),
    details: [
      localize('Minimal leather strap with metal closure detail', 'Bareta minimalista din piele cu detaliu metalic'),
      localize('Black finish for broad styling range', 'Finisaj negru pentru o plaja larga de styling'),
      localize('High-conversion warm-weather luxury pair', 'Pereche foarte buna pentru sezonul cald si vanzare rapida'),
    ],
    priceUSD: 890,
    salePrice: 319,
    category: 'shoes',
    images: [catalog('hermes-kelly-slide-black.jpg')],
    imageFit: 'cover',
    sizes: ['35', '36', '37', '38', '39', '40', '41', '42'],
    colors: [color('black', 'Black', 'Negru', '#111111')],
    featured: true,
    onSale: true,
  },
];
