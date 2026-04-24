import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoDir = path.resolve(__dirname, '..');
const workspaceDir = path.resolve(repoDir, '..');
const outputPath = path.join(repoDir, 'src', 'data', 'women-catalog.ts');

const SOURCE_LABELS = {
  qiqiyg: { en: 'QiQiYG', ro: 'QiQiYG' },
  weifeng: { en: 'Weifeng', ro: 'Weifeng' },
  deshengxing: { en: 'Deshengxing', ro: 'Deshengxing' },
  '198maoyi': { en: '198 Maoyi', ro: '198 Maoyi' },
};

const SECTION_DEFS = [
  {
    id: 'dresses',
    label: { en: 'Dresses', ro: 'Rochii' },
    description: {
      en: 'Fashion dresses and special occasion lines gathered from the women source catalog.',
      ro: 'Rochii fashion si linii pentru ocazii speciale, adunate din catalogul complet de femei.',
    },
  },
  {
    id: 'clothing',
    label: { en: 'Clothing', ro: 'Imbracaminte' },
    description: {
      en: 'Sets, activewear, and premium women separates with a softer day-to-day feel.',
      ro: 'Seturi, activewear si piese premium de femei, cu un aer mai lejer pentru zi cu zi.',
    },
  },
  {
    id: 'bags',
    label: { en: 'Bags', ro: 'Genti' },
    description: {
      en: 'Handbags, shoulder bags, top-handle silhouettes, and travel-ready pieces.',
      ro: 'Posete, genti de umar, siluete top-handle si piese pregatite si pentru travel.',
    },
  },
  {
    id: 'shoes',
    label: { en: 'Shoes', ro: 'Pantofi' },
    description: {
      en: 'Women shoes, sandals, sneakers, mules, and low-profile styles from the full source set.',
      ro: 'Pantofi de dama, sandale, sneakers, mule si modele low-profile din setul complet de surse.',
    },
  },
  {
    id: 'accessories',
    label: { en: 'Accessories', ro: 'Accesorii' },
    description: {
      en: 'Jewelry, belts, scarves, eyewear, and smaller women add-ons.',
      ro: 'Bijuterii, curele, esarfe, eyewear si alte accesorii mici pentru femei.',
    },
  },
  {
    id: 'swimwear',
    label: { en: 'Swimwear', ro: 'Swimwear' },
    description: {
      en: 'Beach-ready women categories that sit outside the main dress and accessory edit.',
      ro: 'Categorii pentru plaja care stau separat de editia principala de rochii si accesorii.',
    },
  },
];

const MODEST_KEYWORDS = [
  'zimmermann',
  'max mara',
  'celine',
  'chanel',
  'dior',
  'loewe',
  'loro piana',
  'valentino',
  'burberry',
  'prada',
  'miumiu',
  'miu miu',
  'fendi',
  'polo',
  'thom browne',
  'vivienne westwood',
];

const ACCESSORY_ALLOWLIST = [
  'jewelry',
  'glasses',
  'plain glasses',
  'belts',
  'watches',
  'scarf',
  'hair band',
  'sunglasses',
  'perfume',
];

