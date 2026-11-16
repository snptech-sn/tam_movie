import { useCallback, useEffect, useState } from 'react';
import { ComposerModal } from './components/ComposerModal';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PostReaderModal } from './components/PostReaderModal';
import { PostsSection, type PostFilter } from './components/PostsSection';
import { VideoGallery } from './components/VideoGallery';
import { VideoTheaterModal } from './components/VideoTheaterModal';
import { BUNDLED_COVERS } from './data/assets';
import { STATIC_SEED_POSTS } from './data/seedPosts';
import tamMovieSnapshot from './data/tamMovieSnapshot.json';
import type {
  ChannelInfo,
  ChannelPayload,
  Post,
  PostCategory,
  PostDraft,
  YouTubePlaylist,
  YouTubeVideo,
} from './types';

const LOCAL_POSTS_KEY = 'tam_movie_posts_v1';

const snapshotData = tamMovieSnapshot as {
  channel: ChannelInfo;
  videos: YouTubeVideo[];
  playlists: YouTubePlaylist[];
  playlistVideos: Record<string, YouTubeVideo[]>;
};

function extractYouTubeIdClient(input?: string): string | undefined {
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

function readLocalPosts(): Post[] {
  try {
    const raw = window.localStorage.getItem(LOCAL_POSTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return STATIC_SEED_POSTS;
}

function writeLocalPosts(posts: Post[]) {
  try {
    window.localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
  } catch {
    // ignore storage errors
  }
}

async function fetchJsonIfAvailable<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, init);
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      return null;
    }
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export default function App() {
  const [channel, setChannel] = useState<ChannelInfo | null>(snapshotData.channel);
  const [videos, setVideos] = useState<YouTubeVideo[]>(snapshotData.videos || []);
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>(snapshotData.playlists || []);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosSyncing, setVideosSyncing] = useState(false);
  const [videosError, setVideosError] = useState<string | null>(null);

  const [selectedPlaylist, setSelectedPlaylist] = useState<YouTubePlaylist | null>(null);
  const [playlistVideos, setPlaylistVideos] = useState<YouTubeVideo[]>([]);
  const [playlistLoading, setPlaylistLoading] = useState(false);

  const [posts, setPosts] = useState<Post[]>(() => readLocalPosts());
  const [postFilter, setPostFilter] = useState<PostFilter>('all');

  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);
  const [theaterQueue, setTheaterQueue] = useState<YouTubeVideo[] | null>(null);
  const [theaterQueueTitle, setTheaterQueueTitle] = useState<string | undefined>(undefined);
  const [activePost, setActivePost] = useState<Post | null>(null);

  const [composerOpen, setComposerOpen] = useState(false);
  const [composerCategory, setComposerCategory] = useState<PostCategory>('story');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [prefillVideo, setPrefillVideo] = useState<{
    title: string;
    youtubeUrl: string;
    coverImage: string;
    summary: string;
  } | null>(null);

  const loadChannel = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      setVideosSyncing(true);
    }
    setVideosError(null);
    const data = await fetchJsonIfAvailable<ChannelPayload>(
      `./api/channel${forceRefresh ? '?refresh=1' : ''}`
    );
    if (data && data.videos?.length) {
      setChannel(data.channel);
      setVideos(data.videos);
      setPlaylists(data.playlists || []);
    } else {
      // Static hosting fallback (GitHub Pages): use bundled snapshot seamlessly
      setChannel(snapshotData.channel);
      setVideos(snapshotData.videos || []);
      setPlaylists(snapshotData.playlists || []);
    }
    setVideosLoading(false);
    setVideosSyncing(false);
  }, []);

  const handleSelectPlaylist = useCallback(async (playlist: YouTubePlaylist | null) => {
    setSelectedPlaylist(playlist);
    if (!playlist) {
      setPlaylistVideos([]);
      return;
    }

    const cachedStatic = snapshotData.playlistVideos?.[playlist.id];
    if (cachedStatic?.length) {
      setPlaylistVideos(cachedStatic);
    } else {
      setPlaylistVideos([]);
    }

    setPlaylistLoading(!cachedStatic?.length);
    const liveData = await fetchJsonIfAvailable<{ playlistId: string; videos: YouTubeVideo[] }>(
      `./api/playlists/${playlist.id}`
    );
    if (liveData?.videos?.length) {
      setPlaylistVideos(liveData.videos);
    }
    setPlaylistLoading(false);
  }, []);

  const handlePlayVideo = useCallback(
    (video: YouTubeVideo, customQueue?: YouTubeVideo[], queueTitle?: string) => {
      setActiveVideo(video);
      setTheaterQueue(customQueue || null);
      setTheaterQueueTitle(queueTitle);
    },
    []
  );

  const loadPosts = useCallback(async () => {
    const data = await fetchJsonIfAvailable<Post[]>('./api/posts');
    if (data && Array.isArray(data)) {
      setPosts(data);
      writeLocalPosts(data);
    }
  }, []);

  useEffect(() => {
    loadChannel(false);
    loadPosts();
  }, [loadChannel, loadPosts]);

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash;
      if (hash === '#posts-story') setPostFilter('story');
      else if (hash === '#posts-song') setPostFilter('song');
      else if (hash === '#posts-news') setPostFilter('news');
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const handleOpenComposer = (defaultCategory: PostCategory = 'story') => {
    setEditingPost(null);
    setPrefillVideo(null);
    setComposerCategory(defaultCategory);
    setComposerOpen(true);
  };

  const handleWriteAboutVideo = (video: YouTubeVideo) => {
    setActiveVideo(null);
    setEditingPost(null);
    setPrefillVideo({
      title: video.title,
      youtubeUrl: video.url,
      coverImage: video.thumbnail,
      summary:
        video.description ||
        `ទស្សនា និងចែករំលែកអំពីវីដេអូ «${video.title}» ពីឆានែល តាមរឿង - Tam MOVIE។`,
    });
    setComposerCategory('story');
    setComposerOpen(true);
  };

  const handleSavePost = async (draft: PostDraft, editingId?: string) => {
    const method = editingId ? 'PUT' : 'POST';
    const endpoint = editingId ? `./api/posts/${editingId}` : './api/posts';

    const apiSaved = await fetchJsonIfAvailable<Post>(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });

    let saved: Post;
    if (apiSaved) {
      saved = apiSaved;
    } else {
      // Static GitHub Pages fallback using localStorage
      const ytId = extractYouTubeIdClient(draft.youtubeUrl);
      const defaultCover = ytId
        ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`
        : draft.category === 'song'
        ? BUNDLED_COVERS.musicVinyl
        : draft.category === 'news'
        ? BUNDLED_COVERS.phnomPenh
        : BUNDLED_COVERS.cinemaStory;

      const existing = editingId ? posts.find((p) => p.id === editingId) : undefined;
      const wordEstimate = Math.max(1, Math.ceil(draft.content.trim().split(/\s+/).length / 160));

      saved = {
        id: editingId || `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        category: draft.category,
        title: draft.title.trim(),
        author: draft.author.trim() || 'អ្នកនិពន្ធសហគមន៍',
        summary: draft.summary.trim() || draft.content.trim().slice(0, 140),
        content: draft.content.trim(),
        coverImage: draft.coverImage.trim() || defaultCover,
        youtubeUrl: draft.youtubeUrl?.trim() || undefined,
        youtubeId: ytId,
        audioUrl: draft.audioUrl?.trim() || undefined,
        lyrics: draft.lyrics?.trim() || undefined,
        artist: draft.artist?.trim() || undefined,
        readTime: draft.category === 'song' ? 'បទចម្រៀង' : `${wordEstimate} នាទី`,
        likes: existing?.likes ?? 0,
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: existing ? new Date().toISOString() : undefined,
      };
    }

    setPosts((prev) => {
      const next = editingId ? prev.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...prev];
      writeLocalPosts(next);
      return next;
    });
    if (activePost?.id === saved.id) {
      setActivePost(saved);
    }
    setPostFilter(saved.category);
  };

  const handleLikePost = async (id: string) => {
    const apiUpdated = await fetchJsonIfAvailable<Post>(`./api/posts/${id}/like`, {
      method: 'POST',
    });
    setPosts((prev) => {
      const next = prev.map((p) => {
        if (p.id !== id) return p;
        return apiUpdated || { ...p, likes: (p.likes || 0) + 1 };
      });
      writeLocalPosts(next);
      return next;
    });
    if (activePost?.id === id) {
      setActivePost((prev) =>
        prev ? apiUpdated || { ...prev, likes: (prev.likes || 0) + 1 } : null
      );
    }
  };

  const handleDeletePost = async (id: string) => {
    await fetchJsonIfAvailable<{ ok: boolean }>(`./api/posts/${id}`, { method: 'DELETE' });
    setPosts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      writeLocalPosts(next);
      return next;
    });
    if (activePost?.id === id) {
      setActivePost(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0D] text-[#F5F2EB]">
      <Header onOpenComposer={() => handleOpenComposer('story')} />

      <main className="flex-1">
        <HeroSection
          channel={channel}
          featuredVideo={videos[0] || null}
          syncedVideosCount={videos.length}
          playlistsCount={playlists.length}
          postsCount={posts.length}
          onPlayVideo={(v) => handlePlayVideo(v)}
        />

        <VideoGallery
          videos={videos}
          playlists={playlists}
          loading={videosLoading}
          syncing={videosSyncing}
          error={videosError}
          selectedPlaylist={selectedPlaylist}
          playlistVideos={playlistVideos}
          playlistLoading={playlistLoading}
          onRefresh={() => loadChannel(true)}
          onSelectPlaylist={handleSelectPlaylist}
          onPlayVideo={handlePlayVideo}
        />

        <PostsSection
          posts={posts}
          activeFilter={postFilter}
          onChangeFilter={setPostFilter}
          onSelectPost={setActivePost}
          onOpenComposer={handleOpenComposer}
        />
      </main>

      <footer className="border-t border-white/10 bg-[#09090B]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#9C988E]">
          <div>
            <span className="font-semibold text-[#F5F2EB]">តាមរឿង · Tam MOVIE</span>
            <span className="mx-2 text-white/25">·</span>
            <span>វីដេអូភាពយន្ត រឿង បទចម្រៀង និងព័ត៌មានខ្មែរ</span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <a
              href="https://www.youtube.com/@tam_movie"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D99B26] transition-colors"
            >
              YouTube (@tam_movie)
            </a>
            <a
              href="https://t.me/tam_movie"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D99B26] transition-colors"
            >
              Telegram
            </a>
            <a
              href="https://www.tiktok.com/@tam_movie7"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D99B26] transition-colors"
            >
              TikTok
            </a>
            <a
              href="https://www.facebook.com/tammovies099"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D99B26] transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      </footer>

      <VideoTheaterModal
        video={activeVideo}
        upNext={theaterQueue || videos}
        queueTitle={theaterQueueTitle}
        onClose={() => {
          setActiveVideo(null);
          setTheaterQueue(null);
          setTheaterQueueTitle(undefined);
        }}
        onSelectVideo={(v) => setActiveVideo(v)}
        onWriteAboutVideo={handleWriteAboutVideo}
      />

      <PostReaderModal
        post={activePost}
        onClose={() => setActivePost(null)}
        onLike={handleLikePost}
        onEdit={(post) => {
          setActivePost(null);
          setEditingPost(post);
          setPrefillVideo(null);
          setComposerOpen(true);
        }}
        onDelete={handleDeletePost}
      />

      <ComposerModal
        open={composerOpen}
        initialCategory={composerCategory}
        editingPost={editingPost}
        prefillFromVideo={prefillVideo}
        onClose={() => {
          setComposerOpen(false);
          setEditingPost(null);
          setPrefillVideo(null);
        }}
        onSave={handleSavePost}
      />
    </div>
  );
}
