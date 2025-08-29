import { useState, useEffect, useCallback } from 'react';
import { getAggregatedPresaleData, refreshPresaleData } from './AggregatedPresaleService';

export const useAggregatedPresale = (refreshInterval = 30000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const aggregatedData = await getAggregatedPresaleData();
      
      if (aggregatedData) {
        setData(aggregatedData);
        setLastUpdated(new Date());
      } else {
        setError('Failed to fetch presale data');
      }
    } catch (err) {
      console.error('Error fetching aggregated presale data:', err);
      setError(err.message || 'Failed to fetch presale data');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const aggregatedData = await refreshPresaleData();
      
      if (aggregatedData) {
        setData(aggregatedData);
        setLastUpdated(new Date());
      } else {
        setError('Failed to refresh presale data');
      }
    } catch (err) {
      console.error('Error refreshing aggregated presale data:', err);
      setError(err.message || 'Failed to refresh presale data');
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up auto-refresh interval
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh
  };
};

export default useAggregatedPresale;