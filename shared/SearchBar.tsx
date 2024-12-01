'use client';

import * as React from 'react';
import { Bell, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  avatarSrc?: string;
  avatarFallback?: string;
  className?: string;
  notificationCount?: number;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search document, template,....',
  avatarSrc,
  avatarFallback = 'U',
  className = '',
  notificationCount = 0,
}: SearchBarProps) {
  const [query, setQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSearch} className={`flex items-center gap-4 lg:gap-6 ${className}`}>
      {/* Search input */}
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="w-full rounded-full bg-muted/50 pl-10 text-lg"
          aria-label="Search"
        />
      </div>

      {/* Notifications and Avatar */}
      <div className="hidden items-center gap-4 md:flex">
        {/* Notifications Button */}
        <div className="relative">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={() => console.log('Notification button clicked')}
            aria-label="Notifications"
          >
            <Bell className="h-8 w-8" />
          </Button>

          {/* Notification Count */}
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </div>

        {/* User Avatar */}
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarSrc} alt="User avatar" />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      </div>
    </form>
  );
}
