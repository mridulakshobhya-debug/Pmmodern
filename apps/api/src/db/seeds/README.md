This project currently uses in-memory mock data for fast local iteration.

When switching to PostgreSQL:
1. Apply `migrations/001_init.sql`.
2. Add real seed scripts for categories, products, and demo accounts.
3. Replace repository implementations to use persistent storage.
