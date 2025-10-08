export type TimeFilter = 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
export type PostType = 'self' | 'link' | 'image' | 'video' | 'rich:video' | null;

export interface RedditPost {
  // Core identifiers
  id: string;
  permalink: string;
  url: string;

  // Content
  title: string;
  selftext: string;
  post_hint: PostType;
  domain: string;
  link_flair_text: string | null;

  // Engagement
  score: number;
  upvote_ratio: number;
  num_comments: number;
  total_awards_received: number;
  all_awardings: Award[];

  // Temporal
  created_utc: number;
  fetched_at: number;
  day_of_week: string;
  hour_of_day: number;
  age_when_fetched_hours: number;

  // Author
  author: string;
  author_flair_text: string | null;
  is_original_content: boolean;

  // Context
  subreddit: string;
  subreddit_subscribers: number;

  // Derived metrics
  title_length_chars: number;
  title_length_words: number;
  comments_per_upvote: number;
  engagement_rate: number;

  // Rankings
  rank_position: number;
  time_filter: TimeFilter;

  // Additional metadata for LLM analysis
  has_media: boolean;
  is_video: boolean;
  is_self: boolean;
  is_gallery: boolean;
  num_crossposts: number;
}

export interface Award {
  name: string;
  count: number;
  coin_price: number;
}

export interface SubredditMetadata {
  name: string;
  display_name: string;
  title: string;
  public_description: string;
  subscribers: number;
  active_user_count: number;
  created_utc: number;
  over18: boolean;
  lang: string;
  submission_type: string;
}

export interface SearchSnapshot {
  query_id: string;
  timestamp: number;
  subreddit: string;
  time_filter: TimeFilter;
  subreddit_metadata: SubredditMetadata;
  posts: RedditPost[];
  total_posts_fetched: number;
}

// Reddit API raw response types
export interface RedditApiPost {
  id: string;
  permalink: string;
  url: string;
  title: string;
  selftext?: string;
  post_hint?: string;
  domain: string;
  link_flair_text?: string;
  score: number;
  upvote_ratio: number;
  num_comments: number;
  total_awards_received: number;
  all_awardings?: Array<{
    name: string;
    count: number;
    coin_price: number;
  }>;
  created_utc: number;
  author: string;
  author_flair_text?: string;
  is_original_content?: boolean;
  subreddit: string;
  is_video: boolean;
  is_self: boolean;
  is_gallery?: boolean;
  num_crossposts: number;
  media?: any;
  secure_media?: any;
}

export interface RedditApiSubreddit {
  name: string;
  display_name: string;
  title: string;
  public_description: string;
  subscribers: number;
  active_user_count?: number;
  created_utc: number;
  over18: boolean;
  lang: string;
  submission_type: string;
}

// Reddit API response wrappers
export interface RedditApiResponse<T> {
  kind: string;
  data: T;
}

export interface RedditApiListing {
  children: Array<{
    kind: string;
    data: RedditApiPost;
  }>;
  after: string | null;
  before: string | null;
  dist: number;
}
