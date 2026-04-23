'use client'

import { IconButton, Popover } from "@mui/material";
import { ReactNode, useState } from "react";

export default function DropdownPopover({ icon, children }: {icon: ReactNode, children: ReactNode }) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <IconButton size="small" onClick={handleClick} aria-describedby={id}>
        {icon}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          zIndex: 3100
        }}
      >
        {children}
      </Popover>
    </>
  );
}