export interface ServiceProvider {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
  }
  
  export interface ServiceItem {
    id: string;
    title: string;
    category: string;
    price: number;
    provider: ServiceProvider;
    image: string;
  }