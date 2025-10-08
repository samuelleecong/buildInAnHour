'use client';

import { RedditPost } from '@/types/reddit';
import { PostCard } from './post-card';

interface PostGridProps {
  posts: RedditPost[];
}

export const PostGrid = ({ posts }: PostGridProps) => {
  if (!posts.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No posts found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
