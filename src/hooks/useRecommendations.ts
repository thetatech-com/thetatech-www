import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

interface Recommendation {
  id: number;
  title: string;
  description: string;
  category: string;
  upvotes: number;
}

export const useRecommendations = (category: string | null) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        let query = supabase.from('recommendations').select('*');

        if (category) {
          query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) {
          setError(error);
        } else {
          setRecommendations(data as Recommendation[]);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [category]);

  return { recommendations, loading, error };
};
