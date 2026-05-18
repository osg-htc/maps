import { Box, IconButton, Link } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function BackButton({ link, onClick }: { link?: string, onClick?: () => void }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.5 }}>
      <Link href={link}>
        <IconButton size="small" onClick={onClick}>
          <ArrowBackIcon />
        </IconButton>
      </Link>
    </Box>
  );
}