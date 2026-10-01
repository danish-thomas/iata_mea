import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search as SearchIcon,
  CalendarDays,
} from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangeCalendar } from "@mui/x-date-pickers-pro/DateRangeCalendar";
import type { Dayjs } from "dayjs";
import FreightForwarderHeader from "../newRegistration/FreightForwarderHeader";
import "./AirlineReports.scss";

type DateRangeValue = [Dayjs | null, Dayjs | null];

type AirlineRow = {
  countryCode: string;
  countryName: string;
  city: string;
  airportCode: string;
  iataDesignator: string;
  airlineName: string;
  joiningDate: string;
  comments: string;
};

const ROWS: AirlineRow[] = [
  {
    countryCode: "US",
    countryName: "United States",
    city: "New York",
    airportCode: "JFK",
    iataDesignator: "AA",
    airlineName: "American Airlines",
    joiningDate: "2014-12-04",
    comments: "Founding member",
  },
  {
    countryCode: "GB",
    countryName: "United Kingdom",
    city: "London",
    airportCode: "LHR",
    iataDesignator: "BA",
    airlineName: "British Airways",
    joiningDate: "2014-12-04",
    comments: "Transatlantic hub",
  },
  {
    countryCode: "DE",
    countryName: "Germany",
    city: "Frankfurt",
    airportCode: "FRA",
    iataDesignator: "LH",
    airlineName: "Lufthansa",
    joiningDate: "2013-04-29",
    comments: "Star Alliance founder",
  },
  {
    countryCode: "AE",
    countryName: "United Arab Emirates",
    city: "Dubai",
    airportCode: "DXB",
    iataDesignator: "EK",
    airlineName: "Emirates",
    joiningDate: "2017-07-07",
    comments: "Rapid expansion",
  },
  {
    countryCode: "SG",
    countryName: "Singapore",
    city: "Singapore",
    airportCode: "SIN",
    iataDesignator: "SQ",
    airlineName: "Singapore Airlines",
    joiningDate: "2017-07-01",
    comments: "5-star rated",
  },
  {
    countryCode: "JP",
    countryName: "Japan",
    city: "Tokyo",
    airportCode: "NRT",
    iataDesignator: "JL",
    airlineName: "Japan Airlines",
    joiningDate: "2016-02-25",
    comments: "Asia-Pacific leader",
  },
  {
    countryCode: "AU",
    countryName: "Australia",
    city: "Sydney",
    airportCode: "SYD",
    iataDesignator: "QF",
    airlineName: "Qantas",
    joiningDate: "2013-08-09",
    comments: "Oldest active airline",
  },
  {
    countryCode: "QA",
    countryName: "Qatar",
    city: "Doha",
    airportCode: "DOH",
    iataDesignator: "QR",
    airlineName: "Qatar Airways",
    joiningDate: "2013-04-29",
    comments: "Skytrax award winner",
  },
  {
    countryCode: "CA",
    countryName: "Canada",
    city: "Toronto",
    airportCode: "YYZ",
    iataDesignator: "AC",
    airlineName: "Air Canada",
    joiningDate: "2015-11-01",
    comments: "National carrier",
  },
];

const PAGE_SIZE = 8;

const uniqueValues = (values: string[]) => Array.from(new Set(values)).sort();

