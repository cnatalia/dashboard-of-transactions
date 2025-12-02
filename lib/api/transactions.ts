/**
 * Server-side data fetching functions
 * These can be used in Server Components for initial data loading
 */

type Transaction = {
  id: string;
  status: string;
  paymentMethod: string;
  salesType: string;
  createdAt: number;
  transactionReference: number;
  amount: number;
  deduction?: number;
};

type ApiResponse = {
  data: Transaction[];
};

/**
 * Fetches transactions from the API
 * This function can be used in Server Components
 */
export async function getTransactions(): Promise<ApiResponse> {
  try {
    const response = await fetch('https://bold-fe-api.vercel.app/api', {
      // Next.js automatically deduplicates requests
      // Add cache options for better control
      next: { 
        revalidate: 60, // Revalidate every 60 seconds
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

/**
 * Type guard to check if response has expected structure
 */
export function isValidTransactionsResponse(data: unknown): data is ApiResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    Array.isArray((data as ApiResponse).data)
  );
}

