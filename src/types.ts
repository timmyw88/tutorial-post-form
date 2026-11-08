export interface TutorialStep {
  id: string;
  title: string;
  body: string;
}

export interface TutorialSetting {
  id: string;
  label: string;
  value: string;
}

export interface TutorialResult {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  kind: 'image' | 'video';
}

export interface TutorialPostData {
  title: string;
  summary: string;
  date: string;
  includeUpdated: boolean;
  updated: string;
  tool: string;
  model: string;
  category: 'image' | 'video';
  tags: string[];
  draft: boolean;
  example: boolean;
  cover: string;
  coverAlt: string;
  videoUrl: string;
  steps: TutorialStep[];
  positivePrompt: string;
  includeNegativePrompt: boolean;
  negativePrompt: string;
  settings: TutorialSetting[];
  tips: string[];
  results: TutorialResult[];
  body: string;
  customFilename?: string;
}

export const DEFAULT_POST_DATA: TutorialPostData = {
  title: "",
  summary: "",
  date: "",
  includeUpdated: false,
  updated: "",
  tool: "",
  model: "",
  category: "image",
  tags: [],
  draft: false,
  example: false,
  cover: "",
  coverAlt: "",
  videoUrl: "",
  steps: [
    {
      id: "step-1",
      title: "",
      body: "",
    },
  ],
  positivePrompt: "",
  includeNegativePrompt: false,
  negativePrompt: "",
  settings: [],
  tips: [],
  results: [],
  body: "",
  customFilename: "",
};
