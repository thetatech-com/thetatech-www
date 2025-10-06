export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  badge?: string;
  originalPrice?: number;
}

export interface CartItem {
  id: string;
  user_id: string;
  device_type: string;
  device_model: string;
  issue_description: string;
  detailed_description?: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  video_url?: string;
  likes: number;
  comments: number;
  shares: number;
  is_live: boolean;
  is_selling: boolean;
  product_price?: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile | any;
}

export interface Group {
  id: string;
  creator_id: string;
  name: string;
  description?: string;
  member_count: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  user_id?: string;
  full_name?: string;
  website?: string;
  bio?: string;
  user_type?: string;
  seller_request_status?: string;
  is_seller?: boolean;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  created_at: string;
  views: number;
  user: Profile;
}

export interface Comment {
  id: string;
  text: string;
  created_at: string;
  user: Profile;
  video_id: string;
}

export interface GroupBuy {
  id: string;
  title: string;
  description: string;
  target_price: number;
  current_price: number;
  min_participants: number;
  product_image: string;
  creator: Profile;
  participants: GroupBuyParticipant[];
  status: string;
  end_date: string;
  creator_id: string;
}

export interface GroupBuyParticipant {
  id: string;
  user_id: string;
  group_buy_id: string;
  user: Profile;
}
