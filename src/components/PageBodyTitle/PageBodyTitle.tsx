import React from "react";
import { Box, Button, Grid } from "@material-ui/core";
import { AddCircle as AddCircleIcon } from "@material-ui/icons";

interface IProps {
  title: string;
  onAddNew?: () => void;
}

const PageBodyTitle = ({ title, onAddNew = () => {} }: IProps) => {
  return (
    <Box height={45} mt={3} mb={1}>
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Grid item>
          <Box fontSize={24} fontWeight={900} color={"primary.main"}>
            {title}
          </Box>
        </Grid>

        <Grid item>
          <Button
            disableElevation
            color={"primary"}
            onClick={onAddNew}
            variant={"contained"}
            startIcon={<AddCircleIcon />}
          >
            Add New
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PageBodyTitle;
