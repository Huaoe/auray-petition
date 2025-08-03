'use client';

import Link from 'next/link';
import { DevModeOnly } from '@/components/DevModeOnly';

export default function AdminPage() {
  return (
    <DevModeOnly>
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminCard
            title="Unsplash API Test"
            description="Test the Unsplash API integration by searching for images."
            link="/admin/unsplash-test"
          />
          
          <AdminCard 
            title="Update Location Images" 
            description="Update all location images in the famous-locations.ts file with images from the Unsplash API."
            link="/admin/update-locations"
          />

          <AdminCard 
            title="Update Utopie Examples" 
            description="Update all example images in the utopie-data.ts file with images from the Unsplash API."
            link="/admin/update-utopie-examples"
          />
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Environment Setup</h2>
          <div className="bg-gray-50 p-4 rounded border">
            <p className="mb-2">
              Make sure you have the following environment variables set in your <code>.env.local</code> file:
            </p>
            <pre className="bg-gray-100 p-3 rounded text-sm font-mono">
              UNSPLASH_ACCESS_KEY=your_access_key_here
            </pre>
            <p className="mt-4 text-sm text-gray-600">
              You can get an API key by registering at the{' '}
              <a
                href="https://unsplash.com/developers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Unsplash Developer Portal
              </a>
            </p>
          </div>
        </div>
      </div>
    </DevModeOnly>
  );
}

interface AdminCardProps {
  title: string;
  description: string;
  link: string;
}

function AdminCard({ title, description, link }: AdminCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link 
          href={link}
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go to {title}
        </Link>
      </div>
    </div>
  );
}
