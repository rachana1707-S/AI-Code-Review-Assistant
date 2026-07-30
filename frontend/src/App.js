import Upload from "./components/Upload";

function App() {
return (
  <div className="max-w-2xl mx-auto">

    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl">

      <h2 className="text-2xl font-semibold mb-4">
        Upload Code for Review
      </h2>

      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg transition"
      >
        {loading ? "Analyzing..." : "Analyze Code"}
      </button>

    </div>

    {result && (
      <div className="mt-6 bg-gray-800 p-6 rounded-xl">

        <h3 className="text-xl mb-2">Results</h3>

        <pre className="bg-black p-4 rounded text-sm overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>

      </div>
    )}

  </div>
);
}

export default App;