import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const distDirectory = resolve('dist')
const clientDirectory = join(distDirectory, 'client')
const serverDirectory = join(distDirectory, 'server')

await rm(clientDirectory, { force: true, recursive: true })
await rm(serverDirectory, { force: true, recursive: true })
await mkdir(clientDirectory, { recursive: true })

const entries = await readdir(distDirectory, { withFileTypes: true })
for (const entry of entries) {
  if (entry.name === 'client' || entry.name === 'server' || entry.name === '.openai') continue
  await cp(join(distDirectory, entry.name), join(clientDirectory, entry.name), { recursive: entry.isDirectory() })
}

await mkdir(serverDirectory, { recursive: true })
await writeFile(join(serverDirectory, 'index.js'), `const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)
    if (response.status !== 404 || request.method !== 'GET') return response

    const url = new URL(request.url)
    if (/\\.[^/]+$/.test(url.pathname)) return response

    url.pathname = '/index.html'
    return env.ASSETS.fetch(new Request(url, request))
  },
}

export default worker
`, 'utf8')
