import { useState, useEffect, useRef } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

interface SearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
}

export function SearchBar({ className, onSearch, autoFocus = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading recent searches:", e);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch search suggestions
  const { data: suggestions = [] } = trpc.search.suggestions.useQuery(
    { query },
    { 
      enabled: query.length >= 2,
      staleTime: 30000, // 30 seconds
    }
  );

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Add to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    // Navigate to search results
    setLocation(`/buscar?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    setQuery("");

    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          autoFocus={autoFocus}
          className="pl-11 pr-10 h-10 bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors rounded-full"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Dropdown with suggestions and recent searches */}
      {isOpen && (query.length >= 2 || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 cyber-border rounded-lg bg-card shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Suggestions */}
          {query.length >= 2 && suggestions.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-mono-cyber text-muted-foreground uppercase">
                <TrendingUp className="h-3 w-3" />
                Sugerencias
              </div>
              {suggestions.map((suggestion: { title: string; type: string }, index: number) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left px-3 py-2 rounded hover:bg-muted/50 transition-colors"
                  onClick={() => handleSearch(suggestion.title)}
                >
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{suggestion.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {suggestion.type === "noticia" && "Noticia"}
                        {suggestion.type === "rumor" && "Rumor"}
                        {suggestion.type === "jugador" && "Jugador"}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {query.length < 2 && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2 text-xs font-mono-cyber text-muted-foreground uppercase">
                  <Clock className="h-3 w-3" />
                  Búsquedas recientes
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={clearRecentSearches}
                >
                  Limpiar
                </Button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left px-3 py-2 rounded hover:bg-muted/50 transition-colors"
                  onClick={() => handleSearch(search)}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm truncate">{search}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {query.length >= 2 && suggestions.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No se encontraron resultados para "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
