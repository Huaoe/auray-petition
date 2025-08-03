'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function IStockTestPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/istock/search?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setResults(data.images || []);
      
      if (data.images?.length === 0) {
        setError('No images found for this query');
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">iStock API Test</h1>
      
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter search query..."
            className="flex-1 p-2 border border-gray-300 rounded"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {error && (
          <div className="mt-2 text-red-500">{error}</div>
        )}
      </div>
      
      {results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((image) => (
              <div key={image.id} className="border rounded p-4">
                <h3 className="font-medium mb-2">{image.title}</h3>
                {image.display_sizes?.map((size: any) => (
                  <div key={size.name} className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Size: {size.name}</p>
                    <img 
                      src={size.uri} 
                      alt={image.title} 
                      className="w-full h-auto rounded"
                    />
                    <div className="mt-2">
                      <input
                        type="text"
                        value={size.uri}
                        readOnly
                        className="w-full p-1 text-xs border border-gray-300 rounded bg-gray-50"
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back to Admin
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to run the update script? This will update all location images.')) {
                // In a real implementation, this would trigger the script
                alert('This would run the update script in a real implementation.');
              }
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Run Update Script
          </button>
        </div>
      </div>
    </div>
  );
}