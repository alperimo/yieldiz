import { useEffect, useState } from 'react';
import { getPrimarySolDomain } from '../services/sns';

export function useSnsIdentity(address, connection) {
  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address || !connection) {
      setDomain(null);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    getPrimarySolDomain(connection, address)
      .then((value) => {
        if (!cancelled) setDomain(value);
      })
      .catch((error) => {
        console.warn('SNS primary domain lookup failed for connected wallet:', error);
        if (!cancelled) setDomain(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [address, connection]);

  return { domain, loading };
}
