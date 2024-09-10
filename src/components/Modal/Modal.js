// src/components/Modal.js
import React from 'react';

function Modal({ isOpen, onClose, message, type, modalContent = null, width = '300px'}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 w-5">
      <div className="fixed inset-0 bg-gray-600 opacity-50"></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-10 max-w-sm" style={{ width: width}}>
        {
          modalContent !== null
          ? modalContent
          : 
            <>
              <h2 className={`text-lg font-bold mb-4 ${type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {type === 'error' ? 'Error' : 'Success'}
              </h2>
              <p>{message}</p>
              <button
                className="mt-4 bg-custom-teal text-white py-2 px-4 rounded hover:bg-custom-teal-dark"
                onClick={onClose}
              >
                Close
              </button>
            </>
        }
      </div>
    </div>
  );
}

export default Modal;
