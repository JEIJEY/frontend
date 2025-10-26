import { PurgeCSS } from 'purgecss'
import fs from 'fs'
import path from 'path'

async function runPurgeCSS() {
  const purgeCSSResult = await new PurgeCSS().purge({
    content: ['src/**/*.html', 'src/**/*.js'],
    css: ['src/styles/**/*.css'],
    safelist: [/^invp-/, /^modal-/, /^alert-/, /^active/, /^open/, /^show/]
  })

  const outputDir = 'dist/cleaned-css'
  fs.mkdirSync(outputDir, { recursive: true })

  console.log('📊 CSS Optimization Report\n')
  let report = '📊 CSS Optimization Report\n\n'
  let totalBefore = 0
  let totalAfter = 0

  for (const result of purgeCSSResult) {
    const originalSize = fs.statSync(result.file).size
    const cleanedSize = Buffer.byteLength(result.css, 'utf8')
    totalBefore += originalSize
    totalAfter += cleanedSize

    const fileName = path.basename(result.file)
    const outPath = path.join(outputDir, fileName)
    fs.writeFileSync(outPath, result.css)

    const diff = ((1 - cleanedSize / originalSize) * 100).toFixed(1)
    const line = `${fileName.padEnd(30)} ${originalSize}B → ${cleanedSize}B  ✅ (${diff}% menos)`
    console.log(line)
    report += line + '\n'
  }

  const summary = `\n🏁 Total ahorro: ${(totalBefore - totalAfter)} bytes
💾 Antes: ${totalBefore} bytes
💡 Después: ${totalAfter} bytes\n`

  console.log(summary)
  report += summary
  fs.writeFileSync(path.join(outputDir, 'report.txt'), report)
}

runPurgeCSS().catch(console.error)
