export type ActiveTab = 'studio' | 'improve' | 'library' | 'history' | 'settings';

export type OutputType =
  | 'web_app'
  | 'mobile_app'
  | 'frontend'
  | 'backend'
  | 'image'
  | 'video'
  | 'text'
  | 'marketing'
  | 'research'
  | 'pdf'
  | 'ppt'
  | 'code';

export type TargetPlatform =
  | 'auto'
  | 'chatgpt'
  | 'claude'
  | 'cursor'
  | 'midjourney'
  | 'runway'
  | 'lovable'
  | 'v0'
  | 'flutter';

export type PromptDepth = 'quick' | 'pro' | 'expert' | 'creative' | 'dev';

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category:
    | 'code'
    | 'web_app'
    | 'mobile_app'
    | 'frontend'
    | 'backend'
    | 'marketing'
    | 'image'
    | 'video'
    | 'research'
    | 'pdf'
    | 'ppt'
    | 'ecommerce'
    | 'academic'
    | 'text';
  platform: string;
  authorEngine: string;
  rating: number;
  usesCount: string;
  tokens: number;
  tags: string[];
  imageUrl?: string;
  imageAlt?: string;
  imageSpecs?: string;
  codeSnippet: string;
  fullPrompt?: string;
  hookFormula?: string;
  temperature?: number;
  isBookmarked?: boolean;
}

export interface PromptSynthesis {
  originalInput: string;
  detectedLanguage: string;
  materialType?: OutputType;
  fidelity: number;
  tokenCount: number;
  decodedIntent: string;
  intentCode: string;
  extractedRequirements: string[];
  smartAssumptions: string[];
  qualityScore: {
    overall: number;
    grade: string;
    readyPercent: number;
    clarity: number;
    specificity: number;
    context: number;
    constraints: number;
    platformFit: number;
  };
  versions: {
    simple: string;
    pro: string;
    expert: string;
  };
  activeVersion: 'simple' | 'pro' | 'expert';
  targetStack: string;
  tokensTotal: number;
  isBookmarked?: boolean;
}

export interface DiagnosticIssue {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'moderate' | 'low';
}

export interface DiagnosticResult {
  sourcePrompt: string;
  targetPlatform: string;
  charCount: number;
  tokenCount: number;
  flaws: DiagnosticIssue[];
  scoreBefore: number;
  scoreAfter: number;
  improvementPts: number;
  synthesizedTime: string;
  enhancedPrompt: {
    role: string;
    techStack: string;
    requirements: string;
    designSystem: string;
    fullFormatted: string;
  };
  enhancedTokens: number;
}
