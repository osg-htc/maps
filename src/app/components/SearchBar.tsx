import {useState} from "react";
import useFuse from "../helpers/useFuse";
import {Box, ClickAwayListener, InputAdornment, List, ListItem, ListItemText, Paper, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
    institutions: any[];
    onSelectInstitution: (institution: any) => void;
    shifted?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ institutions, onSelectInstitution, shifted = false }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const filteredInstitutions = useFuse(institutions, searchTerm, { keys: ['name'] });

    const handleSelect = (institution: any) => {
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

    return (
        <Box
            sx={{
                position: 'absolute',
                top: '2px',
                left: shifted ? '620px' : '16px',
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
                                filteredInstitutions.map((institution) => (
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