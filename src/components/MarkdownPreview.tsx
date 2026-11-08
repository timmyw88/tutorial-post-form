import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Code2,
  Eye,
  FileCode,
  FolderArchive,
  Sparkles,
  ExternalLink,
  Layers,
  Settings2,
  CheckCircle2
} from 'lucide-react';
import { TutorialPostData } from '../types';
import { generateMarkdown, getFilename, downloadMarkdownFile } from '../utils/markdownGenerator';

interface MarkdownPreviewProps {
  data: TutorialPostData;
  onUpdateCustomFilename?: (filename: string) => void;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  data,
  onUpdateCustomFilename,
}) => {
  const [activeTab, setActiveTab] = useState<'raw' | 'rendered'>('raw');
  const [includeComments, setIncludeComments] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [isEditingFilename, setIsEditingFilename] = useState<boolean>(false);

  const filename = getFilename(data);
  const markdownContent = generateMarkdown(data, { includeComments });

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadMarkdownFile(filename, markdownContent);
  };

  const lineCount = markdownContent.split('\n').length;
  const charCount = markdownContent.length;

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Top Header of Preview Card */}
      <div className="p-4 border-b border-stone-200 bg-stone-50/70">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-stone-900 text-white flex items-center justify-center">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-900">Output Markdown</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-700">
                  {lineCount} lines • {charCount} chars
                </span>
              </div>
              <div className="text-[11px] text-stone-500 flex items-center gap-1 font-mono">
                <FolderArchive className="w-3 h-3 text-stone-400" />
                <span>content/posts/</span>
                {isEditingFilename ? (
                  <input
                    type="text"
                    value={data.customFilename || filename}
                    onChange={(e) => onUpdateCustomFilename?.(e.target.value)}
                    onBlur={() => setIsEditingFilename(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setIsEditingFilename(false);
                    }}
                    autoFocus
                    className="px-1 py-0 text-[11px] border border-amber-400 rounded bg-white text-stone-900 font-mono"
                  />
                ) : (
                  <span
                    onClick={() => setIsEditingFilename(true)}
                    className="text-amber-800 font-bold underline decoration-dotted cursor-pointer hover:text-amber-900"
                    title="Click to customize filename"
                  >
                    {filename}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                copied
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
                  : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition shadow-xs active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              Download .md
            </button>
          </div>
        </div>

        {/* View Toggle & Comment toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200/60">
          <div className="flex items-center gap-1 bg-stone-200/70 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('raw')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition font-medium ${
                activeTab === 'raw'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Raw Markdown
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rendered')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition font-medium ${
                activeTab === 'rendered'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Visual Post Preview
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeComments}
              onChange={(e) => setIncludeComments(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-amber-600 border-stone-300 focus:ring-amber-500"
            />
            <span>Include template notes/comments</span>
          </label>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-stone-900 p-4 font-mono text-xs text-stone-200">
        {activeTab === 'raw' ? (
          <div className="relative">
            <pre className="whitespace-pre-wrap break-all leading-relaxed font-mono select-all">
              {markdownContent}
            </pre>
          </div>
        ) : (
          <div className="bg-stone-50 text-stone-900 rounded-lg p-5 font-sans space-y-6">
            {/* Visual Preview of Post */}
            <div className="border-b border-stone-200 pb-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-stone-900 text-white">
                  {data.category}
                </span>
                {data.example && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                    Example
                  </span>
                )}
                {data.draft && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                    Draft
                  </span>
                )}
                <span className="text-xs text-stone-500">
                  {data.date} {data.includeUpdated && `(Updated ${data.updated})`}
                </span>
              </div>

              <h1 className="text-xl md:text-2xl font-bold text-stone-900 mb-1">
                {data.title || 'Untitled Tutorial'}
              </h1>
              <p className="text-sm text-stone-600">{data.summary || 'No summary provided.'}</p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-stone-500">
                {data.tool && (
                  <div>
                    Tool: <strong className="text-stone-800">{data.tool}</strong>
                  </div>
                )}
                {data.model && (
                  <div>
                    Model: <strong className="text-stone-800">{data.model}</strong>
                  </div>
                )}
                {data.cover && (
                  <div className="font-mono text-[11px]">
                    Cover: {data.cover}
                  </div>
                )}
              </div>

              {data.tags && data.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {data.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-stone-200/70 text-stone-700 text-xs"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Video preview if provided */}
            {data.videoUrl && (
              <div className="p-3 bg-stone-100 rounded-lg border border-stone-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-800 font-medium truncate">
                  <span>Video Tutorial:</span>
                  <span className="font-mono text-stone-600 truncate">{data.videoUrl}</span>
                </div>
                <a
                  href={data.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-stone-500 hover:text-stone-900 shrink-0 ml-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Prompts section */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Prompt Configuration
              </h2>
              {data.positivePrompt && (
                <div className="bg-stone-900 text-stone-100 rounded-lg p-3 relative font-mono text-xs">
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-stone-800 text-[11px] text-stone-400">
                    <span>Positive Prompt</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(data.positivePrompt);
                        setCopiedPrompt('pos');
                        setTimeout(() => setCopiedPrompt(null), 1500);
                      }}
                      className="text-stone-300 hover:text-white flex items-center gap-1"
                    >
                      {copiedPrompt === 'pos' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono leading-relaxed">{data.positivePrompt}</pre>
                </div>
              )}

              {data.includeNegativePrompt && data.negativePrompt && (
                <div className="bg-stone-800 text-stone-200 rounded-lg p-3 relative font-mono text-xs">
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-stone-700 text-[11px] text-stone-400">
                    <span>Negative Prompt</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(data.negativePrompt);
                        setCopiedPrompt('neg');
                        setTimeout(() => setCopiedPrompt(null), 1500);
                      }}
                      className="text-stone-300 hover:text-white flex items-center gap-1"
                    >
                      {copiedPrompt === 'neg' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono leading-relaxed">{data.negativePrompt}</pre>
                </div>
              )}
            </div>

            {/* Steps section */}
            {data.steps && data.steps.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Steps ({data.steps.length})
                </h2>
                <div className="space-y-2">
                  {data.steps.map((st, i) => (
                    <div
                      key={st.id || i}
                      className="p-3 bg-white rounded-lg border border-stone-200 shadow-2xs"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <h3 className="text-xs font-bold text-stone-900">
                          {st.title || `Step ${i + 1}`}
                        </h3>
                      </div>
                      <p className="text-xs text-stone-600 pl-7 leading-relaxed">{st.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings & Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.settings && data.settings.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                    Settings
                  </h3>
                  <div className="bg-white rounded-lg border border-stone-200 divide-y divide-stone-100 text-xs">
                    {data.settings.map((s, idx) => (
                      <div key={idx} className="flex justify-between p-2">
                        <span className="text-stone-600">{s.label}</span>
                        <span className="font-mono font-semibold text-stone-900">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.tips && data.tips.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                    Video Tips
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    {data.tips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-amber-50/70 border border-amber-200/80 rounded-md text-amber-900"
                      >
                        💡 {tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Results Gallery */}
            {data.results && data.results.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                  Results ({data.results.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {data.results.map((r, i) => (
                    <div key={i} className="p-2.5 bg-white border border-stone-200 rounded-lg">
                      <div className="font-mono text-[11px] text-stone-700 truncate">{r.src}</div>
                      <div className="text-stone-500 mt-1">{r.alt}</div>
                      {r.caption && <div className="text-stone-400 italic text-[11px]">{r.caption}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Notes */}
            {data.body && (
              <div className="pt-4 border-t border-stone-200">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                  Extra Notes
                </h3>
                <pre className="whitespace-pre-wrap bg-white p-3 rounded-lg border border-stone-200 font-mono text-xs text-stone-800">
                  {data.body}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-3 bg-stone-100 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[11px] text-stone-500">
          Target file: <strong className="font-mono text-stone-800">{filename}</strong>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied to Clipboard' : 'Copy Text'}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download {filename}
          </button>
        </div>
      </div>
    </div>
  );
};
