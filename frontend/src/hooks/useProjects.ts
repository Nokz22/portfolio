import { useEffect, useState } from 'react'
import { api } from '@/lib/api/client'
import type { GithubRepoDto } from '@/types/api'

export function useProjects() {
  const [data, setData] = useState<GithubRepoDto[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    api
      .get<GithubRepoDto[]>('/api/v1/projects')
      .then(setData)
      .catch((err: unknown) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setIsLoading(false))
  }, [])

  return { data, isLoading, error }
}
