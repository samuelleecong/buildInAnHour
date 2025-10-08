# Implementation Plan: Reddit Virality Analyzer - Phase 1

## Project Structure

```
reddit_analyze/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home/Search page
│   ├── results/
│   │   └── page.tsx              # Results display page
│   ├── api/
│   │   └── reddit/
│   │       ├── search/
│   │       │   └── route.ts      # Search API route
│   │       └── subreddit/
│   │           └── route.ts      # Subreddit info route
│   └── actions/
│       └── reddit.ts             # Server Actions
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── search-form.tsx           # Search interface
│   ├── time-filter.tsx           # Time period selector
│   ├── post-card.tsx             # Individual post display
│   ├── post-grid.tsx             # Posts container
│   ├── subreddit-header.tsx      # Subreddit metadata display
│   ├── export-button.tsx         # Export functionality
│   └── loading-skeleton.tsx      # Loading states
├── lib/
│   ├── reddit/
│   │   ├── client.ts             # Reddit API client
│   │   ├── types.ts              # TypeScript types
│   │   └── transforms.ts         # Data transformation
│   ├── storage/
│   │   ├── snapshots.ts          # Snapshot storage logic
│   │   └── exports.ts            # Export functionality
│   └── utils.ts                  # Utility functions
├── data/
│   └── snapshots/                # JSON snapshots storage
├── types/
│   └── reddit.ts                 # Shared types
└── public/
    └── ...
```

---

## Step-by-Step Implementation

### Step 1: Project Setup & Dependencies

```bash
# Initialize Next.js 15 project (if not already done)
npx create-next-app@latest reddit-analyze --typescript --tailwind --app

# Install dependencies
npm install @radix-ui/react-select @radix-ui/react-dialog
npm install date-fns
npm install snoowrap # Reddit API wrapper
npm install lucide-react # Icons
npm install zod # Validation

# Install shadcn/ui components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
```

### Step 2: Define TypeScript Types

**File: `types/reddit.ts`**

```typescript
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
```

### Step 3: Reddit API Client

**File: `lib/reddit/client.ts`**

```typescript
import { RedditPost, SubredditMetadata, TimeFilter } from '@/types/reddit';

export class RedditClient {
  private baseUrl = 'https://www.reddit.com';
  private userAgent = 'RedditViralityAnalyzer/1.0';

  private async fetch(endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'User-Agent': this.userAgent,
      },
      next: { revalidate: 900 }, // Cache for 15 minutes
    });

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  async getTopPosts(
    subreddit: string,
    timeFilter: TimeFilter = 'week',
    limit: number = 100
  ): Promise<any[]> {
    const data = await this.fetch(
      `/r/${subreddit}/top.json?t=${timeFilter}&limit=${limit}`
    );
    return data.data.children.map((child: any) => child.data);
  }

  async getSubredditInfo(subreddit: string): Promise<any> {
    const data = await this.fetch(`/r/${subreddit}/about.json`);
    return data.data;
  }
}

export const redditClient = new RedditClient();
```

**File: `lib/reddit/transforms.ts`**

