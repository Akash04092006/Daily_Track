import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * ==============================================================================
 * DEMO USER CREDENTIALS (DEMO-ONLY DATA FOR LOCAL DEVELOPMENT AND TESTING)
 * Email:    demo@dailyup.app
 * Password: Demo@1234
 * ==============================================================================
 */
const DEMO_EMAIL = "demo@dailyup.app";
const DEMO_PASSWORD = "Demo@1234";

function formatDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Idempotency cleanup: Delete existing demo user and cascaded relations
  await prisma.user.deleteMany({
    where: { email: DEMO_EMAIL },
  });

  // 2. Hash password and create demo user
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const user = await prisma.user.create({
    data: {
      email: DEMO_EMAIL,
      name: "Alex Vance",
      passwordHash,
      avatarColor: "indigo",
      timezone: "Asia/Kolkata",
      theme: "system",
      weekStartsOn: 1, // Monday
    },
  });

  console.log(`👤 Created Demo User: ${user.email} (${user.id})`);

  // 3. Create 7 realistic habits across categories
  const habitDefinitions = [
    {
      title: "Morning Meditation",
      description: "15 minutes of unguided mindfulness breathing",
      category: "mindfulness",
      icon: "sun",
      color: "amber",
      frequencyType: "daily",
      frequencyDays: null,
      targetPerDay: 1,
      unit: "session",
      reminderTime: "07:00",
      sortOrder: 0,
    },
    {
      title: "Drink 3L Water",
      description: "Hydrate steadily throughout the day",
      category: "health",
      icon: "water",
      color: "blue",
      frequencyType: "daily",
      frequencyDays: null,
      targetPerDay: 3,
      unit: "liters",
      reminderTime: "09:00",
      sortOrder: 1,
    },
    {
      title: "Strength Training",
      description: "Progressive compound lifting (Mon, Wed, Fri)",
      category: "fitness",
      icon: "dumbbell",
      color: "emerald",
      frequencyType: "custom",
      frequencyDays: "1,3,5", // Mon, Wed, Fri
      targetPerDay: 1,
      unit: "workout",
      reminderTime: "17:30",
      sortOrder: 2,
    },
    {
      title: "Read 20 Pages",
      description: "Non-fiction reading on architecture, science, and history",
      category: "learning",
      icon: "book",
      color: "indigo",
      frequencyType: "daily",
      frequencyDays: null,
      targetPerDay: 20,
      unit: "pages",
      reminderTime: "21:30",
      sortOrder: 3,
    },
    {
      title: "Deep Work Session",
      description: "90 minutes of distraction-free coding or writing",
      category: "productivity",
      icon: "zap",
      color: "violet",
      frequencyType: "weekdays",
      frequencyDays: null,
      targetPerDay: 1,
      unit: "block",
      reminderTime: "10:00",
      sortOrder: 4,
    },
    {
      title: "Track Daily Expenses",
      description: "Log all card and cash transactions into budgeting ledger",
      category: "finance",
      icon: "dollar",
      color: "rose",
      frequencyType: "daily",
      frequencyDays: null,
      targetPerDay: 1,
      unit: "review",
      reminderTime: "22:00",
      sortOrder: 5,
    },
    {
      title: "Evening Reflection",
      description: "Write 3 wins and tomorrow's top 3 priorities",
      category: "mindfulness",
      icon: "moon",
      color: "cyan",
      frequencyType: "daily",
      frequencyDays: null,
      targetPerDay: 1,
      unit: "entry",
      reminderTime: "22:30",
      sortOrder: 6,
    },
  ];

  const createdHabits = [];
  for (const habitDef of habitDefinitions) {
    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        ...habitDef,
      },
    });
    createdHabits.push(habit);
  }
  console.log(`📋 Created ${createdHabits.length} Habits.`);

  // 4. Generate ~60 days of HabitLogs with realistic completion gaps
  const now = new Date();
  const logsToCreate = [];

  // Deterministic pseudorandom generator based on seed string
  function pseudoRandom(seed: number): number {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  let seedCounter = 42;

  for (let i = 60; i >= 0; i--) {
    const logDate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i)
    );
    const dateStr = formatDate(logDate);
    const dayOfWeek = logDate.getUTCDay();

    for (const habit of createdHabits) {
      let isDue = false;
      if (habit.frequencyType === "daily") {
        isDue = true;
      } else if (habit.frequencyType === "weekdays") {
        isDue = dayOfWeek >= 1 && dayOfWeek <= 5;
      } else if (habit.frequencyType === "custom" && habit.frequencyDays) {
        const days = habit.frequencyDays.split(",").map((d) => parseInt(d, 10));
        isDue = days.includes(dayOfWeek);
      }

      if (!isDue) continue;

      // Realistic completion rates per habit
      let targetRate = 0.8;
      if (habit.title.includes("Strength")) targetRate = 0.75;
      if (habit.title.includes("Water")) targetRate = 0.9;
      if (habit.title.includes("Deep Work")) targetRate = 0.7;
      if (habit.title.includes("Meditation")) targetRate = 0.85;

      const roll = pseudoRandom(seedCounter++);
      if (roll < targetRate) {
        let note: string | null = null;
        if (roll < 0.15) {
          note = "Felt energized and focused today!";
        } else if (roll < 0.25 && habit.title.includes("Read")) {
          note = "Finished an insightful chapter on concurrency.";
        }

        logsToCreate.push({
          habitId: habit.id,
          userId: user.id,
          date: dateStr,
          value: habit.targetPerDay,
          note,
        });
      }
    }
  }

  await prisma.habitLog.createMany({
    data: logsToCreate,
  });
  console.log(`📊 Created ${logsToCreate.length} HabitLogs across 60 days.`);

  // 5. Generate 30 days of DailyEntry rows
  const entriesToCreate = [];
  const reflections = [
    "Productive morning with solid deep work blocks. Feeling calm and centered.",
    "A bit fatigued in the afternoon, but recovered with an outdoor walk.",
    "Great momentum today. Crushed the gym workout and finished my reading quota.",
    "Distracted by notifications early on, but recovered focus after midday.",
    "Calm weekend day. Prioritized mental clarity and family time.",
    "High energy sprint on product roadmap. Clear vision for the coming sprint.",
  ];

  const wins = [
    "Zero distraction morning, completed primary deliverables early.",
    "Hit a clean 5km running pace, felt strong throughout.",
    "Finished 40 pages of reading, prepped weekly meal plan.",
    "Refactored data layer architecture cleanly without breaking contracts.",
    "Consistent hydration and early bedtime routine maintained.",
  ];

  for (let i = 30; i >= 0; i--) {
    const entryDate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i)
    );
    const dateStr = formatDate(entryDate);

    const mood = 3 + Math.floor(pseudoRandom(seedCounter++) * 3); // 3, 4, or 5
    const energy = 2 + Math.floor(pseudoRandom(seedCounter++) * 4); // 2, 3, 4, or 5
    const focus = 3 + Math.floor(pseudoRandom(seedCounter++) * 3); // 3, 4, or 5

    const reflection =
      reflections[Math.floor(pseudoRandom(seedCounter++) * reflections.length)];
    const win = wins[Math.floor(pseudoRandom(seedCounter++) * wins.length)];

    entriesToCreate.push({
      userId: user.id,
      date: dateStr,
      mood: Math.min(5, mood),
      energy: Math.min(5, energy),
      focus: Math.min(5, focus),
      reflection,
      wins: win,
    });
  }

  await prisma.dailyEntry.createMany({
    data: entriesToCreate,
  });
  console.log(`📝 Created ${entriesToCreate.length} DailyEntry journals across 30 days.`);

  // 6. Create 3 Goals + Milestones + GoalHabit Links
  // Goal 1: Active
  const goal1 = await prisma.goal.create({
    data: {
      userId: user.id,
      title: "Read 12 Technical & Philosophy Books",
      description:
        "Expand worldview and software engineering depth through deliberate reading",
      category: "learning",
      status: "active",
      targetValue: 12,
      currentValue: 4,
      unit: "books",
      startDate: new Date("2026-01-01T00:00:00Z"),
      targetDate: new Date("2026-12-31T23:59:59Z"),
      milestones: {
        create: [
          {
            title: "Read Book 1: Atomic Habits",
            isDone: true,
            doneAt: new Date("2026-02-15T12:00:00Z"),
            sortOrder: 0,
          },
          {
            title: "Read Book 2: Deep Work",
            isDone: true,
            doneAt: new Date("2026-04-10T15:00:00Z"),
            sortOrder: 1,
          },
          {
            title: "Read Book 3: Psychology of Money",
            isDone: true,
            doneAt: new Date("2026-06-20T18:00:00Z"),
            sortOrder: 2,
          },
          {
            title: "Read Book 4: Clean Architecture",
            isDone: true,
            doneAt: new Date("2026-08-30T10:00:00Z"),
            sortOrder: 3,
          },
          {
            title: "Read Book 5: Designing Data-Intensive Applications",
            isDone: false,
            doneAt: null,
            sortOrder: 4,
          },
        ],
      },
    },
  });

  // Link Goal 1 to "Read 20 Pages" habit
  const readingHabit = createdHabits.find((h) => h.title.includes("Read"));
  if (readingHabit) {
    await prisma.goalHabit.create({
      data: {
        goalId: goal1.id,
        habitId: readingHabit.id,
      },
    });
  }

  // Goal 2: Completed
  const goal2 = await prisma.goal.create({
    data: {
      userId: user.id,
      title: "Complete 10k Endurance Run",
      description: "Train aerobic capacity and complete sub-50 minute 10k run",
      category: "fitness",
      status: "completed",
      targetValue: 10,
      currentValue: 10,
      unit: "km",
      startDate: new Date("2026-03-01T00:00:00Z"),
      targetDate: new Date("2026-06-30T00:00:00Z"),
      completedAt: new Date("2026-06-25T08:30:00Z"),
      milestones: {
        create: [
          {
            title: "Continuous 3km base run",
            isDone: true,
            doneAt: new Date("2026-03-20T08:00:00Z"),
            sortOrder: 0,
          },
          {
            title: "5km tempo run in under 26 minutes",
            isDone: true,
            doneAt: new Date("2026-05-10T08:00:00Z"),
            sortOrder: 1,
          },
          {
            title: "10k official race completion",
            isDone: true,
            doneAt: new Date("2026-06-25T08:30:00Z"),
            sortOrder: 2,
          },
        ],
      },
    },
  });

  // Link Goal 2 to "Strength Training"
  const gymHabit = createdHabits.find((h) => h.title.includes("Strength"));
  if (gymHabit) {
    await prisma.goalHabit.create({
      data: {
        goalId: goal2.id,
        habitId: gymHabit.id,
      },
    });
  }

  // Goal 3: Paused
  const goal3 = await prisma.goal.create({
    data: {
      userId: user.id,
      title: "Launch Full-Stack Micro SaaS",
      description: "Build, validate, and launch a subscription micro-product",
      category: "productivity",
      status: "paused",
      targetValue: 100,
      currentValue: 40,
      unit: "percent",
      startDate: new Date("2026-05-01T00:00:00Z"),
      targetDate: new Date("2026-11-30T00:00:00Z"),
      completedAt: null,
      milestones: {
        create: [
          {
            title: "Product wireframes and Figma prototypes",
            isDone: true,
            doneAt: new Date("2026-05-25T14:00:00Z"),
            sortOrder: 0,
          },
          {
            title: "PostgreSQL & Prisma data layer implementation",
            isDone: true,
            doneAt: new Date("2026-06-18T16:00:00Z"),
            sortOrder: 1,
          },
          {
            title: "Public beta launch and user interview campaign",
            isDone: false,
            doneAt: null,
            sortOrder: 2,
          },
        ],
      },
    },
  });

  // Link Goal 3 to "Deep Work Session"
  const deepWorkHabit = createdHabits.find((h) => h.title.includes("Deep Work"));
  if (deepWorkHabit) {
    await prisma.goalHabit.create({
      data: {
        goalId: goal3.id,
        habitId: deepWorkHabit.id,
      },
    });
  }

  console.log(
    `🎯 Created 3 Goals (1 active, 1 completed, 1 paused) with Milestones & GoalHabit links.`
  );
  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
