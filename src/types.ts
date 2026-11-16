export type PostCategory = 'story' | 'song' | 'news';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishedText: string;
  publishedAt?: string;
  description: string;
  url: string;
}

export interface ChannelInfo {
  title: string;
  handle: string;
  channelId: string;
  url: string;
  avatar: string;
  banner: string;
  subscribers: string;
  videoCount: string;
  description: string;
  syncedAt: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  videoCountText: string;
  videoCount: number;
  thumbnail: string;
  url: string;
}

export interface ChannelPayload {
  channel: ChannelInfo;
  videos: YouTubeVideo[];
  playlists: YouTubePlaylist[];
}

export interface Post {
  id: string;
  category: PostCategory;
  title: string;
  author: string;
  summary: string;
  content: string;
  coverImage: string;
  youtubeUrl?: string;
  youtubeId?: string;
  audioUrl?: string;
  lyrics?: string;
  artist?: string;
  readTime?: string;
  likes: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PostDraft {
  category: PostCategory;
  title: string;
  author: string;
  summary: string;
  content: string;
  coverImage: string;
  youtubeUrl?: string;
  audioUrl?: string;
  lyrics?: string;
  artist?: string;
}