const WEIFENG_CONFIG = [
  { id: '4769316', titleEn: "Women's Sandals", titleRo: 'Sandale de dama' },
  { id: '4769313', titleEn: "Chanel Women's Shoes", titleRo: 'Pantofi Chanel de dama' },
  { id: '4769311', titleEn: "Louis Vuitton Women's Shoes", titleRo: 'Pantofi Louis Vuitton de dama' },
  { id: '4769309', titleEn: "Gucci Women's Shoes", titleRo: 'Pantofi Gucci de dama' },
  { id: '4769306', titleEn: "Christian Dior Women's Shoes", titleRo: 'Pantofi Christian Dior de dama' },
  { id: '4769304', titleEn: "Dior Women's Shoes", titleRo: 'Pantofi Dior de dama' },
  { id: '4769301', titleEn: "Versace Women's Shoes", titleRo: 'Pantofi Versace de dama' },
  { id: '4770256', titleEn: "Balenciaga Women's Shoes", titleRo: 'Pantofi Balenciaga de dama' },
  { id: '4769299', titleEn: "Alexander McQueen Women's Shoes", titleRo: 'Pantofi Alexander McQueen de dama' },
  { id: '4769297', titleEn: "Philipp Plein Women's Shoes", titleRo: 'Pantofi Philipp Plein de dama' },
  { id: '4769295', titleEn: "Ferragamo Women's Shoes", titleRo: 'Pantofi Ferragamo de dama' },
  { id: '4769293', titleEn: "Fendi Women's Shoes", titleRo: 'Pantofi Fendi de dama' },
  { id: '4769290', titleEn: "Dolce & Gabbana Women's Shoes", titleRo: 'Pantofi Dolce & Gabbana de dama' },
  { id: '4769287', titleEn: "Hermes Women's Shoes", titleRo: 'Pantofi Hermes de dama' },
  { id: '4769285', titleEn: "Prada Women's Shoes", titleRo: 'Pantofi Prada de dama' },
  { id: '4769283', titleEn: "Givenchy Women's Shoes", titleRo: 'Pantofi Givenchy de dama' },
  { id: '4769281', titleEn: "Burberry Women's Shoes", titleRo: 'Pantofi Burberry de dama' },
  { id: '4769279', titleEn: "Louboutin Women's Shoes", titleRo: 'Pantofi Louboutin de dama' },
  { id: '4769330', titleEn: "Miu Miu Women's Shoes", titleRo: 'Pantofi Miu Miu de dama' },
  { id: '4769318', titleEn: "Bottega Veneta Women's Shoes", titleRo: 'Pantofi Bottega Veneta de dama' },
  { id: '4769277', titleEn: "Jimmy Choo Women's Shoes", titleRo: 'Pantofi Jimmy Choo de dama' },
  { id: '4769276', titleEn: "Roger Vivier Women's Shoes", titleRo: 'Pantofi Roger Vivier de dama' },
  { id: '4769274', titleEn: "Tory Burch Women's Shoes", titleRo: 'Pantofi Tory Burch de dama' },
  { id: '4769272', titleEn: "Saint Laurent Women's Shoes", titleRo: 'Pantofi Saint Laurent de dama' },
  { id: '4769319', titleEn: "Celine Women's Shoes", titleRo: 'Pantofi Celine de dama' },
];

const DESHENGXING_CONFIG = [
  { id: '5048815', titleEn: 'UGG Boots & Cold Weather', titleRo: 'UGG pentru sezon rece' },
  { id: '4161011', titleEn: 'UGG Slides & Sandals', titleRo: 'UGG slides si sandale' },
  { id: '4161021', titleEn: 'Birkenstock Boston', titleRo: 'Birkenstock Boston' },
  { id: '113101', titleEn: 'Nike Slides & Sandals', titleRo: 'Nike slides si sandale' },
  { id: '4541246', titleEn: 'Adidas Slides', titleRo: 'Adidas slides' },
  { id: '5168454', titleEn: 'Bottega Veneta Shoes', titleRo: 'Pantofi Bottega Veneta' },
  { id: '5182069', titleEn: 'HOKA Running', titleRo: 'HOKA running' },
  { id: '5182084', titleEn: 'Rick Owens Series', titleRo: 'Seria Rick Owens' },
  { id: '5168432', titleEn: 'Maison Margiela Trainers', titleRo: 'Maison Margiela trainers' },
  { id: '5168423', titleEn: 'Fendi Match Sneakers', titleRo: 'Fendi Match sneakers' },
  { id: '2878193', titleEn: 'Amiri Skeleton Shoes', titleRo: 'Pantofi Amiri Skeleton' },
  { id: '5168419', titleEn: 'Lanvin Series', titleRo: 'Seria Lanvin' },
  { id: '5159087', titleEn: 'Loewe Ballet Runner', titleRo: 'Loewe Ballet Runner' },
  { id: '5159008', titleEn: 'Valentino Trainers', titleRo: 'Valentino trainers' },
  { id: '564210', titleEn: 'Golden Goose', titleRo: 'Golden Goose' },
  { id: '2950696', titleEn: 'LV & Hermes Slides', titleRo: 'LV si Hermes slides' },
  { id: '113109', titleEn: 'Gucci & Versace Slides', titleRo: 'Gucci si Versace slides' },
];

const MAOYI_CONFIG = [
  { id: '5101137', titleEn: 'Mary Jane Platforms', titleRo: 'Mary Jane cu platforma' },
  { id: '4600563', titleEn: 'Miu Miu 530 Sneakers', titleRo: 'Sneakers Miu Miu 530' },
  { id: '3581601', titleEn: '327 Sneakers', titleRo: 'Sneakers 327' },
  { id: '3532846', titleEn: '530 Sneakers', titleRo: 'Sneakers 530' },
  { id: '4616260', titleEn: '574 Platform', titleRo: '574 cu platforma' },
  { id: '4622075', titleEn: 'Chunky Dad Sneakers', titleRo: 'Dad sneakers chunky' },
];

