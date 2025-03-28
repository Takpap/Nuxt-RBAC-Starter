import { H3Event } from 'h3';
import { errorHandler } from '../utils/errors';

export default defineEventHandler((event: H3Event) => {
  event.context.error = (error: any) => {
    return errorHandler(error);
  };
}); 