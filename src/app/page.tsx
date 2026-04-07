import CenterOverlay from "@/src/components/CenterOverlay";
import DisableMapControls from "@/src/components/DisableMapControls";
import { Link } from "@mui/material";

export default async function Home() {

  return (
    <>
      <DisableMapControls />
      <CenterOverlay>
        <Link href="./projects">Projects</Link>
      </CenterOverlay>
    </>
  );
}
