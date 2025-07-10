import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const riskColors = {
    Low: 'text-green-400',
    Medium: 'text-yellow-400',
    High: 'text-red-500'
  };

  const scanPrompt = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('https://promptshield-api.onrender.com/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error scanning prompt:', error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">🔐 PromptShield</h1>
      <p className="mb-4 text-gray-300 text-center">Scan your AI prompts for security risks like injection, leaks, and exposure.</p>

      <textarea
        className="w-full p-4 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:border-blue-500"
        rows="6"
        placeholder="Paste your AI prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      ></textarea>

      <button
        onClick={scanPrompt}
        disabled={loading || !prompt.trim()}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
      >
        {loading ? 'Scanning...' : 'Scan Prompt'}
      </button>

      {result && (
        <div className="mt-6 bg-gray-700 rounded p-4">
          <h2 className={`text-xl font-bold ${riskColors[result.risk_score]}`}>
            🧠 Risk Score: {result.risk_score}
          </h2>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-200">⚠️ Issues Found</h3>
            {result.issues_found.length > 0 ? (
              <ul className="list-disc ml-6 text-gray-300">
                {result.issues_found.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            ) : (
              <p className="text-green-400">No issues found.</p>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-200">✅ Recommendations</h3>
            <ul className="list-disc ml-6 text-gray-300">
              {result.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);