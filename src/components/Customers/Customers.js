// src/pages/Customers.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabaseClient';
import Modal from '../Modal/Modal'; // Import the Modal component
import { FaTrashAlt } from 'react-icons/fa';
import * as XLSX from 'xlsx'; // Import xlsx for Excel generation

import './customers.css'

// sub-components
import AddNewCustomer from './CustomerMainPage/AddNewCustomers';
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
          <AddNewCustomer
            name={name} setName={setName}
            dateOfBirth={dateOfBirth} setDateOfBirth={setDateOfBirth}
            age={age} setAge={setAge}
            height={height} setHeight={setHeight}
            weight={weight} setWeight={setWeight}
            selectedSport={selectedSport} setSelectedSport={setSelectedSport}
            category={category} setCategory={setCategory}
            playerPosition={playerPosition} setPlayerPosition={setPlayerPosition}
            injuryHistory={injuryHistory} setInjuryHistory={setInjuryHistory}
            injuryNotes={injuryNotes} setInjuryNotes={setInjuryNotes}
            dominantSide={dominantSide} setDominantSide={setDominantSide}
            pathology={pathology} setPathology={setPathology}
            sports={sports}
            calculateAge={calculateAge}
            handleSubmit={handleSubmit}
          />
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
