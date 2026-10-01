import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FreightForwarderHeader from "./FreightForwarderHeader";
import "./NewRegistration.scss";

const NewRegistration = () => {
  const navigate = useNavigate();
  const [companyLegalName, setCompanyLegalName] = useState("");
  const [addressOfPrincipalOffice, setAddressOfPrincipalOffice] = useState("");
  const [city, setCity] = useState("");
  const [cassBranchCode, setCassBranchCode] = useState("");
  const [country, setCountry] = useState("");

  const [signatoryFullName, setSignatoryFullName] = useState("");
  const [signatoryJobTitle, setSignatoryJobTitle] = useState("");
  const [signatoryEmail, setSignatoryEmail] = useState("");
  const [signatoryPhone, setSignatoryPhone] = useState("");

  const [designatedFullName, setDesignatedFullName] = useState("");
  const [designatedJobTitle, setDesignatedJobTitle] = useState("");
  const [designatedEmail, setDesignatedEmail] = useState("");
  const [designatedPhone, setDesignatedPhone] = useState("");

  return (
    <>
      <FreightForwarderHeader />

      <main className="ffnr-page">
        <div className="ffnr-breadcrumb">
          Freight Forwarder Dashboard / Create New Registration
        </div>
        <h1 className="ffnr-title">Create New Registration</h1>

        <section className="ffnr-card">
          <h2 className="ffnr-section-title">1. Company Information</h2>
          <div className="ffnr-grid">
            <label className="ffnr-field">
              Company Legal Name
              <input
                type="text"
                placeholder="Enter"
                value={companyLegalName}
                onChange={(event) => setCompanyLegalName(event.target.value)}
              />
            </label>
            <label className="ffnr-field">
              Address of Principal Office
              <input
                type="text"
                placeholder="Type"
                value={addressOfPrincipalOffice}
                onChange={(event) =>
                  setAddressOfPrincipalOffice(event.target.value)
                }
              />
            </label>
            <label className="ffnr-field">
              City
              <input
                type="text"
                placeholder="Enter"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </label>

            <label className="ffnr-field">
              CASS / Branch Code
              <input
                type="text"
                placeholder="Enter"
                value={cassBranchCode}
                onChange={(event) => setCassBranchCode(event.target.value)}
              />
            </label>
            <label className="ffnr-field">
              Country
              <select
                value={country}
                onChange={(event) => setCountry(event.target.value)}
              >
                <option value="">Enter</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United Arab Emirates">
                  United Arab Emirates
                </option>
                <option value="Singapore">Singapore</option>
                <option value="Canada">Canada</option>
              </select>
            </label>
          </div>
        </section>

        <section className="ffnr-card">
          <h2 className="ffnr-section-title">2. Signatory Contact</h2>
          <div className="ffnr-grid">
            <label className="ffnr-field">
              Full Name
              <input
                type="text"
                placeholder="Enter"
                value={signatoryFullName}
                onChange={(event) => setSignatoryFullName(event.target.value)}
              />
            </label>
            <label className="ffnr-field">
              Job Title
              <input
                type="text"
                placeholder="Enter"
                value={signatoryJobTitle}
                onChange={(event) => setSignatoryJobTitle(event.target.value)}
              />
            </label>
            <label className="ffnr-field">
              Email
              <input
                type="email"
                placeholder="Enter"
                value={signatoryEmail}
                onChange={(event) => setSignatoryEmail(event.target.value)}
              />
            </label>

            <label className="ffnr-field">
              Phone Number
              <input
                type="tel"
                placeholder="Enter"
                value={signatoryPhone}
                onChange={(event) => setSignatoryPhone(event.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="ffnr-card">
          <h2 className="ffnr-section-title">3. Designated Contact</h2>
          <div className="ffnr-grid">
            <label className="ffnr-field">
              Full Name
              <input
                type="text"
                placeholder="Enter"
                value={designatedFullName}
                onChange={(event) => setDesignatedFullName(event.target.value)}
              />
            </label>
            <label className="ffnr-field">
              Job Title
              <input
                type="text"
                placeholder="Enter"
                value={designatedJobTitle}
                onChange={(event) => setDesignatedJobTitle(event.target.value)}
              />
            </label>
            <label className="ffnr-field">
              Email
              <input
                type="email"
                placeholder="Enter"
                value={designatedEmail}
                onChange={(event) => setDesignatedEmail(event.target.value)}
              />
            </label>

            <label className="ffnr-field">
              Phone Number
              <input
                type="tel"
                placeholder="Enter"
                value={designatedPhone}
                onChange={(event) => setDesignatedPhone(event.target.value)}
              />
            </label>
          </div>
        </section>

        <div className="ffnr-footer">
          <button type="button" className="ffnr-btn ffnr-btn--link">
            Save draft
          </button>
          <div className="ffnr-footer-actions">
            <button
              type="button"
              className="ffnr-btn ffnr-btn--secondary"
              onClick={() => navigate("/")}
            >
              Back
            </button>
            <button type="button" className="ffnr-btn ffnr-btn--primary">
              Review & submit
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default NewRegistration;
