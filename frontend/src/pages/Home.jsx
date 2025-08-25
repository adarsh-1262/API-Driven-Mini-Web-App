
import { useState } from "react";
import axios from "axios";
import SearchForm from "../components/SearchForm";
import RepoList from "../components/RepoList";
import { Link } from "react-router-dom";


function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRepos = async (keyword) => {
    try {
      setLoading(true);
      setError("");
      setSearchResults([]);
      const res = await axios.post("https://api-driven-mini-web-app.onrender.com/api/search", { keyword });
      // The backend returns a 'returnedSample' array
      setSearchResults(res.data.returnedSample || []);
    } catch (err) {
      setError("Failed to fetch repositories");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center">GitHub Repo Finder</h1>
      <div className="flex justify-end mb-2">
        <Link to="/dashboard">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Go to Dashboard</button>
        </Link>
      </div>
      <SearchForm onSearch={fetchRepos} />
      {loading && <p className="text-center mt-6">Loading...</p>}
      {error && <p className="text-center text-red-500 mt-6">{error}</p>}
      {!loading && !error && searchResults.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-center mt-6">Search Results</h2>
          <RepoList repos={searchResults.map(r => ({
            id: r.id,
            name: r.name,
            description: r.description || '',
            html_url: r.html_url || r.htmlUrl || r.url,
            stars: r.stars,
            language: r.language,
          }))} />
        </div>
      )}
    </div>
  );
}

export default Home;
