
import { useEffect, useState } from "react";
import axios from "axios";

import RepoList from "../components/RepoList";
import { Link } from "react-router-dom";


function Dashboard() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchStoredRepos = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`https://api-driven-mini-web-app.onrender.com/api/results?page=${pageNum}&limit=${limit}`);
      setRepos(res.data.items || []);
      setTotalPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      alert("Failed to load stored repositories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoredRepos(page);
    // eslint-disable-next-line
  }, [page]);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link to="/">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">&larr; Back to Home</button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-center mb-4">Stored Repositories Dashboard</h1>
      {loading ? (
        <p className="text-center mt-6">Loading...</p>
      ) : (
        <>
          <RepoList repos={repos} />
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages} ({total} repos)
              </span>
              <button
                onClick={handleNext}
                disabled={page === totalPages}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
