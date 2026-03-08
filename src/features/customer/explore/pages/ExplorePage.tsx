import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Clock3, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../../routes/paths';
import { SuggestionItem } from '../components';
import {
  exploreSearchService,
  getInitialRecentSearches,
  persistRecentSearches,
} from '../services/exploreSearchService';
import {
  ExploreBrowseCategory,
  ExploreQuickFilter,
  ExploreQuickFilterKey,
  ExploreSuggestion,
} from '../types';

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<ExploreQuickFilterKey[]>([]);
  const [quickFilters, setQuickFilters] = useState<ExploreQuickFilter[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [browseCategories, setBrowseCategories] = useState<ExploreBrowseCategory[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<ExploreSuggestion[]>([]);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigateBackOrHome = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(PATHS.CUSTOMER.HOME);
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrapPage = async () => {
      setIsBootstrapping(true);
      try {
        const landingData = await exploreSearchService.getLandingData();
        if (!isMounted) {
          return;
        }

        setQuickFilters(landingData.quickFilters);
        setTrendingSearches(landingData.trendingSearches);
        setBrowseCategories(landingData.browseCategories);
        setRecentSearches(getInitialRecentSearches(landingData.recentSearches));
      } catch (error) {
        console.error('Unable to load explore search landing data.', error);
        if (isMounted) {
          setErrorMessage('Unable to load search data right now.');
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrapPage();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query]);

  useEffect(() => {
    let isMounted = true;

    const loadSuggestions = async () => {
      setIsSearching(true);
      setErrorMessage('');

      try {
        const nextSuggestions = await exploreSearchService.searchSuggestions({
          query: debouncedQuery,
          activeFilters,
        });
        if (isMounted) {
          setSuggestions(nextSuggestions);
        }
      } catch (error) {
        console.error('Unable to load explore search suggestions.', error);
        if (isMounted) {
          setErrorMessage('Unable to load suggestions. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsSearching(false);
        }
      }
    };

    loadSuggestions();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, activeFilters]);

  const addRecentSearch = (searchTerm: string) => {
    const value = searchTerm.trim();
    if (!value) {
      return;
    }

    setRecentSearches((previous) => {
      const deduped = [
        value,
        ...previous.filter((item) => item.toLowerCase() !== value.toLowerCase()),
      ].slice(0, 6);

      persistRecentSearches(deduped);
      return deduped;
    });
  };

  const handleRecentSearchDelete = (searchTerm: string) => {
    setRecentSearches((previous) => {
      const nextSearches = previous.filter((item) => item !== searchTerm);
      persistRecentSearches(nextSearches);
      return nextSearches;
    });
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    persistRecentSearches([]);
  };

  const handleSearchSubmit = () => {
    if (!query.trim()) {
      return;
    }
    addRecentSearch(query);
  };

  const applySearchTerm = (searchTerm: string) => {
    setQuery(searchTerm);
    addRecentSearch(searchTerm);
  };

  const handleSuggestionSelect = (suggestion: ExploreSuggestion) => {
    addRecentSearch(suggestion.name);
    navigate(PATHS.CUSTOMER.MERCHANT_INFO(suggestion.id), {
      state: { merchantName: suggestion.name },
    });
  };

  const toggleFilter = (filterKey: ExploreQuickFilterKey) => {
    setActiveFilters((previous) =>
      previous.includes(filterKey)
        ? previous.filter((item) => item !== filterKey)
        : [...previous, filterKey],
    );
  };

  const normalizedQuery = query.trim();
  const isActivelySearching = normalizedQuery.length > 0;
  const visibleSuggestions = useMemo(
    () => (isActivelySearching ? suggestions : suggestions.slice(0, 4)),
    [isActivelySearching, suggestions],
  );
  const showLoadingState = isBootstrapping || isSearching;

  return (
    <div className="min-h-full bg-white pb-24 pt-3">
      <div className="mx-auto max-w-md px-4">
        <div className="px-3 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={navigateBackOrHome}
              className="w-11 h-11 rounded-xl bg-[#f7f7f7] shadow-sm text-[#242424] flex items-center justify-center"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={navigateBackOrHome}
              className="text-lg font-semibold text-[#232323]"
              aria-label="Cancel search"
            >
              Cancel
            </button>
          </div>

          <div className="mt-5 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#be3b3b]" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearchSubmit();
                }
              }}
              placeholder="Search"
              className="w-full h-11 rounded-full bg-[#e4e0e1] border border-transparent pl-11 pr-10 text-[14px] text-[#212121] placeholder:text-[#b3a9ac] focus:outline-none focus:border-[#b85a5a]"
            />

            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#aaa2a4]"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {quickFilters.map((filter) => {
              const active = activeFilters.includes(filter.key);
              return (
                <button
                  key={filter.key}
                  onClick={() => toggleFilter(filter.key)}
                  className={`px-3 h-8 rounded-full border text-sm transition-colors ${
                    active
                      ? 'bg-[#9d0a0a] text-white border-[#9d0a0a]'
                      : 'bg-transparent text-[#b21313] border-[#e0b5b5]'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {!isActivelySearching && (
            <>
              <section className="mt-6">
                <h2 className="text-[17px] font-semibold text-[#1f232a]">Recent searches</h2>
                <div className="mt-3 border-t border-[#d9d9d9]">
                  {recentSearches.length === 0 ? (
                    <p className="py-4 text-sm text-[#8f8b8b]">No recent searches yet.</p>
                  ) : (
                    recentSearches.map((searchTerm) => (
                      <div
                        key={searchTerm}
                        className="h-12 border-b border-[#d9d9d9] flex items-center justify-between gap-2"
                      >
                        <button
                          onClick={() => applySearchTerm(searchTerm)}
                          className="flex items-center gap-3 min-w-0 text-left"
                        >
                          <span className="w-4 h-4 rounded-full bg-[#8e1408] text-white flex items-center justify-center">
                            <Clock3 className="w-2.5 h-2.5" />
                          </span>
                          <span className="text-[17px] text-[#1e1e1e] truncate">{searchTerm}</span>
                        </button>
                        <button
                          onClick={() => handleRecentSearchDelete(searchTerm)}
                          className="text-[#b91515]"
                          aria-label={`Remove ${searchTerm} from recent searches`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {recentSearches.length > 0 && (
                  <button
                    onClick={handleClearRecentSearches}
                    className="mx-auto mt-4 block h-8 px-4 rounded-full bg-[#f2d981] text-[#a07500] text-sm"
                  >
                    Clear all
                  </button>
                )}
              </section>

              <section className="mt-6">
                <h2 className="text-[17px] font-semibold text-[#1f232a]">Trending searches</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {trendingSearches.map((trend) => (
                    <button
                      key={trend}
                      onClick={() => applySearchTerm(trend)}
                      className="h-8 px-3 rounded-full border border-[#dcb85b] text-[#b18217] text-sm"
                    >
                      {trend}
                    </button>
                  ))}
                </div>
              </section>

              <section className="mt-6">
                <h2 className="text-[17px] font-semibold text-[#1f232a]">Browse categories</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {browseCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => applySearchTerm(category.label)}
                      className="h-8 px-3 rounded-full bg-[#efe8e8] text-[#a20d0d] text-sm flex items-center gap-1.5"
                    >
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          <section className="mt-6 pb-3">
            <h2 className="text-[17px] font-semibold text-[#1f232a]">
              {isActivelySearching ? `Results for "${normalizedQuery}"` : 'Suggestions'}
            </h2>

            {showLoadingState ? (
              <p className="mt-3 text-sm text-[#8f8b8b]">Loading results...</p>
            ) : errorMessage ? (
              <p className="mt-3 text-sm text-[#b21313]">{errorMessage}</p>
            ) : visibleSuggestions.length === 0 ? (
              <p className="mt-3 text-sm text-[#8f8b8b]">
                {isActivelySearching ? 'No matching merchants found.' : 'No suggestions found.'}
              </p>
            ) : (
              <div className="mt-3 space-y-4">
                {visibleSuggestions.map((suggestion) => (
                  <SuggestionItem
                    key={suggestion.id}
                    suggestion={suggestion}
                    onSelect={handleSuggestionSelect}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
