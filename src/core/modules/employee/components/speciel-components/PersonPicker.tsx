import { useMemo, useState } from "react";
import { Search, User, X } from "lucide-react";
import type { Colleague } from "../../../../../api/models";

export interface PersonPickerProps {
  people: Colleague[];
  isLoading: boolean;
  errorMessage?: string | null;
  value: Colleague | null;
  onChange: (person: Colleague | null) => void;
  label: string;
  placeholder?: string;
}

/**
 * Searchable "who is this about" picker — replaces asking the employee to
 * type a raw user id (which nobody has memorized) with a name/email search
 * over `users/employees` + `users/managers`. Names in that data aren't
 * unique, so every result shows department/email too and selection is
 * keyed by id, not by the text in the box.
 */
export function PersonPicker({
  people,
  isLoading,
  errorMessage,
  value,
  onChange,
  label,
  placeholder = "Search by name or email…",
}: PersonPickerProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return people.slice(0, 8);
    return people
      .filter(
        (person) =>
          person.name.toLowerCase().includes(q) ||
          person.email.toLowerCase().includes(q) ||
          (person.department ?? "").toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [people, query]);

  if (value) {
    return (
      <div>
        <p className="block text-xs text-gray-500 mb-1">{label}</p>
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50">
          <div className="min-w-0">
            <p className="text-sm font-medium text-dark truncate">{value.name}</p>
            <p className="text-xs text-gray-400 truncate">
              {value.email}
              {value.department ? ` · ${value.department}` : ""}
              {value.role === "manager" ? " · Manager" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            aria-label="Change selection"
            title="Change"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <label htmlFor="person-picker-input" className="block text-xs text-gray-500 mb-1">
        {label}
      </label>
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input
          id="person-picker-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full max-h-56 overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-lg">
          {isLoading ? (
            <p className="px-3 py-2 text-xs text-gray-400">Loading people…</p>
          ) : errorMessage ? (
            <p className="px-3 py-2 text-xs text-red-600">{errorMessage}</p>
          ) : matches.length === 0 ? (
            <p className="px-3 py-2 text-xs text-gray-400">No matches.</p>
          ) : (
            matches.map((person) => (
              <button
                key={`${person.role}-${person.id}`}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(person);
                  setQuery("");
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors"
              >
                <User size={14} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-sm text-dark truncate">{person.name}</span>
                  <span className="block text-xs text-gray-400 truncate">
                    {person.email}
                    {person.department ? ` · ${person.department}` : ""}
                    {person.role === "manager" ? " · Manager" : ""}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
