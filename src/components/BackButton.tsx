import { Box, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function BackButton({ link, onClick }: { link?: string, onClick?: () => void }) {

    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.5 }}>
        <Box>
          <IconButton size="small" href={link as string} onClick={onClick}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
      </Box>
    )
}