import React from "react";
import { Badge, IconButton, Tooltip } from "@mui/material";

const LeftBoxIcon = ({ num = 0, icon, title }) => {
  return (
    <>
      {num == 0 ? (
        <Tooltip title={title}>
          <IconButton>{icon}</IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={title}>
          <IconButton>
            <Badge badgeContent={num} color="error">
              {icon}
            </Badge>
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

export default LeftBoxIcon;
