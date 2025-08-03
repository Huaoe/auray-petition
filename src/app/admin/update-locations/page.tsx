'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UpdateLocationsPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [lastCompletedIndex, setLastCompletedIndex] = useState<number | null>(null);
  const router = useRouter();

  const handleRunScript = async () => {
    if (isRunning) return;

    if (!confirm(`Are you sure you want to update location images starting from index ${startIndex}? This may take some time.`)) {
      return;
    }

    setIsRunning(true);
    setError(null);
    setResults([`Starting update process from index ${startIndex}...`]);

    try {
      // Create an API endpoint to run the script
      const response = await fetch('/api/admin/update-locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startIndex }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setLastCompletedIndex(data.currentIndex);
        setResults(prev => [
          ...prev,
          'Update completed successfully!',
          `Updated ${data.updatedCount} out of ${data.totalCount} locations.`,
          `Processed ${data.processedCount} locations in this run.`,
          `Resume from index ${data.currentIndex} next time.`
        ]);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setResults(prev => [...prev, 'Update failed. See error above.']);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResumeFromLast = () => {
    if (lastCompletedIndex !== null) {
      setStartIndex(lastCompletedIndex);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Update Location Images</h1>
      
      <div className="mb-6">
        <p className="mb-4">
          This page allows you to update all location images in the famous-locations.ts file with images from the Unsplash API.
          The process may take several minutes to complete. Due to API rate limits, you may need to run the update in multiple sessions.
        </p>
        
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Update Settings</h2>
          
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center">
              <span className="mr-2">Start from index:</span>
              <input
                type="number"
                value={startIndex}
                onChange={(e) => setStartIndex(parseInt(e.target.value) || 0)}
                min="0"
                className="border rounded px-2 py-1 w-20"
                disabled={isRunning}
              />
            </label>
            
            {lastCompletedIndex !== null && (
              <button
                onClick={handleResumeFromLast}
                disabled={isRunning}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Resume from last completed ({lastCompletedIndex})
              </button>
            )}
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            <p>The Unsplash API has a rate limit of 50 requests per hour for demo applications.</p>
            <p>If you hit the rate limit, note the current index and resume from there after an hour.</p>
            {lastCompletedIndex !== null && (
              <p className="font-medium">Last run completed at index: {lastCompletedIndex}</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleRunScript}
            disabled={isRunning}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isRunning ? 'Running Update...' : `Run Update From Index ${startIndex}`}
          </button>
          
          <button
            onClick={() => router.push('/admin/unsplash-test')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Test Unsplash API
          </button>
          
          <button
            onClick={() => router.push('/admin')}
            className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded"
          >
            Back to Admin
          </button>
        </div>
        
        {error && (
          <div className="p-4 mb-4 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
      
      {results.length > 0 && (
        <div className="border rounded p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Update Log</h2>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
            {results.map((line, index) => (
              <div key={index} className="mb-1">
                {line}
              </div>
            ))}
            {isRunning && <div className="animate-pulse">Processing...</div>}
          </div>
        </div>
      )}
    </div>
  );
}