import React from 'react'
import { Button } from '@heroui/react'
import { Plus } from 'lucide-react'
import { StreakWidget } from '@features/widgets/components/StreakWidget'
import { getGreetingTitle, getGreetingSubtext } from '@shared/utils/greetingUtils'

interface DashboardHeroProps {
  username: string | null
  currentStreak: number
  onNewTaskClick: () => void
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  username,
  currentStreak,
  onNewTaskClick,
}) => {
  const { title, emoji } = getGreetingTitle(username)
  const subtext = getGreetingSubtext()

  return (
    <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="flex flex-col gap-3 flex-1 min-w-0">
        <h1 className="text-4xl font-bold tracking-tight text-workspace-text font-brand">
          {title} {emoji}
        </h1>
        <p className="text-workspace-text-secondary text-base max-w-xl leading-relaxed">
          {subtext}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <Button
            onPress={onNewTaskClick}
            className="h-11 px-5 font-bold text-sm rounded-xl bg-workspace-card border border-workspace-border text-workspace-text hover:bg-workspace-border/60 hover:text-workspace-text transition-all flex items-center justify-center gap-2.5 shadow-sm"
          >
            <div className="w-5 h-5 rounded-full bg-workspace-primary/15 flex items-center justify-center text-workspace-primary flex-shrink-0">
              <Plus size={13} className="stroke-[2.5]" />
            </div>
            New Task
          </Button>
        </div>
      </div>

      {/* Streak Widget placed on the right side of Hero */}
      <div className="w-full md:w-80 flex-shrink-0">
        <StreakWidget currentStreak={currentStreak} />
      </div>
    </section>
  )
}
