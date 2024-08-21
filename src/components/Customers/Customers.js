// src/pages/Customers.js
import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseClient'; // Import your Supabase client

function Customers() {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('view'); // State for active tab
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Fetch the current user
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    // Fetch customers on component mount
    const fetchCustomers = async () => {
      const { data, error } = await supabase.from('customers').select('*');
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
      setMessage('You must be signed in to add a customer.');
      return;
    }

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('customers')
      .insert([{ name, date_of_birth: dateOfBirth, user_id: user.id }]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Customer added successfully!');
      // Clear form fields
      setName('');
      setDateOfBirth('');
      // Fetch updated customers
      const { data: newCustomers, error: fetchError } = await supabase.from('customers').select('*');
      if (!fetchError) {
        setCustomers(newCustomers);
      }
    }
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
            Create Customer
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`flex-1 py-2 text-center font-medium text-sm border-b-2 ${
              activeTab === 'view' ? 'border-custom-teal text-custom-teal' : 'border-transparent text-gray-600'
            }`}
          >
            View Customers
          </button>
        </div>

        {/* Conditional Rendering Based on Active Tab */}
        {activeTab === 'create' && (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-center">Add New Customer</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
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
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-custom-teal text-white py-2 px-4 rounded hover:bg-custom-teal-dark w-full"
              >
                Add Customer
              </button>
            </form>
            {message && <p className="mt-4 text-center text-green-500">{message}</p>}
          </div>
        )}

        {activeTab === 'view' && (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-center">Customer List</h1>
            {customers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(customer.date_of_birth).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-600">No customers found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;
