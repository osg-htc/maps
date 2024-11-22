import { useMemo, useState } from 'react';
import useFuse from '../helpers/useFuse';
import {
  Box,
  ClickAwayListener,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel, Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
// @ts-ignore
import { Institution, SearchBarProps } from '@/types/mapTypes';
import useTheme from '@mui/material/styles/useTheme';
import { Project } from '@/app/types/mapTypes';

const SearchBar: React.FC<SearchBarProps> = ({ institutions, onSelectInstitution, shifted = false, onFilterUpdate}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    fieldOfScience: [],
    department: [],
    piName: [],
  });

  const filteredInstitutions = useFuse(institutions, searchTerm, { keys: ['name'] });
  const theme = useTheme();
  const isMediumUp = useMediaQuery(theme.breakpoints.up('md'));
  const isSmallDown = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSelect = (institution: Institution) => {
    setSearchTerm(institution.name);
    onSelectInstitution(institution);
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setOpen(true);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const handleLeftPosition = () => {
    if (isMediumUp) {
      return shifted ? '45%' : '0.5%';
    } else if (isSmallDown) {
      return shifted ? '45%' : '2%';
    } else {
      return shifted ? '45%' : '0.5%';
    }
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (category: string, value: string) => {
    setSelectedFilters((prevFilters) => {
      const categoryFilters = prevFilters[category] || [];
      const updatedFilters = categoryFilters.includes(value)
        ? categoryFilters.filter((item) => item !== value)
        : [...categoryFilters, value];

      const newFilters = {
        ...prevFilters,
        [category]: updatedFilters,
      }

      onFilterUpdate(newFilters);
      return newFilters
    });
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '10px',
        left: handleLeftPosition(),
        transition: 'left 0.3s ease-in-out',
        zIndex: 2,
      }}
    >
      <TextField
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search for an institution here"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Filter" arrow>
                <IconButton onClick={handleFilterClick}>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
        sx={{
          width: '350px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            '&:hover fieldset': {
              borderColor: '#999',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#007bff',
            },
          },
        }}
      />
      {open && searchTerm && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper elevation={3} sx={{ maxHeight: 200, overflow: 'auto', marginTop: 1 }}>
            <List>
              {filteredInstitutions.length > 0 ? (
                filteredInstitutions.map((institution: Institution) => (
                  <ListItem
                    key={institution.id}
                    onClick={() => handleSelect(institution)}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    <ListItemText primary={institution.name} />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No results found" />
                </ListItem>
              )}
            </List>
          </Paper>
        </ClickAwayListener>
      )}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        <MenuItem>
          <Box>
            <strong>Field of Science</strong>
            {' '}{['Neuroscience', 'Computer Science', 'Physics'].map((field) => (
              <FormControlLabel
                key={field}
                control={
                  <Checkbox
                    checked={selectedFilters.fieldOfScience.includes(field)}
                    onChange={() => handleFilterChange('fieldOfScience', field)}
                  />
                }
                label={field}
              />
            ))}
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <strong>Department</strong>
            {' '}{['Department A', 'Department B', 'Department C'].map((department) => (
              <FormControlLabel
                key={department}
                control={
                  <Checkbox
                    checked={selectedFilters.department.includes(department)}
                    onChange={() => handleFilterChange('department', department)}
                  />
                }
                label={department}
              />
            ))}
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <strong>PI Name</strong>
            {' '}{['PI 1', 'PI 2', 'PI 3'].map((piName) => (
              <FormControlLabel
                key={piName}
                control={
                  <Checkbox
                    checked={selectedFilters.piName.includes(piName)}
                    onChange={() => handleFilterChange('piName', piName)}
                  />
                }
                label={piName}
              />
            ))}
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SearchBar;
