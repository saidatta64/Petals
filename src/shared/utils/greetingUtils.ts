export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 22) return 'evening'
  return 'night'
}

export function getGreetingTitle(username: string | null): { title: string; emoji: string } {
  const timeOfDay = getTimeOfDay()
  const name = username?.trim() || 'friend'

  switch (timeOfDay) {
    case 'morning':
      return { title: `Good morning, ${name}`, emoji: '☀️' }
    case 'afternoon':
      return { title: `Good afternoon, ${name}`, emoji: '🌤️' }
    case 'evening':
      return { title: `Good evening, ${name}`, emoji: '🌆' }
    case 'night':
      return { title: `Good night, ${name}`, emoji: '🌙' }
  }
}

export function getGreetingSubtext(): string {
  const timeOfDay = getTimeOfDay()

  switch (timeOfDay) {
    case 'morning':
      return 'Hope you have a productive and focus-filled morning!'
    case 'afternoon':
      return "Hope you're having a great and productive afternoon!"
    case 'evening':
      return 'Hope you had a wonderful day. Time to review and relax!'
    case 'night':
      return 'Time to unwind, get some rest, and recharge for tomorrow.'
  }
}

export function getEmptyFocusTasksMessage(hasAnyTasksToday: boolean): string {
  const timeOfDay = getTimeOfDay()

  if (!hasAnyTasksToday) {
    return '🎉 No tasks scheduled for today. Click "+ New Task" to get started!'
  }

  switch (timeOfDay) {
    case 'morning':
      return '🎉 All today’s tasks are completed! Off to a great start.'
    case 'afternoon':
      return '🎉 All today’s tasks are completed! Keep up the momentum.'
    case 'evening':
      return '🎉 All tasks completed today. Enjoy your evening!'
    case 'night':
      return '🎉 All tasks completed today. Get some rest!'
  }
}
