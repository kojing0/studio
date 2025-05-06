'use client';

import { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { getMerchantLocations } from '@/services/merchant';
import type { MerchantLocation } from '@/services/merchant';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ServerCrash } from 'lucide-react';

// TODO: Replace with your actual Google Maps API key
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID; // Optional: for custom map styles

const defaultCenter = { lat: 34.0522, lng: -118.2437 }; // Default center (Los Angeles)

export default function MapPage() {
  const [locations, setLocations] = useState<MerchantLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocations() {
      if (!API_KEY) {
        setError("Google Maps API Key is missing. Please configure it in your environment variables (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY).");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const fetchedLocations = await getMerchantLocations();
        setLocations(fetchedLocations);
      } catch (err) {
        console.error('Error fetching merchant locations:', err);
        setError('Failed to load merchant locations. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchLocations();
  }, []);

  if (error) {
     return (
       <Alert variant="destructive">
        <ServerCrash className="h-4 w-4" />
        <AlertTitle>Error Loading Map</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
     );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading Map...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Merchants Accepting Solana</h1>
      <div style={{ height: '60vh', width: '100%' }} className="rounded-lg overflow-hidden shadow-md border">
        {API_KEY ? (
          <APIProvider apiKey={API_KEY}>
            <Map
              defaultCenter={locations.length > 0 ? locations[0] : defaultCenter}
              defaultZoom={11}
              mapId={MAP_ID}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
            >
              {locations.map((location, index) => (
                <AdvancedMarker
                  key={index}
                  position={location}
                  title={location.name}
                >
                   {/* Simple default marker, customize as needed */}
                   <span style={{fontSize: '2rem'}}>📍</span>
                </AdvancedMarker>
              ))}
            </Map>
          </APIProvider>
        ) : (
           <Alert variant="destructive">
              <ServerCrash className="h-4 w-4" />
              <AlertTitle>Configuration Error</AlertTitle>
              <AlertDescription>
                Google Maps API Key (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) is not configured. The map cannot be displayed.
              </AlertDescription>
           </Alert>
        )}
      </div>
       <p className="text-sm text-muted-foreground mt-4">Map displays locations where Solana payments are accepted.</p>
    </div>
  );
}
