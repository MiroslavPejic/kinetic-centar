import React from 'react';

function EasyForceFields({
  easyForceQuadriceps1,
  setEasyForceQuadriceps1,
  easyForceQuadriceps2,
  setEasyForceQuadriceps2,
  easyForceQuadriceps3,
  setEasyForceQuadriceps3
}) {
  return (
    <>
      <div>
        <label htmlFor="easyForceQuadriceps1" className="block text-sm font-medium text-gray-700">EasyForce Quadriceps 1</label>
        <input
          type="text"
          id="easyForceQuadriceps1"
          value={easyForceQuadriceps1}
          onChange={(e) => setEasyForceQuadriceps1(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="easyForceQuadriceps2" className="block text-sm font-medium text-gray-700">EasyForce Quadriceps 2</label>
        <input
          type="text"
          id="easyForceQuadriceps2"
          value={easyForceQuadriceps2}
          onChange={(e) => setEasyForceQuadriceps2(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="easyForceQuadriceps3" className="block text-sm font-medium text-gray-700">EasyForce Quadriceps 3</label>
        <input
          type="text"
          id="easyForceQuadriceps3"
          value={easyForceQuadriceps3}
          onChange={(e) => setEasyForceQuadriceps3(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </>
  );
}

export default EasyForceFields;
