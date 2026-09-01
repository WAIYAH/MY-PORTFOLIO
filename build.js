/* ============================================================
   LUCKY NAKOLA PORTFOLIO — Static Site Build
   Zero third-party runtime deps. Assembles src/ -> dist/.
   Usage: node build.js
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;
const SRC_DIR = path.join(ROOT, 'src');
const PAGES_DIR = path.join(SRC_DIR, 'pages');
const PARTIALS_DIR = path.join(SRC_DIR, 'partials');
const DIST_DIR = path.join(ROOT, 'dist');

const site = JSON.parse(fs.readFileSync(path.join(SRC_DIR, 'data', 'site.json'), 'utf8'));
const pages = JSON.parse(fs.readFileSync(path.join(SRC_DIR, 'data', 'pages.json'), 'utf8'));

const INCLUDE_RE = /<!--#include\s+"([^"]+)"-->/g;
const TOKEN_RE = /\{\{(\w+)\}\}/g;

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function walkHtmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkHtmlFiles(full));
    } else if (entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function resolveIncludes(content, seen) {
  let result = content;
  let pass = 0;
  while (INCLUDE_RE.test(result)) {
    INCLUDE_RE.lastIndex = 0;
    pass += 1;
    if (pass > 5) throw new Error('Include resolution exceeded max depth (possible circular include).');
    result = result.replace(INCLUDE_RE, (_, includePath) => {
      const partialFile = path.join(SRC_DIR, includePath);
      if (!fs.existsSync(partialFile)) {
        throw new Error(`Include not found: "${includePath}" (resolved to ${partialFile})`);
      }
      return fs.readFileSync(partialFile, 'utf8');
    });
  }
  INCLUDE_RE.lastIndex = 0;
  return result;
}

function buildJsonLd(relPathPosix, meta) {
  const blocks = [];
  const schemas = meta.schemas || [];

  if (schemas.includes('WebSite')) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Lucky Nakola — Software Engineer & AI Innovator',
      url: `${site.domain}/`,
    });
  }

  if (schemas.includes('Organization')) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Nakola Expert Systems',
      url: site.nesUrl,
      founder: { '@type': 'Person', name: 'Lucky Nakola' },
    });
  }

  if (!blocks.length) return '';

  return blocks
    .map(b => `<script type="application/ld+json">\n${JSON.stringify(b, null, 2)}\n</script>`)
    .join('\n');
}

function substituteTokens(content, data, filePathForErrors) {
  const out = content.replace(TOKEN_RE, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(data, key)) return String(data[key]);
    throw new Error(`Unresolved token "{{${key}}}" in ${filePathForErrors}`);
  });
  return out;
}

function buildPage(fullPath) {
  const relPathPosix = toPosix(path.relative(PAGES_DIR, fullPath));

  if (relPathPosix === 'cv/print.html') {
    const outPath = path.join(DIST_DIR, relPathPosix);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.copyFileSync(fullPath, outPath);
    return;
  }

  const meta = pages[relPathPosix];
  if (!meta) {
    throw new Error(`No entry in src/data/pages.json for page "${relPathPosix}" — add one before building.`);
  }

  const depth = relPathPosix.split('/').length - 1;
  const base = depth > 0 ? '../'.repeat(depth) : '';

  const canonicalUrl = meta.path === '' ? `${site.domain}/` : `${site.domain}/${meta.path}`;
  const ogImagePath = meta.ogImage || site.defaultOgImage;
  const ogImage = `${site.domain}${ogImagePath}`;
  const robotsMeta = meta.noindex ? '<meta name="robots" content="noindex, follow">' : '';
  const jsonLdBlock = buildJsonLd(relPathPosix, meta);

  const data = {
    ...site,
    base,
    title: meta.title,
    description: meta.description,
    canonicalUrl,
    ogImage,
    robotsMeta,
    jsonLdBlock,
  };

  let content = fs.readFileSync(fullPath, 'utf8');
  content = resolveIncludes(content);
  content = substituteTokens(content, data, relPathPosix);

  const outPath = path.join(DIST_DIR, relPathPosix);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content, 'utf8');
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.cpSync(srcDir, destDir, { recursive: true });
}

function buildSitemapAndRobots() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = Object.values(pages)
    .filter(m => !m.excludeFromSitemap)
    .map(m => {
      const loc = m.path === '' ? `${site.domain}/` : `${site.domain}/${m.path}`;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${m.changefreq || 'monthly'}</changefreq>\n    <priority>${m.priority || '0.5'}</priority>\n  </url>`;
    })
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap, 'utf8');

  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${site.domain}/sitemap.xml\n`;
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robots, 'utf8');
}

function buildTailwind() {
  const input = path.join(SRC_DIR, 'tailwind-input.css');
  const output = path.join(DIST_DIR, 'css', 'tailwind.css');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  execSync(
    `npx tailwindcss -c "${path.join(ROOT, 'tailwind.config.js')}" -i "${input}" -o "${output}" --minify`,
    { stdio: 'inherit', cwd: ROOT }
  );
}

function main() {
  console.log('[build] cleaning dist/ ...');
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });

  console.log('[build] rendering pages ...');
  const htmlFiles = walkHtmlFiles(PAGES_DIR);
  htmlFiles.forEach(buildPage);
  console.log(`[build] rendered ${htmlFiles.length} pages`);

  console.log('[build] copying static assets ...');
  copyDir(path.join(ROOT, 'css'), path.join(DIST_DIR, 'css'));
  copyDir(path.join(ROOT, 'js'), path.join(DIST_DIR, 'js'));
  copyDir(path.join(ROOT, 'img'), path.join(DIST_DIR, 'img'));
  copyDir(path.join(ROOT, 'pdf'), path.join(DIST_DIR, 'pdf'));

  const headersFile = path.join(ROOT, '_headers');
  if (fs.existsSync(headersFile)) {
    fs.copyFileSync(headersFile, path.join(DIST_DIR, '_headers'));
  }

  console.log('[build] compiling Tailwind CSS ...');
  buildTailwind();

  console.log('[build] generating sitemap.xml + robots.txt ...');
  buildSitemapAndRobots();

  const totalBytes = walkHtmlFiles(DIST_DIR).length;
  console.log(`[build] done. ${totalBytes} HTML files written to dist/`);
}

try {
  main();
} catch (err) {
  console.error('[build] FAILED:', err.message);
  process.exit(1);
}
