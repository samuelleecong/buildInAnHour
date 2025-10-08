# Product Requirements Document: Reddit Virality Analyzer

## 1. Executive Summary

**Project Name:** Reddit Virality Analyzer
**Version:** 1.0
**Date:** 2025-10-08
**Status:** Phase 1 - Search & Data Collection

### Vision
Build an intelligent system that analyzes successful Reddit posts to understand virality patterns and eventually generate subreddit-specific content strategies using LLM analysis.

### Objectives
- **Phase 1 (Current):** Create a web application to search and retrieve top Reddit posts with comprehensive metadata
- **Phase 2 (Future):** Implement LLM analysis to deconstruct viral patterns and generate content optimization prompts

---

## 2. Product Overview

### Problem Statement
Content creators struggle to understand what makes posts successful on specific subreddits. Each subreddit has unique culture, preferences, and engagement patterns. There's no systematic way to analyze and learn from successful posts to improve content strategy.

### Solution
A two-phase system that:
1. Collects and displays top posts from any subreddit with rich metadata
2. Uses LLM analysis to identify success patterns and generate actionable insights

### Target Users
- Content creators and marketers
- Community managers
- Social media strategists
- Researchers studying online communities

---

## 3. Phase 1: Search & Data Collection

### 3.1 Core Features

#### F1: Subreddit Search
- **Description:** Users can search for any public subreddit
- **Acceptance Criteria:**
  - Input field with validation for subreddit names
  - Auto-complete suggestions (optional enhancement)
  - Error handling for non-existent subreddits
  - Recent searches saved (localStorage)

#### F2: Time Period Selection
- **Description:** Filter top posts by time period
- **Options:**
  - Past Hour
  - Past 24 Hours
  - Past Week
  - Past Month
  - Past Year
  - All Time
- **Acceptance Criteria:**
  - Clear UI selector (dropdown or tabs)
  - Default to "Past Week"
  - Persist selection across searches

#### F3: Top Posts Display
- **Description:** Display top posts with key metrics
- **Data Points Shown:**
  - Post title (clickable to Reddit)
  - Score (upvotes)
  - Number of comments
  - Upvote ratio
  - Awards count
  - Post type (text/link/image/video)
  - Author username
  - Post age
  - Flair (if present)
- **Acceptance Criteria:**
  - Display 25-100 posts per query
  - Responsive card-based layout
  - Loading states
  - Error states
  - Empty states

#### F4: Metadata Collection & Storage
- **Description:** Capture comprehensive metadata for LLM analysis
- **Acceptance Criteria:**
  - All metadata stored locally (JSON files initially)
  - Timestamped snapshots
  - Export capability (JSON/CSV)
  - View raw metadata option

### 3.2 Metadata Schema

```typescript
interface RedditPost {
  // Identifiers
  id: string;
  permalink: string;
  url: string;

  // Content
  title: string;
  selftext: string;
  post_hint: 'self' | 'link' | 'image' | 'video' | 'rich:video' | null;
  domain: string;
  link_flair_text: string | null;

  // Engagement Metrics
  score: number;
  upvote_ratio: number;
  num_comments: number;
  total_awards_received: number;
  all_awardings: Award[];

  // Temporal Data
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
  subreddit_active_users: number;

  // Content Characteristics
  title_length_chars: number;
  title_length_words: number;
  has_media: boolean;
  is_video: boolean;
  is_self: boolean;
  is_gallery: boolean;
  num_crossposts: number;

  // Engagement Derived Metrics
  comments_per_upvote: number;
  engagement_rate: number;
  awards_per_upvote: number;

  // Rankings
  rank_position: number;
  time_filter: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
}

interface Award {
  name: string;
  count: number;
  coin_price: number;
}

interface SearchSnapshot {
  query_id: string;
  timestamp: number;
  subreddit: string;
  time_filter: string;
  subreddit_metadata: SubredditMetadata;
  posts: RedditPost[];
  total_posts_fetched: number;
}

interface SubredditMetadata {
  name: string;
  display_name: string;
  title: string;
  public_description: string;
  subscribers: number;
  active_user_count: number;
  created_utc: number;
  over18: boolean;
  lang: string;
  submission_type: string;
}
```

---

## 4. Phase 2: LLM Analysis (Future Scope)

