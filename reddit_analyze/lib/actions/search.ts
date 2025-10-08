'use server';

import { redditClient } from '@/lib/reddit/client';
import { transformRedditPost, transformSubredditMetadata } from '@/lib/reddit/transforms';
import { SearchSnapshot, TimeFilter } from '@/types/reddit';

export const searchSubreddit = async (
  subreddit: string,
  timeFilter: TimeFilter = 'week'
): Promise<SearchSnapshot> => {
  try {
    // Fetch subreddit info and top posts in parallel
    const [rawPosts, subredditInfo] = await Promise.all([
      redditClient.getTopPosts(subreddit, timeFilter, 100),
      redditClient.getSubredditInfo(subreddit),
    ]);

    // Transform posts
    const posts = rawPosts.map((rawPost, index) =>
      transformRedditPost(rawPost, index, timeFilter, subredditInfo)
    );

    // Create snapshot
    const snapshot: SearchSnapshot = {
      query_id: `${subreddit}-${timeFilter}-${Date.now()}`,
      timestamp: Date.now(),
      subreddit,
      time_filter: timeFilter,
      subreddit_metadata: transformSubredditMetadata(subredditInfo),
      posts,
      total_posts_fetched: posts.length,
    };

    return snapshot;
  } catch (error) {
    console.error('Error searching subreddit:', error);
    throw error;
  }
};
