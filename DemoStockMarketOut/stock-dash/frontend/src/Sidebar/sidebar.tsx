import React, { useState, useEffect } from 'react';
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

import { TickerListResponse, TickerEntry } from './types'





const SideBar = () => {

    const [tickerMap, setTickerMap] = useState<Record<string, string>>()
    const [tickers, setTickers] = useState<Record<string, boolean>>()

    useEffect(() => {handleTickerData}, [])

    async function fetch_current_tickers(): Promise<TickerListResponse | null> {
        try {
            const response = await fetch('http://localhost:8000/api/tickers/')
            const data: TickerListResponse = await response.json()
            return data
        } catch (err) {
            console.log("Failed to fetch Ticker List: ", err)
            return null
        }
    }

    async function handleTickerData() {
        const data = await fetch_current_tickers()
        console.log(data)
        const nameMap: Record<string, boolean> = {}
        const tickerMap: Record<string, string> = {}
        data?.nasdaq_ticker_list.forEach((ticker: TickerEntry) => {
            tickerMap[ticker["Security Name"]] =  ticker["Symbol"]
            nameMap[ticker["Security Name"]] = false
        })
        setTickerMap(tickerMap)
        setTickers(nameMap)
    }

    interface ActiveFilter {
        type: string,
        value: string
    }

    const [openDrawer, setOpenDrawer] = useState(true);
    const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

    const toggleDrawer = () => {
        setOpenDrawer(prevState => !prevState);
    };

    const handleIndexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target
        setTickers({
            ...tickers,
            [name]: checked,
        });

        if (checked) {
            updateActiveFilters('ticker', name)
        } else {
            removeActiveFilter('ticker', name)

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
                                Object.keys(tickers).map(
                                    (ticker) => (
                                        <FormControlLabel
                                        key={ticker}
                                        control={
                                            <Checkbox 
                                            checked={tickers[ticker]}
                                            onChange={handleIndexChange}
                                            name={ticker}
                                            />
                                        }
                                        label={ticker.charAt(0).toUpperCase() + ticker.slice(1)}
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