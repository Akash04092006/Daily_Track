/**
 * Habit Streak Computation Service Stub
 *
 * NOTE / TODO (Phase 5): Real streak computation, freeze logic, and historical analysis
 * will be fully implemented in Phase 5 (Reminders & Streaks).
 * This function currently performs a documented no-op so habit log writes integrate
 * seamlessly without breaking caller contracts.
 */
export async function recalculateStreaks(habitId: string): Promise<void> {
  // TODO: Phase 5 - calculate currentStreak and longestStreak from HabitLog records
  void habitId;
}
