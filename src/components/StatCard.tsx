import { Paper, Typography } from '@mui/material';
import { formatNumber } from '@/src/utils/formatters';

export type StatCardProps = {
  label: string;
  value: number;
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <Paper elevation={3} sx={{
      p: 4,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      bgcolor: '#0a1725',
      border: '2px solid rgba(255,255,255,0.1)'
    }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
        {label}
      </Typography>
      <Typography variant="h2" sx={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>
        {formatNumber(value)}
      </Typography>
    </Paper>
  );
}