### 4.1 Analysis Features

#### F5: Pattern Detection
- Analyze title structures
- Identify optimal posting times
- Detect content type preferences
- Find linguistic patterns

#### F6: Virality Score Calculation
- Custom algorithm based on:
  - Engagement rate
  - Speed of engagement
  - Comments quality
  - Awards received
  - Upvote ratio

#### F7: Prompt Generation
- Generate "master prompt" for LLM
- Include:
  - Subreddit culture insights
  - Successful content patterns
  - Timing recommendations
  - Title formulas
  - Content structure templates

#### F8: A/B Testing Framework
- Compare generated content against real posts
- Measure predicted vs actual performance

---

## 5. Technical Architecture

### 5.1 Technology Stack

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- shadcn/ui components
- TailwindCSS
- Radix UI primitives

**Backend:**
- Next.js API Routes / Server Actions
- Reddit API (OAuth2)
- Node.js

**Data Storage:**
- Phase 1: JSON files (file system)
- Phase 2: SQLite or PostgreSQL

**Future LLM Integration:**
- OpenAI API / Anthropic API
- LangChain (optional)

### 5.2 System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │ Search Page  │  │ Results View │  │ Analysis │ │
│  │              │  │              │  │  (Phase2)│ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              Server Actions / API Routes            │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │ Reddit API   │  │ Data Storage │  │ LLM API  │ │
│  │ Integration  │  │ Layer        │  │ (Phase2) │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                  External Services                  │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐               │
│  │ Reddit API   │  │ File System  │               │
│  │ (OAuth)      │  │ (JSON)       │               │
│  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────┘
```

### 5.3 API Integration

#### Reddit API Endpoints
- `GET /r/{subreddit}/top.json` - Fetch top posts
- `GET /r/{subreddit}/about.json` - Fetch subreddit metadata

#### Rate Limits
- Without OAuth: 60 requests/minute
- With OAuth: Higher limits (implement for production)

#### Caching Strategy
- Cache responses for 15 minutes (minimum)
- Store snapshots permanently for historical analysis
- Implement Next.js 15 caching mechanisms

---

## 6. Data Flow

### 6.1 Search Flow
1. User enters subreddit name and selects time period
2. Frontend validates input
3. Server Action calls Reddit API
4. Response processed and enriched with derived metrics
5. Data stored as snapshot (JSON)
6. Results displayed in frontend
7. Metadata available for export

### 6.2 Data Storage Structure
```
/data
  /snapshots
    /{subreddit}
      /{timestamp}_{timefilter}.json
  /analysis (Phase 2)
    /{subreddit}
      /patterns.json
      /prompts.json
```

---

## 7. User Stories

### US1: Basic Search
**As a** content creator
**I want to** search for top posts in r/programming for the past week
**So that** I can understand what content performs well

**Acceptance Criteria:**
- Can enter "programming" in search field
- Can select "Past Week" time filter
- See top 100 posts with scores and metrics
- All data loads within 3 seconds

### US2: Metadata Export
**As a** researcher
**I want to** export post metadata as JSON
**So that** I can perform custom analysis

**Acceptance Criteria:**
- Export button visible on results page
- Downloads complete JSON with all metadata
- Includes timestamp and query parameters

### US3: Historical Comparison
**As a** marketer
**I want to** view stored snapshots from previous searches
**So that** I can track trends over time

**Acceptance Criteria:**
- Access to history view
- Filter by subreddit
- Compare different time periods

---

## 8. UI/UX Requirements

### 8.1 Layout
- Clean, minimal interface
- Focus on data visualization
- Responsive design (mobile-first)

### 8.2 Key Pages

#### Search Page
- Centered search interface
- Recent searches sidebar
- Quick stats (total searches, subreddits analyzed)

#### Results Page
- Subreddit header with metadata
- Filters and sorting options
- Grid/List view toggle
- Individual post cards
- Bulk actions (export, analyze)

#### Post Detail (Modal/Drawer)
- Full metadata display
- Link to original Reddit post
- Visual metrics (charts for engagement)
- Add to comparison list

---

## 9. Metadata for LLM Analysis

### 9.1 Critical Data Points

**Engagement Patterns:**
- Score distribution across time filters
- Comments-to-upvotes ratio trends
- Peak engagement times (hour/day)

**Content Characteristics:**
- Title length sweet spot
- Question vs statement ratio
- Media type effectiveness
- Flair correlation with success

**Temporal Patterns:**
- Best posting times
- Day-of-week performance
- Seasonal trends (requires historical data)

**Linguistic Features:**
- Common words/phrases in titles
- Sentiment analysis
- Readability scores
- Use of numbers, emojis, capitalization

### 9.2 LLM Context Template (Phase 2)

```markdown
# Subreddit: r/{name}

