import type { Metadata } from "next";

import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import theme, {fonts} from "@chtc/web-components/themes/osg"

import "@/src/app/globals.css"
import Analytics from "@/src/components/Analytics";
import BaseMap from "@/src/components/BaseMap";

export const metadata: Metadata = {
  title: "Website Template",
  description: "Website template for CHTC projects",
	metadataBase: new URL(`https://${process.env.HOSTNAME}`),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fonts.map(font => font.className).join(' ')}>
			{ process.env.NEXT_PUBLIC_MATOMO_URL && process.env.NEXT_PUBLIC_MATOMO_SITE_ID &&
				<Analytics url={process.env.NEXT_PUBLIC_MATOMO_URL} siteId={process.env.NEXT_PUBLIC_MATOMO_SITE_ID} />
			}
      <AppRouterCacheProvider>
        <Box component={"body"} sx={{ margin: 0, padding: 0 }}>
          <ThemeProvider theme={theme}> 
            <Box sx={{ position: 'relative', width: '100vw', height: '100vh', bgcolor: "background.default" , display: "flex", flexDirection: "row"}}>
              <Box sx={{height: '100vh', width: "30vw"}}>

              </Box>
              <Box sx={{height: '100vh', width: "70vw"}}>
                <BaseMap>
                  {children}
                </BaseMap>
              </Box>
            </Box>
          </ThemeProvider>
        </Box>
      </AppRouterCacheProvider>
    </html>
  );
}
