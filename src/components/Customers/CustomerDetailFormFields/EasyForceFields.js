import React from 'react';

function EasyForceFields({
  easyForceQuadricepsLeft1,
  setEasyForceQuadricepsLeft1,
  easyForceQuadricepsLeft2,
  setEasyForceQuadricepsLeft2,
  easyForceQuadricepsLeft3,
  setEasyForceQuadricepsLeft3
}) {
  return (
    <>
      <div>
        <label htmlFor="easyForceQuadricepsLeft1" className="block text-sm font-medium text-gray-700">EasyForce Quadriceps Left 1</label>
        <input
          type="text"
          id="easyForceQuadricepsLeft1"
          value={easyForceQuadricepsLeft1}
          onChange={(e) => setEasyForceQuadricepsLeft1(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="easyForceQuadricepsLeft2" className="block text-sm font-medium text-gray-700">EasyForce Quadriceps Left 2</label>
        <input
          type="text"
          id="easyForceQuadricepsLeft2"
          value={easyForceQuadricepsLeft2}
          onChange={(e) => setEasyForceQuadricepsLeft2(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="easyForceQuadricepsLeft3" className="block text-sm font-medium text-gray-700">EasyForce Quadriceps Left 3</label>
        <input
          type="text"
          id="easyForceQuadricepsLeft3"
          value={easyForceQuadricepsLeft3}
          onChange={(e) => setEasyForceQuadricepsLeft3(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </>
  );
}

export default EasyForceFields;
