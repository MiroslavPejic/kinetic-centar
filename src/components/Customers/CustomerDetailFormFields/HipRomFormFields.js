import React from 'react';

function HipRomFormFields({
  hipRomLeftInternal,
  setHipRomLeftInternal,
  hipRomLeftExternal,
  setHipRomLeftExternal,
  hipRomRightInternal,
  setHipRomRightInternal,
  hipRomRightExternal,
  setHipRomRightExternal
}) {
  return (
    <>
      <div>
        <label htmlFor="hipRomLeftInternal" className="block text-sm font-medium text-gray-700">Hip ROM Left-internal</label>
        <input
          type="text"
          id="hipRomLeftInternal"
          value={hipRomLeftInternal}
          onChange={(e) => setHipRomLeftInternal(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="hipRomLeftExternal" className="block text-sm font-medium text-gray-700">Hip ROM Left-external</label>
        <input
          type="text"
          id="hipRomLeftExternal"
          value={hipRomLeftExternal}
          onChange={(e) => setHipRomLeftExternal(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="hipRomRightInternal" className="block text-sm font-medium text-gray-700">Hip ROM Right-internal</label>
        <input
          type="text"
          id="hipRomRightInternal"
          value={hipRomRightInternal}
          onChange={(e) => setHipRomRightInternal(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="hipRomRightExternal" className="block text-sm font-medium text-gray-700">Hip ROM Right-external</label>
        <input
          type="text"
          id="hipRomRightExternal"
          value={hipRomRightExternal}
          onChange={(e) => setHipRomRightExternal(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </>
  );
}

export default HipRomFormFields;
