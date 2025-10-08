'use server';

import { redditClient } from '@/lib/reddit/client';
import { transformRedditPost, transformSubredditMetadata } from '@/lib/reddit/transforms';
import { saveSnapshot } from '@/lib/storage/snapshots';
import { SearchSnapshot, TimeFilter } from '@/types/reddit';
import { nanoid } from 'nanoid';

export const searchSubreddit = async (
  subreddit: string,
  timeFilter: TimeFilter = 'week',
  limit: number = 100
): Promise<SearchSnapshot> => {
  try {
    // Validate inputs
    if (!subreddit || subreddit.trim().length === 0) {
      throw new Error('Subreddit name is required');
    }

    const sanitizedSubreddit = subreddit.trim().toLowerCase().replace(/^r\//, '');

    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    // Fetch subreddit info and top posts in parallel
    const [subredditInfo, rawPosts] = await Promise.all([
      redditClient.getSubredditInfo(sanitizedSubreddit),
      redditClient.getTopPosts(sanitizedSubreddit, timeFilter, limit),
    ]);

    // Transform the raw Reddit posts
    const transformedPosts = rawPosts.map((rawPost, index) =>
      transformRedditPost(rawPost, index, timeFilter, subredditInfo)
    );

    // Create the search snapshot
    const snapshot: SearchSnapshot = {
      query_id: nanoid(),
      timestamp: Date.now(),
      subreddit: sanitizedSubreddit,
      time_filter: timeFilter,
      subreddit_metadata: transformSubredditMetadata(subredditInfo),
      posts: transformedPosts,
      total_posts_fetched: transformedPosts.length,
    };

    // Save the snapshot to disk
    await saveSnapshot(snapshot);

    return snapshot;
  } catch (error) {
    // Handle specific error types with user-friendly messages
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        throw new Error(`Subreddit "${subreddit}" not found. Please check the name and try again.`);
      }
      if (error.message.includes('forbidden') || error.message.includes('private')) {
        throw new Error(`Cannot access r/${subreddit}. This subreddit may be private or restricted.`);
      }
      if (error.message.includes('Rate limit')) {
        throw new Error('Reddit rate limit exceeded. Please wait a few minutes and try again.');
      }
      // Re-throw validation errors
      if (error.message.includes('required') || error.message.includes('must be')) {
        throw error;
      }
      // Generic error with context
      throw new Error(`Failed to fetch data from r/${subreddit}: ${error.message}`);
    }

    // Fallback for unknown errors
    throw new Error(`An unexpected error occurred while fetching data from r/${subreddit}`);
  }
};
