import React from "react";
import { Link } from "react-router-dom";
import { Box, Grid } from "@material-ui/core";
import {
  StyledButton,
  StyledGrid,
  StyledTypography,
} from "@components/ui/system";

const NotFound = () => {
  return (
    <StyledGrid
      mt={10}
      container
      height={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Grid item>
        <Box textAlign={"center"}>
          <StyledTypography mb={2} fontWeight={700} fontSize={150}>
            Oops!
          </StyledTypography>

          <StyledTypography variant={"h4"} fontWeight={700}>
            404 - PAGE NOT FOUND
          </StyledTypography>

          <StyledButton
            mt={2}
            px={5}
            py={1}
            // @ts-ignore
            to={"/"}
            component={Link}
            color={"primary"}
            borderRadius={23}
            variant={"contained"}
          >
            Go to homepage
          </StyledButton>
        </Box>
      </Grid>
    </StyledGrid>
  );
};

export default NotFound;
