import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import type {
  ChannelInfo,
  ChannelPayload,
  Post,
  YouTubePlaylist,
  YouTubeVideo,
} from './src/types.ts';

const PORT = 3000;
const CHANNEL_HANDLE = '@tam_movie';
const CHANNEL_URL = `https://www.youtube.com/${CHANNEL_HANDLE}`;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');

const YOUTUBE_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

const SEED_POSTS: Post[] = [
  {
    id: 'post-sovann-hong-cinema',
    category: 'story',
    title: 'សុវណ្ណហង្ស និងដំណើរឆ្លងកាត់ភាពយន្តបុរាណខ្មែរ',
    author: 'ក្រុមការងារ តាមរឿង',
    summary:
      'ការរំលឹកឡើងវិញនូវរឿងព្រេងនិទានខ្មែរដ៏ល្បីល្បាញ ដែលត្រូវបានលើកយកមកសម្តែងជាភាពយន្តភាគ និងរក្សាទុកសម្រាប់កូនខ្មែរជំនាន់ក្រោយ។',
    content: `រឿងព្រេងនិទាន «សុវណ្ណហង្ស» គឺជាស្នាដៃអក្សរសិល្ប៍បុរាណដ៏មានតម្លៃមួយរបស់កម្ពុជា ដែលបានបង្ហាញពីទឹកចិត្តស្មោះត្រង់ កតញ្ញូតាធម៌ និងការតស៊ូជម្នះឧបសគ្គរាប់មិនអស់របស់ព្រះសុវណ្ណហង្ស និងនាងកេសរបុប្ផា។

នៅលើឆានែល YouTube តាមរឿង (@tam_movie) រឿងភាគបុរាណមួយនេះត្រូវបានរៀបចំចងក្រងជាភាគៗ ចាប់ពីភាគទី១ រហូតដល់ភាគទី១១ ដែលជាភាគបញ្ចប់ ដើម្បីឱ្យទស្សនិកជនអាចទស្សនាឡើងវិញបានយ៉ាងងាយស្រួល។

អ្វីដែលគួរឱ្យចាប់អារម្មណ៍បំផុតនោះ គឺការរក្សាបាននូវបរិយាកាសវប្បធម៌ ប្រពៃណី សម្លៀកបំពាក់ប្រណីត និងសំនៀងសន្ទនាបែបខ្មែរសុទ្ធសាធ ដែលនាំឱ្យអ្នកទស្សនានឹកស្រណោះដល់យុគមាសនៃភាពយន្តខ្មែរ។`,
    coverImage: '/src/assets/images/khmer_cinema_story_1794842826365.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=kPNGCOEf90U',
    youtubeId: 'kPNGCOEf90U',
    readTime: '៣ នាទី',
    likes: 42,
    createdAt: '2026-11-12T08:30:00.000Z',
  },
  {
    id: 'post-lotus-lantern-tale',
    category: 'story',
    title: 'រាត្រីផ្កាឈូកភ្លឺលើផ្ទៃទឹកមេគង្គ',
    author: 'សុខ សម្បត្តិ',
    summary:
      'រឿងខ្លីមនោសញ្ចេតនាអំពីការជួបជុំ ការចងចាំ និងក្តីសង្ឃឹមនៅក្រោមពន្លឺគោមផ្កាឈូកនាឱកាសបុណ្យអុំទូក។',
    content: `រាល់ពេលខ្យល់ត្រជាក់ខែវិច្ឆិកាបក់កាត់មាត់ទន្លេចតុមុខ ពន្លឺគោមផ្កាឈូករាប់ពាន់តែងតែអណ្តែតត្រសែតលើផ្ទៃទឹកខ្មៅរលោង។ នៅក្រោមម្លប់ដើមឈើក្បែរមាត់ច្រាំង សំឡេងទ្រខ្មែរដ៏ស្រទន់លាន់ឮតិចៗលាយឡំនឹងសំឡេងរលកទឹក។

បុរីបានបណ្តែតប្រទីបតូចមួយដោយក្តីប្រាថ្នាស្ងប់ស្ងាត់។ ក្នុងប្រទីបនោះ មានក្រដាសតូចមួយដែលសរសេររំលឹកដល់រឿងរ៉ាវកាលពីកុមារភាព ដែលលោកតារបស់គេតែងតែនិទានរឿងព្រេងខ្មែរឱ្យស្តាប់មុនពេលចូលគេង។

ទោះពេលវេលាកន្លងផុតទៅយូរប៉ុណ្ណាក៏ដោយ សំឡេងនិទានរឿង និងមនោសញ្ចេតនានៃវប្បធម៌ខ្មែរនៅតែរស់រវើកក្នុងបេះដូងអ្នកស្រុកមាត់ទន្លេជានិច្ច។`,
    coverImage: '/src/assets/images/folklore_lotus_tale_1794842827440.jpg',
    readTime: '៤ នាទី',
    likes: 29,
    createdAt: '2026-11-10T14:15:00.000Z',
  },
  {
    id: 'post-song-champa-batambang',
    category: 'song',
    title: 'សំនៀងចាប៉ី និងរាត្រីមាត់ទន្លេសង្កែ',
    author: 'តន្ត្រីបុរាណ និងសម័យ',
    artist: 'សិល្បករ សំឡេងមាស',
    summary:
      'បទចម្រៀងមនោសញ្ចេតនាសម្រាប់សម្រាកអារម្មណ៍ លាយឡំជាមួយសំនៀងហ្គីតាអាគូស្ទិក និងទំនុកច្រៀងបែបកំណាព្យខ្មែរ។',
    content: `បទចម្រៀងនេះត្រូវបាននិពន្ធឡើងដើម្បីរំលឹកដល់សម្រស់ធម្មជាតិខេត្តបាត់ដំបង និងភាពស្ងប់ស្ងាត់នាពេលល្ងាចតាមដងស្ទឹងសង្កែ។ ការរួមបញ្ចូលគ្នារវាងឧបករណ៍តន្ត្រីសម័យ និងបទភ្លេងបុរាណ ធ្វើឱ្យបទនេះមានរសជាតិផ្អែមល្ហែម និងជ្រាលជ្រៅ។`,
    lyrics: `វគ្គទី ១
ល្ងាចត្រជាក់ខ្យល់បក់មាត់ស្ទឹងសង្កែ
ពន្លឺច័ន្ទរះក្បែរចុងត្នោតខ្ពស់
នឹកគ្រាកន្លងធ្លាប់ដើរសាសងឈ្មោះ
ក្រោមម្លប់ផ្កាឈូកសាយភាយក្លិនក្រអូប។

បន្ទរ
ឱ! រាត្រីមាសកុំទាន់អាលឃ្លាតទៅ
ទុកឱ្យបេះដូងច្រៀងបទនឹកពៅ
សំនៀងហ្គីតារំលឹកផ្លូវចាស់
ដែលយើងធ្លាប់ស្បថថាមិនប្រែប្រួល។

វគ្គទី ២
ទោះឆ្នាំខែកន្លងទៅឆ្ងាយយ៉ាងណា
សំនៀងចម្រៀងនៅតែរក្សា
ពាក្យពេចន៍ស្នេហាដ៏បរិសុទ្ធថ្លៃថ្លា
ផ្ញើតាមវាយោទៅដល់ម្ចាស់ចិត្ត។`,
    coverImage: '/src/assets/images/khmer_music_vinyl_1794842826945.jpg',
    readTime: 'បទចម្រៀង',
    likes: 54,
    createdAt: '2026-11-11T11:00:00.000Z',
  },
  {
    id: 'post-song-cinema-melody',
    category: 'song',
    title: 'បទភ្លេងអនុស្សាវរីយ៍រោងភាពយន្តចាស់',
    author: 'ផលិតកម្ម សំនៀងខ្មែរ',
    artist: 'រស្មី ភ្នំពេញ',
    summary:
      'បទចម្រៀងអមផ្ទាំងទស្សនីយភាពភាពយន្តបុរាណ នាំអារម្មណ៍វិលទៅកាន់សម័យកាលដ៏រុងរឿងនៃសិល្បៈទី៧។',
    content: `បទភ្លេងអនុស្សាវរីយ៍នេះរៀបរាប់ពីការចងចាំរបស់ទស្សនិកជនចំពោះរោងភាពយន្តនាទសវត្សរ៍ឆ្នាំ ៦០ និង ៧០ នៅរាជធានីភ្នំពេញ។`,
    lyrics: `វគ្គទី ១
ពន្លឺបញ្ចាំងលើផ្ទាំងសំពត់ស
សំឡេងបទភ្លេងហោះកាត់រាត្រី
រឿងរ៉ាវស្នេហា និងកិត្តិយសថ្លៃ
ក្លាយជាអនុស្សាវរីយ៍គ្មានថ្ងៃរសាយ។

បន្ទរ
ច្រៀងបទចម្រៀងនៃភាពយន្តខ្មែរ
រក្សាស្នាដៃដូនតាទុកក្បែរ
ឱ្យកូនជំនាន់ក្រោយបានស្គាល់បានឃើញ
សម្រស់សិល្បៈដ៏ថ្កុំថ្កើង។`,
    coverImage: '/src/assets/images/khmer_cinema_story_1794842826365.jpg',
    readTime: 'បទចម្រៀង',
    likes: 37,
    createdAt: '2026-11-08T16:40:00.000Z',
  },
  {
    id: 'post-news-tam-movie-archive',
    category: 'news',
    title: 'ឆានែល តាមរឿង (@tam_movie) បន្តផ្សព្វផ្សាយវីដេអូភាពយន្តខ្មែរជាង ១៦០ វីដេអូ',
    author: 'ការិយាល័យព័ត៌មាន តាមរឿង',
    summary:
      'ឆានែល YouTube តាមរឿង - Tam MOVIE បានប្រមូលផ្តុំវីដេអូភាពយន្តបុរាណ សម័យ ប្រវត្តិសាស្ត្រ និងការណែនាំរឿងល្អៗជូនប្រិយមិត្ត។',
    content: `ឆានែល តាមរឿង - Tam MOVIE (@tam_movie) បាននិងកំពុងបន្តបេសកកម្មក្នុងការចែករំលែកវីដេអូភាពយន្តខ្មែរ ទាំងភាពយន្តបុរាណ ភាពយន្តប្រវត្តិសាស្ត្រ និងភាពយន្តសម័យ ទៅកាន់អ្នកទស្សនាទូទាំងប្រទេស និងក្រៅប្រទេស។

បច្ចុប្បន្ន ឆានែលមានវីដេអូសរុបជាង ១៦០ វីដេអូ ដែលរួមមានរឿងភាគបុរាណល្បីៗ ដូចជា រឿងសុវណ្ណហង្ស រួមជាមួយការវិភាគសាច់រឿង និងឈុតឆាកក្រៅឆាកគួរឱ្យចាប់អារម្មណ៍។

ប្រិយមិត្តក៏អាចភ្ជាប់ទំនាក់ទំនងជាមួយសហគមន៍តាមរយៈ Telegram (t.me/tam_movie), TikTok (@tam_movie7) និង Facebook (tammovies099) ដើម្បីទទួលបានព័ត៌មានថ្មីៗអំពីការចេញផ្សាយវីដេអូបន្ទាប់ទៀត។`,
    coverImage: '/src/assets/images/phnom_penh_editorial_1794842826864.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=o4OO57A02bY',
    youtubeId: 'o4OO57A02bY',
    readTime: '២ នាទី',
    likes: 61,
    createdAt: '2026-11-15T07:00:00.000Z',
  },
  {
    id: 'post-news-khmer-cinema-revival',
    category: 'news',
    title: 'សន្ទុះនៃការអភិរក្ស និងឌីជីថលភាវូបនីយកម្មភាពយន្តខ្មែរនាឆ្នាំ ២០២៦',
    author: 'វិចារណកថា សិល្បៈភាពយន្ត',
    summary:
      'ផលិតករវ័យក្មេង និងអ្នកស្រឡាញ់ភាពយន្តកំពុងសហការគ្នារក្សាទុកឯកសារភាពយន្តខ្មែរក្នុងទម្រង់ឌីជីថលគុណភាពខ្ពស់។',
    content: `ក្នុងរយៈពេលប៉ុន្មានឆ្នាំចុងក្រោយនេះ ការចាប់អារម្មណ៍លើភាពយន្តបុរាណ និងភាពយន្តប្រវត្តិសាស្ត្រខ្មែរមានការកើនឡើងគួរឱ្យកត់សម្គាល់ ជាពិសេសនៅលើបណ្តាញផ្សព្វផ្សាយឌីជីថល។

អ្នកបង្កើតមាតិកា និងបណ្ណសារភាពយន្តឯករាជ្យបានខិតខំស្វែងរក ចងក្រង និងបកស្រាយឡើងវិញនូវស្នាដៃភាពយន្តចាស់ៗ ដើម្បីឱ្យយុវជនជំនាន់ក្រោយបានស្វែងយល់ពីសិល្បៈការសម្តែង ការនិពន្ធ និងប្រវត្តិសាស្ត្រដ៏សម្បូរបែបរបស់ជាតិ។

គេហទំព័រ តាមរឿង - Tam MOVIE ត្រូវបានបង្កើតឡើងជាកន្លែងរួមមួយសម្រាប់ទស្សនាវីដេអូ និងចែករំលែករឿង បទចម្រៀង និងព័ត៌មានវប្បធម៌ទាន់ហេតុការណ៍។`,
    coverImage: '/src/assets/images/phnom_penh_editorial_1794842826864.jpg',
    readTime: '៣ នាទី',
    likes: 33,
    createdAt: '2026-11-14T09:20:00.000Z',
  },
];

function ensurePostsFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(POSTS_FILE)) {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(SEED_POSTS, null, 2), 'utf-8');
  }
}

function readPosts(): Post[] {
  ensurePostsFile();
  try {
    const raw = fs.readFileSync(POSTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_POSTS;
  } catch {
    return SEED_POSTS;
  }
}

function writePosts(posts: Post[]) {
  ensurePostsFile();
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf-8');
}

export function extractYouTubeId(input?: string): string | undefined {
  if (!input) return undefined;
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const u = new URL(trimmed);
    if (u.hostname.includes('youtu.be')) {
      const seg = u.pathname.split('/').filter(Boolean)[0];
      return seg && /^[a-zA-Z0-9_-]{11}$/.test(seg) ? seg : undefined;
    }
    const v = u.searchParams.get('v');
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
    const parts = u.pathname.split('/').filter(Boolean);
    const embedIdx = parts.findIndex((p) => p === 'embed' || p === 'shorts' || p === 'live');
    if (embedIdx !== -1 && parts[embedIdx + 1]) {
      return parts[embedIdx + 1].slice(0, 11);
    }
  } catch {
    // ignore invalid URL
  }
  return undefined;
}

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseRssEntries(xml: string): Record<string, { publishedAt: string; description: string; title: string }> {
  const map: Record<string, { publishedAt: string; description: string; title: string }> = {};
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match: RegExpExecArray | null;
  while ((match = entryRegex.exec(xml)) !== null) {
    const block = match[1];
    const idMatch = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const pubMatch = block.match(/<published>([^<]+)<\/published>/);
    const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/);
    const descMatch = block.match(/<media:description>([\s\S]*?)<\/media:description>/);
    if (idMatch?.[1]) {
      map[idMatch[1]] = {
        publishedAt: pubMatch?.[1] || '',
        title: titleMatch?.[1] ? decodeXmlEntities(titleMatch[1].trim()) : '',
        description: descMatch?.[1] ? decodeXmlEntities(descMatch[1].trim()) : '',
      };
    }
  }
  return map;
}

