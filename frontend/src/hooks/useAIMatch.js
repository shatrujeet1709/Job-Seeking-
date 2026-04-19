import { useState, useCallback } from 'react';
import { getAIRecommendations } from '../api/aiApi';

export default function useAIMatch() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAIRecommendations();
      setMatches(data.matches || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get AI recommendations');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { matches, loading, error, fetchRecommendations };
}
