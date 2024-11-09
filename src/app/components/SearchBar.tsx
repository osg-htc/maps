import {useState} from "react";
import useFuse from "../helpers/useFuse";
import {ClickAwayListener, List, ListItem, ListItemText, Paper, TextField} from "@mui/material";

interface SearchBarProps {
    institutions: any[],
    onSelectInstitution: (institution: any) => void,
}

const SearchBar: React.FC<SearchBarProps> = ({institutions, onSelectInstitution}) => {
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
        <>
            <TextField
                type="text"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Search for an institution..."

            />
            {open && searchTerm && (
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Paper elevation={3} style={{ maxHeight: 200, overflow: 'auto', marginTop: 8 }}>
                        <List>
                            {filteredInstitutions.length > 0 ? (
                                filteredInstitutions.map((institution) => (
                                    <ListItem
                                        key={institution.id}
                                        onClick={() => handleSelect(institution)}
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
        </>
    )



}


export default SearchBar;