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

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
