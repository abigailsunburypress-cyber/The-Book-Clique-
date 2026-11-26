import { Manuscript, BookClubSession } from '../types';

export interface ChapterItem {
  index: number; // 1-based index (e.g., Chapter 1, Chapter 2...)
  title: string;
  startPage: number;
  endPage: number;
}

export interface ChapterBatch {
  batchNumber: number; // 1-based batch number = day number
  dayNumber: number;
  releaseDate: Date;
  releaseDateFormatted: string;
  isReleased: boolean;
  isCurrentDay: boolean;
  isLocked: boolean;
  chapters: ChapterItem[];
  startPage: number;
  endPage: number;
}

export interface BatchScheduleInfo {
  chaptersPerDay: number;
  totalChapters: number;
  totalBatches: number; // total days to complete
  currentDay: number;
  releasedBatchesCount: number;
  releasedChaptersCount: number;
  progressPercentage: number;
  maxUnlockedPage: number;
  currentBatch: ChapterBatch | null;
  nextBatch: ChapterBatch | null;
  nextReleaseDate: Date | null;
  nextReleaseDateFormatted: string | null;
  batches: ChapterBatch[];
}

/**
 * Computes the chapters and daily release batch schedule for a manuscript.
 * Default schedule: 2 chapters per day.
 * If the final group contains only 1 remaining chapter, it releases on its scheduled day.
 */
export function calculateBatchSchedule(
  manuscript: Manuscript | null | undefined,
  session: BookClubSession | null | undefined
): BatchScheduleInfo {
  const chaptersPerDay = Math.max(1, session?.chaptersPerDay ?? 2);

  if (!manuscript) {
    return {
      chaptersPerDay,
      totalChapters: 0,
      totalBatches: 0,
      currentDay: 1,
      releasedBatchesCount: 0,
      releasedChaptersCount: 0,
      progressPercentage: 0,
      maxUnlockedPage: 0,
      currentBatch: null,
      nextBatch: null,
      nextReleaseDate: null,
      nextReleaseDateFormatted: null,
      batches: []
    };
  }

  // 1. Build chapter list preserving original manuscript order & text
  const toc = manuscript.tableOfContents && manuscript.tableOfContents.length > 0
    ? manuscript.tableOfContents
    : [{ title: manuscript.title, page: 1 }];

  const chapters: ChapterItem[] = toc.map((item, idx) => {
    const nextItem = toc[idx + 1];
    const startPage = Math.max(1, item.page);
    const endPage = nextItem
      ? Math.max(startPage, nextItem.page - 1)
      : Math.max(startPage, manuscript.pageCount);

    return {
      index: idx + 1,
      title: item.title,
      startPage,
      endPage
    };
  });

  const totalChapters = chapters.length;

  // 2. Partition chapters into sequential batches of size `chaptersPerDay`
  // If the last group has only 1 remaining chapter, it forms its own final batch
  const rawBatches: ChapterItem[][] = [];
  for (let i = 0; i < chapters.length; i += chaptersPerDay) {
    rawBatches.push(chapters.slice(i, i + chaptersPerDay));
  }

  const totalBatches = rawBatches.length;

  // 3. Determine schedule start date & current elapsed day
  const startDateStr = session?.batchScheduleStartDate || session?.startedAt || new Date().toISOString();
  const startDate = new Date(startDateStr);
  const now = new Date();

  let currentDay = 1;
  if (typeof session?.currentDayOverride === 'number' && session.currentDayOverride >= 1) {
    currentDay = Math.min(totalBatches, Math.max(1, session.currentDayOverride));
  } else {
    // Calculate calendar days elapsed since session batch start date
    const startMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const elapsedDays = Math.floor((nowMidnight - startMidnight) / (24 * 60 * 60 * 1000));
    currentDay = Math.min(totalBatches, Math.max(1, elapsedDays + 1));
  }

  // 4. Construct ChapterBatch objects
  const batches: ChapterBatch[] = rawBatches.map((batchChapters, bIdx) => {
    const batchNumber = bIdx + 1;
    const dayNumber = batchNumber;
    const batchReleaseDate = new Date(startDate.getTime() + bIdx * 24 * 60 * 60 * 1000);

    const isReleased = batchNumber <= currentDay;
    const isCurrentDay = batchNumber === currentDay;
    const isLocked = batchNumber > currentDay;

    const startPage = batchChapters[0]?.startPage ?? 1;
    const endPage = batchChapters[batchChapters.length - 1]?.endPage ?? manuscript.pageCount;

    return {
      batchNumber,
      dayNumber,
      releaseDate: batchReleaseDate,
      releaseDateFormatted: formatDate(batchReleaseDate),
      isReleased,
      isCurrentDay,
      isLocked,
      chapters: batchChapters,
      startPage,
      endPage
    };
  });

  // 5. Aggregate stats
  const releasedBatches = batches.filter((b) => b.isReleased);
  const releasedBatchesCount = releasedBatches.length;
  const releasedChaptersCount = releasedBatches.reduce((acc, b) => acc + b.chapters.length, 0);
  const progressPercentage = totalChapters > 0
    ? Math.min(100, Math.round((releasedChaptersCount / totalChapters) * 100))
    : 0;

  // maxUnlockedPage: the endPage of the highest released batch
  const highestReleasedBatch = releasedBatches[releasedBatches.length - 1];
  const maxUnlockedPage = highestReleasedBatch
    ? highestReleasedBatch.endPage
    : (batches[0]?.endPage ?? manuscript.pageCount);

  const currentBatch = batches.find((b) => b.isCurrentDay) || batches[0] || null;
  const nextBatch = batches.find((b) => b.batchNumber === currentDay + 1) || null;
  const nextReleaseDate = nextBatch ? nextBatch.releaseDate : null;
  const nextReleaseDateFormatted = nextBatch ? nextBatch.releaseDateFormatted : null;

  return {
    chaptersPerDay,
    totalChapters,
    totalBatches,
    currentDay,
    releasedBatchesCount,
    releasedChaptersCount,
    progressPercentage,
    maxUnlockedPage,
    currentBatch,
    nextBatch,
    nextReleaseDate,
    nextReleaseDateFormatted,
    batches
  };
}

function formatDate(date: Date): string {
  try {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return date.toISOString().slice(0, 10);
  }
}
