import { Link } from 'react-router-dom'

const NotFound = () => (
  <main
    aria-label="Página não encontrada"
    style={{ display: 'grid', placeItems: 'center', minHeight: '100dvh', fontFamily: 'sans-serif' }}
  >
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>404 — Página não encontrada</h1>
      <Link to="/" style={{ color: '#E07B00' }}>← Voltar ao início</Link>
    </div>
  </main>
)

export default NotFound
