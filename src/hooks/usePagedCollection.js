import { useEffect, useState } from 'react';
import api from '../services/api';

export default function usePagedCollection(path, filters = {}) {
  const filterKey = JSON.stringify(filters);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [previousFilters, setPreviousFilters] = useState(filterKey);
  // Reset during rendering so a filter change never requests an old page number.
  if (previousFilters !== filterKey) {
    setPreviousFilters(filterKey);
    setPage(1);
  }
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    api.get(path, { params: { ...JSON.parse(filterKey), page, per_page: 12 }, signal: controller.signal })
      .then(response => { if (!controller.signal.aborted) setResult(response.data); })
      .catch(err => {
        if (!controller.signal.aborted) setError(err.response?.data?.message || 'Could not load results. Please retry.');
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [path, filterKey, page, retry]);
  return { items: result.data, pagination: result, page, setPage, loading, error, refresh: () => setRetry(value => value + 1) };
}
