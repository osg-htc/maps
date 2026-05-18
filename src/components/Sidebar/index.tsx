import { ReactNode } from 'react';
import SidebarPaper from './SidebarPaper';
import SidebarHeader from './SidebarHeader';
import SidebarStack from './SidebarStack';

export default function Sidebar({header, body}: {header?: ReactNode, body?: ReactNode}) {
  return (
    <SidebarPaper>
      {header ? 
        <SidebarHeader>
          { header }
        </SidebarHeader>
        : ""
      }
      {body ?
        <SidebarStack>
          {body}
        </SidebarStack>
        : ""
      }
    </SidebarPaper>
  );
}