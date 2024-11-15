import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';

type DataCardProps = {
  numberOfInstitutions: number;
  shifted: boolean;
  numberOfProjects?: number;
}

const DataCard: React.FC<DataCardProps> = ({ numberOfInstitutions, shifted, numberOfProjects }) => {


  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        position: 'absolute',
        bottom: '35px',
        left: shifted ? '84%' : '0.5%',
        transition: 'left 0.6s ease-in-out',
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        height: '60px',
        borderRadius: '8px'
      }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography gutterBottom sx={{ color: 'black', fontSize: 14}}>
          Institutions: {numberOfInstitutions}
        </Typography>

        {numberOfProjects && <Typography gutterBottom sx={{ color: 'black', fontSize: 14}}>
          Projects: {numberOfProjects}
        </Typography>}
      </CardContent>

      <CardActions>
        <Button variant="contained" href="https://osg-htc.org/" sx={{fontSize: 10, padding: '10px 8px', backgroundColor: 'darkorange'}}>
          Open Science Grid
        </Button>
      </CardActions>
    </Card>
  );
};


export default DataCard;