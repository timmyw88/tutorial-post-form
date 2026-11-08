import React, { useState } from 'react';
import {
  FileText,
  Sliders,
  ListOrdered,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Tag,
  Lightbulb,
  ExternalLink,
  Info,
  Calendar,
  CheckCircle2,
  Wand2
} from 'lucide-react';
import { TutorialPostData, TutorialStep, TutorialSetting, TutorialResult } from '../types';
import { slugify } from '../utils/markdownGenerator';

interface FormSectionsProps {
  data: TutorialPostData;
  onChange: (updated: Partial<TutorialPostData>) => void;
  onResetToTemplate: () => void;
}

export const FormSections: React.FC<FormSectionsProps> = ({
  data,
  onChange,
  onResetToTemplate,
}) => {
  const [newTagInput, setNewTagInput] = useState('');
  const [newTipInput, setNewTipInput] = useState('');

  // Handle adding tag
  const handleAddTag = (tagToAdd?: string) => {
    const val = (tagToAdd || newTagInput).trim();
    if (!val) return;
    if (!data.tags.includes(val)) {
      onChange({ tags: [...data.tags, val] });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange({ tags: data.tags.filter((t) => t !== tagToRemove) });
  };

  // Steps management
  const handleAddStep = () => {
    const newStep: TutorialStep = {
      id: `step-${Date.now()}`,
      title: '',
      body: '',
    };
    onChange({ steps: [...data.steps, newStep] });
  };

  const handleUpdateStep = (index: number, field: 'title' | 'body', value: string) => {
    const updated = [...data.steps];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ steps: updated });
  };

  const handleRemoveStep = (index: number) => {
    onChange({ steps: data.steps.filter((_, i) => i !== index) });
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.steps.length) return;
    const updated = [...data.steps];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange({ steps: updated });
  };

  // Settings management
  const handleAddSetting = (presetLabel = '', presetValue = '') => {
    const newSetting: TutorialSetting = {
      id: `setting-${Date.now()}`,
      label: presetLabel || '',
      value: presetValue || '',
    };
    onChange({ settings: [...data.settings, newSetting] });
  };

  const handleUpdateSetting = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...data.settings];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ settings: updated });
  };

  const handleRemoveSetting = (index: number) => {
    onChange({ settings: data.settings.filter((_, i) => i !== index) });
  };

  // Tips management
  const handleAddTip = () => {
    if (!newTipInput.trim()) return;
    onChange({ tips: [...data.tips, newTipInput.trim()] });
    setNewTipInput('');
  };

  const handleRemoveTip = (index: number) => {
    onChange({ tips: data.tips.filter((_, i) => i !== index) });
  };

  // Results management
  const handleAddResult = (kind: 'image' | 'video' = 'image') => {
    const newRes: TutorialResult = {
      id: `result-${Date.now()}`,
      src: '/media/your-result.jpg',
      alt: 'Describe the picture for someone who cannot see it.',
      caption: '',
      kind,
    };
    onChange({ results: [...data.results, newRes] });
  };

  const handleUpdateResult = (index: number, field: keyof TutorialResult, value: string) => {
    const updated = [...data.results];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ results: updated });
  };

  const handleRemoveResult = (index: number) => {
    onChange({ results: data.results.filter((_, i) => i !== index) });
  };

  const suggestedSlug = slugify(data.title);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Card / Post Identity */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5 md:p-6 transition-all hover:border-stone-300">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-stone-100">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-stone-900">Post Identity & Core Info</h2>
            <p className="text-xs text-stone-500">Title, URL slug, format, and search summary</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Title <span className="text-rose-500">*</span>
              <span className="ml-2 font-normal text-stone-400 italic"># The title viewers see.</span>
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g. Soft Window Portrait Lighting"
              className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
            />
            <div className="mt-1.5 flex items-center gap-2 text-xs text-stone-500">
              <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-[11px] text-stone-700 border border-stone-200">
                content/posts/{data.customFilename ? data.customFilename : `${suggestedSlug}.md`}
              </span>
              <span className="text-stone-400">Use lowercase words and hyphens (.md)</span>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Summary
              <span className="ml-2 font-normal text-stone-400 italic">
                # One or two sentences for the archive card and for search.
              </span>
            </label>
            <textarea
              rows={2}
              value={data.summary}
              onChange={(e) => onChange({ summary: e.target.value })}
              placeholder="Say what the viewer will make, in one or two sentences."
              className="w-full px-3.5 py-2 bg-stone-50/50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition resize-y"
            />
          </div>

          {/* Category & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Category <span className="text-rose-500">*</span>
                <span className="block font-normal text-[11px] text-stone-400">image or video</span>
              </label>
              <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-lg border border-stone-200 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => onChange({ category: 'image' })}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md transition ${
                    data.category === 'image'
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  image
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ category: 'video' })}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md transition ${
                    data.category === 'video'
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  video
                </button>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Publication Date
                <span className="block font-normal text-[11px] text-stone-400">YYYY-MM-DD</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={data.date}
                  onChange={(e) => onChange({ date: e.target.value })}
                  className="w-full px-3 py-1.5 bg-stone-50/50 border border-stone-300 rounded-lg text-sm text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>
            </div>

            {/* Draft toggle */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Draft Status
                <span className="block font-normal text-[11px] text-stone-400">
                  {data.draft ? 'Hidden from built site' : 'Visible on site'}
                </span>
              </label>
              <button
                type="button"
                onClick={() => onChange({ draft: !data.draft })}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                  data.draft
                    ? 'bg-amber-50/60 border-amber-300 text-amber-900'
                    : 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                }`}
              >
                <span>draft: <strong className="font-mono">{data.draft ? 'true' : 'false'}</strong></span>
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white ${
                    data.draft ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                >
                  {data.draft ? '!' : '✓'}
                </span>
              </button>
            </div>

            {/* Example toggle */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Example Badge
                <span className="block font-normal text-[11px] text-stone-400">
                  {data.example ? 'Shows Example badge' : 'Own tutorial lesson'}
                </span>
              </label>
              <button
                type="button"
                onClick={() => onChange({ example: !data.example })}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                  data.example
                    ? 'bg-blue-50/70 border-blue-300 text-blue-900'
                    : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                <span>example: <strong className="font-mono">{data.example ? 'true' : 'false'}</strong></span>
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white ${
                    data.example ? 'bg-blue-600' : 'bg-stone-400'
                  }`}
                >
                  {data.example ? '★' : '•'}
                </span>
              </button>
            </div>
          </div>

          {/* Optional Updated Date toggle */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
              <input
                type="checkbox"
                checked={data.includeUpdated}
                onChange={(e) => onChange({ includeUpdated: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
              />
              <span>Include revision date (<code className="font-mono text-stone-600">updated: YYYY-MM-DD</code>)</span>
            </label>
            {data.includeUpdated && (
              <input
                type="date"
                value={data.updated}
                onChange={(e) => onChange({ updated: e.target.value })}
                className="px-2.5 py-1 text-xs border border-stone-300 rounded-md bg-stone-50 focus:bg-white"
              />
            )}
          </div>
        </div>
      </div>

      {/* 2. Tool, Model & Tags */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5 md:p-6 transition-all hover:border-stone-300">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-stone-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-stone-900">App, Model & Filter Tags</h2>
            <p className="text-xs text-stone-500">The tool demonstrated in the video and searchable topics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tool */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Tool / App Name
              <span className="ml-2 font-normal text-stone-400 italic"># The app you show in the video.</span>
            </label>
            <input
              type="text"
              value={data.tool}
              onChange={(e) => onChange({ tool: e.target.value })}
              placeholder="e.g. Midjourney, ComfyUI, Stable Diffusion, Kling, Sora"
              className="w-full px-3.5 py-2 bg-stone-50/50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Model (Optional)
              <span className="ml-2 font-normal text-stone-400 italic">
                # Optional. Leave blank if you do not want viewers to see it.
              </span>
            </label>
            <input
              type="text"
              value={data.model}
              onChange={(e) => onChange({ model: e.target.value })}
              placeholder="e.g. v6.1, Flux.1 Dev, SDXL, Kling 1.5"
              className="w-full px-3.5 py-2 bg-stone-50/50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
            />
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Tags
              <span className="ml-2 font-normal text-stone-400 italic"># Optional topics for the filter. Keep them short.</span>
            </label>
            <div className="p-3 bg-stone-50/70 border border-stone-300 rounded-lg space-y-2">
              <div className="flex flex-wrap gap-1.5 items-center">
                {data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-200/80 text-stone-800 text-xs font-medium"
                  >
                    <Tag className="w-3 h-3 text-stone-500" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-0.5 text-stone-400 hover:text-stone-700 p-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <div className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add tag + Enter..."
                    className="px-2.5 py-1 text-xs bg-white border border-stone-300 rounded-md text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag()}
                    className="px-2 py-1 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-300 rounded-md hover:bg-stone-50 transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap items-center gap-1 pt-1 text-[11px] text-stone-500">
                <span>Quick suggestions:</span>
                {['lighting', 'portrait', 'photorealism', 'cinematic', 'animation', 'style-transfer', 'camera-angles'].map(
                  (sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => handleAddTag(sug)}
                      disabled={data.tags.includes(sug)}
                      className={`px-1.5 py-0.5 rounded border text-[11px] transition ${
                        data.tags.includes(sug)
                          ? 'opacity-40 border-transparent bg-stone-200 text-stone-500 cursor-default'
                          : 'border-stone-200 bg-white hover:border-stone-300 text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      +{sug}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Media & Video Links */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5 md:p-6 transition-all hover:border-stone-300">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-stone-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-stone-900">Cover & Video Links</h2>
            <p className="text-xs text-stone-500">Thumbnail path and optional YouTube link</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cover Path */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Cover Image Path
              <span className="ml-2 font-normal text-stone-400 italic">
                # Put file in public/media, use path starting with /media/
              </span>
            </label>
            <input
              type="text"
              value={data.cover}
              onChange={(e) => onChange({ cover: e.target.value })}
              placeholder="/media/soft-window-portrait.jpg"
              className="w-full px-3.5 py-2 bg-stone-50/50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
            />
          </div>

          {/* Cover Alt */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Cover Alt Text
              <span className="ml-2 font-normal text-stone-400 italic"># Accessible description</span>
            </label>
            <input
              type="text"
              value={data.coverAlt}
              onChange={(e) => onChange({ coverAlt: e.target.value })}
              placeholder="e.g. Portrait photo illuminated by natural soft morning window light"
              className="w-full px-3.5 py-2 bg-stone-50/50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
            />
          </div>

          {/* Video URL */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              YouTube Video URL (Optional)
              <span className="ml-2 font-normal text-stone-400 italic">
                # Optional. A full YouTube link, or leave blank.
              </span>
            </label>
            <input
              type="url"
              value={data.videoUrl}
              onChange={(e) => onChange({ videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3.5 py-2 bg-stone-50/50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
            />
          </div>
        </div>
      </div>

      {/* 4. Generation Prompts */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5 md:p-6 transition-all hover:border-stone-300">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-stone-100">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-stone-900">Prompts (Positive & Negative)</h2>
            <p className="text-xs text-stone-500">
              Formatted with multi-line literal block (|). Line breaks are kept when viewers copy.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Positive Prompt */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-stone-700">
                Positive Prompt (<code className="font-mono text-purple-700">positivePrompt: |</code>)
              </label>
              <span className="text-xs text-stone-400 italic">Line breaks are kept when a viewer copies it.</span>
            </div>
            <textarea
              rows={4}
              value={data.positivePrompt}
              onChange={(e) => onChange({ positivePrompt: e.target.value })}
              placeholder="Paste the prompt here. Line breaks are kept when a viewer copies it."
              className="w-full font-mono text-xs px-3.5 py-2.5 bg-stone-50/70 border border-stone-300 rounded-lg text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition leading-relaxed resize-y"
            />
          </div>

          {/* Negative Prompt */}
          <div className="pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeNeg"
                  checked={data.includeNegativePrompt}
                  onChange={(e) => onChange({ includeNegativePrompt: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-stone-300"
                />
                <label htmlFor="includeNeg" className="text-xs font-semibold text-stone-700 cursor-pointer">
                  Negative Prompt (<code className="font-mono text-purple-700">negativePrompt: |</code>)
                </label>
              </div>
              <span className="text-xs text-stone-400 italic">Optional. Erase or uncheck if app has none.</span>
            </div>
            {data.includeNegativePrompt ? (
              <textarea
                rows={3}
                value={data.negativePrompt}
                onChange={(e) => onChange({ negativePrompt: e.target.value })}
                placeholder="Optional negative prompt (e.g. low quality, blurry, distorted, watermark)"
                className="w-full font-mono text-xs px-3.5 py-2.5 bg-stone-50/70 border border-stone-300 rounded-lg text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition leading-relaxed resize-y"
              />
            ) : (
              <p className="text-xs text-stone-400 italic bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                Negative prompt will be output as <code className="font-mono text-stone-600">negativePrompt: ""</code>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 5. Tutorial Steps */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5 md:p-6 transition-all hover:border-stone-300">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <ListOrdered className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900">Tutorial Steps ({data.steps.length})</h2>
              <p className="text-xs text-stone-500">Step-by-step instructions for viewers to follow</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddStep}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Step
          </button>
        </div>

        <div className="space-y-3">
          {data.steps.map((step, index) => (
            <div
              key={step.id || index}
              className="p-3.5 bg-stone-50/60 rounded-lg border border-stone-200 space-y-2.5 relative group hover:border-stone-300 transition"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-stone-200 text-stone-700 text-xs font-semibold font-mono">
                  Step {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveStep(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded text-stone-400 hover:text-stone-700 disabled:opacity-30"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveStep(index, 'down')}
                    disabled={index === data.steps.length - 1}
                    className="p-1 rounded text-stone-400 hover:text-stone-700 disabled:opacity-30"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(index)}
                    className="p-1 rounded text-stone-400 hover:text-rose-600 transition"
                    title="Remove step"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                  title: <span className="font-normal text-stone-400 italic">"First thing the viewer does"</span>
                </label>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => handleUpdateStep(index, 'title', e.target.value)}
                  placeholder="e.g. Set up lighting geometry in canvas"
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-md text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                  body: <span className="font-normal text-stone-400 italic">"Write the step in plain sentences."</span>
                </label>
                <textarea
                  rows={2}
                  value={step.body}
                  onChange={(e) => handleUpdateStep(index, 'body', e.target.value)}
                  placeholder="Explain the step clearly in plain sentences..."
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-md text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y"
                />
              </div>
            </div>
          ))}

          {data.steps.length === 0 && (
            <div className="text-center py-6 border border-dashed border-stone-300 rounded-lg text-stone-500 text-xs">
              No steps added yet.{' '}
              <button
                type="button"
                onClick={handleAddStep}
                className="text-sky-600 font-semibold hover:underline"
              >
                Click here to add the first step
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 6. Settings & Tips */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5 md:p-6 transition-all hover:border-stone-300">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-stone-100">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center font-bold">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-stone-900">App Settings & Video Tips</h2>
            <p className="text-xs text-stone-500">Key parameters (Steps, CFG, Seed) and vocal reminders</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Settings list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-700">Settings Key-Values</label>
              <button
                type="button"
                onClick={() => handleAddSetting()}
                className="text-xs text-orange-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>

            {/* Quick preset buttons */}
            <div className="flex flex-wrap gap-1 mb-2.5 text-[11px] text-stone-500">
              <span className="text-[10px]">Presets:</span>
              <button
                type="button"
                onClick={() => handleAddSetting('CFG Scale', '7')}
                className="px-1.5 py-0.5 bg-stone-100 hover:bg-stone-200 rounded text-stone-700"
              >
                +CFG: 7
              </button>
              <button
                type="button"
                onClick={() => handleAddSetting('Sampler', 'Euler a')}
                className="px-1.5 py-0.5 bg-stone-100 hover:bg-stone-200 rounded text-stone-700"
              >
                +Sampler
              </button>
              <button
                type="button"
                onClick={() => handleAddSetting('Seed', '-1')}
                className="px-1.5 py-0.5 bg-stone-100 hover:bg-stone-200 rounded text-stone-700"
              >
                +Seed
              </button>
              <button
                type="button"
                onClick={() => handleAddSetting('Aspect Ratio', '16:9')}
                className="px-1.5 py-0.5 bg-stone-100 hover:bg-stone-200 rounded text-stone-700"
              >
                +Ratio
              </button>
            </div>

            <div className="space-y-2">
              {data.settings.map((setting, idx) => (
                <div key={setting.id || idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={setting.label}
                    onChange={(e) => handleUpdateSetting(idx, 'label', e.target.value)}
                    placeholder="Label (e.g. Steps)"
                    className="w-1/2 px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-md text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    value={setting.value}
                    onChange={(e) => handleUpdateSetting(idx, 'value', e.target.value)}
                    placeholder="Value (e.g. 30)"
                    className="w-1/2 px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-md text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSetting(idx)}
                    className="p-1 text-stone-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tips list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-700">Video Tips & Reminders</label>
              <span className="text-[11px] text-stone-400 italic">Spoken in the video</span>
            </div>

            <div className="flex gap-1.5 mb-2.5">
              <input
                type="text"
                value={newTipInput}
                onChange={(e) => setNewTipInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTip();
                  }
                }}
                placeholder="Write a short reminder you say..."
                className="flex-1 px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-md text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={handleAddTip}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md text-xs font-semibold transition"
              >
                Add
              </button>
            </div>

            <div className="space-y-1.5">
              {data.tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-2 p-2 bg-stone-50/70 rounded-md border border-stone-200 text-xs text-stone-800"
                >
                  <div className="flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTip(idx)}
                    className="text-stone-400 hover:text-rose-600 shrink-0 p-0.5"
                  >
                    ×
                  </button>
                </div>
              ))}
              {data.tips.length === 0 && (
                <p className="text-[11px] text-stone-400 italic">No tips added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 7. Results Gallery */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5 md:p-6 transition-all hover:border-stone-300">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900">
                Results Gallery ({data.results.length === 0 ? 'Empty: results: []' : `${data.results.length} items`})
              </h2>
              <p className="text-xs text-stone-500">Showcase image or video clips created with this tutorial</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {data.results.length > 0 && (
              <button
                type="button"
                onClick={() => onChange({ results: [] })}
                className="px-2.5 py-1.5 text-xs text-stone-600 hover:text-rose-600 border border-stone-200 rounded-lg transition"
              >
                Clear all (results: [])
              </button>
            )}
            <button
              type="button"
              onClick={() => handleAddResult('image')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" /> Image Result
            </button>
            <button
              type="button"
              onClick={() => handleAddResult('video')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" /> Video Result
            </button>
          </div>
        </div>

        {data.results.length === 0 ? (
          <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-500">
            <div className="font-semibold text-stone-700 mb-1">
              Currently using empty array: <code className="font-mono text-teal-700">results: []</code>
            </div>
            <p className="text-[11px] text-stone-400">
              Template note: To show results, add items above with src path (/media/your-result.jpg or .mp4) and alt description.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.results.map((res, idx) => (
              <div
                key={res.id || idx}
                className="p-3 bg-stone-50/70 border border-stone-200 rounded-lg grid grid-cols-1 md:grid-cols-12 gap-3 items-start"
              >
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-semibold text-stone-600 mb-1">Kind</label>
                  <select
                    value={res.kind}
                    onChange={(e) => handleUpdateResult(idx, 'kind', e.target.value as 'image' | 'video')}
                    className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded font-semibold text-stone-800"
                  >
                    <option value="image">image</option>
                    <option value="video">video</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-semibold text-stone-600 mb-1">src (/media/...)</label>
                  <input
                    type="text"
                    value={res.src}
                    onChange={(e) => handleUpdateResult(idx, 'src', e.target.value)}
                    placeholder="/media/your-result.jpg"
                    className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded font-mono"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-semibold text-stone-600 mb-1">alt description</label>
                  <input
                    type="text"
                    value={res.alt}
                    onChange={(e) => handleUpdateResult(idx, 'alt', e.target.value)}
                    placeholder="Describe for screen readers"
                    className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-semibold text-stone-600 mb-1">caption (optional)</label>
                  <input
                    type="text"
                    value={res.caption || ''}
                    onChange={(e) => handleUpdateResult(idx, 'caption', e.target.value)}
                    placeholder="Optional caption"
                    className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded"
                  />
                </div>
                <div className="md:col-span-1 flex justify-end pt-5">
                  <button
                    type="button"
                    onClick={() => handleRemoveResult(idx)}
                    className="p-1 text-stone-400 hover:text-rose-600 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 8. Extra Notes / Markdown Body */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5 md:p-6 transition-all hover:border-stone-300">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900">Extra Notes (Markdown Body)</h2>
              <p className="text-xs text-stone-500">
                Content written below the closing frontmatter delimiter <code className="font-mono text-stone-700">---</code>
              </p>
            </div>
          </div>

          {/* Quick insert buttons */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => {
                const promptSnippet = `\n\n\`\`\`text\nanother prompt line\nthe line break stays\n\`\`\``;
                onChange({ body: (data.body || '') + promptSnippet });
              }}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-mono font-medium transition"
            >
              + Prompt Code Block
            </button>
          </div>
        </div>

        <div>
          <textarea
            rows={6}
            value={data.body}
            onChange={(e) => onChange({ body: e.target.value })}
            placeholder="Write extra notes under this line. This part is optional..."
            className="w-full font-mono text-xs px-3.5 py-2.5 bg-stone-50/70 border border-stone-300 rounded-lg text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition leading-relaxed resize-y"
          />
          <p className="mt-1 text-[11px] text-stone-400">
            Fenced code blocks (<code className="font-mono">```text ... ```</code>) will automatically render a copy button on the published tutorial site.
          </p>
        </div>
      </div>
    </div>
  );
};
