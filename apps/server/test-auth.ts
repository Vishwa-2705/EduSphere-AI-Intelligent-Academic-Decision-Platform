import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ENV } from './src/config/env';
import { User } from './src/models/User';

async function testAllLogins() {
  await mongoose.connect(ENV.MONGODB_URI);
  console.log('Connected to MongoDB for login verification.');

  const accounts = [
    { role: 'STUDENT', email: 'aarav@edusphere.ai', pass: 'Student@12345' },
    { role: 'FACULTY', email: 'faculty@edusphere.ai', pass: 'Faculty@12345' },
    { role: 'MENTOR', email: 'mentor@edusphere.ai', pass: 'Mentor@12345' },
    { role: 'ADMIN', email: 'admin@edusphere.ai', pass: 'Admin@12345' },
  ];

  for (const acc of accounts) {
    const user = await User.findOne({ email: acc.email.toLowerCase() });
    if (!user) {
      console.error(`❌ FAILED: User not found for ${acc.role} (${acc.email})`);
      continue;
    }
    const match = await bcrypt.compare(acc.pass, user.passwordHash);
    if (match && user.role === acc.role) {
      console.log(`✅ VERIFIED: ${acc.role} (${acc.email}) -> Password verified, Role: ${user.role}`);
    } else {
      console.error(`❌ FAILED: ${acc.role} password match: ${match}, role: ${user.role}`);
    }
  }

  await mongoose.disconnect();
  process.exit(0);
}

testAllLogins();
