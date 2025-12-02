import { Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function TransactionsTableSkeleton() {
  // Número de filas y columnas skeleton a mostrar
  const skeletonRows = 3;
  const skeletonColumns = 6;

  return (
    <div className="border border-boldGrayLight bg-white overflow-hidden">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                height: "15px",
                padding: "4px 0",
                width: "4px",
                minWidth: "4px",
                maxWidth: "4px",
              }}
            />
            {Array.from({ length: skeletonColumns }).map((_, col) => (
              <TableCell
                key={col}
                sx={{
                  height: "15px",
                  padding: "4px 16px",
                }}
              >
                <Skeleton 
                  variant="text" 
                  width="60%" 
                  height={14}
                  sx={{ bgcolor: '#E0E0E0' }}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell
                sx={{
                  width: "2px",
                  minWidth: "2px",
                  maxWidth: "2px",
                  padding: 0,
                  backgroundColor: rowIndex % 2 === 0 ? "#121E6C" : "#A1A1A0",
                }}
              />
              {Array.from({ length: skeletonColumns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton 
                    variant="text" 
                    width="80%" 
                    height={16}
                    sx={{ bgcolor: '#E0E0E0' }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="flex justify-between items-center p-3 border-t">
        <Skeleton 
          variant="rectangular" 
          width={80} 
          height={32}
          sx={{ bgcolor: '#E0E0E0', borderRadius: '4px' }}
        />
        <Skeleton 
          variant="text" 
          width={100} 
          height={16}
          sx={{ bgcolor: '#E0E0E0' }}
        />
        <Skeleton 
          variant="rectangular" 
          width={80} 
          height={32}
          sx={{ bgcolor: '#E0E0E0', borderRadius: '4px' }}
        />
      </div>
    </div>
  );
}

