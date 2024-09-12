import React from 'react';

function EasyForceQuadRightFields({
  easyForceQuadricepsRight1,
  setEasyForceQuadricepsRight1,
  easyForceQuadricepsRight2,
  setEasyForceQuadricepsRight2,
  easyForceQuadricepsRight3,
  setEasyForceQuadricepsRight3
}) {
  return (
    <>
      <div>
        <label htmlFor="easyForceQuadricepsRight1" className="block text-sm font-medium text-gray-700">EasyForce Quadriceps Right 1</label>
        <input
          type="text"
          id="easyForceQuadricepsRight1"
          value={easyForceQuadricepsRight1}
          onChange={(e) => setEasyForceQuadricepsRight1(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="easyForceQuadricepsRight2" className="block text-sm font-medium text-gray-700">EasyForce Quadriceps Right 2</label>
        <input
          type="text"
          id="easyForceQuadricepsRight2"
          value={easyForceQuadricepsRight2}
          onChange={(e) => setEasyForceQuadricepsRight2(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="easyForceQuadricepsRight3" className="block text-sm font-medium text-gray-700">EasyForce Quadriceps Right 3</label>
        <input
          type="text"
          id="easyForceQuadricepsRight3"
          value={easyForceQuadricepsRight3}
          onChange={(e) => setEasyForceQuadricepsRight3(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </>
  );
}

export default EasyForceQuadRightFields;
