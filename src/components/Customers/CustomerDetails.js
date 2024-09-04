import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../supabaseClient';
import Modal from '../Modal/Modal';

function CustomerDetails() {
  const { id } = useParams(); // Dohvaća ID klijenta iz URL-a
  const [customer, setCustomer] = useState(null);
  const [history, setHistory] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // State for form modal

  useEffect(() => {
    // Dohvati detalje klijenta
    const fetchCustomer = async () => {
      const { data, error } = await supabase.from('customers').select('*').eq('id', id).single();
      if (error) {
        console.error('Greška prilikom dohvaćanja klijenta:', error);
      } else {
        setCustomer(data);
      }
    };

    // Dohvati povijest klijenta
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
          date: new Date().toISOString(), // Trenutni datum/vrijeme
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
      setIsFormModalOpen(false); // Close form modal after successful submission

      // Dohvati ažuriranu povijest
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

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openFormModal = () => {
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
  };

  return (
    <div className="pt-16 px-4 max-w-full mx-auto">
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
            <table className="min-w-full divide-y divide-gray-200 mt-4">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Težina</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalj</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcija</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.weight} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.detail}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteRecord(record.id)}
                        className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-800"
                      >
                        Ukloni
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Modal za unos novih podataka */}
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
