import { useEffect, useState } from 'react'
import { api } from '@/lib/api/client'
import { STATIC_SKILLS } from '@/data/static'
import type { SkillGroupDto } from '@/types/api'

export function useSkills() {
  const [data, setData] = useState<SkillGroupDto[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    api
      .get<SkillGroupDto[]>('/api/v1/skills')
      .then(setData)
      .catch(() => {
        setData(STATIC_SKILLS)
        setError(null)
      })
      .finally(() => { setIsLoading(false) })
  }, [])

  return { data, isLoading, error }
}
