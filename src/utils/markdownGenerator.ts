import { TutorialPostData, TutorialStep, TutorialSetting, TutorialResult } from '../types';

export function slugify(text: string): string {
  if (!text || text.trim() === '') return 'new-post';
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove non-alphanumeric except spaces & hyphens
    .trim()
    .replace(/\s+/g, '-') // spaces to hyphens
    .replace(/-+/g, '-'); // collapse multiple hyphens
}

export function getFilename(data: TutorialPostData): string {
  if (data.customFilename && data.customFilename.trim()) {
    const custom = data.customFilename.trim();
    return custom.endsWith('.md') ? custom : `${custom}.md`;
  }
  const slug = slugify(data.title);
  return `${slug}.md`;
}

function escapeYamlString(str: string): string {
  // If string contains quotes or special characters, properly escape it
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function formatMultilineYaml(text: string): string {
  if (!text) return '  ';
  return text
    .split('\n')
    .map((line) => (line.length > 0 ? `  ${line}` : ''))
    .join('\n');
}

export function generateMarkdown(
  data: TutorialPostData,
  options: { includeComments?: boolean } = { includeComments: true }
): string {
  const inc = options.includeComments !== false;

  const lines: string[] = ['---'];

  if (inc) {
    lines.push(
      '# Copy this file into content/posts and rename it.',
      '# Use lowercase words and hyphens, then .md. Example: soft-window-portrait.md',
      '# Lines that start with # are notes. They are not shown on the site.',
      '# Leave draft as true until the tutorial is ready.',
      '# A public GitHub repository still shows this file to anyone, even when draft is true.',
      '# Do not put passwords, API keys, or private pictures in the file.',
      ''
    );
  }

  // Title
  if (inc) lines.push('# The title viewers see.');
  lines.push(`title: "${escapeYamlString(data.title || '')}"`, '');

  // Summary
  if (inc) lines.push('# One or two sentences for the archive card and for search.');
  lines.push(`summary: "${escapeYamlString(data.summary || '')}"`, '');

  // Date
  if (inc) lines.push('# Year-month-day. Use a real date.');
  lines.push(`date: ${data.date || '2026-11-06'}`, '');

  // Updated (optional)
  if (data.includeUpdated && data.updated) {
    if (inc) lines.push('# Optional. Add a line like the next one if you revise the tutorial.');
    lines.push(`updated: ${data.updated}`, '');
  } else if (inc) {
    lines.push('# Optional. Add a line like the next one if you revise the tutorial.');
    lines.push('# updated: 2026-11-07', '');
  }

  // Tool
  if (inc) lines.push('# The app you show in the video.');
  lines.push(`tool: "${escapeYamlString(data.tool || '')}"`, '');

  // Model
  if (inc) lines.push('# Optional. The model name, if you want viewers to see it. Leave blank if you do not.');
  lines.push(`model: "${escapeYamlString(data.model || '')}"`, '');

  // Category
  if (inc) lines.push('# Required. Type image or video. No other word.');
  lines.push(`category: "${data.category === 'video' ? 'video' : 'image'}"`, '');

  // Tags
  if (inc) lines.push('# Optional topics for the filter. Keep them short.');
  if (data.tags && data.tags.length > 0) {
    lines.push('tags:');
    for (const tag of data.tags) {
      lines.push(`  - "${escapeYamlString(tag)}"`);
    }
  } else {
    lines.push('tags: []');
  }
  lines.push('');

  // Draft
  if (inc) lines.push('# true hides the tutorial from the built site. false shows it.');
  lines.push(`draft: ${Boolean(data.draft)}`, '');

  // Example
  if (inc) lines.push('# Leave false for your own lessons. true adds an Example badge.');
  lines.push(`example: ${Boolean(data.example)}`, '');

  // Cover & CoverAlt
  if (inc) lines.push('# Optional picture. Put the file in public/media, then use a path that starts with /media/');
  lines.push(`cover: "${escapeYamlString(data.cover || '')}"`);
  lines.push(`coverAlt: "${escapeYamlString(data.coverAlt || '')}"`, '');

  // Video URL
  if (inc) lines.push('# Optional. A full YouTube link, or leave blank.');
  lines.push(`videoUrl: "${escapeYamlString(data.videoUrl || '')}"`, '');

  // Steps
  lines.push('steps:');
  if (data.steps && data.steps.length > 0) {
    data.steps.forEach((step) => {
      lines.push(`  - title: "${escapeYamlString(step.title || '')}"`);
      lines.push(`    body: "${escapeYamlString(step.body || '')}"`);
    });
  } else {
    lines.push('  - title: ""');
    lines.push('    body: ""');
  }
  lines.push('');

  // Positive Prompt
  lines.push('positivePrompt: |');
  lines.push(formatMultilineYaml(data.positivePrompt || ''));
  lines.push('');

  // Negative Prompt
  if (data.includeNegativePrompt) {
    lines.push('negativePrompt: |');
    lines.push(formatMultilineYaml(data.negativePrompt || ''));
  } else {
    lines.push('negativePrompt: ""');
  }
  lines.push('');

  // Settings
  lines.push('settings:');
  if (data.settings && data.settings.length > 0) {
    data.settings.forEach((setting) => {
      lines.push(`  - label: "${escapeYamlString(setting.label || '')}"`);
      lines.push(`    value: "${escapeYamlString(setting.value || '')}"`);
    });
  } else {
    lines.push('  []');
  }
  lines.push('');

  // Tips
  lines.push('tips:');
  if (data.tips && data.tips.length > 0) {
    data.tips.forEach((tip) => {
      lines.push(`  - "${escapeYamlString(tip || '')}"`);
    });
  } else {
    lines.push('  []');
  }
  lines.push('');

  // Results
  if (!data.results || data.results.length === 0) {
    lines.push('results: []');
    if (inc) {
      lines.push(
        '# To show a picture, replace the results line with:',
        '# results:',
        '#   - src: "/media/your-result.jpg"',
        '#     alt: "Describe the picture for someone who cannot see it."',
        '#     caption: "Optional caption."',
        '#     kind: "image"',
        '# For a video file you upload yourself, use kind video and an mp4 or webm path:',
        '#   - src: "/media/your-clip.mp4"',
        '#     alt: "Describe what moves."',
        '#     kind: "video"'
      );
    }
  } else {
    lines.push('results:');
    data.results.forEach((res) => {
      lines.push(`  - src: "${escapeYamlString(res.src || '')}"`);
      lines.push(`    alt: "${escapeYamlString(res.alt || '')}"`);
      if (res.caption && res.caption.trim()) {
        lines.push(`    caption: "${escapeYamlString(res.caption)}"`);
      }
      lines.push(`    kind: "${res.kind === 'video' ? 'video' : 'image'}"`);
    });
  }

  lines.push('---', '');

  // Body
  if (data.body !== undefined) {
    lines.push(data.body.trimStart());
  }

  return lines.join('\n');
}

export function downloadMarkdownFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function parseMarkdownToData(raw: string): Partial<TutorialPostData> {
  const result: Partial<TutorialPostData> = {};
  
  // Extract frontmatter
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n([\s\S]*))?$/);
  if (!match) {
    // If not standard frontmatter, put all in body
    return { body: raw };
  }

  const frontmatter = match[1];
  const body = match[2] || '';
  result.body = body.trimStart();

  const lines = frontmatter.split('\n');
  let currentKey = '';
  let inPositivePrompt = false;
  let inNegativePrompt = false;
  let promptLines: string[] = [];

  const steps: TutorialStep[] = [];
  let currentStep: Partial<TutorialStep> | null = null;

  const settings: TutorialSetting[] = [];
  let currentSetting: Partial<TutorialSetting> | null = null;

  const results: TutorialResult[] = [];
  let currentResult: Partial<TutorialResult> | null = null;

  const tags: string[] = [];
  const tips: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Check multiline prompt accumulation
    if (inPositivePrompt) {
      if (rawLine.startsWith('  ')) {
        promptLines.push(rawLine.slice(2));
        continue;
      } else {
        result.positivePrompt = promptLines.join('\n');
        inPositivePrompt = false;
        promptLines = [];
      }
    }

    if (inNegativePrompt) {
      if (rawLine.startsWith('  ')) {
        promptLines.push(rawLine.slice(2));
        continue;
      } else {
        result.negativePrompt = promptLines.join('\n');
        inNegativePrompt = false;
        promptLines = [];
      }
    }

    // Ignore comment lines that don't define keys
    if (line.startsWith('#')) {
      // Check if it's an updated comment line that could be detected
      continue;
    }

    // Simple key-value string / boolean extraction
    const kvMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      let val = kvMatch[2].trim();

      // strip quotes if present
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }

      currentKey = key;

      if (key === 'title') result.title = val;
      else if (key === 'summary') result.summary = val;
      else if (key === 'date') result.date = val;
      else if (key === 'updated') {
        result.includeUpdated = true;
        result.updated = val;
      } else if (key === 'tool') result.tool = val;
      else if (key === 'model') result.model = val;
      else if (key === 'category') result.category = val === 'video' ? 'video' : 'image';
      else if (key === 'draft') result.draft = val === 'true';
      else if (key === 'example') result.example = val === 'true';
      else if (key === 'cover') result.cover = val;
      else if (key === 'coverAlt') result.coverAlt = val;
      else if (key === 'videoUrl') result.videoUrl = val;
      else if (key === 'positivePrompt' && val === '|') {
        inPositivePrompt = true;
        promptLines = [];
      } else if (key === 'negativePrompt') {
        if (val === '|') {
          inNegativePrompt = true;
          promptLines = [];
          result.includeNegativePrompt = true;
        } else if (val === '""' || val === "''" || val === '') {
          result.includeNegativePrompt = false;
          result.negativePrompt = '';
        } else {
          result.negativePrompt = val;
          result.includeNegativePrompt = true;
        }
      }
      continue;
    }

    // Array items parsing
    if (currentKey === 'tags' && line.startsWith('-')) {
      const tagVal = line.replace(/^-\s*/, '').replace(/^["']|["']$/g, '');
      if (tagVal) tags.push(tagVal);
    } else if (currentKey === 'tips' && line.startsWith('-')) {
      const tipVal = line.replace(/^-\s*/, '').replace(/^["']|["']$/g, '');
      if (tipVal) tips.push(tipVal);
    } else if (currentKey === 'steps') {
      if (line.startsWith('- title:')) {
        const titleVal = line.replace(/^-\s*title:\s*/, '').replace(/^["']|["']$/g, '');
        currentStep = { id: `step-${Date.now()}-${steps.length}`, title: titleVal, body: '' };
        steps.push(currentStep as TutorialStep);
      } else if (line.startsWith('body:') && currentStep) {
        currentStep.body = line.replace(/^body:\s*/, '').replace(/^["']|["']$/g, '');
      }
    } else if (currentKey === 'settings') {
      if (line.startsWith('- label:')) {
        const labelVal = line.replace(/^-\s*label:\s*/, '').replace(/^["']|["']$/g, '');
        currentSetting = { id: `setting-${Date.now()}-${settings.length}`, label: labelVal, value: '' };
        settings.push(currentSetting as TutorialSetting);
      } else if (line.startsWith('value:') && currentSetting) {
        currentSetting.value = line.replace(/^value:\s*/, '').replace(/^["']|["']$/g, '');
      }
    } else if (currentKey === 'results') {
      if (line.startsWith('- src:')) {
        const srcVal = line.replace(/^-\s*src:\s*/, '').replace(/^["']|["']$/g, '');
        currentResult = { id: `res-${Date.now()}-${results.length}`, src: srcVal, alt: '', kind: 'image' };
        results.push(currentResult as TutorialResult);
      } else if (line.startsWith('alt:') && currentResult) {
        currentResult.alt = line.replace(/^alt:\s*/, '').replace(/^["']|["']$/g, '');
      } else if (line.startsWith('caption:') && currentResult) {
        currentResult.caption = line.replace(/^caption:\s*/, '').replace(/^["']|["']$/g, '');
      } else if (line.startsWith('kind:') && currentResult) {
        const k = line.replace(/^kind:\s*/, '').replace(/^["']|["']$/g, '');
        currentResult.kind = k === 'video' ? 'video' : 'image';
      }
    }
  }

  if (inPositivePrompt && promptLines.length > 0) {
    result.positivePrompt = promptLines.join('\n');
  }
  if (inNegativePrompt && promptLines.length > 0) {
    result.negativePrompt = promptLines.join('\n');
  }

  if (tags.length > 0) result.tags = tags;
  if (tips.length > 0) result.tips = tips;
  if (steps.length > 0) result.steps = steps;
  if (settings.length > 0) result.settings = settings;
  if (results.length > 0) result.results = results;

  return result;
}
