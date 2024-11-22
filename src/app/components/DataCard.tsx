import { Box, Button, Card, CardActions, CardContent, Typography, useMediaQuery } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';

type DataCardProps = {
  numberOfInstitutions: number;
  shifted: boolean;
  numberOfProjects?: number;
}

const DataCard: React.FC<DataCardProps> = ({ numberOfInstitutions, shifted, numberOfProjects }) => {
  const theme = useTheme();

  return (
    <Box>
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        position: 'absolute',
        bottom: theme.breakpoints.down('sm') ? '30px' : '35px',
        left: shifted
          ? {
            xs: '50%',
            sm: '78%',
            md: '85%',
            lg: '88%',
            xl: '91%',
          }
          : {
            xs: '2%',
            sm: '0.5%',
            md: '0.5%',
            lg: '0.5%',
            xl: '0.5%',
          },
        width: {
          xs: '95%',
          sm: '47%',
          md: '32%',
          lg: '24%',
          xl: '19%',
        },
        transform: theme.breakpoints.down('sm') && shifted ? 'translateX(-50%)' : 'none',
        transition: 'left 0.6s ease-in-out',
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        height: '60px',
        borderRadius: '8px',
      }}>
      <CardContent sx={{
        display: 'flex',
        flexDirection: {
          xs: 'row',
          sm: 'column',
        },
        alignItems: 'center',
      }}>
        <Typography
          gutterBottom
          sx={{
            color: 'darkorange',
            fontSize: 14,
            '&:hover': {
              color: 'black',
            },
          marginRight: 1}}>
          Institutions: {numberOfInstitutions}
        </Typography>

        {numberOfProjects &&
          <Typography
            gutterBottom
            sx={{
              color: 'darkorange',
              fontSize: 14,
              '&:hover': {
                color: 'black',
              },
            }}>
          Projects: {numberOfProjects}
        </Typography>}
      </CardContent>

      <CardActions>
        <Button variant="contained"
                href="https://osg-htc.org/"
                sx={{
                  fontSize: 10,
                  padding: '10px 8px',
                  backgroundColor: 'darkorange',
                  '&:hover': {
                    backgroundColor: 'black',
                  },
                }}>
          Open Science Grid
        </Button>
      </CardActions>
    </Card>
    </Box>
  );
};


export default DataCard;