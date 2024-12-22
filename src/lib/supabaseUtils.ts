import { PostgrestError, PostgrestResponse } from '@supabase/supabase-js';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function retryableSupabaseRequest<T>(
  operation: () => Promise<PostgrestResponse<T>>,
  retries = MAX_RETRIES
): Promise<T[]> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { data, error } = await operation();
      
      if (error) {
        console.error(`Supabase error (attempt ${attempt}):`, error);
        throw error;
      }
      
      if (!data) {
        console.warn(`No data returned (attempt ${attempt})`);
        return [];
      }
      
      return Array.isArray(data) ? data : [data];
    } catch (err) {
      if (attempt === retries) {
        throw err;
      }
      
      console.warn(`Attempt ${attempt} failed, retrying in ${RETRY_DELAY * attempt}ms...`);
      await delay(RETRY_DELAY * attempt);
    }
  }
  
  throw new Error('All retry attempts failed');
}