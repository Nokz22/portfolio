import { type FormEvent, useState } from 'react'
import { api } from '@/lib/api/client'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export function useContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      await api.post('/api/v1/contact', { name, email, message, honeypot: '' })
      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  return {
    name,
    email,
    message,
    honeypot,
    setName,
    setEmail,
    setMessage,
    status,
    handleSubmit,
  }
}
