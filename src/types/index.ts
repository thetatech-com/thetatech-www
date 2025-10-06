export interface Post {
  id: string;
  content: string;
  image_url?: string;
  video_url?: string;
  user_id: string;
  created_at: string;
  likes: number;
  comments: number;
  shares: number;
  is_live: boolean;
  is_selling: boolean;
  product_price?: number;
  profiles: {
    username: string;
    full_name: string;
    avatar_url: string;
    seller_status: string;
  };
  social_likes: { user_id: string; post_id: string; }[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  banner_image: string;
  member_count: number;
}

export interface GroupBuyParticipant {
  id: string;
  username: string;
  avatar_url: string;
  joined_at: string;
  user_id: string;
}

export interface GroupBuy {
  id: string;
  title: string;
  description: string;
  target_price: number;
  current_price: number;
  min_participants: number;
  product_image: string;
  end_date: string;
  creator: {
    username: string;
    avatar_url: string;
  };
  participants: GroupBuyParticipant[];
}
