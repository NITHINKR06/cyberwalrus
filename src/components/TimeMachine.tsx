import { useState } from 'react';
import { timeMachineService } from '../services/backendApi';
import { Clock, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

interface Scenario {
  id: number;
  name: string;
  year: number;
  description: string;
  red_flags: string[];
  impact: { summary: string };
}

export default function TimeMachine() {
  const [era, setEra] = useState<number | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScenarios = async (year: number) => {
    setIsLoading(true);
    setError(null);
    setEra(year);
    try {
      const data = await timeMachineService.getScenariosByEra(year);
      setScenarios(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch scenarios.');
      setScenarios([]);
    } finally {
      setIsLoading(false);
    }
  };

  const eras = [
    { year: 2015, name: 'Classic Scams' },
    { year: 2025, name: 'Modern Threats' },
    { year: 2035, name: 'Future Frauds' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Scam Time Machine</h1>
        <p className="text-lg text-gray-600">
          Explore interactive challenges from different eras of cyber threats.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        {eras.map(({ year, name }) => (
          <button
            key={year}
            onClick={() => fetchScenarios(year)}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              era === year
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div>
        {isLoading && <p className="text-center">Loading scenarios...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        <div className="space-y-6">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-blue-600">{scenario.year}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{scenario.name}</h3>
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {era === 2015 ? 'Classic' : era === 2025 ? 'Modern' : 'Future'}
                  </div>
                </div>
                <p className="mt-3 text-gray-600">{scenario.description}</p>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-red-600 flex items-center gap-2 mb-2"><AlertTriangle size={18} /> Red Flags</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {scenario.red_flags.map((flag, i) => <li key={i}>{flag}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 flex items-center gap-2 mb-2"><ShieldCheck size={18} /> Impact & Prevention</h4>
                    <p className="text-gray-700">{scenario.impact.summary}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}