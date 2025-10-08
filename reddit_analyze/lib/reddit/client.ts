import {
  TimeFilter,
  RedditApiPost,
  RedditApiSubreddit,
  RedditApiResponse,
  RedditApiListing
} from '@/types/reddit';

export class RedditClient {
  private baseUrl = 'https://www.reddit.com';
  private userAgent = 'RedditViralityAnalyzer/1.0';

  private async fetchApi<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'User-Agent': this.userAgent,
      },
      next: { revalidate: 900 }, // Cache for 15 minutes
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Subreddit not found`);
      }
      if (response.status === 403) {
        throw new Error(`Access forbidden - subreddit may be private`);
      }
      if (response.status === 429) {
        throw new Error(`Rate limit exceeded - please try again later`);
      }
      throw new Error(`Reddit API error: ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  }

  async getTopPosts(
    subreddit: string,
    timeFilter: TimeFilter = 'week',
    limit: number = 100
  ): Promise<RedditApiPost[]> {
    try {
      const data = await this.fetchApi<RedditApiResponse<RedditApiListing>>(
        `/r/${subreddit}/top.json?t=${timeFilter}&limit=${limit}`
      );
      return data.data.children.map(child => child.data);
    } catch (error) {
      console.error('Error fetching top posts:', error);
      throw error;
    }
  }

  async getSubredditInfo(subreddit: string): Promise<RedditApiSubreddit> {
    try {
      const data = await this.fetchApi<RedditApiResponse<RedditApiSubreddit>>(`/r/${subreddit}/about.json`);
      return data.data;
    } catch (error) {
      console.error('Error fetching subreddit info:', error);
      throw error;
    }
  }
}

export const redditClient = new RedditClient();
