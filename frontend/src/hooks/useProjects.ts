import { useEffect, useState } from 'react'
import { api } from '@/lib/api/client'
import { STATIC_PROJECTS } from '@/data/static'
import type { GithubRepoDto } from '@/types/api'

export function useProjects() {
  const [data, setData] = useState<GithubRepoDto[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    api
      .get<GithubRepoDto[]>('/api/v1/projects/featured')
      .then(data => { setData(data.length > 0 ? data : STATIC_PROJECTS) })
      .catch(() => {
        setData(STATIC_PROJECTS)
        setError(null)
      })
      .finally(() => { setIsLoading(false) })
  }, [])

  return { data, isLoading, error }
}
