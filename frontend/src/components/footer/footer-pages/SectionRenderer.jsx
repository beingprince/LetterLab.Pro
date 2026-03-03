import React from 'react';
import FooterPageSection from './layout/FooterPageSection';
import FooterPageDivider from './layout/FooterPageDivider';
import Accordion from './blocks/Accordion';
import Timeline from './blocks/Timeline';
import InlineNotice from './blocks/InlineNotice';
import CompareTable from './blocks/CompareTable';
import TagRow from './blocks/TagRow';
import SearchBox from './blocks/SearchBox';
import FormField from './blocks/FormField';
import { submitContact, submitTalentWaitlist } from '../../../lib/footer-pages/api';
import './SectionRenderer.css';

export default function SectionRenderer({ sections, slug }) {
  const [searchFilter, setSearchFilter] = React.useState('');

  return (
    <>
      {sections.map((section, i) => {
        const alt = i % 2 === 1;
        const key = section.id || i;

        if (section.type === 'search') {
          return (
            <FooterPageSection key={key} id={section.id} alternate={alt}>
              <SearchBox
                placeholder={section.placeholder || 'Search help articles…'}
                onFilter={setSearchFilter}
              />
            </FooterPageSection>
          );
        }

        if (section.type === 'accordion') {
          let items = section.items || [];
          if (searchFilter.trim()) {
            const q = searchFilter.trim().toLowerCase();
            items = items.filter(
              (it) =>
                (it.title && it.title.toLowerCase().includes(q)) ||
                (Array.isArray(it.body) && it.body.some((p) => p && p.toLowerCase().includes(q)))
            );
          }
          if (section.id === 'future-roles') {
            items = items.map((it) => ({
              title: it.title,
              description: it.description,
              body: [
                it.description,
                it.workOn?.length ? "What you'd work on: " + it.workOn.join(', ') : '',
                it.success?.length ? "What matters for success: " + it.success.join(', ') : '',
                'Status: ' + (it.status || 'Not open'),
              ].filter(Boolean),
            }));
          } else {
            items = items.map((it) => ({
              title: it.title,
              body: it.body,
              description: it.description,
            }));
          }
          return (
            <FooterPageSection key={key} id={section.id} title={section.title} alternate={alt}>
              <Accordion
                items={items}
              />
            </FooterPageSection>
          );
        }

        if (section.type === 'notice') {
          return (
            <FooterPageSection key={key} id={section.id} alternate={alt}>
              <InlineNotice body={section.body} />
            </FooterPageSection>
          );
        }

        if (section.type === 'table') {
          return (
            <FooterPageSection key={key} id={section.id} title={section.title} alternate={alt}>
              <CompareTable
                columns={section.columns || []}
                rows={section.rows || []}
                highlightColumn={section.highlightColumn}
              />
            </FooterPageSection>
          );
        }

        if (section.type === 'timeline') {
          return (
            <FooterPageSection key={key} id={section.id} title={section.title} alternate={alt}>
              <Timeline items={section.items || []} />
            </FooterPageSection>
          );
        }

        if (section.type === 'filters') {
          return (
            <FooterPageSection key={key} id={section.id} alternate={alt}>
              <div className="SectionRenderer__filters" role="group" aria-label="Filter updates">
                {(section.options || []).map((opt, j) => (
                  <button
                    key={j}
                    type="button"
                    className="SectionRenderer__filter-btn"
                    data-active={j === 0}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </FooterPageSection>
          );
        }

        if (section.type === 'form' && section.formType === 'contact') {
          return (
            <FooterPageSection key={key} id={section.id} alternate={alt}>
              <ContactFormSection section={section} />
            </FooterPageSection>
          );
        }

        if (section.type === 'form' && section.formType === 'talent-waitlist') {
          return (
            <FooterPageSection key={key} id={section.id} title={section.title} alternate={alt}>
              <TalentWaitlistSection section={section} />
            </FooterPageSection>
          );
        }

        if (section.type === 'plain' && section.items && section.id === 'capability-stories') {
          return (
            <FooterPageSection key={key} id={section.id} title={section.title} alternate={alt}>
              <div className="SectionRenderer__stories">
                {(section.items || []).map((story, j) => (
                  <div key={j} className="SectionRenderer__story">
                    {story.title && <h3 className="SectionRenderer__story-title">{story.title}</h3>}
                    <p className="SectionRenderer__story-p">{story.paragraph}</p>
                    <ul className="SectionRenderer__story-ul">
                      {(story.bullets || []).map((b, k) => (
                        <li key={k}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </FooterPageSection>
          );
        }

        if (section.type === 'personas') {
          return (
            <FooterPageSection key={key} id={section.id} alternate={alt}>
              <PersonasSection items={section.items || []} />
            </FooterPageSection>
          );
        }

        if ((section.type === 'plain' || (!section.type && section.body)) && section.body) {
          return (
            <FooterPageSection key={key} id={section.id} title={section.title} alternate={alt}>
              <div className="SectionRenderer__prose">
                {(section.body || []).map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="SectionRenderer__bullets">
                    {section.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
                {section.items && section.id !== 'capability-stories' && (
                  <ul className="SectionRenderer__items">
                    {section.items.map((it, j) => (
                      <li key={j}>
                        <strong>{it.title}</strong>
                        {it.body && <p>{it.body}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </FooterPageSection>
          );
        }

        if (section.type === 'categories') {
          return (
            <FooterPageSection key={key} id={section.id} alternate={alt}>
              <div className="SectionRenderer__categories">
                {(section.items || []).map((cat) => (
                  <a key={cat.id} href={`#${cat.id}`} className="SectionRenderer__category-link">
                    {cat.title}
                  </a>
                ))}
              </div>
            </FooterPageSection>
          );
        }

        if (section.type === 'links') {
          return (
            <FooterPageSection key={key} id={section.id} alternate={alt}>
              <div className="SectionRenderer__links">
                {(section.items || []).map((link, j) => (
                  <a
                    key={j}
                    href={link.href}
                    target={link.href?.startsWith('http') ? '_blank' : undefined}
                    rel={link.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="SectionRenderer__link-row"
                  >
                    <span className="SectionRenderer__link-label">{link.label}</span>
                    <span className="SectionRenderer__link-desc">{link.description}</span>
                  </a>
                ))}
              </div>
            </FooterPageSection>
          );
        }

        if (section.type === 'blog-entries') {
          return (
            <FooterPageSection key={key} id={section.id} alternate={alt}>
              <div className="SectionRenderer__blog">
                {(section.items || []).map((entry) => (
                  <article key={entry.id} className="SectionRenderer__blog-entry">
                    <h3 className="SectionRenderer__blog-title">{entry.title}</h3>
                    <time className="SectionRenderer__blog-date">{entry.date}</time>
                    <p className="SectionRenderer__blog-summary">{entry.summary}</p>
                    {entry.tags && <TagRow tags={entry.tags} />}
                    <a href="/resources/blog" className="SectionRenderer__blog-more">Read more</a>
                  </article>
                ))}
              </div>
            </FooterPageSection>
          );
        }

        if (section.type === 'cookie-categories') {
          return (
            <FooterPageSection key={key} id={section.id} title={section.title} alternate={alt}>
              <CookieCategoriesSection section={section} />
            </FooterPageSection>
          );
        }

        return null;
      })}
    </>
  );
}

function ContactFormSection({ section }) {
  const [form, setForm] = React.useState({ name: '', email: '', topic: '', message: '' });
  const [error, setError] = React.useState('');
  const [sent, setSent] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name?.trim()) return setError('Name is required.');
    if (!form.email?.trim()) return setError('Valid email is required.');
    if (!form.topic) return setError('Please select a topic.');
    if (!form.message?.trim() || form.message.trim().length < 20) return setError('Message must be at least 20 characters.');
    try {
      await submitContact(form);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  };

  if (sent) {
    return <p className="SectionRenderer__success">Thank you. Your message has been sent.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="SectionRenderer__form">
      {(section.fields || []).map((f) => (
        <FormField
          key={f.name}
          name={f.name}
          label={f.label}
          type={f.type}
          required={f.required}
          options={f.options}
          value={form[f.name]}
          onChange={(v) => setForm((prev) => ({ ...prev, [f.name]: v }))}
          error={error && (f.name === 'name' || f.name === 'email' || f.name === 'topic' || f.name === 'message') ? error : undefined}
          minLength={f.minLength}
        />
      ))}
      {section.privacyNote && <p className="SectionRenderer__privacy">{section.privacyNote}</p>}
      {error && <p className="FormField__error" role="alert">{error}</p>}
      <button type="submit" className="SectionRenderer__submit">Send</button>
    </form>
  );
}

function TalentWaitlistSection({ section }) {
  const [form, setForm] = React.useState({ name: '', email: '', area: '' });
  const [error, setError] = React.useState('');
  const [sent, setSent] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name?.trim() || !form.email?.trim() || !form.area) {
      setError('Please fill all required fields.');
      return;
    }
    try {
      await submitTalentWaitlist(form);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  };

  if (sent) return <p className="SectionRenderer__success">Thanks. We’ll be in touch when roles open up.</p>;

  return (
    <form onSubmit={handleSubmit} className="SectionRenderer__form">
      {(section.fields || []).map((f) => (
        <FormField
          key={f.name}
          name={f.name}
          label={f.label}
          type={f.type}
          required={f.required}
          options={f.options}
          value={form[f.name]}
          onChange={(v) => setForm((prev) => ({ ...prev, [f.name]: v }))}
        />
      ))}
      {error && <p className="FormField__error" role="alert">{error}</p>}
      <button type="submit" className="SectionRenderer__submit">Submit</button>
    </form>
  );
}

function PersonasSection({ items }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const persona = items[activeIndex];

  return (
    <div className="SectionRenderer__personas">
      <div className="SectionRenderer__personas-tabs" role="tablist" aria-label="Use case">
        {items.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-controls={`persona-panel-${i}`}
            id={`persona-tab-${i}`}
            className="SectionRenderer__personas-tab"
            onClick={() => setActiveIndex(i)}
          >
            {p.title}
          </button>
        ))}
      </div>
      {persona && (
        <div
          id={`persona-panel-${activeIndex}`}
          role="tabpanel"
          aria-labelledby={`persona-tab-${activeIndex}`}
          className="SectionRenderer__personas-panel"
        >
          <p className="SectionRenderer__personas-overview">{persona.overview}</p>
          {persona.bullets && persona.bullets.length > 0 && (
            <ul className="SectionRenderer__personas-bullets">
              {persona.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          )}
          <h3 className="SectionRenderer__personas-samples-title">Sample drafts</h3>
          {(persona.samples || []).map((sample, j) => (
            <div key={j} className="SectionRenderer__personas-sample">
              <p className="SectionRenderer__personas-situation"><strong>{sample.situation}</strong></p>
              {sample.keyPoints && sample.keyPoints.length > 0 && (
                <ul className="SectionRenderer__personas-keypoints">
                  {sample.keyPoints.map((kp, k) => (
                    <li key={k}>{kp}</li>
                  ))}
                </ul>
              )}
              <Accordion
                items={[{ title: 'Sample email', body: (sample.sampleEmail || '').split(/\n\n+/).filter(Boolean) }]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CookieCategoriesSection({ section }) {
  const [prefs, setPrefs] = React.useState(() => {
    try {
      const s = localStorage.getItem('letterlab_cookie_prefs');
      return s ? JSON.parse(s) : { preferences: true, analytics: false, marketing: false };
    } catch {
      return { preferences: true, analytics: false, marketing: false };
    }
  });
  const [saved, setSaved] = React.useState(false);

  const items = section.items || [];
  const handleToggle = (id, val) => {
    if (id === 'necessary') return;
    setPrefs((p) => ({ ...p, [id]: val }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem('letterlab_cookie_prefs', JSON.stringify(prefs));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
  };

  const handleReset = () => {
    setPrefs({ preferences: true, analytics: false, marketing: false });
  };

  return (
    <div className="SectionRenderer__cookies">
      {items.map((cat) => (
        <div key={cat.id} className="SectionRenderer__cookie-row">
          <div>
            <span className="SectionRenderer__cookie-label">{cat.label}</span>
            {cat.required && <span className="SectionRenderer__cookie-required"> (always on)</span>}
            <p className="SectionRenderer__cookie-desc">{cat.description}</p>
          </div>
          <label className="SectionRenderer__toggle">
            <input
              type="checkbox"
              checked={cat.required ? true : prefs[cat.id]}
              disabled={cat.required}
              onChange={(e) => handleToggle(cat.id, e.target.checked)}
            />
            <span className="SectionRenderer__slider" />
          </label>
        </div>
      ))}
      <div className="SectionRenderer__cookie-actions">
        <button type="button" onClick={handleReset} className="SectionRenderer__btn-secondary">Reset to default</button>
        <button type="button" onClick={handleSave} className="SectionRenderer__submit">Save settings</button>
      </div>
      {saved && <p className="SectionRenderer__saved" role="status">Settings saved.</p>}
    </div>
  );
}
