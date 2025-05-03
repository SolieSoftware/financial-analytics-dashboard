import React, { useState } from 'react';
import { 
    Drawer,
    Box,
    IconButton,
    Typography,
    Divider,
    AccordionSummary,
    AccordionDetails,
    Accordion,
    FormControl,
    FormGroup,
    Checkbox,
    FormControlLabel
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ExpandIcon from '@mui/icons-material/ExpandMore';
import FilerListIcon from '@mui/icons-material/FilterList';





const SideBar = () => {

    interface ActiveFilter {
        type: string,
        value: string
    }

    const [openDrawer, setOpenDrawer] = useState(true);
    const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

    const toggleDrawer = () => {
        setOpenDrawer(prevState => !prevState);
    };

    const [indices, setIndex] = useState<Record<string, boolean>>({
        "S&P 500": false,
        "FTSE 100": false,
        "FTSE 250": false,
        "Nasdaq 100": false,
        "Dow Jones Industrial Average": false
    })

    const handleIndexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target
        setIndex({
            ...indices,
            [name]: checked,
        });

        if (checked) {
            updateActiveFilters('index', name)
        } else {
            removeActiveFilter('index', name)

        }
    }

    const updateActiveFilters = (type: string, value: string) => {
        const filtered = activeFilters.filter(filter => 
            !(filter.type == type && (type !== 'index' || filter.value === value))
        );

        setActiveFilters([...filtered, {type, value}]);
    };

    const removeActiveFilter = (type: string, value: string|null = null) => {
        setActiveFilters(activeFilters.filter(filter => {
            if (type === 'index' && value) {
                return !(filter.type === type && filter.value === value);
            }
            return filter.type !== type
        }))
    }



    return (
        <>
        <IconButton 
                onClick={toggleDrawer}
                color="primary"
                aria-label="toggle-sidebar"
                sx={{
                    position: 'fixed',
                    left: openDrawer ? 240 : 10,
                    top:10,
                    zIndex: 1300,
                    transition: 'left 0.3s',
                    bgcolor: 'background.paper',
                    '&:hover': {
                        bgcolor: 'action.hover',
                    }
                }}
                >
            {openDrawer ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <Drawer
            open={openDrawer}
            anchor='left'
            ModalProps={{
                keepMounted: false
            }}
            sx={{
                width: 280,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 280,
                    boxSizing: 'border-box'
                }
            }}
        >
            <Box sx={{width: 250, p:2}}>
                <Box
                sx={{display:'flex', justifyContent: 'space-between', alignItems:'center', mb: 2}} 
                >
                    <Typography 
                    variant='h6'
                    component="h2">
                        Filters
                    </Typography>

                </Box>
                <Divider sx={{ mb: 2}}/>
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandIcon/>}>
                        <Typography>
                            Index
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormControl component="fieldset">
                            <FormGroup>
                                {
                                Object.keys(indices).map(
                                    (index) => (
                                        <FormControlLabel
                                        key={index}
                                        control={
                                            <Checkbox 
                                            checked={indices[index]}
                                            onChange={handleIndexChange}
                                            name={index}
                                            />
                                        }
                                        label={index.charAt(0).toUpperCase() + index.slice(1)}
                                        />
                                    ))}

                            </FormGroup>
                        </FormControl>
                    </AccordionDetails>
                </Accordion>

                <p>This is a drawer</p>

            </Box>
        </Drawer>
        </>


    )
}

export default SideBar