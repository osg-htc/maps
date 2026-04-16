import { Card, CardContent, CardActionArea, Link } from '@mui/material';
import { ReactNode } from 'react';

export default function ListCardBase({ children, listKey, onClick, link }: { children: ReactNode, listKey: string, onClick?: () => void, link?: string }) {
  return (
    <Card
      key={listKey}
      variant="outlined"
      sx={{
        borderRadius: 2,
        "&:hover": {
          borderColor: "primary.main",
        },
      }}
    >
      <Link underline='none' href={ link ?? "" }>
        <CardActionArea onClick={onClick}>
          <CardContent sx={{ p: 1.5 }}>
            { children }
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )   
}