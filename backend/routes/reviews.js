import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const REVIEWS_STORE = path.resolve(__dirname, '../content/reviews.json');

router.get('/', async (req, res) => {
    try {
        const raw = await fs.readFile(REVIEWS_STORE, 'utf-8');
        const list = JSON.parse(raw);
        res.json(list);
    } catch {
        res.json([]);
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, quote, rating, title, company } = req.body || {};

        if (!name || !quote) {
            return res.status(400).json({ error: 'Name and quote are required.' });
        }

        let list = [];
        try {
            const raw = await fs.readFile(REVIEWS_STORE, 'utf-8');
            list = JSON.parse(raw);
        } catch {
            // file missing or invalid
        }

        const newReview = {
            id: `r_${Date.now()}`,
            name: name.trim(),
            quote: quote.trim(),
            rating: rating || 5,
            title: title || 'User',
            company: company || '',
            verified: true,
            tag: 'Community',
            createdAt: new Date().toISOString()
        };

        list.push(newReview);
        await fs.mkdir(path.dirname(REVIEWS_STORE), { recursive: true });
        await fs.writeFile(REVIEWS_STORE, JSON.stringify(list, null, 2), 'utf-8');

        return res.status(200).json({ success: true, review: newReview });
    } catch (error) {
        console.error('[reviews]', error);
        return res.status(500).json({ error: 'Failed to submit review' });
    }
});

export default router;
