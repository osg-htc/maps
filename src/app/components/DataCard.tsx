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
        left: shifted ? '90%' : '0.5%',
        transition: 'left 0.3s ease-in-out',
        zIndex: 2,
        placeItems: 'center',
        justifyContent: 'center',
        height: '60px',
      }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'darkorange', fontSize: 14}}>
          Institutions: {numberOfInstitutions}
        </Typography>

        {numberOfProjects && <Typography gutterBottom sx={{ color: 'darkorange', fontSize: 14}}>
          Projects: {numberOfProjects}
        </Typography>}
      </CardContent>
    </Card>
  );
};


export default DataCard;