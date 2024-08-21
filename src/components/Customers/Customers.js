// src/pages/Customers.js
import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseClient'; // Import your Supabase client
import Modal from '../Modal/Modal'; // Import the Modal component
import { FaTrashAlt } from 'react-icons/fa';

function Customers() {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [sports, setSports] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('create');
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch the current user
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    // Fetch sports from the database
    const fetchSports = async () => {
      const { data, error } = await supabase.from('sports').select('*');
      if (error) {
        console.error('Error fetching sports:', error);
      } else {
        setSports(data);
      }
    };

    fetchSports();
  }, []);

  useEffect(() => {
    // Fetch customers on component mount
    const fetchCustomers = async () => {
      const { data, error } = await supabase.from('customers').select('*').eq('deleted', false);
      if (error) {
        console.error('Error fetching customers:', error);
      } else {
        setCustomers(data);
      }
    };

    fetchCustomers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setMessage('Morate biti prijavljeni za dodavanje kupca.');
      setMessageType('error');
      setIsModalOpen(true);
      return;
    }

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('customers')
      .insert([{ name, date_of_birth: dateOfBirth, sport_id: selectedSport, user_id: user.id }]);

    if (error) {
      setMessage(`Greška: ${error.message}`);
      setMessageType('error');
    } else {
      setMessage('Kupac je uspješno dodan!');
      setMessageType('success');
      // Clear form fields
      setName('');
      setDateOfBirth('');
      setSelectedSport('');
      // Fetch updated customers
      const { data: newCustomers, error: fetchError } = await supabase.from('customers').select('*').eq('deleted', false);
      if (!fetchError) {
        setCustomers(newCustomers);
      }
    }

    setIsModalOpen(true);
  };

  const handleRemoveCustomer = async (id) => {
    const { error } = await supabase
      .from('customers')
      .update({ deleted: true })
      .match({ id });

    if (error) {
      setMessage(`Greška: ${error.message}`);
      setMessageType('error');
    } else {
      setMessage('Kupac je uspješno uklonjen!');
      setMessageType('success');
      // Fetch updated customers
      const { data: newCustomers, error: fetchError } = await supabase.from('customers').select('*').eq('deleted', false);
      if (!fetchError) {
        setCustomers(newCustomers);
      }
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="pt-16 px-4 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* Tab Bar */}
        <div className="flex border-b border-gray-300 mb-4">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 text-center font-medium text-sm border-b-2 ${
              activeTab === 'create' ? 'border-custom-teal text-custom-teal' : 'border-transparent text-gray-600'
            }`}
          >
            Dodaj Kupca
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`flex-1 py-2 text-center font-medium text-sm border-b-2 ${
              activeTab === 'view' ? 'border-custom-teal text-custom-teal' : 'border-transparent text-gray-600'
            }`}
          >
            Pregled Kupaca
          </button>
        </div>

        {/* Conditional Rendering Based on Active Tab */}
        {activeTab === 'create' && (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-center">Dodaj Novog Kupca</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Ime</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Datum Rođenja</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="sport" className="block text-sm font-medium text-gray-700">Sport</label>
                <select
                  id="sport"
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                >
                  <option value="" disabled>Odaberite sport</option>
                  {sports.map((sport) => (
                    <option key={sport.id} value={sport.id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-custom-teal text-white py-2 px-4 rounded hover:bg-custom-teal-dark w-full"
              >
                Dodaj Kupca
              </button>
            </form>
          </div>
        )}

        {activeTab === 'view' && (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-center">Lista Kupaca</h1>
            {customers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ime</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum Rođenja</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(customer.date_of_birth).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sports.find(sport => sport.id === customer.sport_id)?.name || 'Nepoznat'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleRemoveCustomer(customer.id)}
                            className="text-red-600 hover:text-red-800 flex items-center"
                          >
                            <FaTrashAlt className="mr-1" />
                            Ukloni
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">Nema kupaca</p>
            )}
          </div>
        )}
      </div>

      {/* Success/Error Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} message={message} type={messageType} />
    </div>
  );
}

export default Customers;
