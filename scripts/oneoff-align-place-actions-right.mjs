import { readFile, writeFile } from 'node:fs/promises'

const path = new URL('../src/styles/app.css', import.meta.url)
let css = await readFile(path, 'utf8')

const oldBlock = `.place-details__header-actions {\n  display: flex;\n  gap: 2px;\n  align-items: center;\n  margin-top: 5px;\n}`

const newBlock = `.place-details__header-actions {\n  display: flex;\n  gap: 2px;\n  align-items: center;\n  justify-content: flex-end;\n  margin-top: 5px;\n}`

if (!css.includes(oldBlock)) throw new Error('No se encontró el bloque esperado de acciones del header')
css = css.replace(oldBlock, newBlock)
await writeFile(path, css)
