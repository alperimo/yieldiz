import { useCallback, useState } from 'react';
import * as qvacReviewer from '../services/qvacReviewer';

export function useLocalRouteReview() {
  const [data, setData] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkHealth = useCallback(async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    try {
      const result = await qvacReviewer.getReviewerHealth({ signal: controller.signal });
      setHealth(result);
      return result;
    } catch (err) {
      setHealth({ available: false, reason: 'Local route check is not running.' });
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }, []);

  const review = useCallback(async (routeIntent) => {
    if (!routeIntent) return null;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    setLoading(true);
    setError(null);
    try {
      const result = await qvacReviewer.reviewRoute(routeIntent, { signal: controller.signal });
      setData(result);
      return result;
    } catch (err) {
      const message = err.name === 'AbortError' ? 'Local route check timed out.' : err.message;
      setError(message);
      setData(null);
      return null;
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }, []);

  return { data, health, loading, error, checkHealth, review };
}

