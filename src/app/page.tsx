import { Box, Typography, Container } from "@mui/material";
import SplitViewController from "@/src/components/SplitViewController";

export default async function Home() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <SplitViewController></SplitViewController>
    </Box>
  );
}