const QIQIYG_SOURCES = [
  {
    cacheName: 'qiqiyg-dresses-page1.html',
    url: 'https://qiqiyg.com/categoryen_170.html?path=0_170',
    source: 'qiqiyg',
    section: 'dresses',
    filter: () => true,
    transform: (item) => {
      const lower = item.name.en.toLowerCase();
      const tags = [];

      if (lower.includes('bikini')) {
        item.section = 'swimwear';
      } else if (lower.includes('lululemon') || lower.includes('alo')) {
        item.section = 'clothing';
      }

      if (MODEST_KEYWORDS.some((keyword) => lower.includes(keyword))) {
        tags.push('modest');
      }

      item.tags = tags;
      item.featured = tags.includes('modest') || lower.includes('zimmermann');
      return item;
    },
  },
  {
    cacheName: 'qiqiyg-bags-home.html',
    url: 'https://bags.qiqiyg.com/',
    source: 'qiqiyg',
    section: 'bags',
    filter: (item) => !item.title.toLowerCase().includes('luggage'),
    transform: (item) => {
      item.featured = /chanel|dior|hermes|loewe|miumiu|prada|ysl/i.test(
        item.name.en,
      );
      return item;
    },
  },
  {
    cacheName: 'qiqiyg-acc-home.html',
    url: 'https://acc.qiqiyg.com/',
    source: 'qiqiyg',
    section: 'accessories',
    filter: (item) =>
      ACCESSORY_ALLOWLIST.some((keyword) =>
        item.title.toLowerCase().includes(keyword),
      ),
    transform: (item) => {
      item.featured = /jewelry|scarf|sunglasses/i.test(item.name.en);
      return item;
    },
  },
];

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function safeId(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function escapeTs(value) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, ' ')
    .trim();
}

function absoluteUrl(baseUrl, input) {
  return new URL(input, baseUrl).toString();
}

async function readCachedOrFetch(cacheName, url) {
  const cachePath = path.join(workspaceDir, cacheName);

  try {
    return await readFile(cachePath, 'utf8');
  } catch {
    const response = await fetch(url, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    return response.text();
  }
}

function localize(valueEn, valueRo = valueEn) {
  return {
    en: decodeHtml(valueEn),
    ro: decodeHtml(valueRo),
  };
}

function qiqiygRoTitle(title) {
  return title
    .replace(/^New Arrival/i, 'Noutati')
    .replace(/^Jewelry/i, 'Bijuterii')
    .replace(/^Belts/i, 'Curele')
    .replace(/^Watches/i, 'Ceasuri')
    .replace(/^Scarf/i, 'Esarfe')
    .replace(/^Glasses Factory/i, 'Ochelari Factory')
    .replace(/^Plain Glasses/i, 'Ochelari')
    .replace(/^Glasses/i, 'Ochelari')
    .replace(/^Hair Band Clasp Tie/i, 'Bentite si accesorii de par')
    .replace(/^Bikini/i, 'Bikini');
}

function parseQiqiygCollections(html, baseUrl, source, defaultSection, filter, transform) {
  const regex =
    /<div class="category_160">[\s\S]*?<a title="([^"]+)" href="([^"]+)">[\s\S]*?data-original="([^"]+)"[\s\S]*?<a href="[^"]+" title="[^"]+" class="brown_a">([^<]+)<\/a>\s*\((\d+)\)/gi;

  const items = [];
  let match;

  while ((match = regex.exec(html))) {
    const title = decodeHtml(match[4] || match[1]);
    const raw = {
      title,
      href: absoluteUrl(baseUrl, match[2]),
      image: absoluteUrl(baseUrl, match[3]),
      count: Number.parseInt(match[5], 10) || null,
    };

    if (filter && !filter(raw)) {
      continue;
    }

    const item = {
      id: `${source}-${safeId(title)}`,
      name: localize(title, qiqiygRoTitle(title)),
      source,
      section: defaultSection,
      href: raw.href,
      image: raw.image,
      count: raw.count,
      featured: false,
      tags: [],
    };

    items.push(transform ? transform(item) : item);
  }

  return items;
}

function parseYupooCategoryMeta(html) {
  const countMatch = html.match(/共(\d+)个相册/);
  const imageMatch = html.match(/data-src="([^"]+)"/);
  const titleMatch = html.match(
    /<div class="text_overflow album__title">([^<]+)<\/div>/,
  );

  return {
    count: countMatch ? Number.parseInt(countMatch[1], 10) : null,
    image: imageMatch ? imageMatch[1] : null,
    sampleTitle: titleMatch ? decodeHtml(titleMatch[1]) : '',
  };
}

