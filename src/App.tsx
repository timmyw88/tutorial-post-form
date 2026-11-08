import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  RotateCcw
} from 'lucide-react';
import { TutorialPostData, TutorialStep, TutorialSetting, DEFAULT_POST_DATA } from './types';
import { generateMarkdown, getFilename, downloadMarkdownFile } from './utils/markdownGenerator';

export default function App() {
  const [data, setData] = useState<TutorialPostData>(DEFAULT_POST_DATA);
  const [tagsInput, setTagsInput] = useState<string>(DEFAULT_POST_DATA.tags.join(', '));
  const [copied, setCopied] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Update field helper
  const update = (fields: Partial<TutorialPostData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  // Sync tags on text change
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setTagsInput(raw);
    const splitTags = raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    update({ tags: splitTags });
  };

  // Steps
  const addStep = () => {
    const newStep: TutorialStep = {
      id: `step-${Date.now()}`,
      title: '',
      body: '',
    };
    update({ steps: [...data.steps, newStep] });
  };

  const updateStep = (index: number, field: 'title' | 'body', value: string) => {
    const updated = [...data.steps];
    updated[index] = { ...updated[index], [field]: value };
    update({ steps: updated });
  };

  const removeStep = (index: number) => {
    update({ steps: data.steps.filter((_, i) => i !== index) });
  };

  // Settings
  const addSetting = () => {
    const newSetting: TutorialSetting = {
      id: `setting-${Date.now()}`,
      label: '',
      value: '',
    };
    update({ settings: [...data.settings, newSetting] });
  };

  const updateSetting = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...data.settings];
    updated[index] = { ...updated[index], [field]: value };
    update({ settings: updated });
  };

  const removeSetting = (index: number) => {
    update({ settings: data.settings.filter((_, i) => i !== index) });
  };

  // Tips
  const addTip = () => {
    update({ tips: [...data.tips, ''] });
  };

  const updateTip = (index: number, value: string) => {
    const updated = [...data.tips];
    updated[index] = value;
    update({ tips: updated });
  };

  const removeTip = (index: number) => {
    update({ tips: data.tips.filter((_, i) => i !== index) });
  };

  // Reset to empty form
  const handleReset = () => {
    if (window.confirm('Clear all form fields?')) {
      setData(DEFAULT_POST_DATA);
      setTagsInput('');
    }
  };

  const filename = getFilename(data);
  const markdownOutput = generateMarkdown(data, { includeComments: true });

  const handleDownload = () => {
    downloadMarkdownFile(filename, markdownOutput);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Simple Page Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-200">
          <div>
            <h1 className="text-xl font-bold text-stone-900">Tutorial Post Form</h1>
            <p className="text-xs text-stone-500 mt-1">
              Fill in the fields, then download your ready-to-use <span className="font-mono text-stone-700">.md</span> file.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 rounded-md transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {/* The Clean Form Card */}
        <form onSubmit={(e) => { e.preventDefault(); handleDownload(); }} className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-stone-900 border-b border-stone-100 pb-2">
              1. Basic Information
            </h2>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="The title viewers see"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                required
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Generates file: <code className="text-stone-600 font-mono">content/posts/{data.title ? filename : '[title].md'}</code>
              </p>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Summary
              </label>
              <textarea
                rows={2}
                value={data.summary}
                onChange={(e) => update({ summary: e.target.value })}
                placeholder="Say what the viewer will make, in one or two sentences."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 resize-y"
              />
              <p className="text-[11px] text-stone-400 mt-1">One or two sentences for the archive card and search.</p>
            </div>

            {/* Category & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={data.category}
                  onChange={(e) => update({ category: e.target.value as 'image' | 'video' })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                >
                  <option value="image">image</option>
                  <option value="video">video</option>
                </select>
                <p className="text-[11px] text-stone-400 mt-1">Required: image or video</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={data.date}
                  onChange={(e) => update({ date: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
                <p className="text-[11px] text-stone-400 mt-1">Year-month-day</p>
              </div>
            </div>

            {/* Tool & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tool (App Name)
                </label>
                <input
                  type="text"
                  value={data.tool}
                  onChange={(e) => update({ tool: e.target.value })}
                  placeholder="e.g. Midjourney, ComfyUI, Kling"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
                <p className="text-[11px] text-stone-400 mt-1">The app you show in the video.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Model (Optional)
                </label>
                <input
                  type="text"
                  value={data.model}
                  onChange={(e) => update({ model: e.target.value })}
                  placeholder="e.g. Flux.1, v6.1 (optional)"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
                <p className="text-[11px] text-stone-400 mt-1">Leave blank if not needed.</p>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={handleTagsChange}
                placeholder="e.g. lighting, portrait, realistic"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
              <p className="text-[11px] text-stone-400 mt-1">Optional filter topics, separated by commas.</p>
            </div>
          </div>

          {/* Section 2: Visibility & Media */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-semibold text-stone-900 border-b border-stone-100 pb-2">
              2. Visibility & Media
            </h2>

            {/* Draft & Example checkboxes */}
            <div className="flex flex-wrap items-center gap-6 py-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-800">
                <input
                  type="checkbox"
                  checked={data.draft}
                  onChange={(e) => update({ draft: e.target.checked })}
                  className="w-4 h-4 rounded text-stone-800 border-stone-300 focus:ring-stone-400"
                />
                <span>Draft (<span className="text-stone-500">true hides the tutorial from the site</span>)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-800">
                <input
                  type="checkbox"
                  checked={data.example}
                  onChange={(e) => update({ example: e.target.checked })}
                  className="w-4 h-4 rounded text-stone-800 border-stone-300 focus:ring-stone-400"
                />
                <span>Example (<span className="text-stone-500">adds an Example badge</span>)</span>
              </label>
            </div>

            {/* Cover & Alt */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Cover Image Path
                </label>
                <input
                  type="text"
                  value={data.cover}
                  onChange={(e) => update({ cover: e.target.value })}
                  placeholder="/media/your-cover.jpg"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 font-mono text-xs"
                />
                <p className="text-[11px] text-stone-400 mt-1">Use a path that starts with /media/</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Cover Alt Text
                </label>
                <input
                  type="text"
                  value={data.coverAlt}
                  onChange={(e) => update({ coverAlt: e.target.value })}
                  placeholder="Describe the cover picture"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
                <p className="text-[11px] text-stone-400 mt-1">Accessibility description for the image.</p>
              </div>
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                YouTube Video Link (Optional)
              </label>
              <input
                type="text"
                value={data.videoUrl}
                onChange={(e) => update({ videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
              <p className="text-[11px] text-stone-400 mt-1">Leave blank if there is no video.</p>
            </div>
          </div>

          {/* Section 3: Prompts */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-semibold text-stone-900 border-b border-stone-100 pb-2">
              3. Prompts
            </h2>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Positive Prompt
              </label>
              <textarea
                rows={3}
                value={data.positivePrompt}
                onChange={(e) => update({ positivePrompt: e.target.value })}
                placeholder="Paste the prompt here. Line breaks are kept when copied."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 resize-y"
              />
              <p className="text-[11px] text-stone-400 mt-1">Preserves exact line breaks in the template.</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700">
                  Negative Prompt (Optional)
                </label>
                <label className="text-xs text-stone-500 flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.includeNegativePrompt}
                    onChange={(e) => update({ includeNegativePrompt: e.target.checked })}
                    className="w-3.5 h-3.5 rounded text-stone-800 border-stone-300"
                  />
                  <span>Enable negative prompt</span>
                </label>
              </div>
              {data.includeNegativePrompt ? (
                <textarea
                  rows={2}
                  value={data.negativePrompt}
                  onChange={(e) => update({ negativePrompt: e.target.value })}
                  placeholder="Optional negative prompt. Erase if not needed."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 resize-y"
                />
              ) : (
                <p className="text-xs text-stone-400 italic">Negative prompt disabled (will output as "").</p>
              )}
            </div>
          </div>

          {/* Section 4: Tutorial Steps */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h2 className="text-sm font-semibold text-stone-900">
                4. Steps ({data.steps.length})
              </h2>
              <button
                type="button"
                onClick={addStep}
                className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 px-2.5 py-1 rounded-md transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Step
              </button>
            </div>

            <div className="space-y-3">
              {data.steps.map((step, idx) => (
                <div key={step.id || idx} className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-600">Step {idx + 1}</span>
                    {data.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(idx)}
                        className="text-stone-400 hover:text-rose-600 transition"
                        title="Remove step"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(idx, 'title', e.target.value)}
                    placeholder="Step title (e.g. First thing the viewer does)"
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                  <textarea
                    rows={2}
                    value={step.body}
                    onChange={(e) => updateStep(idx, 'body', e.target.value)}
                    placeholder="Write the step in plain sentences."
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 resize-y"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Settings & Tips */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-semibold text-stone-900 border-b border-stone-100 pb-2">
              5. Settings & Tips
            </h2>

            {/* Settings */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-stone-700">Settings</label>
                <button
                  type="button"
                  onClick={addSetting}
                  className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3 h-3" /> Add Setting
                </button>
              </div>

              <div className="space-y-2">
                {data.settings.map((s, idx) => (
                  <div key={s.id || idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={s.label}
                      onChange={(e) => updateSetting(idx, 'label', e.target.value)}
                      placeholder="Label (e.g. Steps)"
                      className="w-1/2 px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                    <input
                      type="text"
                      value={s.value}
                      onChange={(e) => updateSetting(idx, 'value', e.target.value)}
                      placeholder="Value (e.g. 30)"
                      className="w-1/2 px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs text-stone-900 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeSetting(idx)}
                      className="p-1 text-stone-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-stone-700">Video Tips</label>
                <button
                  type="button"
                  onClick={addTip}
                  className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3 h-3" /> Add Tip
                </button>
              </div>

              <div className="space-y-2">
                {data.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => updateTip(idx, e.target.value)}
                      placeholder="Write a short reminder you actually say in the video."
                      className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeTip(idx)}
                      className="p-1 text-stone-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 6: Extra Notes (Markdown Body) */}
          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-semibold text-stone-900 border-b border-stone-100 pb-2">
              6. Extra Notes (Optional)
            </h2>
            <p className="text-[11px] text-stone-400">Content below the frontmatter notes divider (---)</p>
            <textarea
              rows={4}
              value={data.body}
              onChange={(e) => update({ body: e.target.value })}
              placeholder="Write extra notes or prompts here..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 resize-y"
            />
          </div>

          {/* Submit & Download Bar */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              Download Markdown
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Markdown'}
              </button>

              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-3 py-2 text-stone-500 hover:text-stone-800 text-xs flex items-center gap-1"
              >
                <span>{showPreview ? 'Hide Preview' : 'Preview'}</span>
                {showPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Collapsible Markdown Preview */}
          {showPreview && (
            <div className="mt-4 pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-600 font-mono">
                  content/posts/{filename}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs text-stone-600 hover:text-stone-900 underline"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 bg-stone-900 text-stone-100 rounded-lg text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-80 overflow-y-auto">
                {markdownOutput}
              </pre>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