```typescript
import { RedditPost, SubredditMetadata } from '@/types/reddit';

export const transformRedditPost = (
  rawPost: any,
  index: number,
  timeFilter: string,
  subredditInfo: any
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

  return {
    id: rawPost.id,
    permalink: `https://reddit.com${rawPost.permalink}`,
    url: rawPost.url,

    title: rawPost.title,
    selftext: rawPost.selftext || '',
    post_hint: rawPost.post_hint || null,
    domain: rawPost.domain,
    link_flair_text: rawPost.link_flair_text || null,

    score: rawPost.score,
    upvote_ratio: rawPost.upvote_ratio,
    num_comments: rawPost.num_comments,
    total_awards_received: rawPost.total_awards_received,
    all_awardings: rawPost.all_awardings?.map((award: any) => ({
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
    time_filter: timeFilter as any,
  };
};

export const transformSubredditMetadata = (rawData: any): SubredditMetadata => ({
  name: rawData.name,
  display_name: rawData.display_name,
  title: rawData.title,
  public_description: rawData.public_description,
  subscribers: rawData.subscribers,
  active_user_count: rawData.active_user_count || 0,
  created_utc: rawData.created_utc,
  over18: rawData.over18,
});
```

### Step 4: Storage Layer

**File: `lib/storage/snapshots.ts`**

```typescript
import fs from 'fs/promises';
import path from 'path';
import { SearchSnapshot } from '@/types/reddit';

const DATA_DIR = path.join(process.cwd(), 'data', 'snapshots');

export const saveSnapshot = async (snapshot: SearchSnapshot): Promise<string> => {
  const subredditDir = path.join(DATA_DIR, snapshot.subreddit);

  // Ensure directory exists
  await fs.mkdir(subredditDir, { recursive: true });

  const filename = `${snapshot.timestamp}_${snapshot.time_filter}.json`;
  const filepath = path.join(subredditDir, filename);

  await fs.writeFile(filepath, JSON.stringify(snapshot, null, 2), 'utf-8');

  return filepath;
};

export const getSnapshots = async (subreddit?: string): Promise<SearchSnapshot[]> => {
  try {
    const searchDir = subreddit
      ? path.join(DATA_DIR, subreddit)
      : DATA_DIR;

    const files = await fs.readdir(searchDir, { recursive: true });
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    const snapshots = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(
          path.join(searchDir, file as string),
          'utf-8'
        );
        return JSON.parse(content) as SearchSnapshot;
      })
    );

    return snapshots.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    return [];
  }
};
```

**File: `lib/storage/exports.ts`**

```typescript
import { SearchSnapshot } from '@/types/reddit';

export const exportToJSON = (snapshot: SearchSnapshot): Blob => {
  const json = JSON.stringify(snapshot, null, 2);
  return new Blob([json], { type: 'application/json' });
};

export const exportToCSV = (snapshot: SearchSnapshot): Blob => {
  const headers = [
    'Rank',
    'Title',
    'Score',
    'Comments',
    'Upvote Ratio',
    'Awards',
    'Author',
    'Type',
    'Created',
    'Age (hours)',
    'URL',
  ];

  const rows = snapshot.posts.map(post => [
    post.rank_position,
    `"${post.title.replace(/"/g, '""')}"`,
    post.score,
    post.num_comments,
    post.upvote_ratio,
    post.total_awards_received,
    post.author,
    post.post_hint || 'text',
    new Date(post.created_utc * 1000).toISOString(),
    post.age_when_fetched_hours,
    post.permalink,
  ]);

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  return new Blob([csv], { type: 'text/csv' });
};
```

### Step 5: Server Actions

**File: `app/actions/reddit.ts`**

```typescript
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
    // Fetch data from Reddit
    const [posts, subredditInfo] = await Promise.all([
      redditClient.getTopPosts(subreddit, timeFilter, limit),
      redditClient.getSubredditInfo(subreddit),
    ]);

    // Transform data
    const transformedPosts = posts.map((post, index) =>
      transformRedditPost(post, index, timeFilter, subredditInfo)
    );

    const snapshot: SearchSnapshot = {
      query_id: nanoid(),
      timestamp: Date.now(),
      subreddit,
      time_filter: timeFilter,
      subreddit_metadata: transformSubredditMetadata(subredditInfo),
      posts: transformedPosts,
      total_posts_fetched: transformedPosts.length,
    };

    // Save snapshot
    await saveSnapshot(snapshot);

    return snapshot;
  } catch (error) {
    console.error('Error searching subreddit:', error);
    throw new Error(`Failed to fetch data from r/${subreddit}`);
  }
};
```

### Step 6: UI Components

**Component 1: Search Form**
```typescript
// components/search-form.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TimeFilter } from '@/types/reddit';
import TimeFilterSelect from './time-filter';

