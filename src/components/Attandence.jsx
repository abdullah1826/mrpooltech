import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import DataTable from 'react-data-table-component';
import upper from '../imgs/pooltecuper.jpeg';
import { onValue, ref } from 'firebase/database';
import CloseIcon from '@mui/icons-material/Close';
import { db } from '../Firbase';
import { Locationmodel } from './Locationmodal';
import img from "../imgs/noimg.jpg";
import { Box, Button, IconButton, Modal, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Height } from '@mui/icons-material';

const Attandence = () => {
    let [mylist, setmylist] = useState([]);
    const [search, setsearch] = useState('');
    const [filtered, setfiltered] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [loc, setloc] = useState('');
    const [showmod, setshowmod] = useState(false);
    const [showmod1, setshowmod1] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showColumnModal, setShowColumnModal] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const columns = [
        { name: 'Worker name', selector: 'name', sortable: true, width: '150px' },
        { name: 'Date', selector: 'date', sortable: true },
        { name: 'Checkin', selector: 'timein', sortable: true },
        { name: 'Checkout', selector: 'timeout', sortable: true },
        { name: 'Checkin Location', selector: 'checkinLocation', sortable: true },
        { name: 'Checkout Location', selector: 'checkoutLocation', sortable: true },
        {
            name: 'Image', selector: 'imageUrl', sortable: true, cell: (row) => (
                <img
                    onClick={() => openImageModal(row.imageUrl)}
                    src={row.imageUrl ? row.imageUrl : "https://placehold.co/45"}
                    className='h-[40px] w-[40px] object-cover cursor-pointer'
                    alt="user"
                />
            ),
            isImageColumn: true // Add this identifier
        },
        {
            name: 'Locations', cell: (row) => (
                <div className='flex'>
                    <button className='h-[40px] w-[70px] border bg-[#35A1CC] rounded-md text-white ' onClick={() => showLocation(row.id)}>View</button>
                </div>
            ), width: '175px',
            isLocationButtonColumn: true // Add this identifier
        },
    ];
    

    useEffect(() => {
        const getingdata = async () => {
            const starCountRef = ref(db, '/attendance');
            onValue(starCountRef, async (snapshot) => {
                const data = await snapshot.val();
                setmylist(Object.values(data));
                setfiltered(Object.values(data));
            });
        };

        getingdata();
    }, []);

    let fetchData=()=>{
    
        setSelectedDate("")
        setsearch("")
    }
    useEffect(() => {
        const result = mylist?.filter((user) => {
            return user?.name?.toLowerCase().includes(search.toLowerCase()) || user?.date?.toLowerCase().includes(search.toLowerCase());
        });
        setfiltered(result);
    }, [search, mylist]);

    useEffect(() => {
        const result = mylist?.filter((user) => {
            return user?.date?.includes(selectedDate);
        });
        setfiltered(result);
    }, [selectedDate, mylist]);

    const showLocation = (id) => {
        const starCountRef = ref(db, `attendance/${id}`);
        onValue(starCountRef, async (snapshot) => {
            const data = await snapshot.val();
            setloc(data);
        });
        setshowmod(true);
    };

    const hidemodal = () => {
        setshowmod(false);
    };

    const openUserModal = () => {
        setShowUserModal(true);
        
    };

    const closeUserModal = () => {
        setShowUserModal(false);
    
    };

    const openColumnModal = () => {
        setShowColumnModal(true);
         setSelectedColumns([]);
    };

    const closeColumnModal = () => {
        setShowColumnModal(false);
     
    };

    const closeImageModal = () => {
        setSelectedImage(null);
        setshowmod1(false);
    };

    const handleUserSelection = (user) => {
        setSelectedUsers((prevSelectedUsers) =>
            prevSelectedUsers.includes(user)
                ? prevSelectedUsers.filter((u) => u !== user)
                : [...prevSelectedUsers, user]
        );
    };

    const handleColumnSelection = (column) => {
        setSelectedColumns((prevSelectedColumns) => {
            const isSelected = prevSelectedColumns.some((col) => col.name === column.name);
            if (isSelected) {
                // If the column is already selected, remove it from the selectedColumns array
                return prevSelectedColumns.filter((col) => col.name !== column.name);
            } else {
                // If the column is not selected, add it to the selectedColumns array
                return [...prevSelectedColumns, column];
            }
        });
    };
    
    console.log("Selected Users:", selectedUsers);
    console.log("Selected Columns:", selectedColumns);
    const generatePDF = () => {
        const doc = new jsPDF();
        
        // Customize table appearance
        const tableOptions = {
            startY: 20, // Start y position of the table
            styles: { overflow: 'linebreak', fontSize: 8, }, 
            headStyles: { fillColor: [51, 161, 204], textColor: 255 }, // Header styles
            bodyStyles: { textColor: 0 }, // Body styles
            columnStyles: { 0: { cellWidth: 'auto' } }, // Column styles
            margin: { top: 30 } // Margin
        };
    
        const tableColumn = selectedColumns.map((col) => col.name);
        const tableRows = selectedUsers.map((user) => selectedColumns.map((col) => user[col.selector]));
    
        // Convert dates to a readable format
        const formattedRows = tableRows.map(row => row.map(cell => (cell instanceof Date) ? cell.toLocaleString() : cell));
    
        // Generate table
        doc.autoTable({
            head: [tableColumn],
            body: formattedRows,
            ...tableOptions
        });
    
        // Save PDF
        doc.save('attendance_report.pdf');
    
        // Reset states
        setShowUserModal(false);
        setShowColumnModal(false);
        setSelectedColumns([]);
        setSelectedUsers([]);
    };

    
    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setshowmod1(true);
    };

    const downloadImage = () => {
        fetch(selectedImage, {
            method: "GET",
            headers: {}
        })
            .then(response => {
                response.arrayBuffer().then(function (buffer) {
                    const url = window.URL.createObjectURL(new Blob([buffer]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "image.png");
                    document.body.appendChild(link);
                    link.click();
                });
            })
            .catch(err => {
                console.log(err);
            });
    };
    const filteredColumns = columns.filter(column => column.name !== 'Checkin Location' && column.name !== 'Checkout Location');

    return (
        <>
            {showmod && <Locationmodel checkinloc={loc.checkinLocation} checkoutloc={loc.checkoutLocation} hidemod={hidemodal} />}
            <div className='flex w-[100%]'>
                <Sidebar />
                <div className='relative h-[125vh] overflow-x-auto w-[88%]'>
                    <img src={upper} alt="Header" />
                    <div className='w-[95%] ml-[45px] mt-[60px] relative'>
                        <div className='border relative w-[100%]'>
                            <div className='absolute left-[330px] top-[4px] w-[200px] z-10'>
                                <h2 className='text-[17px]'>Filter on date</h2>
                                <input type="date" className='border-b w-[270px] mt-[2px]' onChange={(e) => setSelectedDate(e.target.value)} value={selectedDate} />
                            </div>
                            <div className='absolute right-[78px] top-[20px] flex justify-end z-20'>
                                <button className='h-[35px] w-[100px] flex items-center justify-center rounded-2xl bg-[#35A1CC] text-white' onClick={() => fetchData()}>Refresh</button>
                                <button className='h-[35px] w-[180px] flex items-center justify-center rounded-2xl bg-[#35A1CC] text-white ml-4' onClick={openUserModal}>Generate Report</button>
                            </div>
                            <DataTable columns={filteredColumns} data={filtered} style={{ width: '1200px' }} wrapperStyle={{ backgroundColor: '#DAECF3' }} pagination fixedHeader subHeader subHeaderComponent={<div className='h-[70px]'><h2 className='text-[17px]'>Search</h2> <input type='search' placeholder='Search here' className='h-[25px] w-[250px] border-b-[1px] p-1 outline-none placeholder:text-sm' value={search} onChange={(e) => { setsearch(e.target.value) }} /> </div>} subHeaderAlign='left' />
                        </div>
                        <br />
                    </div>
                </div>
            </div>

            {/* User Selection Modal */}
            <Modal open={showUserModal} onClose={closeUserModal} aria-labelledby="user-selection-modal">
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 340,
                    bgcolor: 'white',
                    borderRadius: '21px',
                    background: '#FFF',
                    outline: 'none',
                    boxShadow: 24,
                    maxHeight: "90vh",
                    overflowY: "auto",
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}>
                  <IconButton
                  aria-label="close"
                  onClick={closeUserModal}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 18,
                    width: '24px',
                   height: '24px',
                  background: '#ECECEC',
                  }}
                >
                  <CloseIcon />
                </IconButton>
                  <div className='flex justify-start w-[90%] ml-4 flex-col'>
                    <h2 className='text-[18px] font-[500] mt-5 mb-5'>Select Users</h2>
                    <FormGroup>
                        {filtered?.map((user, index) => (
                            <FormControlLabel
                                key={index}
                                control={<Checkbox checked={selectedUsers.includes(user)} onChange={() => handleUserSelection(user)} />}
                                label={user?.name}
                            />
                        ))}
                    </FormGroup>
                    <Button className='mb-5 mt-5' variant="contained" onClick={() => { closeUserModal(); openColumnModal(); }}>Next</Button>
                    </div>
                </Box>
            </Modal>

            {/* Column Selection Modal */}
            <Modal open={showColumnModal} onClose={closeColumnModal} aria-labelledby="column-selection-modal">
            <Box  sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 340,
                bgcolor: 'white',
                borderRadius: '21px',
                background: '#FFF',
                outline: 'none',
                boxShadow: 24,
                maxHeight: "90vh",
                overflowY: "auto",
                
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}>
              <IconButton
              aria-label="close"
              onClick={closeColumnModal}
              sx={{
                position: 'absolute',
                top: 8,
                right: 18,
                width: '24px',
               height: '24px',
              background: '#ECECEC',
              }}
            >
              <CloseIcon />
            </IconButton>
              <div className='w-[100%] flex justify-center items-center'>
              <div className='w-[90%] flex justify-start  flex-col'>
                <h2 className='font-[450] mt-5 mb-5'>Select Columns</h2>
                <FormGroup>
                    {columns
                        .filter(column => !column.isImageColumn && !column.isLocationButtonColumn) // Filter out the image column
                        .map((column, index) => (
                            <FormControlLabel
                                key={index}
                                control={<Checkbox checked={selectedColumns?.some(col => col.name === column.name)} onChange={() => handleColumnSelection(column)} />}
                                label={column?.name}
                            />
                        ))}
                </FormGroup>
                <Button className='mt-5 mb-5' variant="contained" onClick={() => { closeColumnModal(); generatePDF(); }}>Generate PDF</Button>
                </div>
                </div>
                </Box>
        </Modal>
        

            {/* Image Modal */}
            <Modal open={showmod1} onClose={closeImageModal} aria-labelledby="image-modal" aria-describedby="image-modal-description">
                <Box sx={imageModalStyle}>
                    <IconButton aria-label="close" onClick={closeImageModal} sx={closeButtonStyle}>
                        <CloseIcon />
                    </IconButton>
                    <img src={selectedImage ? selectedImage : img} alt="Selected" className='max-h-[380px] max-w-[70%]' />
                    <Button variant="contained" color="primary" onClick={downloadImage} sx={{ mt: 2 }}>Download Image</Button>
                </Box>
            </Modal>
        </>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

   
    

};

const imageModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '80%',
    bgcolor: 'white',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    outline:"none",
 
};

const closeButtonStyle = {
    position: 'absolute',
    top: 10,
    right: 10,
};

export default Attandence;
