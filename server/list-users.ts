import 'dotenv/config';
import { db } from './db';
import { users } from '@shared/schema';

async function listUsers() {
  try {
    const allUsers = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role,
      membershipId: users.membershipId,
      isVerified: users.isVerified,
      isActive: users.isActive,
      createdAt: users.createdAt,
      lastLogin: users.lastLogin
    }).from(users);

    console.log('\nUser List:');
    console.log('==========');
    allUsers.forEach(user => {
      console.log(`\nID: ${user.id}`);
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Membership ID: ${user.membershipId || 'N/A'}`);
      console.log(`Verified: ${user.isVerified ? 'Yes' : 'No'}`);
      console.log(`Active: ${user.isActive ? 'Yes' : 'No'}`);
      console.log(`Created: ${user.createdAt}`);
      console.log(`Last Login: ${user.lastLogin || 'Never'}`);
      console.log('----------');
    });
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    process.exit(0);
  }
}

listUsers(); 