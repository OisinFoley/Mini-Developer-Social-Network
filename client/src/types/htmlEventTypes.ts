import { ChangeEvent } from 'react';

export type SetProfileFormChangeEvent = 
  ChangeEvent<HTMLInputElement>
  | ChangeEvent<HTMLSelectElement>
  | ChangeEvent<HTMLTextAreaElement>;