import { ReactNode } from "react";
import { Card } from '@mui/material';

function ArrowPopUp({children, left}: {children: ReactNode, left?: boolean}) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        position: 'absolute',
        top: left ? '10%' : '100%',
        left: left ? '125%' : '50%',
        transform: left ? 'translateY(-50%)' :'translateX(-50%)',
        mt: 1.5, 
        padding: 1,
        zIndex: 10001,
        overflow: 'visible',
        // Tooltip arrow
        '&::before': {
          content: '""',
          position: 'absolute',
          top: left ? '50%' : 0,
          left: left ? 0 : '50%',
          width: 12,
          height: 12,
          bgcolor: 'background.paper',
          transform: left ? 'translate(-50%, -50%) rotate(-45deg)' : 'translate(-50%, -50%) rotate(45deg)',
          borderTopLeftRadius: '2px',
          borderTop: '1px solid',
          borderLeft: '1px solid',
          borderColor: 'divider',
          zIndex: -1, 
        }
      }}
    >
      {children}
    </Card>
  )
}

export default ArrowPopUp;