interface Props {
  onSearch: (subreddit: string, timeFilter: TimeFilter) => void;
  isLoading?: boolean;
}

export default function SearchForm({ onSearch, isLoading }: Props) {
  const [subreddit, setSubreddit] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subreddit.trim()) {
      onSearch(subreddit.trim(), timeFilter);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter subreddit name..."
          value={subreddit}
          onChange={(e) => setSubreddit(e.target.value)}
          disabled={isLoading}
          className="flex-1"
        />
        <TimeFilterSelect
          value={timeFilter}
          onChange={setTimeFilter}
          disabled={isLoading}
        />
      </div>
      <Button type="submit" disabled={isLoading || !subreddit.trim()}>
        {isLoading ? 'Searching...' : 'Analyze Subreddit'}
      </Button>
    </form>
  );
}
```

**Component 2: Post Card**
```typescript
// components/post-card.tsx
import { RedditPost } from '@/types/reddit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, MessageSquare, Award } from 'lucide-react';

interface Props {
  post: RedditPost;
}

export default function PostCard({ post }: Props) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {post.rank_position}. {post.title}
            </a>
          </CardTitle>
        </div>
        {post.link_flair_text && (
          <Badge variant="secondary">{post.link_flair_text}</Badge>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ArrowUp className="h-4 w-4" />
            {post.score.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {post.num_comments.toLocaleString()}
          </div>
          {post.total_awards_received > 0 && (
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4 text-yellow-500" />
              {post.total_awards_received}
            </div>
          )}
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          by u/{post.author} • {post.age_when_fetched_hours}h ago
        </div>
      </CardContent>
    </Card>
  );
}
```

### Step 7: Main Pages

**Home Page:**
```typescript
// app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchForm from '@/components/search-form';
import { searchSubreddit } from './actions/reddit';
import { TimeFilter } from '@/types/reddit';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (subreddit: string, timeFilter: TimeFilter) => {
    setIsLoading(true);
    try {
      const snapshot = await searchSubreddit(subreddit, timeFilter);
      // Store in sessionStorage for results page
      sessionStorage.setItem('currentSnapshot', JSON.stringify(snapshot));
      router.push('/results');
    } catch (error) {
      console.error(error);
      alert('Failed to fetch subreddit data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Reddit Virality Analyzer</h1>
        <p className="text-muted-foreground mb-8">
          Analyze top posts from any subreddit to understand what makes content viral
        </p>
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      </div>
    </main>
  );
}
```

---

## Environment Variables

Create `.env.local`:

```env
# Reddit API (for OAuth in future)
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
REDDIT_USERNAME=
REDDIT_PASSWORD=

# Optional: LLM API keys for Phase 2
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

---

## Testing Strategy

### Unit Tests
- Reddit client methods
- Data transformation functions
- Storage layer

### Integration Tests
- Server Actions
- API routes
- End-to-end search flow

### Manual Testing Checklist
- [ ] Search valid subreddit
- [ ] Search invalid subreddit (error handling)
- [ ] All time filters work
- [ ] Data displays correctly
- [ ] Export to JSON works
- [ ] Export to CSV works
- [ ] Snapshots save correctly
- [ ] Loading states appear
- [ ] Responsive on mobile

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Data directory configured
- [ ] Vercel deployment settings
- [ ] Domain configured (optional)
- [ ] Analytics setup (optional)

---

## Next Steps After Phase 1

1. **Data Accumulation:** Run regular searches to build historical dataset
2. **Pattern Analysis:** Analyze collected data for trends
3. **LLM Integration:** Design and test prompt engineering
4. **Feedback Loop:** User testing and iteration

---

## Resources

- Next.js 15 Docs: https://nextjs.org/docs
- Reddit API: https://www.reddit.com/dev/api
- shadcn/ui: https://ui.shadcn.com
- Radix UI: https://www.radix-ui.com
