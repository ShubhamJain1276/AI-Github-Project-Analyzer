const SCORING_VERSION = '1.0';

function scoreReadmeQuality(readmeContent, readmeAvailable) {
  if (!readmeAvailable || !readmeContent || readmeContent.trim().length === 0) {
    return {
      value: 0, scale: 100, version: SCORING_VERSION,
      components: [
        { name: 'Project Overview', value: 0, maxValue: 20, weight: 20, available: !readmeAvailable, details: readmeAvailable ? 'README is empty' : 'README not found' },
        { name: 'Setup & Installation', value: 0, maxValue: 20, weight: 20, available: false, details: 'No README content' },
        { name: 'Usage Documentation', value: 0, maxValue: 15, weight: 15, available: false, details: 'No README content' },
        { name: 'Technical Documentation', value: 0, maxValue: 15, weight: 15, available: false, details: 'No README content' },
        { name: 'Contribution Guidance', value: 0, maxValue: 10, weight: 10, available: false, details: 'No README content' },
        { name: 'Maintenance & Metadata', value: 0, maxValue: 10, weight: 10, available: false, details: 'No README content' },
        { name: 'Readability & Completeness', value: 0, maxValue: 10, weight: 10, available: false, details: 'No README content' }
      ]
    };
  }

  const lower = readmeContent.toLowerCase();
  const lines = readmeContent.split('\n');
  const headings = lines.filter(l => l.match(/^#{1,6}\s/));
  const wordCount = readmeContent.split(/\s+/).length;
  const hasCodeBlocks = readmeContent.includes('```');
  const hasImages = /!\[.*?\]\(.*?\)/.test(readmeContent);
  const hasLinks = /\[.*?\]\(.*?\)/.test(readmeContent);
  const hasBadges = /\[!\[.*?\]\(.*?\)\]\(.*?\)/.test(readmeContent) || lower.includes('badge') || lower.includes('shield');

  // 1. Project Overview (20 pts)
  let overview = 0;
  if (wordCount > 50) overview += 5;
  if (wordCount > 150) overview += 3;
  const hasDescription = headings.length > 0 || wordCount > 30;
  if (hasDescription) overview += 4;
  if (lower.includes('about') || lower.includes('what is') || lower.includes('overview') || lower.includes('introduction')) overview += 4;
  if (lower.includes('feature') || lower.includes('highlight')) overview += 4;
  overview = Math.min(overview, 20);

  // 2. Setup & Installation (20 pts)
  let setup = 0;
  if (lower.includes('install') || lower.includes('setup') || lower.includes('getting started') || lower.includes('quickstart')) setup += 8;
  if (lower.includes('npm') || lower.includes('pip') || lower.includes('yarn') || lower.includes('brew') || lower.includes('cargo') || lower.includes('go get')) setup += 4;
  if (lower.includes('prerequisit') || lower.includes('requirement') || lower.includes('depend')) setup += 4;
  if (hasCodeBlocks && (lower.includes('install') || lower.includes('clone') || lower.includes('npm'))) setup += 4;
  setup = Math.min(setup, 20);

  // 3. Usage Documentation (15 pts)
  let usage = 0;
  if (lower.includes('usage') || lower.includes('example') || lower.includes('how to')) usage += 5;
  if (hasCodeBlocks) usage += 4;
  if (hasImages) usage += 3;
  if (lower.includes('command') || lower.includes('api') || lower.includes('endpoint')) usage += 3;
  usage = Math.min(usage, 15);

  // 4. Technical Documentation (15 pts)
  let technical = 0;
  if (lower.includes('architect') || lower.includes('structure') || lower.includes('design')) technical += 4;
  if (lower.includes('technology') || lower.includes('stack') || lower.includes('built with')) technical += 4;
  if (lower.includes('config') || lower.includes('environment') || lower.includes('.env')) technical += 4;
  if (lower.includes('api') || lower.includes('endpoint') || lower.includes('route')) technical += 3;
  technical = Math.min(technical, 15);

  // 5. Contribution Guidance (10 pts)
  let contribution = 0;
  if (lower.includes('contribut') || lower.includes('pull request') || lower.includes('pr ')) contribution += 5;
  if (lower.includes('branch') || lower.includes('fork') || lower.includes('development')) contribution += 3;
  if (lower.includes('code of conduct') || lower.includes('guidelines')) contribution += 2;
  contribution = Math.min(contribution, 10);

  // 6. Maintenance & Metadata (10 pts)
  let maintenance = 0;
  if (lower.includes('license') || lower.includes('mit') || lower.includes('apache')) maintenance += 3;
  if (lower.includes('version') || lower.includes('release') || lower.includes('changelog')) maintenance += 3;
  if (hasBadges) maintenance += 2;
  if (lower.includes('status') || lower.includes('support') || lower.includes('maintainer')) maintenance += 2;
  maintenance = Math.min(maintenance, 10);

  // 7. Readability & Completeness (10 pts)
  let readability = 0;
  if (headings.length >= 3) readability += 3;
  if (headings.length >= 6) readability += 1;
  if (hasLinks) readability += 2;
  if (wordCount > 200 && wordCount < 10000) readability += 2;
  if (readmeContent.includes('- ') || readmeContent.includes('* ') || readmeContent.match(/^\d+\./m)) readability += 2;
  readability = Math.min(readability, 10);

  const total = overview + setup + usage + technical + contribution + maintenance + readability;

  return {
    value: total, scale: 100, version: SCORING_VERSION,
    components: [
      { name: 'Project Overview', value: overview, maxValue: 20, weight: 20, available: true, details: `Word count: ${wordCount}, headings: ${headings.length}` },
      { name: 'Setup & Installation', value: setup, maxValue: 20, weight: 20, available: true, details: setup > 0 ? 'Installation instructions detected' : 'No installation section found' },
      { name: 'Usage Documentation', value: usage, maxValue: 15, weight: 15, available: true, details: `Code blocks: ${hasCodeBlocks}, images: ${hasImages}` },
      { name: 'Technical Documentation', value: technical, maxValue: 15, weight: 15, available: true, details: technical > 0 ? 'Technical content detected' : 'No technical docs found' },
      { name: 'Contribution Guidance', value: contribution, maxValue: 10, weight: 10, available: true, details: contribution > 0 ? 'Contribution info present' : 'No contribution guidance' },
      { name: 'Maintenance & Metadata', value: maintenance, maxValue: 10, weight: 10, available: true, details: maintenance > 0 ? 'Metadata present' : 'Limited metadata' },
      { name: 'Readability & Completeness', value: readability, maxValue: 10, weight: 10, available: true, details: `Headings: ${headings.length}, has lists: ${readmeContent.includes('- ')}` }
    ]
  };
}

function scoreRepositoryHealth(source, repository) {
  const components = [];
  let total = 0;

  // 1. Repository Activity (20 pts)
  let activity = 0;
  if (repository.pushedAt) {
    const daysSincePush = (Date.now() - new Date(repository.pushedAt).getTime()) / (1000*60*60*24);
    if (daysSincePush < 30) activity += 10;
    else if (daysSincePush < 90) activity += 7;
    else if (daysSincePush < 365) activity += 4;
    else activity += 1;
  }
  if (source.commitsCount > 100) activity += 6;
  else if (source.commitsCount > 30) activity += 4;
  else if (source.commitsCount > 5) activity += 2;
  if (source.commitsCount > 0) activity += 4; else activity += 0;
  activity = Math.min(activity, 20);
  components.push({ name: 'Repository Activity', value: activity, maxValue: 20, weight: 20, available: true, details: `Commits: ~${source.commitsCount}, last push: ${repository.pushedAt ? new Date(repository.pushedAt).toLocaleDateString() : 'unknown'}` });
  total += activity;

  // 2. Collaboration Signals (15 pts)
  let collab = 0;
  if (source.contributorsCount > 5) collab += 5;
  else if (source.contributorsCount > 1) collab += 3;
  else if (source.contributorsCount >= 1) collab += 1;
  if (source.pullRequestsCount > 10) collab += 5;
  else if (source.pullRequestsCount > 0) collab += 3;
  if (repository.openIssues > 0 && repository.openIssues < 100) collab += 3;
  if (repository.forks > 5) collab += 2;
  else if (repository.forks > 0) collab += 1;
  collab = Math.min(collab, 15);
  components.push({ name: 'Collaboration Signals', value: collab, maxValue: 15, weight: 15, available: true, details: `Contributors: ${source.contributorsCount}, PRs: ${source.pullRequestsCount}, forks: ${repository.forks}` });
  total += collab;

  // 3. Repository Organization (15 pts)
  let org = 0;
  if (source.readmeAvailable) org += 4;
  if (source.hasContributing) org += 3;
  if (source.hasCodeOfConduct) org += 2;
  if (source.hasChangelog) org += 3;
  if (repository.description) org += 3;
  org = Math.min(org, 15);
  components.push({ name: 'Repository Organization', value: org, maxValue: 15, weight: 15, available: true, details: `README: ${source.readmeAvailable}, CONTRIBUTING: ${source.hasContributing}` });
  total += org;

  // 4. Automation & Quality Gates (15 pts)
  let automation = 0;
  if (source.hasCI) automation += 6;
  if (source.hasTests) automation += 5;
  if (source.hasLinter) automation += 4;
  automation = Math.min(automation, 15);
  components.push({ name: 'Automation & Quality', value: automation, maxValue: 15, weight: 15, available: true, details: `CI: ${source.hasCI}, tests: ${source.hasTests}, linter: ${source.hasLinter}` });
  total += automation;

  // 5. Dependency & Release Hygiene (15 pts)
  let depHygiene = 0;
  if (source.hasDependencyManifest) depHygiene += 4;
  if (source.hasLockfile) depHygiene += 3;
  if (source.releasesCount > 0) depHygiene += 4;
  if (source.releasesCount > 5) depHygiene += 2;
  if (repository.license) depHygiene += 2;
  depHygiene = Math.min(depHygiene, 15);
  components.push({ name: 'Dependency & Release', value: depHygiene, maxValue: 15, weight: 15, available: true, details: `Manifest: ${source.hasDependencyManifest}, releases: ${source.releasesCount}` });
  total += depHygiene;

  // 6. Issue & Maintenance (10 pts)
  let issueMaint = 0;
  if (repository.openIssues < 50) issueMaint += 4;
  else if (repository.openIssues < 200) issueMaint += 2;
  if (!repository.archived) issueMaint += 3;
  if (repository.pushedAt && (Date.now()-new Date(repository.pushedAt).getTime()) < 180*24*60*60*1000) issueMaint += 3;
  issueMaint = Math.min(issueMaint, 10);
  components.push({ name: 'Issue & Maintenance', value: issueMaint, maxValue: 10, weight: 10, available: true, details: `Open issues: ${repository.openIssues}, archived: ${repository.archived}` });
  total += issueMaint;

  // 7. Community & Discoverability (10 pts)
  let community = 0;
  if (repository.topics && repository.topics.length > 0) community += 3;
  if (repository.description) community += 2;
  if (repository.license) community += 2;
  if (repository.stars > 10) community += 2;
  else if (repository.stars > 0) community += 1;
  if (repository.hasPages || repository.hasWiki) community += 1;
  community = Math.min(community, 10);
  components.push({ name: 'Community & Discoverability', value: community, maxValue: 10, weight: 10, available: true, details: `Stars: ${repository.stars}, topics: ${(repository.topics||[]).length}` });
  total += community;

  return { value: Math.min(total, 100), scale: 100, version: SCORING_VERSION, components };
}

module.exports = { scoreReadmeQuality, scoreRepositoryHealth, SCORING_VERSION };
