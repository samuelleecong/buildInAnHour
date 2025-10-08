'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchSnapshot } from '@/types/reddit';
import { SubredditHeader } from '@/components/subreddit-header';
import { PostGrid } from '@/components/post-grid';
import { ExportButton } from '@/components/export-button';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ResultsPage() {
  const [snapshot, setSnapshot] = useState<SearchSnapshot | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = sessionStorage.getItem('reddit_snapshot');

    if (!storedData) {
      router.push('/');
      return;
    }

    try {
      const parsedSnapshot = JSON.parse(storedData) as SearchSnapshot;
      setSnapshot(parsedSnapshot);
    } catch (error) {
      console.error('Error parsing snapshot:', error);
      router.push('/');
    }
  }, [router]);

  if (!snapshot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            New Search
          </Button>
          <ExportButton snapshot={snapshot} />
        </div>

        <SubredditHeader
          metadata={snapshot.subreddit_metadata}
          timeFilter={snapshot.time_filter}
          totalPosts={snapshot.total_posts_fetched}
        />

        <PostGrid posts={snapshot.posts} />
      </div>
    </div>
  );
}
