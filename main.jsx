import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const scanPrompt = async () => {
    setLoading(true);
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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">🔒 PromptShield AI Risk Scanner</h1>
      <textarea
        className="w-full p-3 border border-gray-300 rounded mb-4"
        rows="6"
        placeholder="Paste your AI prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      ></textarea>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={scanPrompt}
        disabled={loading}
      >
        {loading ? 'Scanning...' : 'Scan Prompt'}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded bg-white shadow">
          <h2 className="text-xl font-semibold">🧠 Risk Score: {result.risk_score}</h2>
          <div className="mt-2">
            <strong>Issues Found:</strong>
            <ul className="list-disc ml-6">
              {result.issues_found.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
          <div className="mt-2">
            <strong>Recommendations:</strong>
            <ul className="list-disc ml-6">
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