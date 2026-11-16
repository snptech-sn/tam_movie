import { useMemo, useState } from 'react';
import { ExternalLink, ListVideo, Play, RefreshCw, Search, X } from 'lucide-react';
import type { YouTubePlaylist, YouTubeVideo } from '../types';
import { SafeImage } from './SafeImage';

interface VideoGalleryProps {
  videos: YouTubeVideo[];
  playlists: YouTubePlaylist[];
  loading: boolean;
  syncing: boolean;
  error: string | null;
  selectedPlaylist: YouTubePlaylist | null;
  playlistVideos: YouTubeVideo[];
  playlistLoading: boolean;
  onRefresh: () => void;
  onSelectPlaylist: (playlist: YouTubePlaylist | null) => void;
  onPlayVideo: (video: YouTubeVideo, queueVideos?: YouTubeVideo[], queueTitle?: string) => void;
}

type GalleryMode = 'all_and_playlists' | 'playlists_only' | 'videos_only';

export function VideoGallery({
  videos,
  playlists,
  loading,
  syncing,
  error,
  selectedPlaylist,
  playlistVideos,
  playlistLoading,
  onRefresh,
  onSelectPlaylist,
  onPlayVideo,
}: VideoGalleryProps) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<GalleryMode>('all_and_playlists');

  const filteredVideos = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return videos;
    return videos.filter(
      (v) => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)
    );
  }, [videos, query]);

  const filteredPlaylists = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return playlists;
    return playlists.filter((pl) => pl.title.toLowerCase().includes(q));
  }, [playlists, query]);

  return (
    <section id="videos" className="py-14 lg:py-20 border-b border-white/10 bg-[#0B0B0D]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <p className="text-xs font-medium text-[#D99B26] mb-2">
              ឆានែល YouTube · @tam_movie
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F2EB]">
              បណ្ណាល័យវីដេអូទាំងអស់ និង Playlist
            </h2>
          </div>

          {/* Search, View Mode & Sync Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <Search className="w-4 h-4 text-[#9C988E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ស្វែងរកវីដេអូ ឬ Playlist..."
                aria-label="ស្វែងរកវីដេអូ ឬ Playlist"
                className="w-full pl-9 pr-3 py-2 min-h-[40px] rounded-lg bg-[#141418] border border-white/10 text-sm text-[#F5F2EB] placeholder:text-[#7E7B73] focus:outline-none focus:border-[#D99B26]"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#141418] border border-white/10 rounded-lg overflow-x-auto">
              {(
                [
                  { id: 'all_and_playlists', label: 'ទាំងអស់ និង Playlist' },
                  { id: 'playlists_only', label: `Playlist (${playlists.length})` },
                  { id: 'videos_only', label: `វីដេអូ (${videos.length})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMode(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 tabular-nums cursor-pointer ${
                    mode === tab.id
                      ? 'bg-[#D99B26] text-[#0B0B0D]'
                      : 'text-[#B8B4AB] hover:text-[#F5F2EB]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onRefresh}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-lg border border-white/15 text-xs font-medium text-[#E8E4DC] hover:bg-white/5 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'កំពុងទាញយក...' : 'ធ្វើបច្ចុប្បន្នភាព'}</span>
            </button>
          </div>
        </div>

        {/* Loading / Error */}
        {loading ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl overflow-hidden bg-[#141418] border border-white/10 animate-pulse"
              >
                <div className="aspect-video bg-[#1D1D24]" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 bg-[#1D1D24] rounded w-5/6" />
                  <div className="h-3 bg-[#1D1D24] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error && videos.length === 0 ? (
          <div className="mt-10 p-8 rounded-xl bg-[#141418] border border-white/10 text-center">
            <p className="text-sm text-[#E8E4DC]">{error}</p>
            <button
              type="button"
              onClick={onRefresh}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D99B26] text-[#0B0B0D] text-xs font-semibold cursor-pointer"
            >
              សាកល្បងម្តងទៀត
            </button>
          </div>
        ) : (
          <div className="space-y-14 mt-8">
            {/* Playlists Grid */}
            {mode !== 'videos_only' && (
              <div>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <h3 className="text-base sm:text-lg font-semibold text-[#F5F2EB] flex items-center gap-2">
                    <ListVideo className="w-5 h-5 text-[#D99B26]" />
                    <span>បញ្ជីរឿងតាមស៊េរី · Playlist ({filteredPlaylists.length})</span>
                  </h3>
                </div>

                {filteredPlaylists.length === 0 ? (
                  <p className="text-sm text-[#9C988E]">
                    រកមិនឃើញ Playlist ដែលត្រូវនឹង «{query}» ទេ។
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {filteredPlaylists.map((pl) => {
                      const isSelected = selectedPlaylist?.id === pl.id;
                      return (
                        <button
                          key={pl.id}
                          type="button"
                          onClick={() => onSelectPlaylist(isSelected ? null : pl)}
                          className={`group text-left rounded-xl overflow-hidden border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#1B1812] border-[#D99B26]'
                              : 'bg-[#141418] border-white/10 hover:border-[#D99B26]/50'
                          }`}
                        >
                          <div className="relative aspect-video w-full overflow-hidden bg-[#0E0E11]">
                            <SafeImage
                              src={pl.thumbnail}
                              alt={pl.title}
                              fallbackTitle={pl.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/85 text-[11px] font-mono tabular-nums text-[#F5F2EB]">
                              <ListVideo className="w-3.5 h-3.5 text-[#D99B26]" />
                              <span>{pl.videoCountText}</span>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="text-sm font-semibold text-[#F5F2EB] group-hover:text-[#D99B26] transition-colors line-clamp-2 leading-snug">
                              {pl.title}
                            </div>
                            <div className="mt-2 text-xs text-[#9C988E]">
                              {isSelected ? 'កំពុងបង្ហាញភាគខាងក្រោម' : 'ចុចដើម្បីមើលគ្រប់ភាគ'}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Expanded Selected Playlist Episodes Drawer */}
                {selectedPlaylist && (
                  <div className="mt-6 p-5 sm:p-6 rounded-xl bg-[#131318] border border-[#D99B26]/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
                      <div>
                        <div className="text-xs font-medium text-[#D99B26]">
                          បញ្ជីរឿង · Playlist ({playlistVideos.length || selectedPlaylist.videoCount} ភាគ)
                        </div>
                        <h4 className="mt-1 font-serif text-xl font-bold text-[#F5F2EB]">
                          {selectedPlaylist.title}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        {playlistVideos.length > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              onPlayVideo(
                                playlistVideos[0],
                                playlistVideos,
                                selectedPlaylist.title
                              )
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-lg bg-[#D99B26] text-[#0B0B0D] text-xs font-semibold hover:bg-[#E5AA38] transition-colors cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>ចាក់មើលទាំងអស់តាមលំដាប់</span>
                          </button>
                        )}
                        <a
                          href={selectedPlaylist.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg border border-white/15 text-xs text-[#E8E4DC] hover:bg-white/5"
                        >
                          <span>បើកលើ YouTube</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => onSelectPlaylist(null)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/15 text-[#B8B4AB] hover:text-white cursor-pointer"
                          aria-label="បិទបញ្ជីភាគ"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {playlistLoading ? (
                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="h-24 rounded-lg bg-[#1C1C23] animate-pulse"
                          />
                        ))}
                      </div>
                    ) : playlistVideos.length === 0 ? (
                      <p className="mt-5 text-sm text-[#9C988E]">
                        មិនអាចទាញយកបញ្ជីភាគសម្រាប់ Playlist នេះបានទេ។
                      </p>
                    ) : (
                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {playlistVideos.map((ep, idx) => (
                          <button
                            key={ep.id}
                            type="button"
                            onClick={() =>
                              onPlayVideo(ep, playlistVideos, selectedPlaylist.title)
                            }
                            className="group flex items-start gap-3 p-2.5 rounded-lg bg-[#0E0E12] border border-white/10 hover:border-[#D99B26]/60 text-left transition-colors cursor-pointer"
                          >
                            <div className="relative w-32 aspect-video rounded-md overflow-hidden shrink-0 bg-[#18181D]">
                              <SafeImage
                                src={ep.thumbnail}
                                alt={ep.title}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] font-mono tabular-nums bg-black/85 text-white rounded">
                                {ep.duration}
                              </span>
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[10px] font-mono tabular-nums bg-black/80 text-[#D99B26] rounded">
                                #{idx + 1}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-semibold text-[#F5F2EB] group-hover:text-[#D99B26] line-clamp-2 leading-snug">
                                {ep.title}
                              </div>
                              <div className="mt-1.5 text-[11px] text-[#9C988E] font-mono tabular-nums">
                                {ep.views} {ep.publishedText ? `· ${ep.publishedText}` : ''}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* All Videos Grid (No Truncation Cap) */}
            {mode !== 'playlists_only' && (
              <div>
                <div className="flex items-center justify-between gap-4 mb-5 pt-4 border-t border-white/10">
                  <h3 className="text-base sm:text-lg font-semibold text-[#F5F2EB]">
                    វីដេអូទាំងអស់ពីឆានែល @tam_movie ({filteredVideos.length})
                  </h3>
                </div>

                {filteredVideos.length === 0 ? (
                  <div className="p-10 rounded-xl bg-[#141418] border border-white/10 text-center">
                    <p className="text-sm text-[#B8B4AB]">
                      រកមិនឃើញវីដេអូដែលត្រូវនឹងពាក្យស្វែងរក «{query}» ទេ។
                    </p>
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="mt-4 text-xs font-medium text-[#D99B26] hover:underline cursor-pointer"
                    >
                      បង្ហាញវីដេអូទាំងអស់វិញ
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.map((video) => (
                      <button
                        key={video.id}
                        type="button"
                        onClick={() => onPlayVideo(video)}
                        className="group flex flex-col text-left rounded-xl overflow-hidden bg-[#141418] border border-white/10 hover:border-[#D99B26]/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B26] cursor-pointer"
                      >
                        <div className="relative aspect-video w-full overflow-hidden bg-[#0E0E11]">
                          <SafeImage
                            src={video.thumbnail}
                            alt={video.title}
                            fallbackTitle={video.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                          <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-[11px] font-mono tabular-nums bg-black/85 text-[#F5F2EB] rounded">
                            {video.duration}
                          </span>

                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/25">
                            <span className="w-12 h-12 rounded-full bg-[#D99B26] text-[#0B0B0D] flex items-center justify-center shadow-md">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </span>
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <h4 className="text-[15px] font-semibold text-[#F5F2EB] group-hover:text-[#D99B26] transition-colors line-clamp-2 leading-snug">
                            {video.title}
                          </h4>

                          <div className="mt-3 flex items-center gap-2 text-xs text-[#9C988E] font-mono tabular-nums">
                            <span>{video.views} views</span>
                            {video.publishedText && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{video.publishedText}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
