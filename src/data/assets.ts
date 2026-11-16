import cinemaStoryImg from '../assets/images/khmer_cinema_story_1794842826365.jpg';
import musicVinylImg from '../assets/images/khmer_music_vinyl_1794842826945.jpg';
import phnomPenhImg from '../assets/images/phnom_penh_editorial_1794842826864.jpg';
import folkloreLotusImg from '../assets/images/folklore_lotus_tale_1794842827440.jpg';

export const BUNDLED_COVERS = {
  cinemaStory: cinemaStoryImg,
  musicVinyl: musicVinylImg,
  phnomPenh: phnomPenhImg,
  folkloreLotus: folkloreLotusImg,
};

const ASSET_MAP: Record<string, string> = {
  '/src/assets/images/khmer_cinema_story_1794842826365.jpg': cinemaStoryImg,
  './src/assets/images/khmer_cinema_story_1794842826365.jpg': cinemaStoryImg,
  '/src/assets/images/khmer_music_vinyl_1794842826945.jpg': musicVinylImg,
  './src/assets/images/khmer_music_vinyl_1794842826945.jpg': musicVinylImg,
  '/src/assets/images/phnom_penh_editorial_1794842826864.jpg': phnomPenhImg,
  './src/assets/images/phnom_penh_editorial_1794842826864.jpg': phnomPenhImg,
  '/src/assets/images/folklore_lotus_tale_1794842827440.jpg': folkloreLotusImg,
  './src/assets/images/folklore_lotus_tale_1794842827440.jpg': folkloreLotusImg,
};

export function resolveAssetUrl(src?: string): string | undefined {
  if (!src) return undefined;
  return ASSET_MAP[src] || src;
}
