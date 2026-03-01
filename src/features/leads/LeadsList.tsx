import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, User } from "lucide-react";
import api from "../../api/axios";
import "./LeadsList.css";

const LeadsList = () => {
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [loadingJobInfo, setLoadingJobInfo] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getField = (lead: any, keys: string[], fallback = "-") => {
    for (const key of keys) {
      if (lead?.[key] !== undefined && lead?.[key] !== null && `${lead[key]}`.trim() !== "") {
        return lead[key];
      }
    }
    return fallback;
  };

  const formatDate = (value: unknown) => {
    if (!value || typeof value !== "string") {
      return "-";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString();
  };

  const formatCurrency = (value: unknown) => {
    const amount = Number(value);
    if (!Number.isFinite(amount)) {
      return "-";
    }
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getStatusVariant = (status: unknown) => {
    const value = String(status || "").toLowerCase();
    if (value.includes("cancel")) {
      return "cancelled";
    }
    if (value.includes("complete") || value.includes("converted")) {
      return "completed";
    }
    if (value.includes("progress") || value.includes("ongoing") || value.includes("assigned")) {
      return "progress";
    }
    if (value.includes("approve")) {
      return "approved";
    }
    if (value.includes("pending") || value.includes("new") || value.includes("open")) {
      return "pending";
    }
    return "default";
  };

  const getStatusClassName = (status: unknown) => {
    return `status-${getStatusVariant(status)}`;
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.get("/leads");

      const data = res.data;
      const items = Array.isArray(data) ? data : data?.items ?? data?.data ?? data?.leads ?? [];
      setAllLeads(items);
      setTotalCount(items.length);
      setLeads(items.slice(0, 10));
      setVisibleCount(Math.min(10, items.length));
      setHasMore(items.length > 10);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const refreshCards = async () => {
    await fetchLeads();
  };

  const convertToJob = async (leadId: number) => {
    try {
      await api.post(`/leads/${leadId}/convert`);
      await refreshCards();
    } catch (error) {
      console.error("Convert to job failed", error);
      alert("Unable to convert lead to job");
    }
  };

  const openJobInfo = async (jobId: number) => {
    if (!jobId) {
      return;
    }
    setLoadingJobInfo(true);
    try {
      const res = await api.get(`/jobs/GetJobInfo/${jobId}`);
      setSelectedJob(res.data);
    } catch (error) {
      console.error("Unable to fetch job info", error);
      alert("Unable to load job information");
    } finally {
      setLoadingJobInfo(false);
    }
  };

  const loadMore = () => {
    if (loading || !hasMore) {
      return;
    }
    const nextVisibleCount = visibleCount + 10;
    setLeads(allLeads.slice(0, nextVisibleCount));
    setVisibleCount(Math.min(nextVisibleCount, allLeads.length));
    setHasMore(nextVisibleCount < allLeads.length);
  };

  const shownCount = useMemo(() => leads.length, [leads]);

  return (
    <div className="leads-page">
      <div className="leads-header">
        <h2>List of Leads</h2>
        <button className="new-lead-btn" onClick={() => navigate("/lead-create")}>
          + Create Lead
        </button>
      </div>

      {leads.length === 0 && !loading && <div className="empty-card">No leads found</div>}

      <div className="lead-cards">
        {leads.map((lead) => {
          const leadId = getField(lead, ["LeadId", "leadId"]);
          const customerName = getField(lead, ["CustomerName", "customerName"]);
          const mobileNo = getField(lead, ["MobileNo", "mobileNo"]);
          const statusName = getField(lead, ["StatusName", "LeadStatus", "statusName"]);
          const jobIdRaw = getField(lead, ["JobId", "jobId"], "0");
          const jobNumber = getField(lead, ["JobNumber", "jobNumber"], "");
          const addressType = getField(lead, ["AddressType", "addressType"]);
          const area = getField(lead, ["Area", "area"]);
          const pincode = getField(lead, ["Pincode", "pincode"]);
          const scheduledOn = formatDate(getField(lead, ["ScheduledOn", "scheduledOn"], ""));
          const numericLeadId = Number(getField(lead, ["LeadId", "leadId"], 0));
          const numericJobId = Number(jobIdRaw);
          const hasJobId = Number.isFinite(numericJobId) && numericJobId > 0;
          const statusVariant = getStatusVariant(statusName);

          return (
            <article className={`lead-card lead-card-${statusVariant}`} key={`${leadId}-${scheduledOn}`}>
              <div className="lead-card-top">
                <div>
                  <p className="lead-label">Lead #{leadId}</p>
                  <h3>{customerName}</h3>
                </div>
                <div className={`lead-status-pill ${getStatusClassName(statusName)}`}>{statusName}</div>
              </div>

              <div className="lead-meta-grid">
                {/* <p>
                  <User size={14} /> Status:
                  <span className={`inline-status ${getStatusClassName(statusName)}`}>{statusName}</span>
                </p> */}
                <p>
                  <Phone size={14} /> {mobileNo}
                </p>
                <p>
                  <MapPin size={14} /> {addressType}, {area} - {pincode}
                </p>
                <p>Scheduled: {scheduledOn}</p>
              </div>

              <div className="card-actions">
                {!hasJobId && (
                  <button
                    className="card-btn card-btn-primary"
                    onClick={() => convertToJob(numericLeadId)}
                    disabled={!numericLeadId}
                  >
                    Convert to Job
                  </button>
                )}
                <button className="card-btn card-btn-outline" onClick={() => setSelectedLead(lead)}>
                  More Info
                </button>
                {hasJobId && (
                  <button
                    className="card-btn card-btn-success"
                    onClick={() => openJobInfo(numericJobId)}
                  >
                    {jobNumber || numericJobId}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="list-footer">
        <span className="count-text">
          Showing {shownCount} of {totalCount || shownCount}
        </span>
        <button className="load-more-btn" onClick={loadMore} disabled={loading || !hasMore}>
          {loading ? "Loading..." : hasMore ? "Load More" : "No More Leads"}
        </button>
      </div>

      {selectedLead && (
        <div className="details-overlay">
          <div className="details-card lead-details-card">
            <div className="details-header lead-header">
              <div>
                <p className="job-title">Lead Information</p>
                <h3>Lead #{getField(selectedLead, ["LeadId", "leadId"])}</h3>
              </div>
              <button className="details-close-btn" onClick={() => setSelectedLead(null)} aria-label="Close details">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="lead-hero">
              <div>
                <p className="job-customer">{getField(selectedLead, ["CustomerName", "customerName"])}</p>
                <p className="job-subtext">Mobile: {getField(selectedLead, ["MobileNo", "mobileNo"])}</p>
                <p className="job-subtext">Whatsapp: {getField(selectedLead, ["WhatsappNo", "whatsappNo"])}</p>
              </div>
              <div className={`job-status-pill ${getStatusClassName(getField(selectedLead, ["StatusName", "statusName", "LeadStatus"]))}`}>
                {getField(selectedLead, ["StatusName", "statusName", "LeadStatus"])}
              </div>
            </div>

            <div className="job-info-grid">
              <div className="job-info-card">
                <p className="info-label">Lead Date</p>
                <p className="info-value">{formatDate(getField(selectedLead, ["LeadDate", "leadDate"], ""))}</p>
              </div>
              <div className="job-info-card">
                <p className="info-label">Scheduled On</p>
                <p className="info-value">{formatDate(getField(selectedLead, ["ScheduledOn", "scheduledOn"], ""))}</p>
              </div>
              <div className="job-info-card">
                <p className="info-label">Created By</p>
                <p className="info-value">{getField(selectedLead, ["CreatedBy", "createdBy", "FullName", "fullName"])}</p>
              </div>
              <div className="job-info-card">
                <p className="info-label">Created At</p>
                <p className="info-value">{formatDate(getField(selectedLead, ["CreatedAt", "createdAt"], ""))}</p>
              </div>
              <div className="job-info-card">
                <p className="info-label">Address Type</p>
                <p className="info-value">{getField(selectedLead, ["AddressType", "addressType"])}</p>
              </div>
              <div className="job-info-card">
                <p className="info-label">Area / Pincode</p>
                <p className="info-value">
                  {getField(selectedLead, ["Area", "area"])} / {getField(selectedLead, ["Pincode", "pincode"])}
                </p>
              </div>
            </div>

            <div className="job-address-block">
              <p className="info-label">Coordinates</p>
              <p className="info-value">
                Lat: {getField(selectedLead, ["Latitude", "latitude"])} | Lng: {getField(selectedLead, ["Longitude", "longitude"])}
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedJob && (
        <div className="details-overlay">
          <div className="details-card job-details-card">
            <div className="details-header job-header">
              <div>
                <p className="job-title">Job Information</p>
                <h3>{selectedJob.JobNumber ?? "Job Details"}</h3>
              </div>
              <button className="details-close-btn" onClick={() => setSelectedJob(null)} aria-label="Close job details">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="job-hero">
              <div>
                <p className="job-customer">{selectedJob.CustomerName ?? "-"}</p>
                <p className="job-subtext">{selectedJob.MobileNo ?? "-"}</p>
                <p className="job-subtext">{selectedJob.ServiceName ?? "-"}</p>
              </div>
              <div className={`job-status-pill ${getStatusClassName(selectedJob.JobStatus)}`}>
                {selectedJob.JobStatus ?? "UNKNOWN"}
              </div>
            </div>

            <div className="job-info-grid">
              <div className="job-info-card">
                <p className="info-label">Schedule</p>
                <p className="info-value">{formatDate(selectedJob.ScheduledOn)}</p>
              </div>
              <div className="job-info-card">
                <p className="info-label">Total Amount</p>
                <p className="info-value">{formatCurrency(selectedJob.TotalAmount)}</p>
              </div>
              <div className="job-info-card">
                <p className="info-label">Status Name</p>
                <p className="info-value">{selectedJob.StatusName ?? "-"}</p>
              </div>
              <div className="job-info-card">
                <p className="info-label">Approval Status</p>
                <p className="info-value">{selectedJob.Status ?? "-"}</p>
              </div>
              <div className="job-info-card">
                <p className="info-label">Start Time</p>
                <p className="info-value">{formatDate(selectedJob.StartTime)}</p>
              </div>
              <div className="job-info-card">
                <p className="info-label">End Time</p>
                <p className="info-value">{formatDate(selectedJob.EndTime)}</p>
              </div>
            </div>

            <div className="job-address-block">
              <p className="info-label">Address</p>
              <p className="info-value">{selectedJob.Address ?? "-"}</p>
              <p className="job-subtext">
                Lat: {selectedJob.Latitude ?? "-"} | Lng: {selectedJob.Longitude ?? "-"}
              </p>
            </div>

            <div className="job-footer-meta">
              <span>Job ID: {selectedJob.JobId ?? "-"}</span>
              <span>Quotation ID: {selectedJob.QuotationId ?? "-"}</span>
              <span>Current Action: {selectedJob.CurrentButtion ?? "-"}</span>
            </div>
          </div>
        </div>
      )}

      {loadingJobInfo && (
        <div className="details-overlay">
          <div className="details-card loading-card">
            <p>Loading job information...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsList;
