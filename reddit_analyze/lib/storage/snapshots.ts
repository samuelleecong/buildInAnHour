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

    // Check if directory exists
    try {
      await fs.access(searchDir);
    } catch {
      return [];
    }

    const files = await fs.readdir(searchDir, { recursive: true, withFileTypes: true });
    const jsonFiles = files
      .filter(f => f.isFile() && f.name.endsWith('.json'))
      .map(f => path.join(f.path || searchDir, f.name));

    const snapshots = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(file, 'utf-8');
        return JSON.parse(content) as SearchSnapshot;
      })
    );

    return snapshots.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error getting snapshots:', error);
    return [];
  }
};

export const getSnapshotById = async (queryId: string): Promise<SearchSnapshot | null> => {
  try {
    const allSnapshots = await getSnapshots();
    return allSnapshots.find(s => s.query_id === queryId) || null;
  } catch (error) {
    console.error('Error getting snapshot by ID:', error);
    return null;
  }
};
