import { formatDistanceToNowStrict, parseISO } from 'date-fns';

export function formatTimestamp(timestamp: string): string {
  const date = parseISO(timestamp);
  const now = new Date();
  const differenceInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (differenceInSeconds < 30) {
    return 'just now';
  }

  const distance = formatDistanceToNowStrict(date, { addSuffix: true });

  return distance
    .replace('about ', '')
    .replace('in ', '')
    .replace('seconds ago', 'sec ago')
    .replace('second ago', 'sec ago')
    .replace('minutes ago', 'min ago')
    .replace('minute ago', 'min ago')
    .replace('hours ago', 'hr ago')
    .replace('hour ago', 'hr ago')
    .replace('days ago', 'd ago')
    .replace('day ago', 'd ago')
    .replace('months ago', 'mo ago')
    .replace('month ago', 'mo ago')
    .replace('years ago', 'yr ago')
    .replace('year ago', 'yr ago');
}

