interface LoyaltyService {
  id: number;
  name: {
    ar: string;
    en: string;
  };
  price: number;
  currency: string;
}

interface Salon {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  loyalty_service_id?: number;
  loyalty_service?: LoyaltyService;
  types?: ('home_service' | 'beautician' | 'never')[];
}