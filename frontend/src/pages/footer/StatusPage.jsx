import React, { useState, useEffect } from 'react';
import { fetchStatus } from '../../lib/footer-pages/api';
import FooterPageLayout from '../../components/footer/footer-pages/layout/FooterPageLayout';
import StatusBadge from '../../components/footer/footer-pages/blocks/StatusBadge';
import './StatusPage.css';

export default function StatusPage() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchStatus()
      .then((data) => { if (!cancelled) setStatus(data); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return (
      <div className="footer-pages" style={{ padding: 48 }}>
        <p>{error}</p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="footer-pages" style={{ padding: 48 }}>
        <p>Loading status…</p>
      </div>
    );
  }

  const services = status.services || {};
  const updatedAt = status.updatedAt ? new Date(status.updatedAt).toLocaleString() : '';

  return (
    <FooterPageLayout
      slug="status"
      title="System status"
      lead="Current status of LetterLab services. This page updates automatically."
      breadcrumbs={true}
    >
      <section className="StatusPage__section">
        <h2 id="current-status" className="StatusPage__heading">Current status</h2>
        <div className="StatusPage__badge-wrap">
          <StatusBadge status={status} href="/status" />
        </div>
        <p className="StatusPage__updated">Last updated: {updatedAt}</p>
      </section>
      <section className="StatusPage__section" aria-labelledby="services-heading">
        <h2 id="services-heading" className="StatusPage__heading">Services</h2>
        <ul className="StatusPage__services">
          <li><span className="StatusPage__service-name">API</span> <span className="StatusPage__service-status">{services.api || 'operational'}</span></li>
          <li><span className="StatusPage__service-name">AI</span> <span className="StatusPage__service-status">{services.ai || 'operational'}</span></li>
          <li><span className="StatusPage__service-name">Website</span> <span className="StatusPage__service-status">{services.website || 'operational'}</span></li>
        </ul>
      </section>
      {status.incidents && status.incidents.length > 0 && (
        <section className="StatusPage__section" aria-labelledby="incidents-heading">
          <h2 id="incidents-heading" className="StatusPage__heading">Incidents</h2>
          <ul className="StatusPage__incidents">
            {status.incidents.map((inc) => (
              <li key={inc.id}>
                <strong>{inc.title}</strong> — {inc.status} — {inc.time}
                {inc.details && <p>{inc.details}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </FooterPageLayout>
  );
}
