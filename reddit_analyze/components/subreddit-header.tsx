'use client';

import { SubredditMetadata, TimeFilter } from '@/types/reddit';
import { Badge } from '@/components/ui/badge';
import { Users, FileText } from 'lucide-react';

interface SubredditHeaderProps {
  metadata: SubredditMetadata;
  timeFilter: TimeFilter;
  totalPosts: number;
}

export const SubredditHeader = ({
  metadata,
  timeFilter,
  totalPosts,
}: SubredditHeaderProps) => {
  const timeFilterLabels: Record<TimeFilter, string> = {
    hour: 'Past Hour',
    day: 'Past 24 Hours',
    week: 'Past Week',
    month: 'Past Month',
    year: 'Past Year',
    all: 'All Time',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">r/{metadata.display_name}</h1>
          {metadata.public_description && (
            <p className="text-muted-foreground">{metadata.public_description}</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {metadata.subscribers.toLocaleString()} subscribers
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          {totalPosts.toLocaleString()} posts
        </Badge>
        <Badge variant="outline">{timeFilterLabels[timeFilter]}</Badge>
      </div>
    </div>
  );
};
