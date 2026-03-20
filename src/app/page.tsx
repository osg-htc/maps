import { Box, Typography, Container } from "@mui/material";
import SplitView from "@/src/components/SplitView";

export default async function Home() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <SplitView></SplitView>
    </Box>
  );
}
