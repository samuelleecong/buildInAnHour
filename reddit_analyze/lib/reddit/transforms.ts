import { RedditPost, SubredditMetadata, RedditApiPost, RedditApiSubreddit, TimeFilter, PostType } from '@/types/reddit';

export const transformRedditPost = (
  rawPost: RedditApiPost,
  index: number,
  timeFilter: TimeFilter,
  subredditInfo: RedditApiSubreddit
): RedditPost => {
  const fetchedAt = Date.now();
  const createdUtc = rawPost.created_utc * 1000;
  const ageHours = (fetchedAt - createdUtc) / (1000 * 60 * 60);
  const createdDate = new Date(createdUtc);

  const titleWords = rawPost.title.trim().split(/\s+/).length;
  const commentsPerUpvote = rawPost.score > 0
    ? rawPost.num_comments / rawPost.score
    : 0;
  const engagementRate = rawPost.score > 0
    ? (rawPost.num_comments + rawPost.total_awards_received) / rawPost.score
    : 0;

  // Determine if post has media
  const hasMedia = !!(
    rawPost.is_video ||
    rawPost.post_hint === 'image' ||
    rawPost.post_hint === 'video' ||
    rawPost.post_hint === 'rich:video' ||
    rawPost.media ||
    rawPost.secure_media
  );

  return {
    id: rawPost.id,
    permalink: `https://reddit.com${rawPost.permalink}`,
    url: rawPost.url,

    title: rawPost.title,
    selftext: rawPost.selftext || '',
    post_hint: (rawPost.post_hint || null) as PostType,
    domain: rawPost.domain,
    link_flair_text: rawPost.link_flair_text || null,

    score: rawPost.score,
    upvote_ratio: rawPost.upvote_ratio,
    num_comments: rawPost.num_comments,
    total_awards_received: rawPost.total_awards_received,
    all_awardings: rawPost.all_awardings?.map((award) => ({
      name: award.name,
      count: award.count,
      coin_price: award.coin_price,
    })) || [],

    created_utc: rawPost.created_utc,
    fetched_at: fetchedAt,
    day_of_week: createdDate.toLocaleDateString('en-US', { weekday: 'long' }),
    hour_of_day: createdDate.getHours(),
    age_when_fetched_hours: Math.round(ageHours * 100) / 100,

    author: rawPost.author,
    author_flair_text: rawPost.author_flair_text || null,
    is_original_content: rawPost.is_original_content || false,

    subreddit: rawPost.subreddit,
    subreddit_subscribers: subredditInfo?.subscribers || 0,

    title_length_chars: rawPost.title.length,
    title_length_words: titleWords,
    comments_per_upvote: Math.round(commentsPerUpvote * 1000) / 1000,
    engagement_rate: Math.round(engagementRate * 1000) / 1000,

    rank_position: index + 1,
    time_filter: timeFilter,

    has_media: hasMedia,
    is_video: rawPost.is_video,
    is_self: rawPost.is_self,
    is_gallery: rawPost.is_gallery || false,
    num_crossposts: rawPost.num_crossposts,
  };
};

export const transformSubredditMetadata = (rawData: RedditApiSubreddit): SubredditMetadata => ({
  name: rawData.name,
  display_name: rawData.display_name,
  title: rawData.title,
  public_description: rawData.public_description,
  subscribers: rawData.subscribers,
  active_user_count: rawData.active_user_count || 0,
  created_utc: rawData.created_utc,
  over18: rawData.over18,
  lang: rawData.lang,
  submission_type: rawData.submission_type,
});
