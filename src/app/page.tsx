import Sidebar from "@/src/components/Sidebar";
import { Stack, Typography } from "@mui/material";
import Image from 'next-image-export-optimizer';
import ListCardBase from "../components/ListCardBase";


export default async function Home() {
  return (
    <Sidebar body={
      <>
        <ListCardBase listKey="projectMap" link="./projects">
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Stack spacing={0.5}>
              <Typography variant="h6" lineHeight={1.2}>
                Projects Map
              </Typography>
              <Typography variant="subtitle2" color="secondary.main" lineHeight={1}>
                A map of active OSPool projects showing and the institutions that provided resources to it
              </Typography>
            </Stack>
            <Image
              src="/maps/images/project-map-thumbnail.png"
              alt="Project Map Thumbnail"
              width={100}
              height={100}
              style={{
                borderRadius: 16
              }}
            />
          </Stack>
        </ListCardBase>
        <ListCardBase listKey="institutionsMap" link="./institutions">
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Stack spacing={0.5}>
              <Typography variant="h6" lineHeight={1.2}>
                Institution Map
              </Typography>
              <Typography variant="subtitle2" color="secondary.main" lineHeight={1}>
                A map of institutions in the OSPool and the projects they contribute to
              </Typography>
            </Stack>
            <Image
              src="/maps/images/project-map-thumbnail.png"
              alt="Institution Map Thumbnail"
              width={100}
              height={100}
              style={{
                borderRadius: 16
              }}
            />
          </Stack>
        </ListCardBase>
      </>
    } />
  );
}
