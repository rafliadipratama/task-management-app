import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();

  // Project 1: E-Commerce Mobile App Redesign
  const project1 = await prisma.project.create({
    data: {
      title: 'E-Commerce Mobile App Redesign',
      description: 'Revamping the user checkout flow, cart experience, and home page recommendations.',
      tasks: {
        create: [
          {
            title: 'Design Checkout Flow Wireframes',
            description: 'Create Figma interactive prototype for one-click checkout and address selector.',
            status: 'done',
            priority: 'high',
          },
          {
            title: 'Implement Payment Gateway Integration',
            description: 'Integrate Stripe and Midtrans webhooks for handling card and QRIS transactions.',
            status: 'in_progress',
            priority: 'high',
          },
          {
            title: 'Refactor Product Search Engine',
            description: 'Enhance autocomplete search queries with debounce and category filters.',
            status: 'todo',
            priority: 'medium',
          },
          {
            title: 'Setup Push Notifications',
            description: 'Send delivery and discount updates using Firebase Cloud Messaging.',
            status: 'todo',
            priority: 'low',
          },
        ],
      },
    },
  });

  // Project 2: Internal HR & Attendance System
  const project2 = await prisma.project.create({
    data: {
      title: 'Internal HR & Attendance Portal',
      description: 'Employee management portal for shift scheduling, leave requests, and payroll tracking.',
      tasks: {
        create: [
          {
            title: 'Database Schema for Shift Patterns',
            description: 'Model rotating shifts, overtime rules, and holiday calendar.',
            status: 'done',
            priority: 'medium',
          },
          {
            title: 'Geolocation Verification API',
            description: 'Verify employee check-in latitude and longitude within office geofence.',
            status: 'in_progress',
            priority: 'high',
          },
          {
            title: 'Export Monthly Attendance to Excel',
            description: 'Generate formatted spreadsheet with totals and deductions.',
            status: 'todo',
            priority: 'low',
          },
        ],
      },
    },
  });

  // Project 3: Cloud Infrastructure Optimization
  const project3 = await prisma.project.create({
    data: {
      title: 'Cloud Infrastructure & Security Audit',
      description: 'Migrating legacy monolith services to containerized microservices and hardening IAM policies.',
      tasks: {
        create: [
          {
            title: 'Setup Automated CI/CD Pipeline',
            description: 'GitHub Actions workflow for linting, testing, and zero-downtime deployment.',
            status: 'done',
            priority: 'high',
          },
          {
            title: 'Rotate Root API Keys and Certificates',
            description: 'Automate SSL renewal via Let\'s Encrypt and migrate keys to HashiCorp Vault.',
            status: 'done',
            priority: 'high',
          },
          {
            title: 'Conduct Load Testing on Black Friday Scenario',
            description: 'Simulate 15,000 concurrent RPS using k6 scripts.',
            status: 'in_progress',
            priority: 'medium',
          },
        ],
      },
    },
  });

  console.log(`✅ Seed finished successfully! Created 3 projects with 10 tasks.`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
