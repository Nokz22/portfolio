import { useParams } from 'react-router-dom'

// Phase 2: implement full project detail page

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  return <main aria-label="Project detail">{slug}</main>
}

export default ProjectDetail
