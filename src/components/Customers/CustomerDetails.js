import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../supabaseClient';
import Modal from '../Modal/Modal';
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination } from '@mui/material';

// Chart
import { Bar } from 'react-chartjs-2';  // Import Bar chart
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Import chart dependencies

// PDF
import jsPDF from 'jspdf'; // Import jsPDF
import html2canvas from 'html2canvas'; // Import html2canvas

// Form
import MultiStepForm from './MultiStepForm';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [newWeight, setNewWeight] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const [flexibility, setFlexibility] = useState('');

  // Hip ROM fields
  const [hipRomLeftInternal, setHipRomLeftInternal] = useState('');
  const [hipRomLeftExternal, setHipRomLeftExternal] = useState('');
  const [hipRomRightInternal, setHipRomRightInternal] = useState('');
  const [hipRomRightExternal, setHipRomRightExternal] = useState('');

  // EasyForce quadriceps fields
  const [easyForceQuadricepsLeft1, setEasyForceQuadricepsLeft1] = useState('');
  const [easyForceQuadricepsLeft2, setEasyForceQuadricepsLeft2] = useState('');
  const [easyForceQuadricepsLeft3, setEasyForceQuadricepsLeft3] = useState('');
  const [easyForceQuadricepsRight1, setEasyForceQuadricepsRight1] = useState('');
  const [easyForceQuadricepsRight2, setEasyForceQuadricepsRight2] = useState('');
  const [easyForceQuadricepsRight3, setEasyForceQuadricepsRight3] = useState('');

  // Latest data
  const [latestRecordData, setLatestRecordData] = useState({
    hipRomLeftInternal: null,
    hipRomLeftExternal: null,
    hipRomRightInternal: null,
    hipRomRightExternal: null,
    easyForceQuadricepsLeft1: 'N/A',
    easyForceQuadricepsLeft2: 'N/A',
    easyForceQuadricepsLeft3: 'N/A',
    easyForceQuadricepsRight1: 'N/A',
    easyForceQuadricepsRight2: 'N/A',
    easyForceQuadricepsRight3: 'N/A',
    weight: null,
    detail: '',
    flexibility: '',
  });

  const [hipRomAverages, setHipRomAverages] = useState({
    avgHipRomLeftInternal: 0,
    avgHipRomLeftExternal: 0,
    avgHipRomRightInternal: 0,
    avgHipRomRightExternal: 0,
  });
  

  useEffect(() => {
    const fetchCustomer = async () => {
      const { data, error } = await supabase
      .from('customers')
      .select(`
        *,
        sports (name)
      `)
      .eq('id', id).single()
      
      if (error) {
        console.error('Greška prilikom dohvaćanja klijenta:', error);
      } else {
        setCustomer(data);
      };

      
    };

    const fetchHistory = async () => {
      const { data, error } = await supabase.from('customer_history').select('*').eq('customer_id', id);
      if (error) {
        console.error('Greška prilikom dohvaćanja povijesti:', error);
      } else {
        setHistory(data);
        if (data.length > 0) {
          const latestRecord = data[data.length - 1];

          // Consolidate all data into one variable
          await setLatestRecordData({
            hipRomLeftInternal: latestRecord.hip_rom_left_internal,
            hipRomLeftExternal: latestRecord.hip_rom_left_external,
            hipRomRightInternal: latestRecord.hip_rom_right_internal,
            hipRomRightExternal: latestRecord.hip_rom_right_external,
            easyForceQuadricepsLeft1: latestRecord.easy_force_quadriceps_left_1 || 'N/A',
            easyForceQuadricepsLeft2: latestRecord.easy_force_quadriceps_left_2 || 'N/A',
            easyForceQuadricepsLeft3: latestRecord.easy_force_quadriceps_left_3 || 'N/A',
            easyForceQuadricepsRight1: latestRecord.easy_force_quadriceps_right_1 || 'N/A',
            easyForceQuadricepsRight2: latestRecord.easy_force_quadriceps_right_2 || 'N/A',
            easyForceQuadricepsRight3: latestRecord.easy_force_quadriceps_right_3 || 'N/A',
            weight: latestRecord.weight || 'N/A',
            detail: latestRecord.detail || 'N/A',
            flexibility: latestRecord.flexibility || 'N/A',
          });
        }
      }
    };

    
    const fetchAverages = async () => {
      const { data, error } = await supabase
        .rpc('get_hip_rom_averages', { excluded_customer_id: id }); // Call a stored procedure for averages
  
      if (error) {
        console.error('Greška prilikom dohvaćanja prosjeka:', error);
      } else {
        setHipRomAverages({
          avgHipRomLeftInternal: data.avghipromleftinternal,
          avgHipRomLeftExternal: data.avgHipRomLeftExternal,
          avgHipRomRightInternal: data.avgHipRomRightInternal,
          avgHipRomRightExternal: data.avgHipRomRightExternal,
        });
      }
    };
    

    fetchCustomer();
    fetchHistory();
    fetchAverages();
  }, [id]);

  const handleAddRecord = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase
      .from('customer_history')
      .insert([
        {
          customer_id: id,
          weight: newWeight,
          detail: newDetail,
          flexibility,
          hip_rom_left_internal: hipRomLeftInternal,
          hip_rom_left_external: hipRomLeftExternal,
          hip_rom_right_internal: hipRomRightInternal,
          hip_rom_right_external: hipRomRightExternal,
          easy_force_quadriceps_left_1: easyForceQuadricepsLeft1,
          easy_force_quadriceps_left_2: easyForceQuadricepsLeft2,
          easy_force_quadriceps_left_3: easyForceQuadricepsLeft3,
          easy_force_quadriceps_right_1: easyForceQuadricepsRight1,
          easy_force_quadriceps_right_2: easyForceQuadricepsRight2,
          easy_force_quadriceps_right_3: easyForceQuadricepsRight3,
          date: new Date().toISOString(),
        },
      ]);

    if (error) {
      setMessage(`Greška: ${error.message}`);
      setMessageType('error');
    } else {
      setMessage('Zapis uspješno dodan!');
      setMessageType('success');
      setNewWeight('');
      setNewDetail('');
      setFlexibility('');
      setHipRomLeftInternal('');
      setHipRomLeftExternal('');
      setHipRomRightInternal('');
      setHipRomRightExternal('');
      setEasyForceQuadricepsLeft1('');
      setEasyForceQuadricepsLeft2('');
      setEasyForceQuadricepsLeft3('');
      setEasyForceQuadricepsRight1('');
      setEasyForceQuadricepsRight2('');
      setEasyForceQuadricepsRight3('');
      setIsFormModalOpen(false);

      const { data: updatedHistory, error: historyError } = await supabase.from('customer_history').select('*').eq('customer_id', id);
      if (!historyError) {
        setHistory(updatedHistory);
      }
    }

    setIsModalOpen(true);
  };

  const handleDeleteRecord = async (recordId) => {
    const { error } = await supabase
      .from('customer_history')
      .delete()
      .eq('id', recordId);

    if (error) {
      setMessage(`Greška: ${error.message}`);
      setMessageType('error');
    } else {
      setMessage('Zapis uspješno uklonjen!');
      setMessageType('success');

      // Ažuriraj povijest nakon brisanja
      setHistory(history.filter((record) => record.id !== recordId));
    }

    setIsModalOpen(true);
  };

  const openFormModal = () => {
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setNewWeight('');
    setNewDetail('');
    setFlexibility('');
    setHipRomLeftInternal('');
    setHipRomLeftExternal('');
    setHipRomRightInternal('');
    setHipRomRightExternal('');
    setIsFormModalOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  // Chart data for Hip ROM comparison
  const hipRomData = {
    labels: ['Hip ROM Left-Internal', 'Hip ROM Left-External', 'Hip ROM Right-Internal', 'Hip ROM Right-External'],
    datasets: [
      {
        label: 'Klijent',
        data: [50, 40, 50, 40],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Prosjek',
        data: [45, 39, 47, 39],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const hipRomOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Hip ROM Comparison (Client vs Average)',
      },
    },
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add client name at the top
    doc.setFontSize(16);
    doc.text(`Client: ${customer.name}`, 10, 20);
    doc.text(`Weight: ${latestRecordData.weight || 'N/A'} kg`, 10, 40);
    doc.text(`Flexibility: ${latestRecordData.flexibility || 'N/A'}`, 10, 50);

    // Add HIP ROM data as text
    doc.setFontSize(14);
    doc.text('Latest HIP ROM Data:', 10, 60);
    doc.setFontSize(12);
    doc.text(`Hip ROM Left Internal: ${latestRecordData.hipRomLeftInternal || 'N/A'}`, 10, 70);
    doc.text(`Hip ROM Left External: ${latestRecordData.hipRomLeftExternal || 'N/A'}`, 10, 80);
    doc.text(`Hip ROM Right Internal: ${latestRecordData.hipRomRightInternal || 'N/A'}`, 120, 70); // Right column
    doc.text(`Hip ROM Right External: ${latestRecordData.hipRomRightExternal || 'N/A'}`, 120, 80); // Right column

    // Add Quadriceps data as text
    doc.setFontSize(14);
    doc.text('Latest Quadriceps Data (EasyForce):', 10, 90);
    doc.setFontSize(12);
    doc.text(`Left Quadriceps 1: ${latestRecordData.easyForceQuadricepsLeft1 || 'N/A'}`, 10, 100); // Left column
    doc.text(`Left Quadriceps 2: ${latestRecordData.easyForceQuadricepsLeft2 || 'N/A'}`, 10, 110); // Left column
    doc.text(`Left Quadriceps 3: ${latestRecordData.easyForceQuadricepsLeft3 || 'N/A'}`, 10, 120); // Left column

    doc.text(`Right Quadriceps 1: ${latestRecordData.easyForceQuadricepsRight1 || 'N/A'}`, 120, 100); // Right column
    doc.text(`Right Quadriceps 2: ${latestRecordData.easyForceQuadricepsRight2 || 'N/A'}`, 120, 110); // Right column
    doc.text(`Right Quadriceps 3: ${latestRecordData.easyForceQuadricepsRight3 || 'N/A'}`, 120, 120); // Right column

    // Convert the chart to an image
    const chartElement = document.getElementById('hip-rom-chart'); // Ensure the chart has this id
    html2canvas(chartElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');

        // Add the chart as an image to the PDF
        doc.addImage(imgData, 'PNG', 10, 140, 180, 90); // Adjust dimensions as needed
        
        // Save the PDF
        doc.save(`${customer.name}-details.pdf`);
    });
  };

  return (
    <div id="customer-details" className="pt-24 px-4 max-w-full mx-auto bg-gradient-to-b from-custom-blue to-white">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {customer && (
          <>
            <div className='text-center'>
              <h1 className="text-2xl font-bold mb-4 text-center">Detalji o klijentu za {customer.name}</h1>
              <p><strong>Datum rođenja:</strong> {new Date(customer.date_of_birth).toLocaleDateString()}</p>
              <p><strong>Dob:</strong> {customer.age}</p>
              <p><strong>Visina:</strong> {customer.height} cm</p>
              <p><strong>Težina:</strong> {customer.weight} kg</p>
              <p><strong>Sport:</strong> {customer.sports.name}</p>
              <p><strong>Kategorija:</strong> {customer.category}</p>
              <p><strong>Pozicija igrača:</strong> {customer.player_position}</p>
              <p><strong>Povijest ozljeda:</strong> {customer.injury_history === 'yes' ? 'Da' : 'Ne'}</p>
              <p><strong>Dominantna strana:</strong> {customer.dominant_side === 'left' ? 'Lijeva' : 'Desna'}</p>
              <p><strong>Patologija:</strong> {customer.pathology}</p>
            </div>

            <div className='text-center'>
              <button
                onClick={openFormModal}
                className="bg-custom-blue text-white py-2 px-4 rounded hover:bg-teal-700 mt-4"
              >
                Dodaj novi zapis
              </button>
            </div>

            <h2 className="text-xl font-bold mt-6">Povijest</h2>
            <br/>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Datum</TableCell>
                    <TableCell>Težina</TableCell>
                    <TableCell>Detalj</TableCell>
                    <TableCell>Fleksibilnost</TableCell>
                    <TableCell>Hip ROM Left-internal</TableCell>
                    <TableCell>Hip ROM Left-external</TableCell>
                    <TableCell>Hip ROM Right-internal</TableCell>
                    <TableCell>Hip ROM Right-external</TableCell>
                    <TableCell>EasyForce Left Quadriceps 1</TableCell>
                    <TableCell>EasyForce Left Quadriceps 2</TableCell>
                    <TableCell>EasyForce Left Quadriceps 3</TableCell>
                    <TableCell>EasyForce Right Quadriceps 1</TableCell>
                    <TableCell>EasyForce Right Quadriceps 2</TableCell>
                    <TableCell>EasyForce Right Quadriceps 3</TableCell>
                    <TableCell>Akcija</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>{record.weight} kg</TableCell>
                      <TableCell>{record.detail}</TableCell>
                      <TableCell>{record.flexibility}</TableCell>
                      <TableCell>{record.hip_rom_left_internal}</TableCell>
                      <TableCell>{record.hip_rom_left_external}</TableCell>
                      <TableCell>{record.hip_rom_right_internal}</TableCell>
                      <TableCell>{record.hip_rom_right_external}</TableCell>
                      <TableCell>{record.easy_force_quadriceps_left_1}</TableCell>
                      <TableCell>{record.easy_force_quadriceps_left_2}</TableCell>
                      <TableCell>{record.easy_force_quadriceps_left_3}</TableCell>
                      <TableCell>{record.easy_force_quadriceps_right_1}</TableCell>
                      <TableCell>{record.easy_force_quadriceps_right_2}</TableCell>
                      <TableCell>{record.easy_force_quadriceps_right_3}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteRecord(record.id)}
                        >
                          Ukloni
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={history.length}
              rowsPerPage={rowsPerPage}
              page={currentPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <div id="hip-rom-chart" className="mt-8" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <Bar data={hipRomData} options={hipRomOptions} width={300} height={200} />
            </div>

            {/* Download PDF Button */}
            <div className="text-center mt-4">
              <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
                Preuzmi PDF
              </Button>
            </div>
          </>
        )}
      </div>

      {isFormModalOpen && (
        <Modal 
          width={'500px'}
          isOpen={isFormModalOpen} 
          onClose={closeFormModal}
          modalContent={
           <>
             <MultiStepForm 
               newWeight={newWeight}
               setNewWeight={setNewWeight}
               newDetail={newDetail}
               setNewDetail={setNewDetail}
               flexibility={flexibility}
               setFlexibility={setFlexibility}
               hipRomLeftExternal={hipRomLeftExternal}
               setHipRomLeftExternal={setHipRomLeftExternal}
               hipRomLeftInternal={hipRomLeftInternal}
               setHipRomLeftInternal={setHipRomLeftInternal}
               hipRomRightInternal={hipRomRightInternal}
               setHipRomRightInternal={setHipRomRightInternal}
               hipRomRightExternal={hipRomRightExternal}
               setHipRomRightExternal={setHipRomRightExternal}
               easyForceQuadricepsLeft1={easyForceQuadricepsLeft1}
               setEasyForceQuadricepsLeft1={setEasyForceQuadricepsLeft1}
               easyForceQuadricepsLeft2={easyForceQuadricepsLeft2}
               setEasyForceQuadricepsLeft2={setEasyForceQuadricepsLeft2}
               easyForceQuadricepsLeft3={easyForceQuadricepsLeft3}
               setEasyForceQuadricepsLeft3={setEasyForceQuadricepsLeft3}
               easyForceQuadricepsRight1={easyForceQuadricepsRight1}
               setEasyForceQuadricepsRight1={setEasyForceQuadricepsRight1}
               easyForceQuadricepsRight2={easyForceQuadricepsRight2}
               setEasyForceQuadricepsRight2={setEasyForceQuadricepsRight2}
               easyForceQuadricepsRight3={easyForceQuadricepsRight3}
               setEasyForceQuadricepsRight3={setEasyForceQuadricepsRight3}
               handleAddRecord={handleAddRecord}
               closeFormModal={closeFormModal}/>
           </> 
          }>
        </Modal>
      )}
    </div>
  );
}

export default CustomerDetails;
