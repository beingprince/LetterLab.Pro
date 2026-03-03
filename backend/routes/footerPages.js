// backend/routes/footerPages.js
// GET /api/footer-pages?slug=product/features — serve JSON content

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const CONTENT_DIR = path.resolve(__dirname, '../content/footer-pages');

const SLUG_TO_FILE = {
  'product/features': 'product.features.json',
  'product/pricing': 'product.pricing.json',
  'product/use-cases': 'product.use-cases.json',
  'product/updates': 'product.updates.json',
  'resources/documentation': 'resources.documentation.json',
  'resources/help-center': 'resources.help-center.json',
  'resources/blog': 'resources.blog.json',
  'resources/community': 'resources.community.json',
  'company/about': 'company.about.json',
  'company/contact': 'company.contact.json',
  'legal/privacy-policy': 'legal.privacy-policy.json',
  'legal/terms-of-service': 'legal.terms-of-service.json',
  'legal/cookies-settings': 'legal.cookies-settings.json',
};

router.get('/', async (req, res) => {
  const slug = (req.query.slug || '').trim();
  if (!slug) return res.status(400).json({ error: 'Missing slug' });
  const file = SLUG_TO_FILE[slug];
  if (!file) return res.status(404).json({ error: 'Page not found' });
  const filePath = path.join(CONTENT_DIR, file);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(raw);
    if (data.slug !== slug) data.slug = slug;
    return res.json(data);
  } catch (err) {
    if (err.code === 'ENOENT') return res.status(404).json({ error: 'Page not found' });
    console.error('[footer-pages]', err);
    return res.status(500).json({ error: 'Failed to load content' });
  }
});

export default router;
