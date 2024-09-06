import React from 'react';

import { useNavigate } from 'react-router-dom';

function ViewCustomers({
  customers,
  sports,
  handleRemoveCustomer,
  handleDownloadExcel
}) {
    const navigate = useNavigate();
    
    const handleViewCustomer = (id) => {
      navigate(`/customers/${id}`);
    };

  return (
    <>
          <div className="overflow-x-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Pregled Klijenta</h1>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ime</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum Rođenja</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Godine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visina</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Težina</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategorija</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pozicija Igrača</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Povijest Ozljeda</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bilješke o Ozljedama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dominantna Strana</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patologija</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Akcija</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(customer.date_of_birth).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.height} cm</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.weight} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sports.find((sport) => sport.id === customer.sport_id)?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.player_position}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.injury_history === 'yes' ? 'Da' : 'Ne'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.injury_notes || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.dominant_side === 'left' ? 'Lijeva' : 'Desna'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.pathology || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleViewCustomer(customer.id)}
                        className="bg-custom-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        informacija
                      </button>
                      &nbsp;
                      <button
                        onClick={() => handleRemoveCustomer(customer.id)}
                        className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Ukloni
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleDownloadExcel}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
            Preuzmi Excel
          </button>
    </>
  );
}

export default ViewCustomers;
