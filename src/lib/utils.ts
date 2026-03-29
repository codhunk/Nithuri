export interface Address {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

/** 
 * Format an address object into a human-readable string 
 * e.g., "A-29 Block B, New Delhi, Delhi"
 */
export function formatAddress(address: any): string {
  if (!address) return "Location not available";
  if (typeof address === "string") return address;
  
  const parts = [
    address.street,
    address.city,
    address.state,
    address.pincode
  ].filter(Boolean); // Remove empty or undefined parts

  return parts.length > 0 ? parts.join(", ") : "Location not available";
}
