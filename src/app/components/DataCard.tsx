import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControlLabel, Switch, Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { useState } from 'react';

type DataCardProps = {
  institutionsLabel?: string;
  numberOfInstitutions: number;
  projectsLabel?: string;
  numberOfProjects?: number;
  shifted: boolean;
}

const DataCard: React.FC<DataCardProps> = ({institutionsLabel, projectsLabel, numberOfProjects, numberOfInstitutions, shifted  }) => {
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
            xs: '96%',
            sm: '48%',
            md: '34%',
            lg: '28%',
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
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {numberOfProjects &&
            <Tooltip title="Number of OSPool Projects Active in last year" arrow placement='right-end'>
              <Typography
                gutterBottom
                sx={{
                  color: 'darkorange',
                  fontSize: 14,
                  '&:hover': {
                    color: 'black',
                  },
                }}>
                {projectsLabel || "Projects:"} {numberOfProjects}
              </Typography>
            </Tooltip>}
          <Tooltip title="Number of institutions associated with active projects" arrow placement='right-end'>
            <Typography
                gutterBottom
                sx={{
                  color: 'darkorange',
                  fontSize: 14,
                  '&:hover': {
                    color: 'black',
                  },
                  marginRight: 1,
                  justifyContent: 'center',
                }}>
              {institutionsLabel || "Institutions:"} {numberOfInstitutions}
            </Typography>
          </Tooltip>
        </CardContent>

        <CardActions sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          paddingTop: '4px',
        }}>
          <Tooltip title="osg-htc.org" arrow placement='top'>
            <Button
              variant="contained"
              href="https://osg-htc.org/ospool"
              sx={{
                fontSize: 10,
                padding: '10px 16px',
                backgroundColor: 'darkorange',
                '&:hover': {
                  backgroundColor: 'black',
                },
                width: '60%',
                height: '30px',
              }}>
              OSPool
            </Button>
          </Tooltip>
        </CardActions>
      </Card>
    </Box>
  );
};

export default DataCard;
