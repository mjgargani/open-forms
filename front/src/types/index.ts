export type OptionType = 'INPUT' | 'MARKDOWN';
export type QuestionType = 'DISCURSIVE' | 'SINGLE' | 'MULTIPLE';

export interface Option {
  id: string;
  description: string;
  type: OptionType;
  correct?: boolean;
  questionId: string;
}

export interface Question {
  id: string;
  title: string;
  formId: string;
  type: QuestionType;
  required?: boolean;
  options: Option[];
}

export interface Form {
  id: string;
  title: string;
  type: QuestionType;
  description?: string;
  active?: boolean;
  published?: boolean;
  questions: Question[];
}