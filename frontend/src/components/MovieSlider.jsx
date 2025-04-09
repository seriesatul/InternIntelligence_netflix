import { useEffect, useRef, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

// TMDB Configuration
const TMDB_API_KEY = "b1baaadc9be6d476afe6ba9f02b5f048";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Valid categories mapping
const VALID_CATEGORIES = {
  movie: ["now_playing", "popular", "top_rated", "upcoming", "trending"],
  tv: ["popular", "top_rated", "on_the_air", "airing_today", "trending"]
};

const DEFAULT_CATEGORY = "popular";

const MovieSlider = ({ category }) => {
  const { contentType } = useContentStore();
  const [results, setResults] = useState([]);
  const [showArrows, setShowArrows] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);

  // Format display names
  const formattedCategoryName = 
    category.replaceAll("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Validate and sanitize category
        const sanitizedCategory = VALID_CATEGORIES[contentType].includes(category) 
          ? category 
          : DEFAULT_CATEGORY;

        if (category !== sanitizedCategory) {
          console.warn(`Invalid category "${category}" for ${contentType}. Using "${sanitizedCategory}" instead.`);
        }

        // Build API endpoint
        const endpoint = sanitizedCategory === "trending"
          ? `${TMDB_BASE_URL}/trending/${contentType}/week?api_key=${TMDB_API_KEY}`
          : `${TMDB_BASE_URL}/${contentType}/${sanitizedCategory}?api_key=${TMDB_API_KEY}`;

        const response = await axios.get(endpoint, { signal });
        
        if (!response.data?.results) {
          throw new Error("Invalid data structure from TMDB API");
        }

        // Filter out items without backdrop images
        const filteredResults = response.data.results.filter(
          item => item.backdrop_path && (item.title || item.name)
        );

        setResults(filteredResults);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(`Failed to load ${formattedCategoryName} ${formattedContentType}`);
          console.error("Fetch error:", err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();

    return () => controller.abort();
  }, [contentType, category]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth * 0.8,
        behavior: "smooth"
      });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth * 0.8,
        behavior: "smooth"
      });
    }
  };

  return (
    <section 
      className=" overflow-hidden relative px-4 md:px-12 py-8 bg-gradient-to-b from-gray-900 to-black"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
      aria-labelledby="slider-heading"
    >
      <h2 
        id="slider-heading"
        className="mb-6 text-2xl font-bold text-white"
      >
        {formattedCategoryName} {formattedContentType}
      </h2>

      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 w-64 h-36 bg-gray-800 rounded-lg animate-pulse"
              aria-hidden="true"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-400">
          {error}
          <button 
            onClick={() => window.location.reload()}
            className="ml-2 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            Retry
          </button>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No content available in this category
        </div>
      ) : (
        <div className="relative">
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            tabIndex="0"
            aria-live="polite"
          >
            {results.map((item) => (
              <Link
                to={`/watch/${contentType}/${item.id}`}
                key={item.id}
                className="flex-shrink-0 w-64 snap-start transition-transform duration-300 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-white rounded-lg overflow-hidden"
                aria-label={`${item.title || item.name}, Rating: ${Math.round(item.vote_average * 10)}%`}
              >
                <div className="relative">
                  <img
                    src={`${IMAGE_BASE_URL}${item.backdrop_path}`}
                    alt=""
                    className="w-full h-36 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/400x225/333/666?text=${encodeURIComponent(item.title || item.name)}`;
                      e.target.alt = item.title || item.name;
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs font-bold text-white">
                    {Math.round(item.vote_average * 10)}%
                  </div>
                </div>
                <p className="mt-2 text-white text-sm font-medium truncate px-1">
                  {item.title || item.name}
                </p>
              </Link>
            ))}
          </div>

          {showArrows && results.length > 0 && (
            <>
              <button
                onClick={scrollLeft}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-90 text-white p-2 rounded-full z-10 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={scrollRight}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-90 text-white p-2 rounded-full z-10 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Scroll right"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default MovieSlider;