function collectNodes(obj: unknown, key: string, out: Record<string, unknown>[] = []): Record<string, unknown>[] {
  if (!obj || typeof obj !== 'object') return out;
  if (Array.isArray(obj)) {
    for (const item of obj) collectNodes(item, key, out);
    return out;
  }
  const record = obj as Record<string, unknown>;
  if (record[key] && typeof record[key] === 'object') {
    out.push(record[key] as Record<string, unknown>);
  }
  for (const val of Object.values(record)) {
    collectNodes(val, key, out);
  }
  return out;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseLockupVideo(lockup: any, channelTitle: string, rssMap: Record<string, { publishedAt: string; description: string; title: string }>): YouTubeVideo | null {
  const id: string | undefined = lockup?.contentId;
  if (!id || id.length !== 11) return null;

  const thumbs = lockup.contentImage?.thumbnailViewModel?.image?.sources || [];
  const rawThumb: string =
    thumbs[thumbs.length - 1]?.url || thumbs[0]?.url || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const cleanThumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  const overlays = lockup.contentImage?.thumbnailViewModel?.overlays || [];
  let duration = '';
  for (const ov of overlays) {
    const badgeText = ov.thumbnailBottomOverlayViewModel?.badges?.[0]?.thumbnailBadgeViewModel?.text;
    if (badgeText) {
      duration = badgeText;
      break;
    }
  }

  const metaModel = lockup.metadata?.lockupMetadataViewModel;
  const title: string = metaModel?.title?.content || rssMap[id]?.title || 'វីដេអូ តាមរឿង';
  const rows = metaModel?.metadata?.contentMetadataViewModel?.metadataRows || [];
  let views = '';
  let publishedText = '';

  for (const row of rows) {
    for (const part of row.metadataParts || []) {
      const label = (part.accessibilityLabel || part.text?.content || '').toLowerCase();
      const txt: string = part.text?.content || '';
      if (label.includes('view')) {
        views = txt;
      } else if (label.includes('ago') || label.includes('streamed')) {
        publishedText = txt;
      }
    }
  }

  const rssInfo = rssMap[id];
  return {
    id,
    title,
    thumbnail: rawThumb.startsWith('https://i.ytimg.com/') ? rawThumb : cleanThumb,
    duration: duration || 'HD',
    views: views || '—',
    publishedText: publishedText || (rssInfo?.publishedAt ? rssInfo.publishedAt.slice(0, 10) : ''),
    publishedAt: rssInfo?.publishedAt,
    description: rssInfo?.description || `${title} — ពីឆានែល ${channelTitle}`,
    url: `https://www.youtube.com/watch?v=${id}`,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractVideosFromItems(items: any[], channelTitle: string, rssMap: Record<string, { publishedAt: string; description: string; title: string }>, seen: Set<string>, out: YouTubeVideo[]): string | null {
  let continuationToken: string | null = null;
  for (const item of items) {
    const lockup = item.richItemRenderer?.content?.lockupViewModel || item.lockupViewModel;
    if (lockup?.contentId) {
      const parsed = parseLockupVideo(lockup, channelTitle, rssMap);
      if (parsed && !seen.has(parsed.id)) {
        seen.add(parsed.id);
        out.push(parsed);
      }
    } else if (item.richItemRenderer?.content?.videoRenderer?.videoId) {
      const vr = item.richItemRenderer.content.videoRenderer;
      const id: string = vr.videoId;
      if (!seen.has(id)) {
        seen.add(id);
        const rssInfo = rssMap[id];
        out.push({
          id,
          title: vr.title?.runs?.[0]?.text || rssInfo?.title || 'វីដេអូ តាមរឿង',
          thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          duration: vr.lengthText?.simpleText || 'HD',
          views: vr.shortViewCountText?.simpleText || vr.viewCountText?.simpleText || '—',
          publishedText: vr.publishedTimeText?.simpleText || '',
          publishedAt: rssInfo?.publishedAt,
          description: rssInfo?.description || `${vr.title?.runs?.[0]?.text || ''} — ពីឆានែល ${channelTitle}`,
          url: `https://www.youtube.com/watch?v=${id}`,
        });
      }
    }

    const tok = item.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
    if (tok) continuationToken = tok;
  }
  return continuationToken;
}

async function fetchChannelPlaylists(): Promise<YouTubePlaylist[]> {
  try {
    const res = await fetch(`${CHANNEL_URL}/playlists`, { headers: YOUTUBE_HEADERS });
    if (!res.ok) return [];
    const html = await res.text();
    const apiKey = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/)?.[1];
    const clientVersion = html.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/)?.[1] || '2.20240726.00.00';
    const dataMatch = html.match(/var ytInitialData = (\{.+?\});<\/script>/);
    if (!dataMatch?.[1]) return [];

    const ytData = JSON.parse(dataMatch[1]);
    const playlists: YouTubePlaylist[] = [];
    const seen = new Set<string>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsePlaylistLockup = (lv: any) => {
      const id: string | undefined = lv?.contentId;
      if (!id || seen.has(id)) return;
      seen.add(id);
      const title: string = lv.metadata?.lockupMetadataViewModel?.title?.content || 'បញ្ជីរឿង';
      const thumbModel = lv.contentImage?.collectionThumbnailViewModel?.primaryThumbnail?.thumbnailViewModel;
      const thumbs = thumbModel?.image?.sources || [];
      const thumbnail: string = thumbs[thumbs.length - 1]?.url || thumbs[0]?.url || '';
      const badgeText: string =
        thumbModel?.overlays?.[0]?.thumbnailOverlayBadgeViewModel?.thumbnailBadges?.[0]?.thumbnailBadgeViewModel?.text ||
        '';
      const countNum = parseInt(badgeText.replace(/[^\d]/g, ''), 10) || 0;

      playlists.push({
        id,
        title,
        videoCountText: badgeText || `${countNum} videos`,
        videoCount: countNum,
        thumbnail,
        url: `https://www.youtube.com/playlist?list=${id}`,
      });
    };

    const tabs = ytData.contents?.twoColumnBrowseResultsRenderer?.tabs || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plTab = tabs.find((t: any) => t.tabRenderer?.selected);
    const gridItems =
      plTab?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents?.[0]?.gridRenderer
        ?.items || [];

    let token: string | null = null;
    for (const item of gridItems) {
      if (item.lockupViewModel) parsePlaylistLockup(item.lockupViewModel);
      const tok = item.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
      if (tok) token = tok;
    }

    let pages = 1;
    while (token && apiKey && pages < 6) {
      pages++;
      const contRes = await fetch(`https://www.youtube.com/youtubei/v1/browse?key=${apiKey}`, {
        method: 'POST',
        headers: { ...YOUTUBE_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: { client: { clientName: 'WEB', clientVersion } },
          continuation: token,
        }),
      });
      if (!contRes.ok) break;
      const contJson = await contRes.json();
      const contItems = contJson.onResponseReceivedActions?.[0]?.appendContinuationItemsAction?.continuationItems || [];
      token = null;
      for (const item of contItems) {
        if (item.lockupViewModel) parsePlaylistLockup(item.lockupViewModel);
        const tok = item.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
        if (tok) token = tok;
      }
    }

    return playlists;
  } catch (err) {
    console.error('Playlist fetch error:', err);
    return [];
  }
}

