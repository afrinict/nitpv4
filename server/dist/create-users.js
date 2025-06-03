import 'dotenv/config';
import { db } from './db';
import { users } from '@shared/schema';
import { hashPassword } from './auth';
async function createUsers() {
    try {
        const userData = [
            {
                username: 'admin',
                email: 'admin@nitp-abuja.afrinict.com',
                role: 'ADMINISTRATOR',
                membershipId: null
            },
            {
                username: 'member',
                email: 'member@nitp-abuja.afrinict.com',
                role: 'MEMBER',
                membershipId: 'TP-A32123456'
            },
            {
                username: 'member2',
                email: 'member2@nitp-abuja.afrinict.com',
                role: 'MEMBER',
                membershipId: 'TP-A32765432'
            },
            {
                username: 'member3',
                email: 'member3@nitp-abuja.afrinict.com',
                role: 'MEMBER',
                membershipId: 'TP-A32987654'
            },
            {
                username: 'ethic',
                email: 'ethics@nitp-abuja.afrinict.com',
                role: 'ETHICS_OFFICER',
                membershipId: 'TP-A32567890'
            },
            {
                username: 'finsec',
                email: 'finsec@nitp-abuja.afrinict.com',
                role: 'FINANCIAL_ADMINISTRATOR',
                membershipId: 'TP-A32109876'
            }
        ];
        console.log('Creating users...');
        for (const user of userData) {
            const hashedPassword = await hashPassword(user.username === 'admin' ? 'admin123' : 'pass123');
            const [createdUser] = await db.insert(users).values({
                ...user,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
                isVerified: true,
                isActive: true
            }).returning();
            console.log(`Created user: ${createdUser.username} (${createdUser.role})`);
        }
        console.log('\nAll users created successfully!');
    }
    catch (error) {
        console.error('Error creating users:', error);
    }
    finally {
        process.exit(0);
    }
}
createUsers();
