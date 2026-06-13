import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '@/lib/api/client'
import type { ProfileDto } from '@/types/api'

export function useProfile() {
  const { i18n } = useTranslation()
  const [data, setData] = useState<ProfileDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    api
      .get<ProfileDto>(`/api/v1/profile?lang=${i18n.language}`)
      .then(setData)
      .catch((err: unknown) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setIsLoading(false))
  }, [i18n.language])

  return { data, isLoading, error }
}
