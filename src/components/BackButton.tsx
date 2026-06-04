import {   IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function BackButton({ link, onClick }: { link?: string, onClick?: () => void }) {
    return (
      <IconButton size="small" href={link as string} onClick={onClick}>
        <ArrowBackIcon />
      </IconButton>
    )
}