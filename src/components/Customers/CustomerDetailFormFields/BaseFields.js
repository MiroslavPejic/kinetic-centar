import React from 'react';

function BaseFields({
  newWeight,
  setNewWeight,
  newDetail,
  setNewDetail,
  flexibility,
  setFlexibility
}) {
  return (
    <>
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
    </>
  );
}

export default BaseFields;
