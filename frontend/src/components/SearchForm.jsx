import { useState } from "react";

function SearchForm({ onSearch }) {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword);
      setKeyword("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 items-center justify-center mt-6"
    >
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Enter GitHub username"
        className="border rounded p-2 w-64"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
}

export default SearchForm;
