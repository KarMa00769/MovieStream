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
    <form onSubmit={handleSubmit} className="d-flex mb-4 mt-4" role="search" aria-label="Buscar pel&iacute;culas en OMDb">
      <input
        id="search-section"
        type="search"
        className="form-control form-control-lg me-2 bg-dark text-white border-secondary"
        placeholder="Buscar pel&iacute;culas en OMDb..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="T&eacute;rmino de b&uacute;squeda"
      />
      <button className="btn btn-brand btn-lg px-4" type="submit" aria-label="Buscar">
        <i className="bi bi-search"></i>
      </button>
    </form>
  );
};
export default SearchBar;
