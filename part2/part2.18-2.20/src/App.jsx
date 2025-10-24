import { useState , useEffect} from 'react'
import axios from 'axios'

const DetailItem = ({ label, value }) => (
  <div className="flex justify-between py-2">
    <span className="font-semibold text-gray-600 dark:text-gray-400">{label}:</span>
    <span className="text-gray-900 dark:text-gray-200">{value}</span>
  </div>
)

const formatNumber = (num) => {
  return num.toLocaleString();
}

const Display = ({countries, setSelectedCountry}) => {
  if(countries.length > 50) { 
    return (
      <p className="mt-4 p-4 text-center bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200">
        Too many countries to display. Please narrow search.
      </p>
    );
  }

  if (countries.length === 0) {
    return (
      <p className="mt-4 p-4 text-center bg-red-100 border border-red-300 text-red-800 rounded-lg dark:bg-red-900 dark:border-red-700 dark:text-red-200">
        No countries matched search .
      </p>
    );
  }

  if (countries.length === 1) {
    return <DisplayCountry country={countries[0]} setSelectedCountry={setSelectedCountry} />;
  }

  return (
    <ul className="mt-6 space-y-3 max-h-[70vh] overflow-y-auto pr-2">
      {countries.map(country => (
        <li
          key={country.cca3}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-200 border border-gray-200 dark:border-gray-700"
        >
          <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {country.name.common}
          </span>
          <button
            onClick={() => setSelectedCountry(country)}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full shadow-lg shadow-indigo-500/50 hover:bg-indigo-700 transition duration-150 transform hover:scale-105"
          >
            View Details
          </button>
        </li>
      ))}
    </ul>
  );
};


const DisplayCountry = ({ country }) => {
    // Safely extract nested data
    const commonName = country.name?.common || 'N/A';
    const officialName = country.name?.official || 'N/A';
    const capital = country.capital?.[0] || 'N/A';
    const region = country.region || 'N/A';
    const subregion = country.subregion || 'N/A';
    const population = country.population;
    const area = country.area;
    const flagUrl = country.flags?.svg || country.flags?.png;
    const coatOfArmsUrl = country.coatOfArms?.svg || country.coatOfArms?.png;

    // Process languages
    const languages = country.languages
        ? Object.values(country.languages).join(', ')
        : 'N/A';

    // Process currencies
    const currencies = country.currencies
        ? Object.values(country.currencies)
              .map(c => `${c.name} (${c.symbol})`)
              .join(' | ')
        : 'N/A';

    return (
        <div className="w-full bg-white shadow-2xl rounded-xl overflow-hidden dark:bg-gray-800 transition duration-300">

            {/* Header - Name and Flag */}
            <div className="relative p-6 sm:p-8 bg-indigo-600 dark:bg-indigo-800 text-white flex flex-col sm:flex-row items-center justify-between">
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">
                        {commonName}
                    </h1>
                    <p className="text-lg font-light opacity-80">
                        {officialName}
                    </p>
                </div>

                {flagUrl && (
                    <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
                        <img
                            src={flagUrl}
                            alt={`Flag of ${commonName}`}
                            className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded-lg shadow-xl border-4 border-white dark:border-gray-700"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/128x80/cccccc/333333?text=Flag+Not+Found"; }}
                        />
                    </div>
                )}
            </div>

            {/* Main Details Grid */}
            <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white border-b pb-2 border-indigo-100 dark:border-indigo-900">
                    Geographical & Political Data
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <div className="space-y-1">
                        <DetailItem label="Capital" value={capital} />
                        <DetailItem label="Region" value={region} />
                        <DetailItem label="Subregion" value={subregion} />
                        <DetailItem label="Top Level Domain (TLD)" value={country.tld?.join(', ') || 'N/A'} />
                        <DetailItem label="Independent" value={country.independent ? 'Yes' : 'No'} />
                    </div>
                    <div className="space-y-1 mt-4 md:mt-0">
                        <DetailItem label="Population" value={population ? formatNumber(population) : 'N/A'} />
                        <DetailItem label="Area" value={area ? `${formatNumber(area)} km²` : 'N/A'} />
                        <DetailItem label="Calling Code" value={`${country.idd?.root}${country.idd?.suffixes?.[0] || ''}`} />
                        <DetailItem label="Start of Week" value={country.startOfWeek ? country.startOfWeek.charAt(0).toUpperCase() + country.startOfWeek.slice(1) : 'N/A'} />
                        <DetailItem label="UN Member" value={country.unMember ? 'Yes' : 'No'} />
                    </div>
                </div>

                {/* Language and Currency Sections */}
                <div className="mt-8 pt-4 border-t border-indigo-100 dark:border-indigo-900">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">Key Systems</h3>
                    <DetailItem label="Official Languages" value={languages} />
                    <DetailItem label="Currencies" value={currencies} />
                    <DetailItem label="Timezones" value={country.timezones?.join(', ') || 'N/A'} />
                </div>

                {/* Coat of Arms and Map Link */}
                <div className="mt-8 pt-4 border-t border-indigo-100 dark:border-indigo-900 flex flex-col sm:flex-row items-center justify-between gap-6">
                    {coatOfArmsUrl && (
                        <div className="text-center">
                            <h4 className="font-semibold text-gray-600 mb-2 dark:text-gray-300">Coat of Arms</h4>
                            <img
                                src={coatOfArmsUrl}
                                alt={`Coat of Arms of ${commonName}`}
                                className="w-24 h-24 object-contain mx-auto rounded-full p-2 bg-gray-100 dark:bg-gray-700 shadow-md"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/cccccc/333333?text=CoA"; }}
                            />
                        </div>
                    )}
                    <div className="flex-1 text-center sm:text-right">
                        <h4 className="font-semibold text-gray-600 mb-2 dark:text-gray-300">View Map</h4>
                        {country.maps?.googleMaps && (
                            <a
                                href={country.maps.googleMaps}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out transform hover:scale-[1.02]"
                            >
                                Open Google Maps
                                <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Filter = ({countries , search , setSelectedCountry}) => {
  const filter_countries = countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))
  return (
    <Display countries={filter_countries} setSelectedCountry={setSelectedCountry}/>
  )
}

function App() {
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry , setSelectedCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Effect ran");
      console.log("Fetching country data");
      axios.get(
        `https://studies.cs.helsinki.fi/restcountries/api/all`
      ).then(response => {
        setCountries(response.data)
        setIsLoading(false);
      }).catch(error => {
        console.log("Could not fetch all countries");
        setError("Failed to fetch country data. Please check your network connection.");
        setIsLoading(false);
      })
    }, []) // get all countries once

  const handleChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null) // Reset selected country when searching
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8 font-inter antialiased">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-8 text-center">
            Global Country Explorer
        </h1>

        <div className="mb-8">
            <input
                value={search}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white dark:bg-gray-700 transition duration-150 text-lg"
                placeholder="Start typing to search for a country..."
                aria-label="Search for country"
            />
        </div>

        {isLoading && (
            <p className="text-center text-indigo-600 dark:text-indigo-400">Loading all country data, please wait...</p>
        )}

        {error && (
            <p className="text-center text-red-600 dark:text-red-400">Error: {error}</p>
        )}

        {!isLoading && !error && (
            selectedCountry ? (
                <DisplayCountry country={selectedCountry} setSelectedCountry={setSelectedCountry} />
            ) : (
                <Filter countries={countries} search={search} setSelectedCountry={setSelectedCountry} />
            )
        )}
      </div>
    </div>
  )
}


export default App
