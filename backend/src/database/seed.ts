import 'dotenv/config';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { hashPassword } from 'better-auth/crypto';
import * as schema from './schema/index.js';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Starting database seed for Kauwar Chor Kindergarten University (KCKU)...');

  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nest_db',
    waitForConnections: true,
    connectionLimit: 5,
  });

  const db = drizzle(pool, { schema, mode: 'default' });

  try {
    // 1. Password Hashes (Using Better Auth Scrypt Cryptography)
    console.log('🔐 Hashing user passwords via better-auth/crypto...');
    const adminPasswordHash = await hashPassword('admin123');
    const staffPasswordHash = await hashPassword('tech1234');
    const transportPasswordHash = await hashPassword('transport123');
    const studentPasswordHash = await hashPassword('student123');

    // 2. Define Core University Users
    const usersToSeed = [
      {
        id: 'usr_admin_proctor',
        name: 'Dr. Rafiqul Islam (Chief Proctor)',
        email: 'proctor@kcku.edu',
        emailVerified: true,
        role: 'admin' as const,
        studentId: null,
        department: 'Proctor Office & Student Welfare',
        passwordHash: adminPasswordHash,
      },
      {
        id: 'usr_staff_tech',
        name: 'Kamal Uddin (Senior Maintenance Tech)',
        email: 'technician@kcku.edu',
        emailVerified: true,
        role: 'staff' as const,
        studentId: null,
        department: 'Campus Electrical & Plumbing Cell',
        passwordHash: staffPasswordHash,
      },
      {
        id: 'usr_staff_transport',
        name: 'Jashim Uddin (Transport Dispatcher)',
        email: 'transport@kcku.edu',
        emailVerified: true,
        role: 'staff' as const,
        studentId: null,
        department: 'University Bus Directorate',
        passwordHash: transportPasswordHash,
      },
      {
        id: 'usr_student_tanvir',
        name: 'Tanvir Hossain',
        email: 'student@kcku.edu',
        emailVerified: true,
        role: 'student' as const,
        studentId: 'KCKU-2023-0101',
        department: 'Computer Science & Engineering',
        passwordHash: studentPasswordHash,
      },
      {
        id: 'usr_student_anika',
        name: 'Anika Rahman',
        email: 'anika@kcku.edu',
        emailVerified: true,
        role: 'student' as const,
        studentId: 'KCKU-2023-0205',
        department: 'Business Administration',
        passwordHash: studentPasswordHash,
      },
      {
        id: 'usr_student_mahmud',
        name: 'Mahmudul Hasan',
        email: 'mahmud@kcku.edu',
        emailVerified: true,
        role: 'student' as const,
        studentId: 'KCKU-2024-0312',
        department: 'Electrical & Electronic Engineering',
        passwordHash: studentPasswordHash,
      },
    ];

    console.log('👤 Seeding users & auth accounts...');
    for (const u of usersToSeed) {
      // Upsert User
      const existingUser = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.email, u.email))
        .limit(1);

      let userId = u.id;

      if (existingUser.length === 0) {
        await db.insert(schema.user).values({
          id: u.id,
          name: u.name,
          email: u.email,
          emailVerified: u.emailVerified,
          role: u.role,
          studentId: u.studentId,
          department: u.department,
        });
        console.log(`  ✔ Created user: ${u.email} (${u.role})`);
      } else {
        userId = existingUser[0].id;
        console.log(`  ℹ User already exists: ${u.email}`);
      }

      // Upsert Account credentials
      const existingAccount = await db
        .select()
        .from(schema.account)
        .where(eq(schema.account.userId, userId))
        .limit(1);

      if (existingAccount.length === 0) {
        await db.insert(schema.account).values({
          id: `acc_${userId}`,
          userId: userId,
          accountId: userId,
          providerId: 'credential',
          password: u.passwordHash,
        });
        console.log(`  ✔ Created credential account for: ${u.email}`);
      } else {
        await db
          .update(schema.account)
          .set({
            accountId: userId,
            password: u.passwordHash,
            updatedAt: new Date(),
          })
          .where(eq(schema.account.userId, userId));
        console.log(`  ✔ Updated credential account for: ${u.email}`);
      }
    }

    // 3. Define Realistic Campus Complaints
    console.log('📋 Seeding campus complaints across sectors...');
    const complaintsToSeed = [
      {
        authorId: 'usr_student_tanvir',
        title: '🏢 Hall 3 (South Wing) 4th Floor Water Filter Leaking & Low Pressure',
        description:
          'The central drinking water purifier on the 4th floor has been leaking continuously since Tuesday morning. Low water pressure is forcing 120+ residents to carry buckets down to the 2nd floor.',
        category: 'facilities' as const,
        visibility: 'public' as const,
        isAnonymous: false,
        priority: 'urgent' as const,
        status: 'in_progress' as const,
        assignedStaffId: 'usr_staff_tech',
        resolutionNote: null,
        upvotesCount: 47,
        resolvedAt: null,
      },
      {
        authorId: 'usr_student_anika',
        title: '🛏️ Central Canteen Lunch Hygiene & Cold Food Complaint',
        description:
          'Several resident students reported undercooked chicken and cold rice served during lunch on Monday. Water cups on dining tables were not properly sanitized. Requesting urgent food safety inspection.',
        category: 'hostel_canteen' as const,
        visibility: 'public' as const,
        isAnonymous: true,
        priority: 'high' as const,
        status: 'under_review' as const,
        assignedStaffId: 'usr_admin_proctor',
        resolutionNote: null,
        upvotesCount: 89,
        resolvedAt: null,
      },
      {
        authorId: 'usr_student_anika',
        title: '🚌 Route 4 Campus Bus Overcrowding & Morning Delay (8:15 AM)',
        description:
          'Route 4 bus from Chawkbazar to campus arrives 25 minutes late consistently, causing students to miss 9:00 AM lab attendance. The bus is dangerously overloaded with students standing on footboards.',
        category: 'transport' as const,
        visibility: 'public' as const,
        isAnonymous: false,
        priority: 'medium' as const,
        status: 'resolved' as const,
        assignedStaffId: 'usr_staff_transport',
        resolutionNote:
          'Transport Directorate dispatched Bus #14 as an additional backup shuttle at 8:20 AM. Bus route schedule adjusted and driver counselled.',
        upvotesCount: 63,
        resolvedAt: new Date(Date.now() - 3600 * 1000 * 24),
      },
      {
        authorId: 'usr_student_mahmud',
        title: '📚 Central Library 3rd Floor Wi-Fi Router Disconnecting Frequently',
        description:
          'The access point "KCKU-STUDENT-LIB-03" drops connection every 10-15 minutes, interrupting digital resource access for midterm research students. Signal strength fluctuates severely.',
        category: 'academics' as const,
        visibility: 'public' as const,
        isAnonymous: false,
        priority: 'medium' as const,
        status: 'in_progress' as const,
        assignedStaffId: 'usr_staff_tech',
        resolutionNote: null,
        upvotesCount: 38,
        resolvedAt: null,
      },
      {
        authorId: 'usr_student_tanvir',
        title: '🛡️ Streetlight Outage & Ragging Patrol Request at North Boundary Gate',
        description:
          'Two high-pressure sodium street lamps near the botanical garden walkway have been dead for a week. Freshers reported intimidation attempts around 9:30 PM. Urgent mobile proctor patrol needed.',
        category: 'safety_bullying' as const,
        visibility: 'public' as const,
        isAnonymous: true,
        priority: 'urgent' as const,
        status: 'resolved' as const,
        assignedStaffId: 'usr_admin_proctor',
        resolutionNote:
          'Proctorial Mobile Patrol Post #2 stationed at North Gate from 8:00 PM to 1:00 AM daily. Electrical maintenance installed two new 100W LED floodlights on Oct 19.',
        upvotesCount: 114,
        resolvedAt: new Date(Date.now() - 3600 * 1000 * 12),
      },
      {
        authorId: 'usr_student_mahmud',
        title: '📑 Semester 5 Grade Sheet Discrepancy Correction Desk Delay',
        description:
          'The exam controller office counter #3 is only open for 45 minutes a day, creating an unruly queue of 80+ students trying to resolve course credit mismatches before registration deadline.',
        category: 'administration' as const,
        visibility: 'public' as const,
        isAnonymous: false,
        priority: 'low' as const,
        status: 'submitted' as const,
        assignedStaffId: null,
        resolutionNote: null,
        upvotesCount: 29,
        resolvedAt: null,
      },
      {
        authorId: 'usr_student_tanvir',
        title: '🔒 Confidential Whistleblower: Late Night Dorm Intimidation in Hall 2 Room 314',
        description:
          'Non-resident senior students entered Room 314 at 1:30 AM demanding juniors to perform menial tasks. Requesting confidential proctorial inspection without revealing complainant details.',
        category: 'safety_bullying' as const,
        visibility: 'private' as const,
        isAnonymous: true,
        priority: 'urgent' as const,
        status: 'under_review' as const,
        assignedStaffId: 'usr_admin_proctor',
        resolutionNote: null,
        upvotesCount: 0,
        resolvedAt: null,
      },
    ];

    for (const c of complaintsToSeed) {
      const existing = await db
        .select()
        .from(schema.complaints)
        .where(eq(schema.complaints.title, c.title))
        .limit(1);

      if (existing.length === 0) {
        const [result] = await db.insert(schema.complaints).values(c);
        const complaintId = result.insertId;
        console.log(`  ✔ Seeded complaint #${complaintId}: "${c.title.slice(0, 40)}..."`);

        // Seed sample upvote
        try {
          await db.insert(schema.complaintUpvotes).values({
            complaintId,
            userId: 'usr_student_anika',
          });
        } catch {
          // ignore duplicate
        }

        // Seed sample activity timeline comment
        await db.insert(schema.complaintComments).values({
          complaintId,
          authorId: c.assignedStaffId || 'usr_admin_proctor',
          message:
            c.status === 'resolved'
              ? 'Repair verified by campus authority. Case closed.'
              : 'Ticket acknowledged by department. Technician assigned.',
          statusChangeTo: c.status,
          isInternalNote: false,
        });
      } else {
        console.log(`  ℹ Complaint already exists: "${c.title.slice(0, 40)}..."`);
      }
    }

    console.log('✅ Database seed completed successfully!');
  } catch (err: any) {
    console.error('❌ Error seeding database:', err.message);
    throw err;
  } finally {
    await pool.end();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

