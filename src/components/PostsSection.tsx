import { useMemo, useState } from 'react';
import { Heart, Music2, Play, Plus, Search } from 'lucide-react';
import type { Post, PostCategory } from '../types';
import { SafeImage } from './SafeImage';

export type PostFilter = 'all' | PostCategory;

interface PostsSectionProps {
  posts: Post[];
  activeFilter: PostFilter;
  onChangeFilter: (filter: PostFilter) => void;
  onSelectPost: (post: Post) => void;
  onOpenComposer: (defaultCategory?: PostCategory) => void;
}

const CATEGORY_LABELS: Record<PostCategory, string> = {
  story: 'រឿង',
  song: 'បទចម្រៀង',
  news: 'ព័ត៌មាន',
};

function formatKhmerDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('km-KH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso.slice(0, 10);
  }
}

export function PostsSection({
  posts,
  activeFilter,
  onChangeFilter,
  onSelectPost,
  onOpenComposer,
}: PostsSectionProps) {
  const [query, setQuery] = useState('');

  const counts = useMemo(() => {
    return {
      all: posts.length,
      story: posts.filter((p) => p.category === 'story').length,
      song: posts.filter((p) => p.category === 'song').length,
      news: posts.filter((p) => p.category === 'news').length,
    };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (activeFilter !== 'all' && post.category !== activeFilter) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q) ||
        (post.artist && post.artist.toLowerCase().includes(q))
      );
    });
  }, [posts, activeFilter, query]);

  const leadPost = filteredPosts.length >= 3 ? filteredPosts[0] : null;
  const gridPosts = leadPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <section id="posts" className="py-14 lg:py-20 bg-[#0E0E12]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hidden anchor markers for direct header links */}
        <span id="posts-story" className="sr-only" />
        <span id="posts-song" className="sr-only" />
        <span id="posts-news" className="sr-only" />

        {/* Section Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <p className="text-xs font-medium text-[#D99B26] mb-2">
              សហគមន៍ និងការបោះពុម្ពផ្សាយ
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F2EB]">
              រឿង បទចម្រៀង និងព័ត៌មានផ្សេងៗ
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:flex-initial sm:w-56">
              <Search className="w-4 h-4 text-[#9C988E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ស្វែងរកអត្ថបទ..."
                aria-label="ស្វែងរករឿង បទចម្រៀង ឬព័ត៌មាន"
                className="w-full pl-9 pr-3 py-2 min-h-[40px] rounded-lg bg-[#141418] border border-white/10 text-sm text-[#F5F2EB] placeholder:text-[#7E7B73] focus:outline-none focus:border-[#D99B26]"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#141418] border border-white/10 rounded-lg overflow-x-auto">
              {(
                [
                  { id: 'all', label: `ទាំងអស់ (${counts.all})` },
                  { id: 'story', label: `រឿង (${counts.story})` },
                  { id: 'song', label: `បទចម្រៀង (${counts.song})` },
                  { id: 'news', label: `ព័ត៌មាន (${counts.news})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onChangeFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 tabular-nums cursor-pointer ${
                    activeFilter === tab.id
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
              onClick={() => onOpenComposer(activeFilter === 'all' ? 'story' : activeFilter)}
              className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg border border-[#D99B26]/60 text-xs font-semibold text-[#D99B26] hover:bg-[#D99B26] hover:text-[#0B0B0D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>បង្ហោះថ្មី</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 ? (
          <div className="mt-10 p-12 rounded-xl bg-[#141418] border border-white/10 text-center">
            <p className="text-base text-[#D6D2C9]">
              មិនទាន់មានមាតិកានៅក្នុងផ្នែកនេះនៅឡើយទេ។
            </p>
            <button
              type="button"
              onClick={() => onOpenComposer(activeFilter === 'all' ? 'story' : activeFilter)}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D99B26] text-[#0B0B0D] text-sm font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>បង្ហោះមាតិកាដំបូង</span>
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {/* Lead Editorial Feature (Tier 1 Salience) */}
            {leadPost && (
              <button
                type="button"
                onClick={() => onSelectPost(leadPost)}
                className="group w-full grid grid-cols-1 lg:grid-cols-12 rounded-xl overflow-hidden bg-[#141418] border border-white/10 hover:border-[#D99B26]/50 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B26] cursor-pointer"
              >
                <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[340px] bg-[#0B0B0D] overflow-hidden">
                  <SafeImage
                    src={leadPost.coverImage}
                    alt={leadPost.title}
                    fallbackTitle={leadPost.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  {(leadPost.youtubeId || leadPost.audioUrl) && (
                    <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 text-xs font-medium text-[#F5F2EB]">
                      {leadPost.category === 'song' ? (
                        <Music2 className="w-3.5 h-3.5 text-[#D99B26]" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-[#D99B26] fill-current" />
                      )}
                      <span>មានវីដេអូ / សំឡេង</span>
                    </span>
                  )}
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#9C988E]">
                      <span className="text-[#D99B26] font-semibold">
                        {CATEGORY_LABELS[leadPost.category]}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{formatKhmerDate(leadPost.createdAt)}</span>
                      {leadPost.readTime && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{leadPost.readTime}</span>
                        </>
                      )}
                    </div>

                    <h3 className="mt-3 font-serif text-2xl sm:text-[1.75rem] font-bold text-[#F5F2EB] group-hover:text-[#D99B26] transition-colors leading-snug">
                      {leadPost.title}
                    </h3>

                    <p className="mt-4 text-sm sm:text-[15px] text-[#B8B4AB] leading-relaxed line-clamp-3">
                      {leadPost.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#9C988E]">
                    <span className="text-[#E8E4DC] font-medium">
                      {leadPost.artist ? `${leadPost.artist} · ${leadPost.author}` : leadPost.author}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
                      <Heart className="w-3.5 h-3.5 text-[#D99B26]" />
                      {leadPost.likes}
                    </span>
                  </div>
                </div>
              </button>
            )}

            {/* Editorial 3-Column Grid (Tier 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => onSelectPost(post)}
                  className="group flex flex-col text-left rounded-xl overflow-hidden bg-[#141418] border border-white/10 hover:border-[#D99B26]/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B26] cursor-pointer"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0B0B0D]">
                    <SafeImage
                      src={post.coverImage}
                      alt={post.title}
                      fallbackTitle={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    {(post.youtubeId || post.audioUrl) && (
                      <span className="absolute bottom-2.5 right-2.5 inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/80 text-[#D99B26]">
                        {post.category === 'song' ? (
                          <Music2 className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#9C988E]">
                        <span className="text-[#D99B26] font-semibold">
                          {CATEGORY_LABELS[post.category]}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{formatKhmerDate(post.createdAt)}</span>
                        {post.readTime && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{post.readTime}</span>
                          </>
                        )}
                      </div>

                      <h3 className="mt-2.5 font-serif text-lg font-bold text-[#F5F2EB] group-hover:text-[#D99B26] transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      <p className="mt-2.5 text-sm text-[#B8B4AB] line-clamp-2 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-[#9C988E]">
                      <span className="truncate max-w-[75%] text-[#D6D2C9]">
                        {post.artist || post.author}
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono tabular-nums shrink-0">
                        <Heart className="w-3.5 h-3.5 text-[#D99B26]" />
                        {post.likes}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
