'use client';

import { RedditPost } from '@/types/reddit';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, MessageSquare, Award, ExternalLink } from 'lucide-react';

interface PostCardProps {
  post: RedditPost;
}

const formatAge = (hours: number): string => {
  if (hours < 1) return `${Math.round(hours * 60)}m ago`;
  if (hours < 24) return `${Math.round(hours)}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="secondary" className="shrink-0">
            #{post.rank_position}
          </Badge>
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 group"
          >
            <h3 className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
          </a>
          <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ArrowUp className="h-4 w-4" />
            <span className="font-medium">{post.score.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.num_comments.toLocaleString()}</span>
          </div>
          {post.total_awards_received > 0 && (
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4 text-yellow-500" />
              <span>{post.total_awards_received.toLocaleString()}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>u/{post.author}</span>
          <span>{formatAge(post.age_when_fetched_hours)}</span>
        </div>
        {post.link_flair_text && (
          <Badge variant="outline" className="text-xs">
            {post.link_flair_text}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};
