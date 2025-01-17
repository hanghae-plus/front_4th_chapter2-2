import { setupServer } from 'msw/node';
import { handler } from './handler.ts';

export const server = setupServer(...handler);
