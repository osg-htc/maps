import Sidebar from "@/src/components/Sidebar";
import SidebarStack from "@/src/components/SidebarStack";
import { Card, CardActionArea, CardContent, Chip, Link, Stack, Typography } from "@mui/material";
import Image from 'next-image-export-optimizer';


export default async function Home() {
  return (
    <>
      <Sidebar>
        <SidebarStack>
          <Card
            key="ProjectMap"
            variant="outlined"
            sx={{
              borderRadius: 2,
              "&:hover": {
                borderColor: "primary.main",
              },
            }}
          >
            <Link underline="none" href='./projects'>
              <CardContent sx={{ p: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                  <Stack spacing={0.5}>
                    <Typography variant="h6" lineHeight={1.2}>
                      Projects Map
                    </Typography>
                    <Typography variant="subtitle2" color="secondary.main" lineHeight={1}>
                      A collection of maps for every project institution showing all of its contributing institutions
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
              </CardContent>
            </Link>
          </Card>
        </SidebarStack>
      </Sidebar>
    </>
  );
}
