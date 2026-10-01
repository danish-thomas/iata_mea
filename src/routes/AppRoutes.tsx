import { Routes, Route } from "react-router-dom";

import Login from "../pages/login/Login.tsx";

import AdobeSignPOC from "../pages/sign/AdobeSignPOC.tsx";
import RoleManagement from "../pages/roleManagement/RoleManagement.tsx";
import NewRegistration from "../pages/freightForwader/newRegistration/NewRegistration.tsx";
import AirlineReports from "../pages/freightForwader/reports/AirlineReports.tsx";
import FreightsReport from "../pages/freightForwader/reports/FreightsReport.tsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleManagement />} />
      <Route path="/listing" element={<RoleManagement />} />
      <Route path="/airlines" element={<RoleManagement />} />
      <Route path="/FreightForwarders" element={<RoleManagement />} />
      <Route path="/login" element={<Login />} />
      <Route path="/adobe-sign" element={<AdobeSignPOC />} />
      <Route path="/new-registration" element={<NewRegistration />} />
      <Route
        path="/reports/airlines-and-airports"
        element={<AirlineReports />}
      />
      <Route
        path="/reports/freight-forwarders-and-affiliates"
        element={<FreightsReport />}
      />
    </Routes>
  );
}

export default AppRoutes;
