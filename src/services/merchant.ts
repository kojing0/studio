/**
 * Represents a merchant location with latitude and longitude coordinates.
 */
export interface MerchantLocation {
  /**
   * The latitude of the location.
   */
  lat: number;
  /**
   * The longitude of the location.
   */
  lng: number;
  /**
   * The merchant name.
   */
  name: string;
}

/**
 * Asynchronously retrieves merchant locations.
 *
 * @returns A promise that resolves to a list of MerchantLocation objects.
 */
export async function getMerchantLocations(): Promise<MerchantLocation[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      lat: 34.0522,
      lng: -118.2437,
      name: 'Coffee Shop',
    },
    {
      lat: 34.0523,
      lng: -118.2438,
      name: 'Restaurant',
    },
  ];
}
