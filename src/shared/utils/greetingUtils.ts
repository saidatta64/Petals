export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}

export function getGreetingTitle(username: string | null): { title: string; emoji: string } {
  const timeOfDay = getTimeOfDay();
  const name = username?.trim() || 'friend';

  switch (timeOfDay) {
    case 'morning':
      return { title: `Good morning, ${name}`, emoji: '☀️' };
    case 'afternoon':
      return { title: `Good afternoon, ${name}`, emoji: '🌤️' };
    case 'evening':
      return { title: `Good evening, ${name}`, emoji: '🌆' };
    case 'night':
      return { title: `Good night, ${name}`, emoji: '🌙' };
  }
}

export function getGreetingSubtext(
  pendingCount: number,
  totalTodayTasks: number,
  currentStreak: number
): string {
  const timeOfDay = getTimeOfDay();

  if (totalTodayTasks === 0) {
    switch (timeOfDay) {
      case 'morning':
        return 'Your schedule is clear for today. Plan ahead or take it easy!';
      case 'afternoon':
        return 'No tasks scheduled for today. Enjoy your afternoon!';
      case 'evening':
        return 'No tasks scheduled today. Relax and enjoy your evening.';
      case 'night':
        return 'No tasks on your list. Get some rest and recharge for tomorrow!';
    }
  }

  if (pendingCount === 0) {
    switch (timeOfDay) {
      case 'morning':
      case 'afternoon':
        return 'All tasks completed for today! Great job staying ahead.';
      case 'evening':
        return 'All tasks completed for today! Relax and enjoy your evening.';
      case 'night':
        return 'All tasks completed for today! Time to unwind and rest.';
    }
  }

  const streakText =
    currentStreak > 0
      ? ` Complete ${pendingCount === 1 ? 'it' : 'them'} to keep your ${currentStreak}-day streak alive 🔥`
      : ' Let’s make steady progress today!';

  return `You have ${pendingCount} pending task${pendingCount > 1 ? 's' : ''} today.${streakText}`;
}

export function getEmptyFocusTasksMessage(hasAnyTasksToday: boolean): string {
  const timeOfDay = getTimeOfDay();

  if (!hasAnyTasksToday) {
    return '🎉 No tasks scheduled for today. Click "+ New Task" to get started!';
  }

  switch (timeOfDay) {
    case 'morning':
      return '🎉 All today’s tasks are completed! Off to a great start.';
    case 'afternoon':
      return '🎉 All today’s tasks are completed! Keep up the momentum.';
    case 'evening':
      return '🎉 All tasks completed today. Enjoy your evening!';
    case 'night':
      return '🎉 All tasks completed today. Get some rest!';
  }
}
