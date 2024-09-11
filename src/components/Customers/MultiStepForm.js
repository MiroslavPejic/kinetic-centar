import React, { useState } from 'react';

// Import your field components
import BaseFields from './CustomerDetailFormFields/BaseFields';
import HipRomFormFields from './CustomerDetailFormFields/HipRomFormFields';
import EasyForceFields from './CustomerDetailFormFields/EasyForceFields';

function MultiStepForm({
  newWeight, setNewWeight,
  newDetail, setNewDetail,
  flexibility, setFlexibility,
  hipRomLeftInternal, setHipRomLeftInternal,
  hipRomLeftExternal, setHipRomLeftExternal,
  hipRomRightInternal, setHipRomRightInternal,
  hipRomRightExternal, setHipRomRightExternal,
  easyForceQuadricepsLeft1, setEasyForceQuadricepsLeft1,
  easyForceQuadricepsLeft2, setEasyForceQuadricepsLeft2,
  easyForceQuadricepsLeft3, setEasyForceQuadricepsLeft3,
  handleAddRecord, closeFormModal
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <form onSubmit={handleAddRecord} className="space-y-4">
      {currentStep === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Step 1: Base Information</h2>
          <BaseFields
            newWeight={newWeight}
            setNewWeight={setNewWeight}
            newDetail={newDetail}
            setNewDetail={setNewDetail}
            flexibility={flexibility}
            setFlexibility={setFlexibility}
          />
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Step 2: Hip ROM Information</h2>
          <HipRomFormFields
            hipRomLeftInternal={hipRomLeftInternal}
            setHipRomLeftInternal={setHipRomLeftInternal}
            hipRomLeftExternal={hipRomLeftExternal}
            setHipRomLeftExternal={setHipRomLeftExternal}
            hipRomRightInternal={hipRomRightInternal}
            setHipRomRightInternal={setHipRomRightInternal}
            hipRomRightExternal={hipRomRightExternal}
            setHipRomRightExternal={setHipRomRightExternal}
          />
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Step 2: Hip ROM Information</h2>
          <EasyForceFields 
            easyForceQuadricepsLeft1={easyForceQuadricepsLeft1}
            setEasyForceQuadricepsLeft1={setEasyForceQuadricepsLeft1}
            easyForceQuadricepsLeft2={easyForceQuadricepsLeft2}
            setEasyForceQuadricepsLeft2={setEasyForceQuadricepsLeft2}
            easyForceQuadricepsLeft3={easyForceQuadricepsLeft3}
            setEasyForceQuadricepsLeft3={setEasyForceQuadricepsLeft3}
          />
        </div>
      )}

      <div className="flex justify-between">
        {/* Page Indicator */}
        <div className="text-gray-500">
          {currentStep} / {totalSteps}
        </div>
        <div className="flex justify-end">
            {currentStep > 1 && (
            <button
                type="button"
                onClick={handlePrevious}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 mr-2"
            >
                Prethodni
            </button>
            )}

            {currentStep < 3 && (
            <button
                type="button"
                onClick={handleNext}
                className="bg-custom-blue text-white py-2 px-4 rounded hover:bg-teal-700"
            >
                Sljedeći
            </button>
            )}

            {currentStep === 3 && (
            <>
                <button
                type="button"
                onClick={closeFormModal}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-gray-700 mr-2"
                >
                Odustani
                </button>
                <button
                type="submit"
                className="bg-custom-blue text-white py-2 px-4 rounded hover:bg-teal-700"
                >
                Dodaj Zapis
                </button>
            </>
            )}
        </div>
      </div>
    </form>
  );
}

export default MultiStepForm;
