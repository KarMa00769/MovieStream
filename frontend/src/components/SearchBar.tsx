import { useState } from 'react';

interface Props {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: Props) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex mb-4 mt-4">
      <input
        type="search"
        className="form-control form-control-lg me-2 bg-dark text-white border-secondary"
        placeholder="Buscar películas en OMDb..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn btn-brand btn-lg px-4" type="submit">
        <i className="bi bi-search"></i>
      </button>
    </form>
  );
};
export default SearchBar;
