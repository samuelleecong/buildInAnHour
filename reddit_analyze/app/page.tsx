'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchForm } from '@/components/search-form';
import { searchSubreddit } from '@/lib/actions/search';
import { TimeFilter } from '@/types/reddit';
import { toast } from 'sonner';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (subreddit: string, timeFilter: TimeFilter) => {
    setIsLoading(true);

    try {
      const snapshot = await searchSubreddit(subreddit, timeFilter);

      // Store snapshot in sessionStorage
      sessionStorage.setItem('reddit_snapshot', JSON.stringify(snapshot));

      // Navigate to results page
      router.push('/results');
    } catch (error) {
      console.error('Search error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch subreddit data. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Reddit Virality Analyzer
          </h1>
          <p className="text-lg text-muted-foreground">
            Analyze top posts from any subreddit to understand what makes content go viral
          </p>
        </div>
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      </div>
    </div>
  );
}
