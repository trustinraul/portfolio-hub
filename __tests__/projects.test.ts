import { projects } from '@/content/projects'

describe('projects data', () => {
  it('has exactly 4 projects', () => {
    expect(projects).toHaveLength(4)
  })

  it('has unique slugs', () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(4)
  })

  it('every project has https demo and repo urls', () => {
    for (const p of projects) {
      expect(p.demoUrl).toMatch(/^https:\/\//)
      expect(p.repoUrl).toMatch(/^https:\/\/github\.com\//)
    }
  })

  it('every project has a local thumbnail, a pitch and at least one tag', () => {
    for (const p of projects) {
      expect(p.thumbnail.startsWith('/')).toBe(true)
      expect(p.pitch.length).toBeGreaterThan(10)
      expect(p.tags.length).toBeGreaterThan(0)
    }
  })

  it('every project has a non-empty build duration', () => {
    for (const p of projects) {
      expect(p.duration.trim().length).toBeGreaterThan(0)
    }
  })
})
