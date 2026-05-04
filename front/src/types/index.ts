// src/types/index.ts

export type OptionType = 'INPUT' | 'MARKDOWN';
export type QuestionType = 'DISCURSIVE' | 'SINGLE' | 'MULTIPLE';

export interface Option {
  id: string;
  active?: boolean;
  description: string;
  type: OptionType;
  correct?: boolean;
  questionId: string;
}

export interface Question {
  id: string;
  active?: boolean;
  title: string;
  formId: string;
  required?: boolean;
  options: Option[];
}

export interface Form {
  id: string;
  title: string;
  type: QuestionType;
  description?: string;
  active?: boolean;
  questions: Question[];
}