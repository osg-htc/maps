import type { Metadata } from "next";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import theme, {fonts} from "@chtc/web-components/themes/osg"
import "@/src/app/globals.css"
import Analytics from "@/src/components/Analytics";
import BaseMap from "@/src/components/BaseMap";
import { Suspense } from "react";
import LoadingScreen from "../components/LoadingScreen";
import LogoContainer from "../components/LogoContainer";
import LinkLogoImage from "../components/LinkLogoImage";

export const metadata: Metadata = {
  title: "Maps",
  description: 'A collection of maps',
  metadataBase: new URL(`https://${process.env.HOSTNAME}`),
  openGraph: {
    title: 'Maps',
    description: 'A collection of maps',
    type: 'website',
    url: `https://${process.env.HOSTNAME}/maps/`,
    images: [
      {
        url: '/maps/images/globe-thumbnail-wide.png',
        width: 1200,
        height: 630,
        alt: 'A blank globe'
      }
    ]
  }
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
            <Box sx={{ position: 'relative', width: '100vw', height: '100vh', bgcolor: "background.default" }}>
              <Suspense fallback={<LoadingScreen />}>
                <BaseMap>
                  {children}
                  <LogoContainer>
                    <LinkLogoImage src={'/maps/images/OSDF_logo_round.png'} alt={'OSDF logo'} href={'https://osg-htc.org/services/osdf'} size={75} />
                    <LinkLogoImage src={'/maps/images/OSPool_logo_round.png'} alt={'OSPool logo'} href={'https://osg-htc.org/services/ospool/'} size={75} />
                    <LinkLogoImage src={'/maps/images/PATh_logo_round.png'} alt={'PATh logo'} href={'https://path-cc.io/'} size={75} />
                  </LogoContainer>
                </BaseMap>
              </Suspense>
            </Box>
          </ThemeProvider>
        </Box>
      </AppRouterCacheProvider>
    </html>
  );
}
