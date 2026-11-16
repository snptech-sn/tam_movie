import { ExternalLink, Play } from 'lucide-react';
import type { ChannelInfo, YouTubeVideo } from '../types';
import { SafeImage } from './SafeImage';

interface HeroSectionProps {
  channel: ChannelInfo | null;
  featuredVideo: YouTubeVideo | null;
  syncedVideosCount: number;
  playlistsCount: number;
  postsCount: number;
  onPlayVideo: (video: YouTubeVideo) => void;
}

export function HeroSection({
  channel,
  featuredVideo,
  syncedVideosCount,
  playlistsCount,
  postsCount,
  onPlayVideo,
}: HeroSectionProps) {
  const channelTitle = channel?.title || 'តាមរឿង - Tam MOVIE';
  const channelUrl = channel?.url || 'https://www.youtube.com/@tam_movie';

  return (
    <section id="top" className="border-b border-white/10 bg-[#0B0B0D]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 lg:pt-14 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Editorial Channel Introduction */}
          <div className="lg:col-span-6 flex flex-col justify-between py-1">
            <div>
              <div className="flex items-center gap-3 text-xs font-medium text-[#D99B26] tracking-wide mb-4">
                <span>ឆានែល YouTube ផ្លូវការ</span>
                <span aria-hidden="true" className="text-white/30">·</span>
                <span className="font-mono text-[#B8B4AB]">{channel?.handle || '@tam_movie'}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-[#F5F2EB] leading-[1.3] text-balance">
                ពិភពភាពយន្តខ្មែរ រឿងនិទាន បទចម្រៀង និងព័ត៌មានសិល្បៈ
              </h1>

              <p className="mt-5 text-base sm:text-[17px] text-[#B8B4AB] leading-[1.8] max-w-xl">
                ទស្សនាវីដេអូភាពយន្តបុរាណ និងសម័យថ្មីៗដោយផ្ទាល់ពីឆានែល{' '}
                <strong className="text-[#F5F2EB] font-semibold">{channelTitle}</strong>{' '}
                ព្រមទាំងចូលរួមបង្ហោះ និងអានរឿងរ៉ាវ បទចម្រៀង និងព័ត៌មានផ្សេងៗនៅក្នុងគេហទំព័រតែមួយ។
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {featuredVideo ? (
                <button
                  type="button"
                  onClick={() => onPlayVideo(featuredVideo)}
                  className="inline-flex items-center gap-2.5 px-6 py-3 min-h-[44px] rounded-lg bg-[#D99B26] text-[#0B0B0D] font-semibold text-sm hover:bg-[#E5AA38] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B26] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current shrink-0" />
                  <span>ទស្សនាវីដេអូថ្មីបំផុត</span>
                </button>
              ) : (
                <a
                  href="#videos"
                  className="inline-flex items-center gap-2.5 px-6 py-3 min-h-[44px] rounded-lg bg-[#D99B26] text-[#0B0B0D] font-semibold text-sm hover:bg-[#E5AA38] transition-colors whitespace-nowrap shrink-0"
                >
                  <Play className="w-4 h-4 fill-current shrink-0" />
                  <span>ទស្សនាវីដេអូ</span>
                </a>
              )}

              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-lg border border-white/15 text-[#F5F2EB] text-sm font-medium hover:bg-white/5 transition-colors whitespace-nowrap shrink-0"
              >
                <span>បើកឆានែល YouTube</span>
                <ExternalLink className="w-4 h-4 text-[#B8B4AB] shrink-0" />
              </a>
            </div>
          </div>

          {/* Right Column: Featured Video Stage */}
          <div className="lg:col-span-6 flex">
            {featuredVideo ? (
              <button
                type="button"
                onClick={() => onPlayVideo(featuredVideo)}
                className="group relative w-full min-h-[280px] lg:h-full rounded-xl overflow-hidden border border-white/10 bg-[#141418] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B26] cursor-pointer"
              >
                <SafeImage
                  src={featuredVideo.thumbnail}
                  alt={featuredVideo.title}
                  fallbackTitle={featuredVideo.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-16 h-16 rounded-full bg-[#D99B26] text-[#0B0B0D] flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105">
                    <Play className="w-7 h-7 fill-current ml-0.5" />
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-xs text-[#E8E4DC]/85 mb-1.5 font-mono tabular-nums">
                    <span>វីដេអូពិសេសប្រចាំថ្ងៃ</span>
                    <span aria-hidden="true">·</span>
                    <span>{featuredVideo.duration}</span>
                    {featuredVideo.views && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{featuredVideo.views} views</span>
                      </>
                    )}
                  </div>
                  <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#F5F2EB] line-clamp-2">
                    {featuredVideo.title}
                  </h2>
                </div>
              </button>
            ) : (
              <div className="w-full min-h-[280px] lg:h-full rounded-xl overflow-hidden border border-white/10 bg-[#141418] flex items-center justify-center">
                <SafeImage
                  src="/src/assets/images/khmer_cinema_story_1794842826365.jpg"
                  alt="តាមរឿង - Tam MOVIE"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            )}
          </div>
        </div>

        {/* Full-Width 4-Column Channel Proof Strip */}
        <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="text-xs text-[#9C988E]">អ្នកជាវឆានែល YouTube</div>
            <div className="mt-1 text-xl sm:text-2xl font-bold text-[#F5F2EB] tabular-nums">
              {channel?.subscribers?.replace(/subscribers?/i, '').trim() || '958'} នាក់
            </div>
          </div>
          <div>
            <div className="text-xs text-[#9C988E]">វីដេអូសរុបដែលបានទាញយក</div>
            <div className="mt-1 text-xl sm:text-2xl font-bold text-[#D99B26] tabular-nums">
              {syncedVideosCount} វីដេអូ
            </div>
          </div>
          <div>
            <div className="text-xs text-[#9C988E]">បញ្ជីរឿងភាគ (Playlist)</div>
            <div className="mt-1 text-xl sm:text-2xl font-bold text-[#F5F2EB] tabular-nums">
              {playlistsCount} រឿង
            </div>
          </div>
          <div>
            <div className="text-xs text-[#9C988E]">រឿង ចម្រៀង និងព័ត៌មាន</div>
            <div className="mt-1 text-xl sm:text-2xl font-bold text-[#F5F2EB] tabular-nums">
              {postsCount} មាតិកា
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
