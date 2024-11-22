import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControlLabel, Switch,
  Typography,
  useMediaQuery,
} from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { useState } from 'react';

type DataCardProps = {
  numberOfInstitutions: number;
  shifted: boolean;
  numberOfProjects?: number;
}

const DataCard: React.FC<DataCardProps> = ({ numberOfInstitutions, shifted, numberOfProjects }) => {
  const theme = useTheme();
  const [page, setPage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.includes('projects') ? 'projects' : 'institutions';
    }
    return 'institutions';
  }); // 'institutions' or 'projects'
  const handlePageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = event.target.checked ? 'institutions' : 'projects';
    setPage(newPage);
    window.history.pushState({}, '', `/maps/${newPage}`);
    window.location.reload();
  };

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
            xs: '70%',
            sm: '38%',
            md: '28%',
            lg: '24%',
            xl: '15%',
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
            title='Number of institutions'
            gutterBottom
            sx={{
              color: 'darkorange',
              fontSize: 14,
              '&:hover': {
                color: 'black',
              },
              marginRight: 1,
            justifyContent: 'center'}}>
            Institutions: {numberOfInstitutions}
          </Typography>

          {numberOfProjects &&
            <Typography
              title='Number of Projects'
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

        <CardActions sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          paddingTop: '4px'
        }}>
          <Button title='osg-htc.org'
            variant="contained"
                  href="https://osg-htc.org/"
                  sx={{
                    fontSize: 10,
                    padding: '10px 16px',
                    backgroundColor: 'darkorange',
                    '&:hover': {
                      backgroundColor: 'black',
                    },
                    width: '60%',
                    height: '20px'
                  }}>
            OSPOOL
          </Button>
          <FormControlLabel
            title= 'Toggle between institutions and projects pages'
            control={
              <Switch
                checked={page === 'institutions'}
                onChange={handlePageChange}
                name="pageSwitch"
                size='small'
                color='warning'
                sx={{
                  color: 'darkorange',
                  fontSize: 5,
                }}
              />
            }
            label={page === 'institutions' ? "Institutions" : "Projects"}
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '14px',
              },
              '&:hover': {
                color: 'black',
              },
              width: '100%',
              color: 'darkorange',
              margin: 0,
              height: '20px',
              justifyContent: 'center',
            }}
          />
        </CardActions>
      </Card>
    </Box>
  );
};

export default DataCard;