let cachedChannel: { data: ChannelPayload; fetchedAt: number } | null = null;
const playlistCache = new Map<string, { videos: YouTubeVideo[]; fetchedAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

async function fetchPlaylistVideos(playlistId: string): Promise<YouTubeVideo[]> {
  const cached = playlistCache.get(playlistId);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.videos;
  }

  let rssMap: Record<string, { publishedAt: string; description: string; title: string }> = {};
  try {
    const rssRes = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`, {
      headers: YOUTUBE_HEADERS,
    });
    if (rssRes.ok) {
      rssMap = parseRssEntries(await rssRes.text());
    }
  } catch {
    // non-fatal
  }

  const res = await fetch(`https://www.youtube.com/playlist?list=${playlistId}`, { headers: YOUTUBE_HEADERS });
  if (!res.ok) {
    throw new Error(`YouTube playlist responded with ${res.status}`);
  }
  const html = await res.text();
  const dataMatch = html.match(/var ytInitialData = (\{.+?\});<\/script>/);
  const videos: YouTubeVideo[] = [];
  const seen = new Set<string>();

  if (dataMatch?.[1]) {
    const ytData = JSON.parse(dataMatch[1]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lockups = collectNodes(ytData.contents, 'lockupViewModel') as any[];
    for (const lv of lockups) {
      const parsed = parseLockupVideo(lv, 'តាមរឿង - Tam MOVIE', rssMap);
      if (parsed && !seen.has(parsed.id)) {
        seen.add(parsed.id);
        videos.push(parsed);
      }
    }

    if (videos.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pvrList = collectNodes(ytData.contents, 'playlistVideoRenderer') as any[];
      for (const vr of pvrList) {
        const id: string | undefined = vr?.videoId;
        if (id && !seen.has(id)) {
          seen.add(id);
          const rssInfo = rssMap[id];
          videos.push({
            id,
            title: vr.title?.runs?.[0]?.text || rssInfo?.title || 'វីដេអូ តាមរឿង',
            thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
            duration: vr.lengthText?.simpleText || 'HD',
            views: vr.videoInfo?.runs?.[0]?.text || '—',
            publishedText: vr.videoInfo?.runs?.[2]?.text || '',
            publishedAt: rssInfo?.publishedAt,
            description: rssInfo?.description || '',
            url: `https://www.youtube.com/watch?v=${id}&list=${playlistId}`,
          });
        }
      }
    }
  }

  if (videos.length === 0 && Object.keys(rssMap).length > 0) {
    for (const [id, entry] of Object.entries(rssMap)) {
      videos.push({
        id,
        title: entry.title,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        duration: 'HD',
        views: 'YouTube',
        publishedText: entry.publishedAt.slice(0, 10),
        publishedAt: entry.publishedAt,
        description: entry.description,
        url: `https://www.youtube.com/watch?v=${id}&list=${playlistId}`,
      });
    }
  }

  playlistCache.set(playlistId, { videos, fetchedAt: Date.now() });
  return videos;
}

async function fetchTamMovieChannel(forceRefresh = false): Promise<ChannelPayload> {
  if (!forceRefresh && cachedChannel && Date.now() - cachedChannel.fetchedAt < CACHE_TTL_MS) {
    return cachedChannel.data;
  }

  const [videoPageRes, playlists] = await Promise.all([
    fetch(`${CHANNEL_URL}/videos`, { headers: YOUTUBE_HEADERS }),
    fetchChannelPlaylists(),
  ]);

  if (!videoPageRes.ok) {
    throw new Error(`YouTube responded with status ${videoPageRes.status}`);
  }
  const html = await videoPageRes.text();
  const apiKey = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/)?.[1];
  const clientVersion = html.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/)?.[1] || '2.20240726.00.00';

  const cidMatch =
    html.match(/"externalId":"(UC[a-zA-Z0-9_-]+)"/) ||
    html.match(/channel_id=(UC[a-zA-Z0-9_-]+)/);
  const channelId = cidMatch?.[1] || 'UCxKxL1xnH22cLo2ewLhxf9Q';

  let rssMap: Record<string, { publishedAt: string; description: string; title: string }> = {};
  try {
    const rssRes = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      headers: YOUTUBE_HEADERS,
    });
    if (rssRes.ok) {
      rssMap = parseRssEntries(await rssRes.text());
    }
  } catch {
    // non-fatal
  }

  const dataMatch = html.match(/var ytInitialData = (\{.+?\});<\/script>/);
  let channelTitle = 'តាមរឿង - Tam MOVIE';
  let avatar = '';
  let banner = '';
  let subscribers = '958 subscribers';
  let videoCount = '160 videos';
  let description = 'Please subscribe to us to get the movies you like.';
  const videos: YouTubeVideo[] = [];
  const seen = new Set<string>();

  if (dataMatch?.[1]) {
    const ytData = JSON.parse(dataMatch[1]);
    const ph = ytData.header?.pageHeaderRenderer?.content?.pageHeaderViewModel;
    if (ph) {
      channelTitle = ph.title?.dynamicTextViewModel?.text?.content || channelTitle;
      const avatarSources = ph.image?.decoratedAvatarViewModel?.avatar?.avatarViewModel?.image?.sources || [];
      avatar = avatarSources[avatarSources.length - 1]?.url || avatarSources[0]?.url || '';
      const bannerSources = ph.banner?.imageBannerViewModel?.image?.sources || [];
      banner = bannerSources[bannerSources.length - 1]?.url || bannerSources[0]?.url || '';
      description = ph.description?.descriptionPreviewViewModel?.description?.content || description;

      const metaRows = ph.metadata?.contentMetadataViewModel?.metadataRows || [];
      for (const row of metaRows) {
        for (const p of row.metadataParts || []) {
          const text: string = p.text?.content || '';
          if (text.toLowerCase().includes('subscriber')) {
            subscribers = text;
          } else if (text.toLowerCase().includes('video')) {
            videoCount = text;
          }
        }
      }
    }

    const tabs = ytData.contents?.twoColumnBrowseResultsRenderer?.tabs || [];
    const videosTab =
      tabs.find((t: { tabRenderer?: { selected?: boolean } }) => t.tabRenderer?.selected) ||
      tabs.find((t: { tabRenderer?: { title?: string } }) => t.tabRenderer?.title === 'Videos');
    const contents = videosTab?.tabRenderer?.content?.richGridRenderer?.contents || [];

    let token = extractVideosFromItems(contents, channelTitle, rssMap, seen, videos);
    let page = 1;
    while (token && apiKey && page < 12) {
      page++;
      try {
        const contRes = await fetch(`https://www.youtube.com/youtubei/v1/browse?key=${apiKey}`, {
          method: 'POST',
          headers: { ...YOUTUBE_HEADERS, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            context: { client: { clientName: 'WEB', clientVersion } },
            continuation: token,
          }),
        });
        if (!contRes.ok) break;
        const contJson = await contRes.json();
        const contItems = contJson.onResponseReceivedActions?.[0]?.appendContinuationItemsAction?.continuationItems || [];
        token = extractVideosFromItems(contItems, channelTitle, rssMap, seen, videos);
      } catch {
        break;
      }
    }
  }

  if (videos.length === 0 && Object.keys(rssMap).length > 0) {
    for (const [id, entry] of Object.entries(rssMap)) {
      videos.push({
        id,
        title: entry.title,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        duration: 'HD',
        views: 'YouTube',
        publishedText: entry.publishedAt.slice(0, 10),
        publishedAt: entry.publishedAt,
        description: entry.description,
        url: `https://www.youtube.com/watch?v=${id}`,
      });
    }
  }

  const channel: ChannelInfo = {
    title: channelTitle,
    handle: CHANNEL_HANDLE,
    channelId,
    url: CHANNEL_URL,
    avatar,
    banner,
    subscribers,
    videoCount,
    description,
    syncedAt: new Date().toISOString(),
  };

  const payload: ChannelPayload = { channel, videos, playlists };
  cachedChannel = { data: payload, fetchedAt: Date.now() };
  return payload;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/channel', async (req, res) => {
    try {
      const refresh = req.query.refresh === '1';
      if (refresh) playlistCache.clear();
      const data = await fetchTamMovieChannel(refresh);
      res.json(data);
    } catch (err) {
      console.error('YouTube fetch error:', err);
      if (cachedChannel) {
        return res.json(cachedChannel.data);
      }
      res.status(502).json({ error: 'មិនអាចទាញយកទិន្នន័យពី YouTube បានទេ។' });
    }
  });

  app.get('/api/playlists/:id', async (req, res) => {
    const { id } = req.params;
    if (!/^[a-zA-Z0-9_-]{10,64}$/.test(id)) {
      return res.status(400).json({ error: 'លេខសម្គាល់ Playlist មិនត្រឹមត្រូវ។' });
    }
    try {
      const videos = await fetchPlaylistVideos(id);
      res.json({ playlistId: id, videos });
    } catch (err) {
      console.error('Playlist videos fetch error:', err);
      res.status(502).json({ error: 'មិនអាចទាញយកវីដេអូក្នុង Playlist បានទេ។' });
    }
  });

  app.get('/api/posts', (_req, res) => {
    const posts = readPosts().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json(posts);
  });

  app.post('/api/posts', (req, res) => {
    const { category, title, author, summary, content, coverImage, youtubeUrl, audioUrl, lyrics, artist } =
      req.body || {};

    if (!title?.trim() || !content?.trim() || !['story', 'song', 'news'].includes(category)) {
      return res.status(400).json({ error: 'សូមបំពេញចំណងជើង ប្រភេទ និងខ្លឹមសារឱ្យបានត្រឹមត្រូវ។' });
    }

    const ytId = extractYouTubeId(youtubeUrl);
    const defaultCover =
      ytId
        ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`
        : category === 'song'
        ? '/src/assets/images/khmer_music_vinyl_1794842826945.jpg'
        : category === 'news'
        ? '/src/assets/images/phnom_penh_editorial_1794842826864.jpg'
        : '/src/assets/images/khmer_cinema_story_1794842826365.jpg';

    const wordEstimate = Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 160));
    const newPost: Post = {
      id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      category,
      title: title.trim(),
      author: (author || 'អ្នកនិពន្ធសហគមន៍').trim(),
      summary: (summary || content.trim().slice(0, 140)).trim(),
      content: content.trim(),
      coverImage: (coverImage || defaultCover).trim(),
      youtubeUrl: youtubeUrl?.trim() || undefined,
      youtubeId: ytId,
      audioUrl: audioUrl?.trim() || undefined,
      lyrics: lyrics?.trim() || undefined,
      artist: artist?.trim() || undefined,
      readTime: category === 'song' ? 'បទចម្រៀង' : `${wordEstimate} នាទី`,
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    const posts = readPosts();
    posts.unshift(newPost);
    writePosts(posts);
    res.status(201).json(newPost);
  });

  app.put('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    const posts = readPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'រកមិនឃើញមាតិកានេះទេ។' });
    }

    const existing = posts[index];
    const { category, title, author, summary, content, coverImage, youtubeUrl, audioUrl, lyrics, artist } =
      req.body || {};

    const ytId = youtubeUrl !== undefined ? extractYouTubeId(youtubeUrl) : existing.youtubeId;
    const updated: Post = {
      ...existing,
      category: ['story', 'song', 'news'].includes(category) ? category : existing.category,
      title: title?.trim() || existing.title,
      author: author?.trim() || existing.author,
      summary: summary?.trim() || existing.summary,
      content: content?.trim() || existing.content,
      coverImage: coverImage?.trim() || existing.coverImage,
      youtubeUrl: youtubeUrl !== undefined ? youtubeUrl.trim() || undefined : existing.youtubeUrl,
      youtubeId: ytId,
      audioUrl: audioUrl !== undefined ? audioUrl.trim() || undefined : existing.audioUrl,
      lyrics: lyrics !== undefined ? lyrics.trim() || undefined : existing.lyrics,
      artist: artist !== undefined ? artist.trim() || undefined : existing.artist,
      updatedAt: new Date().toISOString(),
    };

    posts[index] = updated;
    writePosts(posts);
    res.json(updated);
  });

  app.post('/api/posts/:id/like', (req, res) => {
    const { id } = req.params;
    const posts = readPosts();
    const post = posts.find((p) => p.id === id);
    if (!post) {
      return res.status(404).json({ error: 'រកមិនឃើញមាតិកានេះទេ។' });
    }
    post.likes = (post.likes || 0) + 1;
    writePosts(posts);
    res.json(post);
  });

  app.delete('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    const posts = readPosts();
    const filtered = posts.filter((p) => p.id !== id);
    if (filtered.length === posts.length) {
      return res.status(404).json({ error: 'រកមិនឃើញមាតិកានេះទេ។' });
    }
    writePosts(filtered);
    res.json({ ok: true });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`តាមរឿង - Tam MOVIE server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