async function buildYupooCollection(config, baseUrl, source) {
  const href = `${baseUrl}/categories/${config.id}?page=1`;
  const html = await readCachedOrFetch(`${source}-${config.id}.html`, href);
  const meta = parseYupooCategoryMeta(html);

  return {
    id: `${source}-${config.id}`,
    name: localize(config.titleEn, config.titleRo),
    source,
    section: 'shoes',
    href,
    image: meta.image ?? '',
    count: meta.count,
    featured: /Miu Miu|Mary Jane|Sandals|LV|Chanel|Loewe|Valentino/i.test(
      config.titleEn,
    ),
    tags: [],
  };
}

function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

function renderData(items) {
  const sectionsTs = SECTION_DEFS.map(
    (section) => `  {
    id: '${section.id}',
    label: { en: '${escapeTs(section.label.en)}', ro: '${escapeTs(section.label.ro)}' },
    description: { en: '${escapeTs(section.description.en)}', ro: '${escapeTs(section.description.ro)}' },
  }`,
  ).join(',\n');

  const sourceLabelsTs = Object.entries(SOURCE_LABELS)
    .map(
      ([key, value]) =>
        `  ${key === '198maoyi' ? "'198maoyi'" : key}: { en: '${escapeTs(
          value.en,
        )}', ro: '${escapeTs(value.ro)}' }`,
    )
    .join(',\n');

  const itemsTs = items
    .map(
      (item) => `  {
    id: '${escapeTs(item.id)}',
    name: { en: '${escapeTs(item.name.en)}', ro: '${escapeTs(item.name.ro)}' },
    source: '${item.source}',
    section: '${item.section}',
    href: '${escapeTs(item.href)}',
    image: '${escapeTs(item.image)}',
    count: ${item.count ?? 'null'},
    featured: ${item.featured ? 'true' : 'false'},
    tags: [${item.tags.map((tag) => `'${escapeTs(tag)}'`).join(', ')}],
  }`,
    )
    .join(',\n');

  return `import type { LocalizedText } from '@/lib/i18n';

export type CatalogSectionId =
  | 'dresses'
  | 'clothing'
  | 'bags'
  | 'shoes'
  | 'accessories'
  | 'swimwear';

export type CatalogSourceId =
  | 'qiqiyg'
  | 'weifeng'
  | 'deshengxing'
  | '198maoyi';

export interface CatalogSection {
  id: CatalogSectionId;
  label: LocalizedText;
  description: LocalizedText;
}

export interface CatalogCollection {
  id: string;
  name: LocalizedText;
  source: CatalogSourceId;
  section: CatalogSectionId;
  href: string;
  image: string;
  count: number | null;
  featured: boolean;
  tags: string[];
}

export const catalogSections: CatalogSection[] = [
${sectionsTs}
];

export const catalogSourceLabels: Record<CatalogSourceId, LocalizedText> = {
${sourceLabelsTs}
};

export const womenCatalogCollections: CatalogCollection[] = [
${itemsTs}
];
`;
}

async function main() {
  const qiqiygCollections = [];

  for (const source of QIQIYG_SOURCES) {
    const html = await readCachedOrFetch(source.cacheName, source.url);
    qiqiygCollections.push(
      ...parseQiqiygCollections(
        html,
        source.url,
        source.source,
        source.section,
        source.filter,
        source.transform,
      ),
    );
  }

  const weifengCollections = await Promise.all(
    WEIFENG_CONFIG.map((config) =>
      buildYupooCollection(
        config,
        'https://weifengfz.x.yupoo.com',
        'weifeng',
      ),
    ),
  );

  const deshengxingCollections = await Promise.all(
    DESHENGXING_CONFIG.map((config) =>
      buildYupooCollection(
        config,
        'https://deshengxing.x.yupoo.com',
        'deshengxing',
      ),
    ),
  );

  const maoyiCollections = await Promise.all(
    MAOYI_CONFIG.map((config) =>
      buildYupooCollection(
        config,
        'https://198maoyi.x.yupoo.com',
        '198maoyi',
      ),
    ),
  );

  const allCollections = uniqueById([
    ...qiqiygCollections,
    ...weifengCollections,
    ...deshengxingCollections,
    ...maoyiCollections,
  ])
    .filter((item) => Boolean(item.image))
    .sort((left, right) => {
      if (left.section !== right.section) {
        return left.section.localeCompare(right.section);
      }

      if (left.featured !== right.featured) {
        return left.featured ? -1 : 1;
      }

      return right.count - left.count;
    });

  await writeFile(outputPath, renderData(allCollections), 'utf8');
  console.log(`Generated ${allCollections.length} women catalog collections.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
