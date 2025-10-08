'use client';

import { SearchSnapshot } from '@/types/reddit';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportToJSON, exportToCSV, downloadBlob } from '@/lib/storage/exports';

interface ExportButtonProps {
  snapshot: SearchSnapshot;
}

export const ExportButton = ({ snapshot }: ExportButtonProps) => {
  const handleExportJSON = () => {
    const blob = exportToJSON(snapshot);
    const filename = `reddit-${snapshot.subreddit}-${snapshot.time_filter}-${new Date().toISOString().split('T')[0]}.json`;
    downloadBlob(blob, filename);
  };

  const handleExportCSV = () => {
    const blob = exportToCSV(snapshot);
    const filename = `reddit-${snapshot.subreddit}-${snapshot.time_filter}-${new Date().toISOString().split('T')[0]}.csv`;
    downloadBlob(blob, filename);
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleExportJSON} variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Export JSON
      </Button>
      <Button onClick={handleExportCSV} variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
    </div>
  );
};
