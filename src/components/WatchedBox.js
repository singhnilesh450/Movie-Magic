import { useState } from "react";
import MovieSummary from "./MovieSummary";
import WatchedMOvieList from "./WatchedMOvieList";

export default function WatchedBox({ watched }) {
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <MovieSummary watched={watched} />
          <WatchedMOvieList watched={watched} />
        </>
      )}
    </div>
  );
}
