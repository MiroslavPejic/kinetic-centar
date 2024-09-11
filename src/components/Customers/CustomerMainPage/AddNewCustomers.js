function AddNewCustomer({
    name, setName,
    dateOfBirth, setDateOfBirth,
    age, setAge,
    height, setHeight,
    weight, setWeight,
    selectedSport, setSelectedSport,
    category, setCategory,
    playerPosition, setPlayerPosition,
    injuryHistory, setInjuryHistory,
    injuryNotes, setInjuryNotes,
    dominantSide, setDominantSide,
    pathology, setPathology,
    sports, calculateAge, handleSubmit
}) {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Dodaj Novog klijenta</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Ime</label>
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
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Datum Rođenja</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={dateOfBirth}
                  onChange={(e) => {
                    setDateOfBirth(e.target.value);
                    setAge(calculateAge(e.target.value));
                  }}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Godine</label>
                <input
                  type="text"
                  id="age"
                  value={age}
                  readOnly
                  className="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-100"
                />
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">Visina (cm)</label>
                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Težina (kg)</label>
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="sport" className="block text-sm font-medium text-gray-700">Sport</label>
                <select
                  id="sport"
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                >
                  <option value="" disabled>Odaberite sport</option>
                  {sports.map((sport) => (
                    <option key={sport.id} value={sport.id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategorija</label>
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="playerPosition" className="block text-sm font-medium text-gray-700">Pozicija Igrača</label>
                <input
                  type="text"
                  id="playerPosition"
                  value={playerPosition}
                  onChange={(e) => setPlayerPosition(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="injuryHistory" className="block text-sm font-medium text-gray-700">Povijest Ozljeda</label>
                <select
                  id="injuryHistory"
                  value={injuryHistory}
                  onChange={(e) => setInjuryHistory(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                >
                  <option value="no">Ne</option>
                  <option value="yes">Da</option>
                </select>
              </div>
              {injuryHistory === 'yes' && (
                <div>
                  <label htmlFor="injuryNotes" className="block text-sm font-medium text-gray-700">Bilješke o Ozljedama</label>
                  <textarea
                    id="injuryNotes"
                    value={injuryNotes}
                    onChange={(e) => setInjuryNotes(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              )}
              <div>
                <label htmlFor="dominantSide" className="block text-sm font-medium text-gray-700">Dominantna Strana</label>
                <select
                  id="dominantSide"
                  value={dominantSide}
                  onChange={(e) => setDominantSide(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                >
                  <option value="" disabled>Odaberite stranu</option>
                  <option value="left">Lijeva</option>
                  <option value="right">Desna</option>
                </select>
              </div>
              <div>
                <label htmlFor="pathology" className="block text-sm font-medium text-gray-700">Patologija</label>
                <input
                  type="text"
                  id="pathology"
                  value={pathology}
                  onChange={(e) => setPathology(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-custom-blue text-white py-2 px-4 rounded hover:bg-teal-700"
              >
                Dodaj klijenta
              </button>
            </form>
          </div>
    )
};

export default AddNewCustomer;

