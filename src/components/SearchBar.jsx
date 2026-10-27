function SearchBar({ searchText, onSearch, category, onCategoryChange, categories }) {
  return (
    <div className="search-row">
      <div className="field-group">
        <label htmlFor="model-search">Search by name</label>
        <input id="model-search" value={searchText} onChange={(event) => onSearch(event.target.value)} placeholder="Try Heart or Brain" />
      </div>
      <div className="field-group">
        <label htmlFor="category-filter">Category</label>
        <select id="category-filter" value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="All">All categories</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
    </div>
  );
}

export default SearchBar;