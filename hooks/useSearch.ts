import { useSearchStore } from '@/store/useSearchStore';
import { useCallback, useEffect, useRef } from 'react';

interface UseSearchOptions {
  searchFunction: (query: string) => Promise<any[]>;
  debounceTime?: number;
  minChars?: number;
}

export function useSearch({ searchFunction, debounceTime = 300, minChars = 2 }: UseSearchOptions) {
  const { query, results, isSearching, setQuery, setResults, setIsSearching } = useSearchStore();
  const latestQuery = useRef(query);

  useEffect(() => {
    latestQuery.current = query;
  }, [query]);

  const debouncedSearch = useCallback(async () => {
    const currentQuery = latestQuery.current;
    console.log('Searching for:', currentQuery);
    if (currentQuery.length >= minChars) {
      setIsSearching(true);
      try {
        const searchResults = await searchFunction(currentQuery);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setResults([]);
    }
  }, [searchFunction, minChars, setIsSearching, setResults]);

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch();
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [query, debounceTime, debouncedSearch]);

  const handleSearch = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
    },
    [setQuery]
  );

  return {
    query,
    results,
    isSearching,
    handleSearch,
  };
}
