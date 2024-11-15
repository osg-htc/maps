import { Button, Card, CardActions, CardContent, Typography, useMediaQuery } from '@mui/material';

type DataCardProps = {
  numberOfInstitutions: number;
  shifted: boolean;
  numberOfProjects?: number;
}

const DataCard: React.FC<DataCardProps> = ({ numberOfInstitutions, shifted, numberOfProjects }) => {
  const isMobile = useMediaQuery('(max-width: 600px)');

  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        position: 'absolute',
        bottom: '35px',
        left: shifted ? (isMobile ? '50%' : '89%') : '0.5%',
        transition: 'left 0.6s ease-in-out',
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        height: '60px',
        borderRadius: '8px',
      }}>
      <CardContent sx={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: 'center' }}>
        <Typography
          gutterBottom
          sx={{
            color: 'darkorange',
            fontSize: 14,
            '&:hover': {
              color: 'black',
            },}}>
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
  );
};


export default DataCard;