import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#F6F4F9',
        gap: '16px',
      }}
    >
      <CircularProgress 
        sx={{ 
          color: '#121E6C',
        }} 
        size={48}
      />
      <Typography 
        variant="body1" 
        sx={{ 
          color: '#606060',
        }}
      >
        Cargando...
      </Typography>
    </Box>
  );
}

