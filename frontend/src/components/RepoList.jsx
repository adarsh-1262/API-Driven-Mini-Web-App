
import { useState } from "react";

function RepoList({ repos }) {
  const [expanded, setExpanded] = useState({});

  if (!repos.length) {
    return <p className="text-center mt-6">No repositories found.</p>;
  }

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      style={{ maxHeight: '70vh', overflowY: 'auto', width: '100%' }}
      className="flex justify-center"
    >
      <div className="grid gap-4 mt-6 max-w-3xl w-full">
        {repos.map((repo) => {
          const desc = repo.description || "No description";
          const isLong = desc.split("\n").length > 5 || desc.length > 350;
          const showAll = expanded[repo._id || repo.id];
          return (
            <div
              key={repo._id || repo.id}
              className="border rounded p-4 shadow hover:shadow-md bg-white w-full"
              style={{ minWidth: 0 }}
            >
              <h2 className="font-bold text-lg break-words">{repo.name}</h2>
              <div className="mt-2 mb-2">
                <p
                  className={
                    !showAll && isLong
                      ? "overflow-hidden text-ellipsis" : ""
                  }
                  style={
                    !showAll && isLong
                      ? { display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", maxHeight: "7.5em", whiteSpace: "pre-line" }
                      : { whiteSpace: "pre-line" }
                  }
                >
                  {desc}
                </p>
                {isLong && (
                  <button
                    className="text-blue-500 underline text-sm mt-1 focus:outline-none cursor-pointer"
                    onClick={() => toggleExpand(repo._id || repo.id)}
                  >
                    {showAll ? "Show less" : "more..."}
                  </button>
                )}
              </div>
              <a
                href={repo.html_url || repo.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Repo
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RepoList;
