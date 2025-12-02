import { Skeleton } from '@mui/material';

export default function SalesSummaryCardSkeleton() {
  return (
    <div className="flex items-center flex-col md:w-2/3 w-full gap-4 rounded-lg bg-white pb-2 shadow-lg">
      {/* Header skeleton */}
      <div className="text-white bg-bold-gradient text-sm w-full p-3 rounded-t-lg flex items-center justify-between">
        <Skeleton 
          variant="text" 
          width={180} 
          height={20}
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
          }}
        />
        <Skeleton 
          variant="circular" 
          width={20} 
          height={20}
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.3)',
          }}
        />
      </div>
      
      {/* Amount skeleton */}
      <Skeleton 
        variant="text" 
        width={200} 
        height={48}
        sx={{ 
          bgcolor: '#E0E0E0',
          borderRadius: '4px',
        }}
      />
      
      {/* Date text skeleton */}
      <Skeleton 
        variant="text" 
        width={150} 
        height={20}
        sx={{ 
          bgcolor: '#E0E0E0',
          borderRadius: '4px',
        }}
      />
    </div>
  );
}

