/**
 * Server-side data fetching functions
 * These can be used in Server Components for initial data loading
 */

import type { ApiResponse } from './format-transactions';
import { TRANSACTIONS_ENDPOINT } from './config';

// Re-export types for convenience
export type { ApiResponse } from './format-transactions';

/**
 * Fetches transactions from the API
 */
export async function getTransactions(): Promise<ApiResponse> {
  try {
    const response = await fetch(TRANSACTIONS_ENDPOINT, {
      next: { 
        revalidate: 60, 
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

