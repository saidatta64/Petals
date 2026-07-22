import { useEffect, useState } from 'react'
import { OverallStatsCards, OverallStats } from './OverallStatsCards'
import { WeeklyActivityChart, WeeklyStat } from './WeeklyActivityChart'
import { CategoryBreakdown, CategoryStats } from './CategoryBreakdown'
import { PriorityDistribution, PriorityStats } from './PriorityDistribution'

export default function StatisticsView() {
  const [overall, setOverall] = useState<OverallStats | null>(null)
  const [categories, setCategories] = useState<CategoryStats[]>([])
  const [priorities, setPriorities] = useState<PriorityStats[]>([])
  const [weekly, setWeekly] = useState<WeeklyStat[]>([])

  useEffect(() => {
    async function fetchStats() {
      if (window.taskflow) {
        const [overallStats, catStats, prioStats, weekStats] = await Promise.all([
          window.taskflow.stats.getOverall(),
          window.taskflow.stats.getCategory(),
          window.taskflow.stats.getPriority(),
          window.taskflow.stats.getWeekly(),
        ])
        setOverall(overallStats as OverallStats)
        setCategories(catStats as CategoryStats[])
        setPriorities(prioStats as PriorityStats[])
        setWeekly(weekStats as WeeklyStat[])
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-workspace-text">Productivity Statistics</h1>
        <p className="text-workspace-text-secondary mt-1">
          Detailed metrics of your productivity trends and categories.
        </p>
      </div>

      {overall && <OverallStatsCards overall={overall} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyActivityChart weekly={weekly} />
        <CategoryBreakdown categories={categories} />
      </div>

      <PriorityDistribution priorities={priorities} />
    </div>
  )
}
