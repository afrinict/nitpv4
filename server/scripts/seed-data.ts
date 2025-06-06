import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: 'postgresql://nitp-projectdb_owner:npg_1YOFitB7HXQV@ep-calm-cherry-a9xwxhnr-pooler.gwc.azure.neon.tech/nitp-projectdb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function seedData() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert users
    const users = [
      {
        username: 'ethics_officer',
        email: 'ethics@nitp.org',
        password: 'ethics123',
        role: 'ETHICS_OFFICER',
        membership_id: 'TP-A32100001',
        is_verified: true
      },
      {
        username: 'finance_admin',
        email: 'finance@nitp.org',
        password: 'finance123',
        role: 'FINANCIAL_ADMINISTRATOR',
        membership_id: 'TP-A32100002',
        is_verified: true
      },
      {
        username: 'finance_officer',
        email: 'finance_officer@nitp.org',
        password: 'finance123',
        role: 'FINANCIAL_OFFICER',
        membership_id: 'TP-A32100003',
        is_verified: true
      }
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await client.query(
        `INSERT INTO users (username, email, password, role, membership_id, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (email) DO NOTHING
         RETURNING id`,
        [user.username, user.email, hashedPassword, user.role, user.membership_id, user.is_verified]
      );
    }

    // Insert members
    const members = [
      {
        first_name: 'John',
        last_name: 'Doe',
        phone: '+2348012345678',
        address: '123 Abuja Street, Abuja',
        membership_type: 'PROFESSIONAL',
        membership_status: 'ACTIVE',
        membership_expiry: new Date('2025-12-31')
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '+2348098765432',
        address: '456 Lagos Road, Lagos',
        membership_type: 'ASSOCIATE',
        membership_status: 'ACTIVE',
        membership_expiry: new Date('2025-12-31')
      }
    ];

    for (const member of members) {
      await client.query(
        `INSERT INTO members (user_id, first_name, last_name, phone, address, membership_type, membership_status, membership_expiry)
         SELECT id, $1, $2, $3, $4, $5, $6, $7
         FROM users
         WHERE role = 'MEMBER'
         LIMIT 1
         ON CONFLICT DO NOTHING`,
        [member.first_name, member.last_name, member.phone, member.address, member.membership_type, member.membership_status, member.membership_expiry]
      );
    }

    // Insert events
    const events = [
      {
        title: 'Annual Conference 2024',
        description: 'Join us for our annual conference on urban planning and development',
        event_date: new Date('2024-06-15'),
        location: 'International Conference Centre, Abuja',
        capacity: 500,
        registration_fee: 50000.00,
        status: 'UPCOMING'
      },
      {
        title: 'Workshop on Sustainable Development',
        description: 'Learn about sustainable urban development practices',
        event_date: new Date('2024-07-20'),
        location: 'NITP Headquarters, Abuja',
        capacity: 100,
        registration_fee: 25000.00,
        status: 'UPCOMING'
      }
    ];

    for (const event of events) {
      await client.query(
        `INSERT INTO events (title, description, event_date, location, capacity, registration_fee, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT DO NOTHING`,
        [event.title, event.description, event.event_date, event.location, event.capacity, event.registration_fee, event.status]
      );
    }

    // Insert financial transactions
    const transactions = [
      {
        amount: 50000.00,
        type: 'DUES',
        status: 'COMPLETED',
        description: 'Annual membership dues 2024'
      },
      {
        amount: 25000.00,
        type: 'EVENT',
        status: 'COMPLETED',
        description: 'Workshop registration fee'
      }
    ];

    for (const transaction of transactions) {
      await client.query(
        `INSERT INTO financial_transactions (member_id, amount, type, status, description)
         SELECT m.id, $1, $2, $3, $4
         FROM members m
         LIMIT 1
         ON CONFLICT DO NOTHING`,
        [transaction.amount, transaction.type, transaction.status, transaction.description]
      );
    }

    await client.query('COMMIT');
    console.log('Data seeded successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedData().catch(console.error); 