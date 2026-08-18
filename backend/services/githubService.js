const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';

function parseRepoUrl(url) {
  if (!url || typeof url !== 'string') throw new Error('Repository URL is required');
  let cleaned = url.trim().replace(/\/+$/, '').replace(/\.git$/, '');
  const patterns = [
    /^https?:\/\/(?:www\.)?github\.com\/([^\/]+)\/([^\/\?#]+)/i,
    /^(?:www\.)?github\.com\/([^\/]+)\/([^\/\?#]+)/i,
    /^([^\/]+)\/([^\/\?#]+)$/
  ];
  for (const p of patterns) {
    const m = cleaned.match(p);
    if (m && /^[a-zA-Z0-9._-]+$/.test(m[1]) && /^[a-zA-Z0-9._-]+$/.test(m[2])) {
      return { owner: m[1], name: m[2], fullName: `${m[1]}/${m[2]}`, url: `https://github.com/${m[1]}/${m[2]}` };
    }
  }
  throw new Error('Invalid GitHub repository URL. Expected: https://github.com/owner/repository');
}

function createClient() {
  const h = { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'AI-GitHub-Analyzer/1.0' };
  if (process.env.GITHUB_TOKEN) h['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  return axios.create({ baseURL: GITHUB_API_BASE, headers: h, timeout: 15000 });
}

function countFromLink(headers, fallbackData) {
  const link = headers?.link;
  if (link) { const m = link.match(/page=(\d+)>; rel="last"/); if (m) return parseInt(m[1]); }
  return Array.isArray(fallbackData) ? fallbackData.length : (fallbackData ? 1 : 0);
}

async function getRepositoryData(owner, name) {
  const client = createClient();
  const retrievedAt = new Date();
  try {
    const { data: repo } = await client.get(`/repos/${owner}/${name}`);
    const [readme, langs, contribs, commits, pulls, releases, contents] = await Promise.allSettled([
      client.get(`/repos/${owner}/${name}/readme`),
      client.get(`/repos/${owner}/${name}/languages`),
      client.get(`/repos/${owner}/${name}/contributors?per_page=1&anon=true`),
      client.get(`/repos/${owner}/${name}/commits?per_page=1`),
      client.get(`/repos/${owner}/${name}/pulls?state=all&per_page=1`),
      client.get(`/repos/${owner}/${name}/releases?per_page=1`),
      client.get(`/repos/${owner}/${name}/contents/`)
    ]);

    let readmeContent = '', readmeAvailable = false;
    if (readme.status === 'fulfilled' && readme.value.data.content) {
      readmeAvailable = true;
      readmeContent = Buffer.from(readme.value.data.content, 'base64').toString('utf-8').substring(0, 50000);
    }

    const languages = langs.status === 'fulfilled' ? langs.value.data : {};
    const contributorsCount = contribs.status === 'fulfilled' ? countFromLink(contribs.value.headers, contribs.value.data) : 0;
    const commitsCount = commits.status === 'fulfilled' ? countFromLink(commits.value.headers, commits.value.data) : 0;
    const pullRequestsCount = pulls.status === 'fulfilled' ? countFromLink(pulls.value.headers, pulls.value.data) : 0;
    const releasesCount = releases.status === 'fulfilled' ? countFromLink(releases.value.headers, releases.value.data) : 0;

    let hasCI=false,hasTests=false,hasLinter=false,hasDep=false,hasLock=false,hasContrib=false,hasCOC=false,hasLog=false;
    if (contents.status === 'fulfilled' && Array.isArray(contents.value.data)) {
      const fn = contents.value.data.map(f=>f.name.toLowerCase());
      const dn = contents.value.data.filter(f=>f.type==='dir').map(f=>f.name.toLowerCase());
      hasCI = dn.includes('.github') || fn.some(f=>f.includes('.travis.yml')||f.includes('jenkinsfile')||f.includes('.gitlab-ci'));
      hasTests = dn.some(d=>['test','tests','__tests__','spec','specs'].includes(d)) || fn.some(f=>f.includes('.test.')||f.includes('.spec.')||f.startsWith('jest.config')||f.startsWith('vitest.config'));
      hasLinter = fn.some(f=>f.startsWith('.eslint')||f.startsWith('.prettier')||f==='biome.json');
      hasDep = fn.some(f=>['package.json','requirements.txt','pyproject.toml','cargo.toml','go.mod','pom.xml','build.gradle','composer.json'].includes(f));
      hasLock = fn.some(f=>['package-lock.json','yarn.lock','pnpm-lock.yaml','poetry.lock','cargo.lock'].includes(f));
      hasContrib = fn.some(f=>f.startsWith('contributing'));
      hasCOC = fn.some(f=>f.includes('code_of_conduct')||f.includes('code-of-conduct'));
      hasLog = fn.some(f=>f.startsWith('changelog')||f.startsWith('changes'));
    }

    const failed = [readme,langs,contribs,commits,pulls,releases,contents].filter(r=>r.status==='rejected').length;
    const dataCompleteness = failed>=4?'minimal':failed>=2?'partial':'complete';

    return {
      repository: {
        owner: repo.owner.login, name: repo.name, fullName: repo.full_name, url: repo.html_url,
        defaultBranch: repo.default_branch, description: repo.description||'', language: repo.language||'',
        stars: repo.stargazers_count, forks: repo.forks_count, openIssues: repo.open_issues_count,
        watchers: repo.watchers_count, size: repo.size, topics: repo.topics||[],
        license: repo.license?.spdx_id||repo.license?.name||'', hasWiki: repo.has_wiki, hasPages: repo.has_pages,
        archived: repo.archived, createdAt: repo.created_at, updatedAt: repo.updated_at, pushedAt: repo.pushed_at
      },
      source: {
        provider:'github', retrievedAt, readmeAvailable, readmeContent, dataCompleteness, languages,
        contributorsCount, commitsCount, pullRequestsCount, releasesCount,
        hasCI, hasTests, hasLinter, hasDependencyManifest:hasDep, hasLockfile:hasLock,
        hasContributing:hasContrib, hasCodeOfConduct:hasCOC, hasChangelog:hasLog
      }
    };
  } catch (error) {
    if (error.response) {
      const s = error.response.status;
      if (s===404) throw new Error('Repository not found. Check the URL and ensure it is publicly accessible.');
      if (s===403) {
        if (error.response.headers['x-ratelimit-remaining']==='0') throw new Error('GitHub API rate limit exceeded. Please try again later.');
        throw new Error('Access forbidden. The repository may be private.');
      }
      throw new Error(`GitHub API error (${s}): ${error.response.data?.message||'Unknown'}`);
    }
    if (error.code==='ECONNABORTED') throw new Error('GitHub API timed out. Please try again.');
    throw error;
  }
}

module.exports = { parseRepoUrl, getRepositoryData };
