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
import "./FreightsReport.scss";

type DateRangeValue = [Dayjs | null, Dayjs | null];

type FreightForwarderRow = {
  countryCode: string;
  countryName: string;
  city: string;
  companyName: string;
  joiningDate: string;
  comments: string;
};

const ROWS: FreightForwarderRow[] = [
  {
    countryCode: "IN",
    countryName: "India",
    city: "Kolkata",
    companyName: "DHL Express India Pvt Ltd - CCU",
    joiningDate: "2013-07-29",
    comments: "Affiliate",
  },
  {
    countryCode: "IN",
    countryName: "India",
    city: "Kolkata",
    companyName: "Schenker India Pvt. Ltd.",
    joiningDate: "2013-07-29",
    comments: "Affiliate",
  },
  {
    countryCode: "IN",
    countryName: "India",
    city: "Kolkata",
    companyName: "UPS SCS India Private Ltd",
    joiningDate: "2013-08-15",
    comments: "Affiliate",
  },
  {
    countryCode: "IN",
    countryName: "India",
    city: "Kolkata",
    companyName: "Rohlig India Private Ltd",
    joiningDate: "2013-08-15",
    comments: "Affiliate",
  },
  {
    countryCode: "IN",
    countryName: "India",
    city: "Kolkata",
    companyName: "Expo Freight Pvt Ltd",
    joiningDate: "2014-03-27",
    comments: "Affiliate",
  },
  {
    countryCode: "IN",
    countryName: "India",
    city: "Kolkata",
    companyName: "Jeena and Company",
    joiningDate: "2014-03-27",
    comments: "Affiliate",
  },
  {
    countryCode: "IN",
    countryName: "India",
    city: "Kolkata",
    companyName: "Envisage Air Express",
    joiningDate: "2014-07-28",
    comments: "Parent",
  },
  {
    countryCode: "IN",
    countryName: "India",
    city: "Kolkata",
    companyName: "Geodis Overseas Pvt Ltd",
    joiningDate: "2014-08-14",
    comments: "Parent",
  },
  {
    countryCode: "IN",
    countryName: "India",
    city: "Kolkata",
    companyName: "DHL Logistics Pvt Ltd",
    joiningDate: "2015-02-05",
    comments: "Affiliate",
  },
];

const PAGE_SIZE = 8;

const uniqueValues = (values: string[]) => Array.from(new Set(values)).sort();

const FreightsReport = () => {
  const [countryCode, setCountryCode] = useState("");
  const [countryName, setCountryName] = useState("");
  const [city, setCity] = useState("");
  const [companyName, setCompanyName] = useState("");
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
  const companyNameOptions = useMemo(
    () => uniqueValues(ROWS.map((row) => row.companyName)),
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
        !companyName || row.companyName === companyName;
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
    setComments("");
    setDateRange([null, null]);
    setPage(1);
  };

  const chip = (label: string, value: string) => `${label}: ${value || "All"}`;

  return (
    <>
      <FreightForwarderHeader />

      <main className="ffr-page">
        <div className="ffr-breadcrumb">
          Reports / List of Freight Forwarders and Affiliates
        </div>

        <div className="ffr-heading-row">
          <div>
            <h1 className="ffr-title">
              List of Freight Forwarders and Affiliates
            </h1>
            <p className="ffr-subtitle">
              IATA RESOLUTION 672, Attachment &apos;C&apos;: LIST OF FREIGHT
              FORWARDERS AND AFFILIATES– MULTILATERAL E-AWB AGREEMENT
            </p>
          </div>
          <button type="button" className="ffr-export-btn">
            Export CSV
          </button>
        </div>

        <section className="ffr-search-card">
          <h2 className="ffr-search-title">Search Criteria</h2>

          <div className="ffr-search-grid">
            <label className="ffr-field">
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

            <label className="ffr-field">
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

            <label className="ffr-field">
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

            <label className="ffr-field">
              Company Name
              <select
                value={companyName}
                onChange={(event) => {
                  setCompanyName(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">Select</option>
                {companyNameOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <div className="ffr-field ffr-date-field" ref={dateFieldRef}>
              <span>Joining Date</span>
              <button
                type="button"
                className="ffr-date-input"
                onClick={() => setIsDatePickerOpen((open) => !open)}
              >
                <span className={dateRangeLabel ? "" : "ffr-date-placeholder"}>
                  {dateRangeLabel || "Select Date Range"}
                </span>
                <CalendarDays size={15} />
              </button>

              {isDatePickerOpen && (
                <div className="ffr-date-popover">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateRangeCalendar
                      value={dateRange}
                      onChange={(value) => {
                        setDateRange(value);
                        setPage(1);
                      }}
                    />
                  </LocalizationProvider>
                  <div className="ffr-date-popover-actions">
                    <button
                      type="button"
                      className="ffr-btn-link"
                      onClick={() => {
                        setDateRange([null, null]);
                        setPage(1);
                      }}
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      className="ffr-btn-primary ffr-btn-primary--sm"
                      onClick={() => setIsDatePickerOpen(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            <label className="ffr-field">
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

          <div className="ffr-search-actions">
            <button
              type="button"
              className="ffr-btn-link"
              onClick={clearAllFilters}
            >
              Clear All Filters
            </button>
            <button type="button" className="ffr-btn-primary">
              Search
            </button>
          </div>
        </section>

        <div className="ffr-quick-bar">
          <label className="ffr-quick-search">
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

          <span className="ffr-chip">{chip("Country Code", countryCode)}</span>
          <span className="ffr-chip">{chip("Country Name", countryName)}</span>
          <span className="ffr-chip">{chip("City", city)}</span>
        </div>

        <div className="ffr-table-wrapper">
          <table className="ffr-table">
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
                  Company Name <ChevronDown size={12} />
                </th>
                <th>
                  Joining Date <ChevronDown size={12} />
                </th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row) => (
                <tr key={`${row.companyName}-${row.joiningDate}`}>
                  <td className="ffr-cell-strong">{row.countryCode}</td>
                  <td>{row.countryName}</td>
                  <td>{row.city}</td>
                  <td>{row.companyName}</td>
                  <td>{row.joiningDate}</td>
                  <td>{row.comments}</td>
                </tr>
              ))}
              {pagedRows.length === 0 && (
                <tr>
                  <td className="ffr-empty" colSpan={6}>
                    No records match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="ffr-pagination">
          <span>
            Showing {filteredRows.length === 0 ? 0 : pageStart + 1}-
            {Math.min(pageStart + PAGE_SIZE, filteredRows.length)} of{" "}
            {filteredRows.length} items
          </span>

          <div className="ffr-pagination-controls">
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
                    pageNumber === currentPage ? "ffr-page-btn--active" : ""
                  }
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}

            {totalPages > 4 && (
              <span className="ffr-pagination-ellipsis">...</span>
            )}

            {totalPages > 3 && (
              <button
                type="button"
                className={
                  totalPages === currentPage ? "ffr-page-btn--active" : ""
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

export default FreightsReport;
