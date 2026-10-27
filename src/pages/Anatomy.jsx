import { useState, useEffect } from "react";
import AnatomyCard from "../components/AnatomyCard";
import SearchBar from "../components/SearchBar";
import { Link } from "react-router-dom";
import initialModels from "../data/models.json";

function Anatomy({ isLoggedIn, onLogin }) {
  const [models] = useState(initialModels);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All");
  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("anatomyApp_favourites") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("anatomyApp_favourites", JSON.stringify(favourites));
  }, [favourites]);

  const categories = [...new Set(models.map((model) => model.category))];
  const visibleModels = models.filter((model) => {
    const matchesName =
      model.name.toLowerCase().includes(searchText.toLowerCase()) ||
      model.description.toLowerCase().includes(searchText.toLowerCase());
    return matchesName && (category === "All" || model.category === category);
  });

  const toggleFavourite = (id) =>
    setFavourites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );

  if (!isLoggedIn) {
    return (
      <div className="container access-message">
        <p className="eyebrow">Authentication</p>
        <h1>Demo Login Required</h1>
        <p>Log in with any demo credentials to browse the full anatomy catalogue.</p>
        <div style={{ display: "flex", gap: "12px", marginTop: "18px" }}>
          <button className="button" onClick={onLogin}>
            Quick 1-Click Login & Explore
          </button>
          <Link className="button" style={{ background: "#5e6c75" }} to="/">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container catalogue">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Anatomy Catalogue</p>
          <h1>Explore Anatomy Models</h1>
        </div>
        <p>
          {visibleModels.length} of {models.length} models shown
        </p>
      </div>

      <SearchBar
        searchText={searchText}
        onSearch={setSearchText}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
      />

      <section className="card-grid" aria-label="Anatomy models">
        {visibleModels.map((model) => (
          <AnatomyCard
            key={model.id}
            model={model}
            isFavourite={favourites.includes(model.id)}
            onFavourite={toggleFavourite}
          />
        ))}
      </section>

      {visibleModels.length === 0 && (
        <div className="model-unavailable" style={{ marginTop: "30px" }}>
          <h2>No matching models found</h2>
          <p>Try clearing your search keyword or switching category filter.</p>
        </div>
      )}
    </div>
  );
}

export default Anatomy;
