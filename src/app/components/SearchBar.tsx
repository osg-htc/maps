import {useState} from "react";
import useFuse from "../helpers/useFuse";
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
// @ts-ignore
import {Institution, SearchBarProps} from "@/types/mapTypes";
import useTheme from '@mui/material/styles/useTheme';


const SearchBar: React.FC<SearchBarProps> = ({ institutions, onSelectInstitution, shifted = false }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const filteredInstitutions = useFuse(institutions, searchTerm, { keys: ['name'] });
    const theme = useTheme();
    const isMediumUp = useMediaQuery(theme.breakpoints.up('md'));
    const isSmallDown = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSelect = (institution: Institution) => {
        setSearchTerm(institution.name);
        onSelectInstitution(institution);
        setOpen(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setOpen(true);
    }

    const handleClickAway = () => {
        setOpen(false);
    }

    const handleLeftPosition = () => {
      if(isMediumUp){
        return shifted ? '45%' : '0.5%';
      } else if(isSmallDown){
        return shifted ? '45%' : '2%';
      } else{
        return shifted ? '45%' : '0.5%';
      }
    }

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
                }}
                sx={{
                    width: '300px',
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
        </Box>
    );
}

export default SearchBar;