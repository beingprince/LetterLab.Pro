import React, { useState, useEffect } from 'react';
import { fetchStatus } from '../../lib/footer-pages/api';
import StatusBadge from "./footer-pages/blocks/StatusBadge";

export default function FooterStatusBadge() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchStatus()
      .then((data) => { if (!cancelled) setStatus(data); })
      .catch(() => { if (!cancelled) setStatus({ overall: 'operational' }); });
    return () => { cancelled = true; };
  }, []);

  return (
    <StatusBadge status={status || { overall: 'operational' }} href="/status" />
  );
}
