import { useMemo, useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import "./IataDashboard.scss";

interface FreightForwarder {
  code: string;
  name: string;
  country: string;
  address: string;
  cass: string;
  status: "Active" | "Pending" | "Inactive";
}

const FF_DATA: FreightForwarder[] = [
  {
    code: "DHLC",
    name: "DHL Global Forwarding",
    country: "Germany",
    address: "53844 Troisdorf, Germany",
    cass: "01-234",
    status: "Active",
  },
  {
    code: "KUEH",
    name: "Kuehne + Nagel International AG",
    country: "Switzerland",
    address: "Schindellegi, Switzerland",
    cass: "02-315",
    status: "Pending",
  },
  {
    code: "DBEN",
    name: "DB Schenker",
    country: "Germany",
    address: "Frankfurt, Germany",
    cass: "03-111",
    status: "Active",
  },
  {
    code: "DSVA",
    name: "DSV Air & Sea",
    country: "Denmark",
    address: "Copenhagen, Denmark",
    cass: "04-228",
    status: "Inactive",
  },
  {
    code: "GATI",
    name: "GATI-KWE Ltd.",
    country: "India",
    address: "Mumbai, India",
    cass: "13-993",
    status: "Active",
  },
];



const IataDashboard = () => {
  const [searchText, setSearchText] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState("");

  const filteredData = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return FF_DATA.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.cass.toLowerCase().includes(query);

      const matchesCountry =
        !country || item.country === country;

      const matchesStatus =
        !status || item.status === status;

      return (
        matchesSearch &&
        matchesCountry &&
        matchesStatus
      );
    });
  }, [searchText, country, status]);

  const clearSearch = () => {
    setSearchText("");
    setCountry("");
    setStatus("");
  };

  const countries = [
    ...new Set(FF_DATA.map((item) => item.country)),
  ];

  return (
    <>
      {/* <HeaderNew
        role={role}
        activePage={activePage}
        onNavigate={setActivePage}
      /> */}

      <main className="iata-dashboard">
        {/* <div className="iata-dashboard__heading">
          <h1>IATA Dashboard</h1>

          <p>
            Search and manage Freight Forwarder registrations
          </p>
        </div> */}

        {/* Search Panel */}

        <section className="search-panel">
          <div className="search-panel__header">
            <div>
              <h2>Search Freight Forwarders</h2>

              <p>
                Search by company name, IATA code or CASS code
              </p>
            </div>
          </div>

          <div className="search-panel__body">

            <div className="search-field search-field--large">
              <label htmlFor="ff-search">
                Company Name / IATA Code / CASS Code
              </label>

              <div className="search-input">
                <Search size={17} />

                <input
                  id="ff-search"
                  type="text"
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(event.target.value)
                  }
                  placeholder="Search freight forwarder..."
                />
              </div>
            </div>

            <div className="search-field">
              <label htmlFor="country">
                Country
              </label>

              <select
                id="country"
                value={country}
                onChange={(event) =>
                  setCountry(event.target.value)
                }
              >
                <option value="">All Countries</option>

                {countries.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="search-field">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="search-actions">
              <button
                type="button"
                className="btn-search"
              >
                <Search size={16} />
                Search
              </button>

              <button
                type="button"
                className="btn-clear"
                onClick={clearSearch}
              >
                <RotateCcw size={15} />
                Clear
              </button>
            </div>

          </div>
        </section>

        {/* Results */}

        <section className="results-panel">

          <div className="results-header">
            <div>
              <h2>Freight Forwarders</h2>

              <span>
                {filteredData.length} result
                {filteredData.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="results-table-wrapper">
            <table className="results-table">
              <thead>
                <tr>
                  <th>IATA Code</th>
                  <th>Company Name</th>
                  <th>Country</th>
                  <th>CASS Code</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.code}>
                      <td>
                        <strong>{item.code}</strong>
                      </td>

                      <td>{item.name}</td>

                      <td>{item.country}</td>

                      <td>{item.cass}</td>

                      <td>
                        <span
                          className={`status status--${item.status.toLowerCase()}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="view-button"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="no-results"
                    >
                      No freight forwarders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </section>
      </main>
    </>
  );
};

export default IataDashboard;