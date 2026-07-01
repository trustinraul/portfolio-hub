import { projects } from '@/content/projects'

describe('projects data', () => {
  it('has 5 projects', () => {
    expect(projects).toHaveLength(5)
  })

  it('has unique slugs', () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(projects.length)
  })

  it('every project has an https demo url', () => {
    for (const p of projects) {
      expect(p.demoUrl).toMatch(/^https:\/\//)
    }
  })

  it('any repo url present points to github', () => {
    for (const p of projects) {
      if (p.repoUrl) {
        expect(p.repoUrl).toMatch(/^https:\/\/github\.com\//)
      }
    }
  })

  it('every project has a local thumbnail, a pitch and at least one tag', () => {
    for (const p of projects) {
      expect(p.thumbnail.startsWith('/')).toBe(true)
      expect(p.pitch.length).toBeGreaterThan(10)
      expect(p.tags.length).toBeGreaterThan(0)
    }
  })

  it('duration, when present, is non-empty', () => {
    for (const p of projects) {
      if (p.duration !== undefined) {
        expect(p.duration.trim().length).toBeGreaterThan(0)
      }
    }
  })

  it('has exactly one real client, placed first, with a live label and no public repo', () => {
    const realClients = projects.filter((p) => p.isRealClient)
    expect(realClients).toHaveLength(1)
    expect(projects[0].isRealClient).toBe(true)
    const dilara = realClients[0]
    expect(dilara.slug).toBe('dilara')
    expect(dilara.liveLabel && dilara.liveLabel.length).toBeGreaterThan(0)
    expect(dilara.repoUrl).toBeUndefined()
  })
})