## Overview
- Subscribers: {count}
- Active Users: {count}
- Primary Language: {lang}
- Content Type: {type}

## Top Performing Posts Analysis (Past {time_period})

### Engagement Metrics
- Average Score: {avg}
- Average Comments: {avg}
- Average Upvote Ratio: {avg}
- Engagement Rate: {rate}

### Content Patterns
- Most successful post types: {types}
- Optimal title length: {range} characters
- Common title patterns: {patterns}
- Best posting times: {times}

### Success Factors
1. {factor} - {explanation}
2. {factor} - {explanation}
...

## Recommendations for Viral Content

### Title Formula
{template}

### Content Structure
{structure}

### Timing
{optimal_times}

### Topics
{trending_topics}
```

---

## 10. Technical Requirements

### 10.1 Performance
- Initial page load: < 2 seconds
- Search results: < 3 seconds
- Support 100+ posts per query
- Smooth scrolling/pagination

### 10.2 Security
- No storage of Reddit passwords
- OAuth token encryption
- Rate limit protection
- Input sanitization

### 10.3 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode

### 10.4 Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

---

## 11. Success Metrics

### Phase 1 Metrics
- Number of successful searches
- Data points collected
- User engagement time
- Export usage

### Phase 2 Metrics (Future)
- Accuracy of pattern detection
- Quality of generated prompts
- User satisfaction with recommendations

---

## 12. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Reddit API rate limits | High | High | Implement OAuth, caching, and rate limit handling |
| API changes | Medium | Medium | Version the integration, monitor Reddit API updates |
| Data storage growth | Medium | High | Implement data retention policy, archival strategy |
| LLM API costs (Phase 2) | High | Medium | Batch processing, caching, cost monitoring |
| Subreddit privacy/access | Low | Low | Handle private/banned subreddits gracefully |

---

## 13. Development Phases

### Phase 1: MVP (Week 1-2)
**Sprint 1: Foundation**
- [ ] Project setup (Next.js 15, TypeScript, shadcn/ui)
- [ ] Reddit API integration setup
- [ ] Basic search interface
- [ ] Data fetching and display

**Sprint 2: Data & Polish**
- [ ] Metadata schema implementation
- [ ] Data storage (JSON files)
- [ ] Enhanced UI with shadcn components
- [ ] Export functionality
- [ ] Error handling and loading states

### Phase 2: LLM Analysis (Future)
**Sprint 3: Analysis Engine**
- [ ] Pattern detection algorithms
- [ ] Statistical analysis
- [ ] LLM integration
- [ ] Prompt generation

**Sprint 4: Optimization**
- [ ] A/B testing framework
- [ ] Performance optimization
- [ ] Advanced visualizations
- [ ] User feedback loop

---

## 14. Open Questions

1. **Storage:** Migrate to database in Phase 1 or stick with JSON files?
2. **LLM Provider:** OpenAI, Anthropic, or both?
3. **Reddit Auth:** Implement OAuth immediately or start with public API?
4. **Monetization:** Free tier vs paid features?
5. **Data Retention:** How long to keep historical snapshots?

---

## 15. Appendices

### A. Reddit API Resources
- Official Documentation: https://www.reddit.com/dev/api
- Rate Limits: https://github.com/reddit-archive/reddit/wiki/API
- OAuth Guide: https://github.com/reddit-archive/reddit/wiki/OAuth2

### B. Sample Queries
- `r/programming` + "Past Week"
- `r/dataisbeautiful` + "Past Month"
- `r/AskReddit` + "All Time"

### C. Competitor Analysis
- Reddit Enhancement Suite (RES) - Browser extension
- Subreddit Stats websites
- Social listening tools (Brandwatch, Sprout Social)

---

**Document Status:** Draft
**Next Review:** Post-Phase 1 Completion
**Owner:** Development Team
