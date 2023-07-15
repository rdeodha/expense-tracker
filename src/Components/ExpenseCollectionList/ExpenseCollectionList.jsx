import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';

import debounce from 'lodash.debounce';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Slide from '@mui/material/Slide';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import DownloadIcon from '@mui/icons-material/Download';

export default function ExpenseCollectionList({ deleteAllFileIDsInsideFolder, createNewExpenseCollection, expenseCollections, setIsLoadingData, setExpenseCollections, setSelectedExpenseCollection, signInStatus, rootFolderID }) {
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [searchIsFocused, setSearchIsFocused] = useState(false);
    const [filteredExpenseCollections, setFilteredExpenseCollections] = useState([]);
    const [searchBarDisabled, setSearchBarDisabled] = useState(true);
    const [modelOpen, setModelOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [newCollectionName, setNewCollectionName] = useState('');
    const [isNewCollectionNameInvalid, setIsNewCollectionNameInvalid] = useState(true);
    const [newCollectionInvalidHelperText, setNewCollectionInvalidHelperText] = useState('');
    const [confirmDeletion, setConfirmDeletion] = useState(false);
    const [temporaryDisable, setTemporaryDisable] = useState(false);

    const containerRef = useRef(null);

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        border: 1,
        borderColor: 'rgb(125,175,215)',
        borderRadius: 4
    };

    useEffect(() => {
        setFilteredExpenseCollections(expenseCollections);
        setSearchBarDisabled(expenseCollections.length === 0);
    }, [expenseCollections]);

    useEffect(() => {
        if (searchBarDisabled) {
          setQuery('');
        }

      }, [searchBarDisabled]);

    const handleCollectionSearchFocus = () => setSearchIsFocused(!searchIsFocused);
    const handleOpenModal = () => setModelOpen(true);
    const handleCloseModal = () => {setModelOpen(false); setNewCollectionName('')};

    const handleCollectionCreation = async () => {
        handleCloseModal();
        setIsLoadingData(true);
        const queryParams = {
            name: newCollectionName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [rootFolderID]
        };
        
        const newCollectionID = await createNewExpenseCollection(queryParams);
        const newCollection = {
            id: newCollectionID,
            name: newCollectionName
        }

        const collectionArray = [...expenseCollections, newCollection].sort((a, b) => {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            
            return 0;
        });

        setFilteredExpenseCollections(collectionArray);
        setExpenseCollections(collectionArray);
        setQuery('');
        setIsLoadingData(false);
    }

    const handleNewCollectionName = (event) => {
        const { value } = event.target;
        setNewCollectionName(value);
        handleRegexCollectionName(value);
    }

    const handleRegexCollectionName = (value) => {
        const regex = /^(?!.*[\\/:*?"<>|]).{1,255}$/;
        const isValid = !regex.test(value);

        setIsNewCollectionNameInvalid(isValid);

        if (isValid) {
            setNewCollectionInvalidHelperText('Remove Invalid Characters');
        } else {
            setNewCollectionInvalidHelperText('');
        }
    }

    // Debounce function to delay the execution of the search
    const handleSearch = debounce((value) => {
        const filteredArray = [];
        expenseCollections.forEach((item) => {
            if (item.name.toLowerCase().includes(value.toLowerCase())) {
                filteredArray.push(item);
            }
        });
        setFilteredExpenseCollections(filteredArray);

    }, 100); // Adjust the debounce delay as per your requirements

    const handleCollectionSearchChange = (event) => {
        const { value } = event.target;
        setQuery(value); // Update the query state
        handleSearch(value); // Call the debounced search function
    };

    const deleteExpenseCollection = async (collectionID) => {
        if (confirmDeletion) {
            setIsLoadingData(true);

            await deleteAllFileIDsInsideFolder(collectionID);
            const collectionArray = expenseCollections.filter((item) => item.id !== collectionID);
            setFilteredExpenseCollections(collectionArray);
            setExpenseCollections(collectionArray);
    
            setIsLoadingData(false);
            setConfirmDeletion(false);
        } else {
            setTemporaryDisable(true);
            setTimeout(() => {
                setConfirmDeletion(true);
                setTemporaryDisable(false);
            }, 800);
            setTimeout(() => {
                setConfirmDeletion(false);
                setTemporaryDisable(false);
            }, 5800)
        }
    }

    const generateExpenseList = () => {
        return filteredExpenseCollections.map((report) =>
            <ListItem disablePadding key={report.id}>
                <ListItemButton 
                    divider 
                    onClick={() => {
                        setSelectedIndex(report.id);
                        setSelectedExpenseCollection(report.id);
                        setConfirmDeletion(false);
                    }}
                    selected={selectedIndex === report.id}
                    disabled={selectedIndex === report.id}
                >
                    <Tooltip 
                        title={report.name} 
                        disableInteractive
                        placement="right-end"
                        enterDelay={1000}
                    >
                        <ListItemText
                            primary={report.name}
                            primaryTypographyProps={{
                                sx: {
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                },
                            }}
                
                        />
                    </Tooltip>
                </ListItemButton>
                <Slide direction="left" in={ selectedIndex === report.id } container={containerRef.current} mountOnEnter unmountOnExit>
                    <IconButton
                        style={{borderRadius: 0}}
                        color='primary'
                        sx={
                            { 
                                display: selectedIndex === report.id ? 'block' : 'none' 
                            }
                        }
                    >
                        <DownloadIcon />
                    </IconButton>
                </Slide>
                <Slide direction="left" in={ selectedIndex === report.id } container={containerRef.current} mountOnEnter unmountOnExit>
                    <Divider orientation="vertical" variant="middle" flexItem />
                </Slide>
                <Slide direction="left" in={ selectedIndex === report.id } container={containerRef.current} mountOnEnter unmountOnExit>
                    <IconButton
                        style={{borderRadius: 0}}
                        color={!confirmDeletion ? 'primary' : 'error'}
                        onClick={() => deleteExpenseCollection(report.id)}
                        disabled={temporaryDisable}
                        sx={
                            { 
                                display: selectedIndex === report.id ? 'block' : 'none' 
                            }
                        }
                    >
                        <DeleteForeverIcon />
                    </IconButton>
                </Slide>
            </ListItem>
        );
    }

    return (
        <>
            <Box
                border={1}
                borderColor='border.grey'
                borderRadius={4}
                sx={
                    {
                        bgcolor: 'background.paper',
                        width: '100%',
                        height: '100%',
                        maxWidth: '30%',
                        maxHeight: '400px',
                        margin: '10px',
                        position: 'relative',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                    }
                }
                ref={containerRef}
            >
                <Box
                    sx={
                        {
                            bgcolor: 'background.paper',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1
                        }
                    }
                >
                    <TextField 
                        id="filled-basic" 
                        label="Search" 
                        variant="filled"
                        value={query}
                        disabled={searchBarDisabled}
                        onChange={handleCollectionSearchChange}
                        onFocus={handleCollectionSearchFocus}
                        onBlur={handleCollectionSearchFocus}
                        sx={
                            { 
                                input: { color: 'primary' }, 
                                width: '100%',
                            }
                        }
                        InputProps={
                            {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color={searchIsFocused ? 'primary' : 'grey[900]'} fontSize="medium" />
                                    </InputAdornment>
                                ),
                            }
                        }
                    />
                    <Button
                        variant="contained"
                        disabled={!signInStatus}
                        onClick={(handleOpenModal)}
                        sx={
                            {
                                width: '95%',
                                marginLeft: '2.5%', 
                                marginTop: '2.5%', 
                                marginBottom: '2.5%'
                            }
                        }
                    >
                        Create new collection
                    </Button>
                </Box>

                <Divider variant="middle" />
                    <Slide direction="down" in={ expenseCollections.length > 0 } container={containerRef.current}>
                        <List 
                            dense={true}
                            style={{maxHeight: '100%'}}
                        >
                            {generateExpenseList()}
                        </List>
                    </Slide>
            </Box>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={modelOpen}
                onClose={handleCloseModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={
                    {
                        backdrop: {
                            timeout: 500,
                        },
                    }
                }
            >
                <Fade in={modelOpen}>
                    <Box sx={modalStyle}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            New Expense Collection
                        </Typography>
                        <br></br>
                        <TextField
                            value={newCollectionName}
                            onChange={handleNewCollectionName}
                            error={isNewCollectionNameInvalid}
                            helperText={!newCollectionName ? 'Name is empty' : newCollectionInvalidHelperText}
                            focused
                            sx={
                                { 
                                    input: { color: 'primary' }, 
                                    width: '100%',
                                    minHeight: 100
                                }
                            }
                            required
                            label="Name" 
                            variant="filled">
                        </TextField>
                        <Box sx={{float: 'bottom', width: '100%'}}>
                            <Box sx={{display: 'flex', justifyContent: 'flex-end'}} >
                                <Button onClick={handleCloseModal}>Cancel</Button>
                                <Button color="error" onClick={handleCollectionCreation} disabled={isNewCollectionNameInvalid || !newCollectionName}>Create</Button>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

ExpenseCollectionList.propTypes = {
    createNewExpenseCollection: PropTypes.func.isRequired,
    setSelectedExpenseCollection: PropTypes.func.isRequired,
    expenseCollections: PropTypes.array.isRequired,
    setExpenseCollections: PropTypes.func.isRequired,
    signInStatus: PropTypes.bool.isRequired,
    rootFolderID: PropTypes.string.isRequired,
    setIsLoadingData: PropTypes.func.isRequired,
    deleteAllFileIDsInsideFolder: PropTypes.func.isRequired
};
