import Sidebar from "@/src/components/Sidebar";
import SidebarStack from "@/src/components/SidebarStack";
import { Stack, Typography } from "@mui/material";
import Image from 'next-image-export-optimizer';
import ListCardBase from "../components/ListCardBase";


export default async function Home() {
  return (
    <>
      <Sidebar>
        <SidebarStack>
          <ListCardBase listKey="projectMap" link="./projects">
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
              <Stack spacing={0.5}>
                <Typography variant="h6" lineHeight={1.2}>
                  Projects Map
                </Typography>
                <Typography variant="subtitle2" color="secondary.main" lineHeight={1}>
                  A collection of maps for every active OSPool project showing institutions that provided resources to it
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
        </SidebarStack>
      </Sidebar>
    </>
  );
}
