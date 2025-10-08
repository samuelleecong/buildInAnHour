"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TimeFilterSelect } from "@/components/time-filter";
import { TimeFilter } from "@/types/reddit";
import { Search } from "lucide-react";

interface SearchFormProps {
  onSearch: (subreddit: string, timeFilter: TimeFilter) => void;
  isLoading?: boolean;
}

export const SearchForm = ({ onSearch, isLoading = false }: SearchFormProps) => {
  const [subreddit, setSubreddit] = useState("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subreddit.trim()) {
      return;
    }

    // Clean subreddit name (remove r/ prefix if present)
    const cleanedSubreddit = subreddit.trim().replace(/^r\//, "");
    onSearch(cleanedSubreddit, timeFilter);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Enter subreddit name (e.g., programming)"
            value={subreddit}
            onChange={(e) => setSubreddit(e.target.value)}
            disabled={isLoading}
            className="w-full"
            aria-label="Subreddit name"
          />
        </div>
        <TimeFilterSelect
          value={timeFilter}
          onChange={setTimeFilter}
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !subreddit.trim()}
        className="w-full sm:w-auto"
      >
        {isLoading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Analyzing...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Analyze Subreddit
          </>
        )}
      </Button>
    </form>
  );
};
