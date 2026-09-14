import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_S6AQBl1xjgVn@ep-noisy-bonus-axh88gf9-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
});

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id BIGINT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT DEFAULT 'Agricultural',
        location TEXT NOT NULL,
        size TEXT NOT NULL,
        price TEXT NOT NULL,
        status TEXT DEFAULT 'Available',
        feat1 TEXT DEFAULT '',
        feat2 TEXT DEFAULT '',
        feat3 TEXT DEFAULT '',
        image TEXT DEFAULT '',
        description TEXT DEFAULT ''
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id BIGINT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT DEFAULT '',
        interest TEXT DEFAULT '',
        message TEXT DEFAULT '',
        date TEXT DEFAULT '',
        status TEXT DEFAULT 'New',
        type TEXT DEFAULT 'buyer'
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id BIGINT PRIMARY KEY,
        name TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        text TEXT NOT NULL,
        date TEXT DEFAULT '',
        type TEXT DEFAULT 'buyer'
      );
    `);

    // Seed default data if empty
    const propCount = await client.query("SELECT COUNT(*) FROM properties");
    if (parseInt(propCount.rows[0].count) === 0) {
      await client.query(`INSERT INTO properties (id, name, type, location, size, price, status, feat1, feat2, feat3, image, description) VALUES
        (1, 'Green Valley Farm', 'Agricultural', 'Nashik, Maharashtra', '5 Acres', '5 crores /', 'Available', 'Irrigated', 'Road Access', 'Water Supply', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop', 'Premium agricultural land with irrigation and road access.'),
        (2, 'Riverside Heights', 'Residential', 'Alibaug, Maharashtra', '2,400 sq.ft', '₹85L / plot', 'Available', 'River View', 'Green Area', 'Gated', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop', 'Residential plot with river view in gated community.'),
        (3, 'Palm Grove Plot', 'Residential', 'ECR, Chennai', '1,800 sq.ft', '₹62L / plot', 'Available', 'Beach Proximity', 'Main Road', 'Corner Plot', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop', 'Prime residential plot near beach.'),
        (4, 'Tech Corridor Land', 'Commercial', 'HITEC City, Hyderabad', '15,000 sq.ft', '₹4.5Cr / plot', 'Available', 'Metro Adjacent', 'Commercial Zone', 'Highway Facing', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop', 'Commercial land in tech corridor.'),
        (5, 'Hill View Retreat', 'Farmhouse', 'Lonavala, Maharashtra', '3 Acres', '₹75L / acre', 'Available', 'Hill View', 'Nature', 'Waterfall Nearby', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop', 'Scenic farmhouse land with hill view.')`);
    }

    const leadCount = await client.query("SELECT COUNT(*) FROM leads");
    if (parseInt(leadCount.rows[0].count) === 0) {
      await client.query(`INSERT INTO leads (id, name, phone, email, interest, message, date, status, type) VALUES
        (1, 'Rajesh Kumar', '+91 98765 43210', 'rajesh@email.com', 'Agricultural', 'Looking for 5 acre farmland near Nashik', '2026-09-10', 'New', 'buyer'),
        (2, 'Priya Sharma', '+91 87654 32109', 'priya@email.com', 'Residential', 'Want a plot in Alibaug area', '2026-09-11', 'Contacted', 'buyer'),
        (3, 'Arun Mehta', '+91 76543 21098', 'arun@email.com', 'Commercial', 'Need commercial land in Hyderabad', '2026-09-12', 'New', 'seller')`);
    }

    const revCount = await client.query("SELECT COUNT(*) FROM reviews");
    if (parseInt(revCount.rows[0].count) === 0) {
      await client.query(`INSERT INTO reviews (id, name, rating, text, date, type) VALUES
        (1, 'Rajesh Kumar', 5, 'Terra Vista helped me find the perfect agricultural land near Nashik. The entire process was transparent and smooth.', '2026-09-10', 'buyer'),
        (2, 'Priya Sharma', 5, 'Vikram''s expertise in land advisory is unmatched. He guided us through every step of purchasing our residential plot.', '2026-09-11', 'buyer'),
        (3, 'Arun Mehta', 4, 'Excellent service for selling our commercial land in Hyderabad. Got a great price thanks to their market knowledge.', '2026-09-12', 'seller'),
        (4, 'Sneha Patel', 5, 'Best land advisory in India. They found us a beautiful farmhouse plot in Lonavala within our budget.', '2026-09-13', 'buyer')`);
    }
  } finally {
    client.release();
  }
}

// Initialize on first import
initDB().catch(console.error);

export default pool;