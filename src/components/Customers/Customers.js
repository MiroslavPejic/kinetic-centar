import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';
import Modal from '../Modal/Modal';
import { FaTrashAlt } from 'react-icons/fa';

function Customers() {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [category, setCategory] = useState('');
  const [playerPosition, setPlayerPosition] = useState('');
  const [injuryHistory, setInjuryHistory] = useState('no');
  const [injuryNotes, setInjuryNotes] = useState('');
  const [dominantSide, setDominantSide] = useState('');
  const [sports, setSports] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('create');
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  useEffect(() => {
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

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleDateOfBirthChange = (e) => {
    const dob = e.target.value;
    setDateOfBirth(dob);
    if (dob) {
      const calculatedAge = calculateAge(dob);
      setAge(calculatedAge);
    } else {
      setAge('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setMessage('Morate biti prijavljeni za dodavanje kupca.');
      setMessageType('error');
      setIsModalOpen(true);
      return;
    }

    const { data, error } = await supabase
      .from('customers')
      .insert([{
        name,
        date_of_birth: dateOfBirth,
        sport_id: selectedSport,
        user_id: user.id,
        age,
        category,
        player_position: playerPosition,
        injury_history: injuryHistory === 'yes',
        injury_notes: injuryNotes,
        dominant_side: dominantSide
      }]);

    if (error) {
      setMessage(`Greška: ${error.message}`);
      setMessageType('error');
    } else {
      setMessage('Kupac je uspješno dodan!');
      setMessageType('success');
      setName('');
      setDateOfBirth('');
      setSelectedSport('');
      setAge('');
      setCategory('');
      setPlayerPosition('');
      setInjuryHistory('no');
      setInjuryNotes('');
      setDominantSide('');
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
                  onChange={handleDateOfBirthChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Dob</label>
                <input
                  type="text"
                  id="age"
                  value={age}
                  readOnly
                  disabled
                  className="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="selectedSport" className="block text-sm font-medium text-gray-700">Sport</label>
                <select
                  id="selectedSport"
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Odaberite sport</option>
                  {sports.map(sport => (
                    <option key={sport.id} value={sport.id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategorija</label>
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="playerPosition" className="block text-sm font-medium text-gray-700">Pozicija Igrača</label>
                <input
                  type="text"
                  id="playerPosition"
                  value={playerPosition}
                  onChange={(e) => setPlayerPosition(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="injuryHistory" className="block text-sm font-medium text-gray-700">Povijest Ozljeda</label>
                <select
                  id="injuryHistory"
                  value={injuryHistory}
                  onChange={(e) => setInjuryHistory(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                >
                  <option value="no">Ne</option>
                  <option value="yes">Da</option>
                </select>
              </div>
              {injuryHistory === 'yes' && (
                <div>
                  <label htmlFor="injuryNotes" className="block text-sm font-medium text-gray-700">Bilješke o Ozljedama</label>
                  <textarea
                    id="injuryNotes"
                    value={injuryNotes}
                    onChange={(e) => setInjuryNotes(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    rows="3"
                  ></textarea>
                </div>
              )}
              <div>
                <label htmlFor="dominantSide" className="block text-sm font-medium text-gray-700">Dominantna Strana Tijela</label>
                <select
                  id="dominantSide"
                  value={dominantSide}
                  onChange={(e) => setDominantSide(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Odaberite stranu</option>
                  <option value="left">Lijeva</option>
                  <option value="right">Desna</option>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dob</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategorija</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pozicija</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Povijest Ozljeda</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bilješke</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dominantna Strana</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(customer.date_of_birth).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.age}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sports.find(sport => sport.id === customer.sport_id)?.name || 'Nepoznat'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.player_position}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.injury_history ? 'Da' : 'Ne'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.injury_notes || 'Nema'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.dominant_side === 'left' ? 'Lijeva' : 'Desna'}</td>
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

      <Modal isOpen={isModalOpen} onClose={closeModal} message={message} type={messageType} />
    </div>
  );
}

export default Customers;
