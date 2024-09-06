import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../supabaseClient';
import Modal from '../Modal/Modal';
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination } from '@mui/material';

// Form fields
import HipRomFormFields from './CustomerDetailFormFields/HipRomFormFields';

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

  useEffect(() => {
    const fetchCustomer = async () => {
      const { data, error } = await supabase.from('customers').select('*').eq('id', id).single();
      if (error) {
        console.error('Greška prilikom dohvaćanja klijenta:', error);
      } else {
        setCustomer(data);
      }
    };

    const fetchHistory = async () => {
      const { data, error } = await supabase.from('customer_history').select('*').eq('customer_id', id);
      if (error) {
        console.error('Greška prilikom dohvaćanja povijesti:', error);
      } else {
        setHistory(data);
      }
    };

    fetchCustomer();
    fetchHistory();
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
    setIsFormModalOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  return (
    <div className="pt-24 px-4 max-w-full mx-auto bg-gradient-to-b from-custom-blue to-white">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {customer && (
          <>
            <div className='text-center'>
              <h1 className="text-2xl font-bold mb-4 text-center">Detalji o klijentu za {customer.name}</h1>
              <p><strong>Datum rođenja:</strong> {new Date(customer.date_of_birth).toLocaleDateString()}</p>
              <p><strong>Dob:</strong> {customer.age}</p>
              <p><strong>Visina:</strong> {customer.height} cm</p>
              <p><strong>Težina:</strong> {customer.weight} kg</p>
              <p><strong>Sport:</strong> {customer.sport_id}</p>
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
          </>
        )}
      </div>

      {isFormModalOpen && (
        <Modal 
          isOpen={isFormModalOpen} 
          onClose={closeFormModal}
          modalContent={
           <>
           <h2 className="text-xl font-bold mb-4">Dodaj novi zapis</h2>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div>
                <label htmlFor="newWeight" className="block text-sm font-medium text-gray-700">Težina (kg)</label>
                <input
                  type="number"
                  id="newWeight"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="newDetail" className="block text-sm font-medium text-gray-700">Detalj</label>
                <input
                  type="text"
                  id="newDetail"
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              {/* New Fields */}
              <div>
                <label htmlFor="flexibility" className="block text-sm font-medium text-gray-700">Fleksibilnost</label>
                <input
                  type="text"
                  id="flexibility"
                  value={flexibility}
                  onChange={(e) => setFlexibility(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <HipRomFormFields
                hipRomLeftInternal={hipRomLeftInternal}
                setHipRomLeftInternal={setHipRomLeftInternal}
                hipRomLeftExternal={hipRomLeftExternal}
                setHipRomLeftExternal={setHipRomLeftExternal}
                hipRomRightInternal={hipRomRightInternal}
                setHipRomRightInternal={setHipRomRightInternal}
                hipRomRightExternal={hipRomRightExternal}
                setHipRomRightExternal={setHipRomRightExternal}
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-gray-700 mr-2"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="bg-custom-blue text-white py-2 px-4 rounded hover:bg-teal-700"
                >
                  Dodaj zapis
                </button>
              </div>
            </form>
           </> 
          }>
        </Modal>
      )}
    </div>
  );
}

export default CustomerDetails;
