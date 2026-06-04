import { ReactNode } from 'react';
import SidebarPaper from './SidebarPaper';
import SidebarStack from './SidebarStack';
import { Box } from '@mui/material';

export default function Sidebar({leftButton, rightButton, header, body}: {leftButton?: ReactNode, rightButton?: ReactNode,header?: ReactNode, body?: ReactNode}) {
  return (
    <SidebarPaper>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '40px auto 40px',
          alignItems: 'top',
          mb: 1
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
          <Box>
            { leftButton }
          </Box>
        </Box>   
        <Box>           
          {header}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
          <Box>
            { rightButton }
          </Box>
        </Box>   
      </Box>
      <SidebarStack>
        {body}
      </SidebarStack>
    </SidebarPaper>
  );
}