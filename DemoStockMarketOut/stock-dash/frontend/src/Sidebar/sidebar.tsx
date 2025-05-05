import React, { useState, useEffect } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
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
    FormControlLabel,
    TextField,
    RadioGroup,
    Radio
} from '@mui/material';

import { useDispatch } from 'react-redux';
import { setSelectedTickerState } from '../redux/tickerSlice';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ExpandIcon from '@mui/icons-material/ExpandMore';

import { TickerListResponse, TickerEntry } from './types'

const SideBar = () => {
    const dispatch = useDispatch();
    const [tickerMap, setTickerMap] = useState<Record<string, string>>()
    const [tickers, setTickers] = useState<Record<string, boolean>>({})
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedTicker, setSelectedTicker] = useState('')

    useEffect(() => {
        console.log("Use Effect Triggered.")
        const fetchData = async () => {
            await handleTickerData()
        }
        fetchData()
    }, [])

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

    const filteredTickers = Object.keys(tickers ?? {}).filter(
        ticker => ticker.toLowerCase().includes(searchTerm.toLowerCase())
      );

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
    };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTicker(event.target.value);
        const selected: string = tickerMap ? tickerMap[selectedTicker] : '';
        const displayValue = selected || '';
        dispatch(setSelectedTickerState(displayValue));
        updateActiveFilters('ticker', event.target.value);
      };

    const Row = ({ index, style }: ListChildComponentProps) => {
        const ticker = filteredTickers[index];
        return (
          <div style={{ ...style, display: 'flex', alignItems: 'center', height: '100%' }} key={ticker}>
            <FormControlLabel
              control={
                <Radio
                  checked={selectedTicker === ticker}
                  onChange={handleRadioChange}
                  value={ticker}
                  name={ticker}
                />
              }
              label={ticker.charAt(0).toUpperCase() + ticker.slice(1)}
            />
          </div>
        );
      };



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
                <Divider sx={{mb: 2}}/>
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandIcon/>}>
                        <Typography>
                            Ticker Name
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormControl component="fieldset">
                            <TextField
                            label="Search Tickers"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ mb: 2 }}
                                />
                        <RadioGroup value={selectedTicker} onChange={handleRadioChange}>
                            <List
                                height={300}
                                itemCount={filteredTickers.length}
                                itemSize={100}
                                width="100%"
                            >
                            {Row}
                            </List>
                            </RadioGroup>
                        </FormControl>
                    </AccordionDetails>
                </Accordion>

                <p>This is a drawer</p>

            </Box>
        </Drawer>
        </>


    )
}

export default SideBar;