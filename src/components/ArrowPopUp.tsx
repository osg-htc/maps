import { ReactNode } from "react";
import { Card } from '@mui/material';

function ArrowPopUp({children}: {children: ReactNode}) {

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        mt: 1.5, 
        padding: 1,
        zIndex: 1000,
        overflow: 'visible',
        // Tooltip arrow
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          width: 12,
          height: 12,
          bgcolor: 'background.paper',
          transform: 'translate(-50%, -50%) rotate(45deg)',
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
