import CenterOverlay from "@/src/components/CenterOverlay";
import { Link } from "@mui/material";

export default async function Home() {

  return (
    <>
      <CenterOverlay>
        <Link href="./projects">Projects</Link>
      </CenterOverlay>
    </>
  );
}