const AirlineReports = () => {
  const [countryCode, setCountryCode] = useState("");
  const [countryName, setCountryName] = useState("");
  const [city, setCity] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [iataDesignator, setIataDesignator] = useState("");
  const [airlineName, setAirlineName] = useState("");
  const [comments, setComments] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeValue>([null, null]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const dateFieldRef = useRef<HTMLDivElement>(null);

  const [quickSearch, setQuickSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isDatePickerOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dateFieldRef.current &&
        !dateFieldRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDatePickerOpen]);

  const countryCodeOptions = useMemo(
    () => uniqueValues(ROWS.map((row) => row.countryCode)),
    [],
  );
  const countryNameOptions = useMemo(
    () => uniqueValues(ROWS.map((row) => row.countryName)),
    [],
  );
  const cityOptions = useMemo(
    () => uniqueValues(ROWS.map((row) => row.city)),
    [],
  );
  const iataDesignatorOptions = useMemo(
    () => uniqueValues(ROWS.map((row) => row.iataDesignator)),
    [],
  );
  const airlineNameOptions = useMemo(
    () => uniqueValues(ROWS.map((row) => row.airlineName)),
    [],
  );

  const filteredRows = useMemo(() => {
    const [rangeStart, rangeEnd] = dateRange;

    return ROWS.filter((row) => {
      const matchesCountryCode =
        !countryCode || row.countryCode === countryCode;
      const matchesCountryName =
        !countryName || row.countryName === countryName;
      const matchesCity = !city || row.city === city;
      const matchesCompanyName =
        !companyName ||
        row.airlineName.toLowerCase().includes(companyName.toLowerCase());
      const matchesIataDesignator =
        !iataDesignator || row.iataDesignator === iataDesignator;
      const matchesAirlineName =
        !airlineName || row.airlineName === airlineName;
      const matchesComments =
        !comments ||
        row.comments.toLowerCase().includes(comments.toLowerCase());

      const joiningDate = new Date(row.joiningDate);
      const matchesDateRange =
        (!rangeStart || joiningDate >= rangeStart.toDate()) &&
        (!rangeEnd || joiningDate <= rangeEnd.toDate());

      const query = quickSearch.trim().toLowerCase();
      const matchesQuickSearch =
        !query ||
        Object.values(row).some((value) => value.toLowerCase().includes(query));

      return (
        matchesCountryCode &&
        matchesCountryName &&
        matchesCity &&
        matchesCompanyName &&
        matchesIataDesignator &&
        matchesAirlineName &&
        matchesComments &&
        matchesDateRange &&
        matchesQuickSearch
      );
    });
  }, [
    countryCode,
    countryName,
    city,
    companyName,
    iataDesignator,
    airlineName,
    comments,
    dateRange,
    quickSearch,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pagedRows = filteredRows.slice(pageStart, pageStart + PAGE_SIZE);

  const dateRangeLabel =
    dateRange[0] && dateRange[1]
      ? `${dateRange[0].format("MMM D, YYYY")} - ${dateRange[1].format("MMM D, YYYY")}`
      : "";

  const clearAllFilters = () => {
    setCountryCode("");
    setCountryName("");
    setCity("");
    setCompanyName("");
    setIataDesignator("");
    setAirlineName("");
    setComments("");
    setDateRange([null, null]);
    setPage(1);
  };

  const chip = (label: string, value: string) => `${label}: ${value || "All"}`;

  return (
    <>
      <FreightForwarderHeader />

      <main className="afr-page">
        <div className="afr-breadcrumb">
          Reports / List of Airlines and Airports
        </div>

        <div className="afr-heading-row">
          <div>
            <h1 className="afr-title">List of Airlines and Airports</h1>
            <p className="afr-subtitle">
              IATA RESOLUTION 672, Attachment &apos;B&apos;: LIST OF AIRLINES
              AND THEIR ACCEPTABLE AIRPORTS – MULTILATERAL E-AWB AGREEMENT
            </p>
          </div>
          <button type="button" className="afr-export-btn">
            Export CSV
          </button>
        </div>

        <section className="afr-search-card">
          <h2 className="afr-search-title">Search Criteria</h2>

          <div className="afr-search-grid">
            <label className="afr-field">
              Country Code
              <select
                value={countryCode}
                onChange={(event) => {
                  setCountryCode(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">Select</option>
                {countryCodeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="afr-field">
              Country Name
              <select
                value={countryName}
                onChange={(event) => {
                  setCountryName(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">Select</option>
                {countryNameOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="afr-field">
              City
              <select
                value={city}
                onChange={(event) => {
                  setCity(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">Select</option>
                {cityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="afr-field">
              Company Name
              <select
                value={companyName}
                onChange={(event) => {
                  setCompanyName(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">Select</option>
                {airlineNameOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="afr-field">
              IATA Designator
              <select
                value={iataDesignator}
                onChange={(event) => {
                  setIataDesignator(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">Select</option>
                {iataDesignatorOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="afr-field">
              Airline Name
              <select
                value={airlineName}
                onChange={(event) => {
                  setAirlineName(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">Select</option>
                {airlineNameOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <div className="afr-field afr-date-field" ref={dateFieldRef}>
              <span>Joining Date</span>
              <button
                type="button"
                className="afr-date-input"
                onClick={() => setIsDatePickerOpen((open) => !open)}
              >
                <span className={dateRangeLabel ? "" : "afr-date-placeholder"}>
                  {dateRangeLabel || "Select Date Range"}
                </span>
                <CalendarDays size={15} />
              </button>

              {isDatePickerOpen && (
                <div className="afr-date-popover">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateRangeCalendar
                      value={dateRange}
                      onChange={(value) => {
                        setDateRange(value);
                        setPage(1);
                      }}
                    />
                  </LocalizationProvider>
                  <div className="afr-date-popover-actions">
                    <button
                      type="button"
                      className="afr-btn-link"
                      onClick={() => {
                        setDateRange([null, null]);
                        setPage(1);
                      }}
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      className="afr-btn-primary afr-btn-primary--sm"
                      onClick={() => setIsDatePickerOpen(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            <label className="afr-field">
              Comments
              <input
                type="text"
                placeholder="Type"
                value={comments}
                onChange={(event) => {
                  setComments(event.target.value);
                  setPage(1);
                }}
              />
            </label>
          </div>

          <div className="afr-search-actions">
            <button
              type="button"
              className="afr-btn-link"
              onClick={clearAllFilters}
            >
              Clear All Filters
            </button>
            <button type="button" className="afr-btn-primary">
              Search
            </button>
          </div>
        </section>

        <div className="afr-quick-bar">
          <label className="afr-quick-search">
            <SearchIcon size={14} />
            <input
              type="search"
              placeholder="Search..."
              value={quickSearch}
              onChange={(event) => {
                setQuickSearch(event.target.value);
                setPage(1);
              }}
            />
          </label>

          <span className="afr-chip">{chip("Country Code", countryCode)}</span>
          <span className="afr-chip">{chip("Country Name", countryName)}</span>
          <span className="afr-chip">{chip("City", city)}</span>
          <span className="afr-chip">{chip("Airport Code", "")}</span>
          <span className="afr-chip">
            {chip("IATA Designator", iataDesignator)}
          </span>
        </div>

        <div className="afr-table-wrapper">
          <table className="afr-table">
            <thead>
              <tr>
                <th>
                  Country Code <ChevronDown size={12} />
                </th>
                <th>
                  Country Name <ChevronDown size={12} />
                </th>
                <th>
                  City <ChevronDown size={12} />
                </th>
                <th>
                  Airport Code <ChevronDown size={12} />
                </th>
                <th>
                  IATA Designator <ChevronDown size={12} />
                </th>
                <th>
                  Airline Name <ChevronDown size={12} />
                </th>
                <th>
                  Joining Date <ChevronDown size={12} />
                </th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row) => (
                <tr key={`${row.countryCode}-${row.airportCode}`}>
                  <td className="afr-cell-strong">{row.countryCode}</td>
                  <td>{row.countryName}</td>
                  <td>{row.city}</td>
                  <td>{row.airportCode}</td>
                  <td>{row.iataDesignator}</td>
                  <td>{row.airlineName}</td>
                  <td>{row.joiningDate}</td>
                  <td>{row.comments}</td>
                </tr>
              ))}
              {pagedRows.length === 0 && (
                <tr>
                  <td className="afr-empty" colSpan={8}>
                    No records match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="afr-pagination">
          <span>
            Showing {filteredRows.length === 0 ? 0 : pageStart + 1}-
            {Math.min(pageStart + PAGE_SIZE, filteredRows.length)} of{" "}
            {filteredRows.length} items
          </span>

          <div className="afr-pagination-controls">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .slice(0, 3)
              .map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={
                    pageNumber === currentPage ? "afr-page-btn--active" : ""
                  }
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}

            {totalPages > 4 && (
              <span className="afr-pagination-ellipsis">...</span>
            )}

            {totalPages > 3 && (
              <button
                type="button"
                className={
                  totalPages === currentPage ? "afr-page-btn--active" : ""
                }
                onClick={() => setPage(totalPages)}
              >
                {totalPages}
              </button>
            )}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setPage((previous) => Math.min(totalPages, previous + 1))
              }
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default AirlineReports;
