// src/pages/Customers.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabaseClient';
import Modal from '../Modal/Modal'; // Import the Modal component
import { FaTrashAlt } from 'react-icons/fa';
import * as XLSX from 'xlsx'; // Import xlsx for Excel generation

import './customers.css'

// sub-components
import ViewCustomers from './CustomerMainPage/ViewCustomers';

function Customers() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [category, setCategory] = useState('');
  const [playerPosition, setPlayerPosition] = useState('');
  const [injuryHistory, setInjuryHistory] = useState('no');
  const [injuryNotes, setInjuryNotes] = useState('');
  const [dominantSide, setDominantSide] = useState('');
  const [pathology, setPathology] = useState('');
  const [sports, setSports] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('view');
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

  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

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
      .insert([{ 
        name, 
        date_of_birth: dateOfBirth, 
        age, 
        height, 
        weight, 
        sport_id: selectedSport, 
        user_id: user.id, 
        category, 
        player_position: playerPosition, 
        injury_history: injuryHistory, 
        injury_notes: injuryNotes, 
        dominant_side: dominantSide,
        pathology: pathology
      }]);

    if (error) {
      setMessage(`Greška: ${error.message}`);
      setMessageType('error');
    } else {
      setMessage('Klijent je uspješno dodan!');
      setMessageType('success');
      // Clear form fields
      setName('');
      setDateOfBirth('');
      setAge('');
      setHeight('');
      setWeight('');
      setSelectedSport('');
      setCategory('');
      setPlayerPosition('');
      setInjuryHistory('no');
      setInjuryNotes('');
      setDominantSide('');
      setPathology('');

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
      setMessage('Klijent je uspješno uklonjen!');
      setMessageType('success');
      // Fetch updated customers
      const { data: newCustomers, error: fetchError } = await supabase.from('customers').select('*').eq('deleted', false);
      if (!fetchError) {
        setCustomers(newCustomers);
      }
    }

    setIsModalOpen(true);
  };

  // Download Excel file
  const handleDownloadExcel = () => {
    const customerData = customers.map(customer => ({
      Ime: customer.name,
      'Datum Rođenja': new Date(customer.date_of_birth).toLocaleDateString(),
      Godine: customer.age,
      Visina: `${customer.height} cm`,
      Težina: `${customer.weight} kg`,
      Sport: sports.find(sport => sport.id === customer.sport_id)?.name || 'N/A',
      Kategorija: customer.category,
      'Pozicija Igrača': customer.player_position,
      'Povijest Ozljeda': customer.injury_history === 'yes' ? 'Da' : 'Ne',
      'Bilješke o Ozljedama': customer.injury_notes || 'N/A',
      'Dominantna Strana': customer.dominant_side === 'left' ? 'Lijeva' : 'Desna',
      Patologija: customer.pathology || 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(customerData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    XLSX.writeFile(workbook, 'customers.xlsx');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="pt-24 px-4 max-w-full mx-auto bg-gradient-to-b from-custom-blue to-white">
      <div className="customer-details bg-white p-6 rounded-lg shadow-lg">
        {/* Tab Bar */}
        <div className="flex border-b border-gray-300 mb-4">
          <button
            onClick={() => setActiveTab('create')}
            className={`py-2 text-center font-medium text-sm border-b-2 w-1/2 ${
              activeTab === 'create' ? 'border-custom-blue text-custom-blue' : 'border-transparent text-gray-600'
            }`}
          >
            Dodaj klijenta
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`py-2 text-center font-medium text-sm border-b-2 flex-1 ${
              activeTab === 'view' ? 'border-custom-blue text-custom-blue' : 'border-transparent text-gray-600'
            }`}
          >
            Pregled klijenta
          </button>
        </div>

        {/* Conditional Rendering Based on Active Tab */}
        {activeTab === 'create' && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Dodaj Novog klijenta</h1>
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
                  onChange={(e) => {
                    setDateOfBirth(e.target.value);
                    setAge(calculateAge(e.target.value));
                  }}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Godine</label>
                <input
                  type="text"
                  id="age"
                  value={age}
                  readOnly
                  className="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-100"
                />
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">Visina (cm)</label>
                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Težina (kg)</label>
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
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
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategorija</label>
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
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
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="injuryHistory" className="block text-sm font-medium text-gray-700">Povijest Ozljeda</label>
                <select
                  id="injuryHistory"
                  value={injuryHistory}
                  onChange={(e) => setInjuryHistory(e.target.value)}
                  required
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
                  />
                </div>
              )}
              <div>
                <label htmlFor="dominantSide" className="block text-sm font-medium text-gray-700">Dominantna Strana</label>
                <select
                  id="dominantSide"
                  value={dominantSide}
                  onChange={(e) => setDominantSide(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                >
                  <option value="" disabled>Odaberite stranu</option>
                  <option value="left">Lijeva</option>
                  <option value="right">Desna</option>
                </select>
              </div>
              <div>
                <label htmlFor="pathology" className="block text-sm font-medium text-gray-700">Patologija</label>
                <input
                  type="text"
                  id="pathology"
                  value={pathology}
                  onChange={(e) => setPathology(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-custom-blue text-white py-2 px-4 rounded hover:bg-teal-700"
              >
                Dodaj klijenta
              </button>
            </form>
          </div>
        )}

        {activeTab === 'view' && (
          <ViewCustomers 
            customers={customers}
            sports={sports}
            handleRemoveCustomer={handleRemoveCustomer}
            handleDownloadExcel={handleDownloadExcel}/>
        )}
      </div>

      {/* Success/Error Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} message={message} type={messageType} />
    </div>
  );
}

export default Customers;
