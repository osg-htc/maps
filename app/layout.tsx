import type { Metadata } from "next";

import {Box, Grid, Stack} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { PlayArrow } from '@mui/icons-material';


import theme, {fonts} from "@chtc/web-components/themes/chtc"

import "./globals.css"
import Analytics from "@/components/Analytics";
import Map from "@/components/Map";
import Statistics from "@/components/Statistics";

export const metadata: Metadata = {
  title: "Website Template",
  description: "Website template for CHTC projects",
	metadataBase: new URL(`https://${process.env.HOSTNAME}`),
};

const pages = [
	{ label: 'Home Page', path: '/', icon: <PlayArrow /> },
]

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
            <Grid container sx={{ height: '100vh' }}>
              <Grid size={6}>
                <Box sx={{ height: "100%" }} >
                  <Statistics></Statistics>
                </Box>
              </Grid>
              <Grid size={6}>
                <Box sx={{ height: "100%" }} >
                  <Map>
                    {children}
                  </Map>
                </Box>
              </Grid>
            </Grid>
          </ThemeProvider>
        </Box>
      </AppRouterCacheProvider>
    </html>
  );
}
