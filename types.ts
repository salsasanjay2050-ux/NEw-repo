
export interface VideoScriptPart {
  timestamp: string;
  content: string;
}

export interface VideoScript {
  hook: string;
  mainExplanation: VideoScriptPart[];
  cta: string;
}

export interface MCQ {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface MLTContent {
  videoScript: VideoScript;
  imagePrompts: string[];
  practiceMCQs: MCQ[];
  onScreenText: string[];
}

export enum LanguageStyle {
  ENGLISH = 'English',
  HINGLISH = 'Hinglish'
}
