import { Box, Divider, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent } from "@mui/material";
import { US_STATES } from "@/src/utils/helpers"

export type ClassificationFilterMode = "All" | "NonR1"
export type StateFilterMode = "All" | "EPSCOR" | "Specific";

interface FilterMenuContentProps {
  classificationFilterMode: ClassificationFilterMode;
  setClassificationFilterMode: (mode: ClassificationFilterMode) => void;
  stateFilterMode: StateFilterMode;
  setStateFilterMode: (mode: StateFilterMode) => void;
  chosenState: string;
  setChosenState: (state: string) => void;
}

export default function FilterMenuContent({
  classificationFilterMode,
  setClassificationFilterMode,
  stateFilterMode,
  setStateFilterMode,
  chosenState,
  setChosenState
}: FilterMenuContentProps) {
  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
<FormControl>
        <RadioGroup
          value={classificationFilterMode}
          onChange={(e) => setClassificationFilterMode(e.target.value as ClassificationFilterMode)}
        >
          <FormControlLabel value="All" control={<Radio size="small" />} label="All institutions" />
          <FormControlLabel value="NonR1" control={<Radio size="small" />} label="Non-R1 Universities" />
        </RadioGroup>
      </FormControl>
      
      <Divider sx={{ my: 1.5 }} />

      <FormControl>
        <RadioGroup
          value={stateFilterMode}
          onChange={(e) => setStateFilterMode(e.target.value as StateFilterMode)}
        >
          <FormControlLabel value="All" control={<Radio size="small" />} label="All States" />
          <FormControlLabel value="EPSCOR" control={<Radio size="small" />} label="EPSCOR States" />
          <FormControlLabel value="Specific" control={<Radio size="small" />} label={
            <>
              State: 
              <Select
                value={chosenState}
                onChange={(e: SelectChangeEvent) => {
                  setChosenState(e.target.value);
                  setStateFilterMode("Specific");
                }}
                onClick={(e) => e.stopPropagation()}
                size='small'
                sx={{ ml: 1 }}
                MenuProps={{
                  sx: {
                    zIndex: 3200, 
                    maxHeight: '50vh',
                  } 
                }}
              >
                {US_STATES.map((state) => (
                  <MenuItem dense key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </>
          } />
        </RadioGroup>
      </FormControl>
     </Box>
  );
}