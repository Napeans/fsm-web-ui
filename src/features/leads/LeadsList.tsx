import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Search } from "lucide-react";
import api from "../../api/axios";
import "./LeadsList.css";

const LeadsList = () => {
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [assignTechId, setAssignTechId] = useState<string>("");
  const [showConvertPopup, setShowConvertPopup] = useState(false);
  const [convertLeadId, setConvertLeadId] = useState<number>(0);
  const [convertTechId, setConvertTechId] = useState<string>("");
  const [convertScheduleDate, setConvertScheduleDate] = useState("");
  const [convertScheduleHour, setConvertScheduleHour] = useState("");
  const [convertScheduleMinute, setConvertScheduleMinute] = useState("");
  const [convertSchedulePeriod, setConvertSchedulePeriod] = useState<"AM" | "PM">("AM");
  const [loadingJobInfo, setLoadingJobInfo] = useState(false);
  const [savingAssignment, setSavingAssignment] = useState(false);
  const [creatingJob, setCreatingJob] = useState(false);
  const [assignScheduleDate, setAssignScheduleDate] = useState("");
  const [assignScheduleHour, setAssignScheduleHour] = useState("");
  const [assignScheduleMinute, setAssignScheduleMinute] = useState("");
  const [assignSchedulePeriod, setAssignSchedulePeriod] = useState<"AM" | "PM">("AM");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
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

  const hourOptions = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const minuteOptions = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

  const parseScheduleTo12H = (value: unknown) => {
    if (!value || typeof value !== "string") {
      return { date: "", hour: "", minute: "", period: "AM" as "AM" | "PM" };
    }
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) {
      return { date: "", hour: "", minute: "", period: "AM" as "AM" | "PM" };
    }
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    const hour24 = dt.getHours();
    const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return {
      date: `${yyyy}-${mm}-${dd}`,
      hour: String(hour12).padStart(2, "0"),
      minute: String(dt.getMinutes()).padStart(2, "0"),
      period,
    };
  };

  const buildScheduleIso = (date: string, hour: string, minute: string, period: "AM" | "PM") => {
    if (!date || !hour || !minute) {
      return null;
    }
    const hour12 = Number(hour);
    if (!Number.isFinite(hour12) || hour12 < 1 || hour12 > 12) {
      return null;
    }
    let hour24 = hour12 % 12;
    if (period === "PM") {
      hour24 += 12;
    }
    const dt = new Date(`${date}T00:00:00`);
    dt.setHours(hour24, Number(minute), 0, 0);
    return dt.toISOString();
  };

  const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const addDays = (date: Date, days: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  };

  const getScheduleDate = (lead: any) => {
    const raw = getField(lead, ["ScheduledOn", "scheduledOn"], "");
    if (!raw || typeof raw !== "string") {
      return null;
    }
    const dt = new Date(raw);
    return Number.isNaN(dt.getTime()) ? null : startOfDay(dt);
  };

  const matchesSearch = (lead: any, term: string) => {
    if (!term) {
      return true;
    }
    const haystack = [
      getField(lead, ["LeadId", "leadId"], ""),
      getField(lead, ["CustomerName", "customerName"], ""),
      getField(lead, ["MobileNo", "mobileNo"], ""),
      getField(lead, ["StatusName", "LeadStatus", "statusName"], ""),
      getField(lead, ["AddressType", "addressType"], ""),
      getField(lead, ["Area", "area"], ""),
      getField(lead, ["Pincode", "pincode"], ""),
      getField(lead, ["JobNumber", "jobNumber"], ""),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  };

  const groupLeadsBySchedule = (items: any[]) => {
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    const daysToWeekEnd = 6 - today.getDay();
    const endOfWeek = addDays(today, daysToWeekEnd);
    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const monthAfterNextStart = new Date(today.getFullYear(), today.getMonth() + 2, 1);

    const groups: Record<string, any[]> = {
      Today: [],
      Tomorrow: [],
      "This Week": [],
      "This Month": [],
      "Next Month": [],
      Later: [],
      Earlier: [],
      Unscheduled: [],
    };

    items.forEach((lead) => {
      const scheduleDate = getScheduleDate(lead);
      if (!scheduleDate) {
        groups.Unscheduled.push(lead);
        return;
      }
      if (scheduleDate.getTime() === today.getTime()) {
        groups.Today.push(lead);
        return;
      }
      if (scheduleDate.getTime() === tomorrow.getTime()) {
        groups.Tomorrow.push(lead);
        return;
      }
      if (scheduleDate > tomorrow && scheduleDate <= endOfWeek) {
        groups["This Week"].push(lead);
        return;
      }
      if (
        scheduleDate.getMonth() === today.getMonth() &&
        scheduleDate.getFullYear() === today.getFullYear()
      ) {
        groups["This Month"].push(lead);
        return;
      }
      if (scheduleDate >= nextMonthStart && scheduleDate < monthAfterNextStart) {
        groups["Next Month"].push(lead);
        return;
      }
      if (scheduleDate < today) {
        groups.Earlier.push(lead);
        return;
      }
      groups.Later.push(lead);
    });

    return groups;
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.get("/leads");

      const data = res.data;
      const items = Array.isArray(data) ? data : data?.items ?? data?.data ?? data?.leads ?? [];
      setAllLeads(items);
      setVisibleCount(10);
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const res = await api.get("/jobs/technicians");
      const list = Array.isArray(res.data) ? res.data : res.data?.items ?? [];
      setTechnicians(list);
    } catch (error) {
      console.error("Unable to fetch technicians", error);
      setTechnicians([]);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchTechnicians();
  }, []);

  const refreshCards = async () => {
    await fetchLeads();
  };

  const createJobFromLead = async () => {
    if (!convertLeadId) {
      return;
    }
    const scheduledOn = buildScheduleIso(
      convertScheduleDate,
      convertScheduleHour,
      convertScheduleMinute,
      convertSchedulePeriod
    );
    if (!scheduledOn) {
      alert("Select Scheduled On date and time");
      return;
    }
    setCreatingJob(true);
    try {
      await api.post("/jobs/CreateJob", {
        LeadId: convertLeadId,
        TechnicianId: convertTechId ? Number(convertTechId) : null,
        ScheduledOn: scheduledOn,
      });
      setShowConvertPopup(false);
      setConvertLeadId(0);
      setConvertTechId("");
      setConvertScheduleDate("");
      setConvertScheduleHour("");
      setConvertScheduleMinute("");
      setConvertSchedulePeriod("AM");
      await refreshCards();
    } catch (error) {
      console.error("Create job failed", error);
      alert("Unable to create job");
    } finally {
      setCreatingJob(false);
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
      const assigned = res.data?.AssignedTechnicianId;
      setAssignTechId(assigned != null && Number(assigned) > 0 ? String(assigned) : "");
      const parsed = parseScheduleTo12H(res.data?.ScheduledOn);
      setAssignScheduleDate(parsed.date);
      setAssignScheduleHour(parsed.hour);
      setAssignScheduleMinute(parsed.minute);
      setAssignSchedulePeriod(parsed.period);
    } catch (error) {
      console.error("Unable to fetch job info", error);
      alert("Unable to load job information");
    } finally {
      setLoadingJobInfo(false);
    }
  };

  const handleAssignTechnician = async (value: string) => {
    if (!selectedJob?.JobId) {
      return;
    }
    const confirmAssign = window.confirm(
      "Assigned technician will be updated. Do you want to continue?"
    );
    if (!confirmAssign) {
      return;
    }
    const scheduledOn = buildScheduleIso(
      assignScheduleDate,
      assignScheduleHour,
      assignScheduleMinute,
      assignSchedulePeriod
    );
    if (!scheduledOn) {
      alert("Select Scheduled On date and time");
      return;
    }
    setAssignTechId(value);
    setSavingAssignment(true);
    try {
      await api.post("/jobs/assign", {
        JobId: selectedJob.JobId,
        TechnicianId: value ? Number(value) : null,
        ScheduledOn: scheduledOn,
      });
    } catch (error) {
      console.error("Unable to assign technician", error);
      alert("Unable to assign technician");
    } finally {
      setSavingAssignment(false);
    }
  };

  const openConvertPopup = (lead: any) => {
    const leadId = Number(getField(lead, ["LeadId", "leadId"], 0));
    const assignedTech = getField(lead, ["AssignedTechnicianId", "assignedTechnicianId"], "");
    const assignedTechNum = Number(assignedTech);
    const parsed = parseScheduleTo12H(getField(lead, ["ScheduledOn", "scheduledOn"], ""));
    setConvertLeadId(leadId);
    setConvertTechId(Number.isFinite(assignedTechNum) && assignedTechNum > 0 ? String(assignedTechNum) : "");
    setConvertScheduleDate(parsed.date);
    setConvertScheduleHour(parsed.hour);
    setConvertScheduleMinute(parsed.minute);
    setConvertSchedulePeriod(parsed.period);
    setShowConvertPopup(true);
  };

  const loadMore = () => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (loading || normalizedSearch) {
      return;
    }
    setVisibleCount((prev) => prev + 10);
  };

  const normalizedSearch = useMemo(() => searchTerm.trim().toLowerCase(), [searchTerm]);
  const filteredLeads = useMemo(
    () => allLeads.filter((lead) => matchesSearch(lead, normalizedSearch)),
    [allLeads, normalizedSearch]
  );
  const visibleLeads = useMemo(() => {
    if (normalizedSearch) {
      return filteredLeads;
    }
    return filteredLeads.slice(0, visibleCount);
  }, [filteredLeads, normalizedSearch, visibleCount]);
  const shownCount = useMemo(() => visibleLeads.length, [visibleLeads]);
  const totalCount = useMemo(() => filteredLeads.length, [filteredLeads]);
  const hasMore = useMemo(
    () => !normalizedSearch && visibleCount < filteredLeads.length,
    [normalizedSearch, visibleCount, filteredLeads.length]
  );
  const groupedLeads = useMemo(() => groupLeadsBySchedule(visibleLeads), [visibleLeads]);
  const orderedGroupKeys = ["Today", "Tomorrow", "This Week", "This Month", "Next Month", "Later", "Earlier", "Unscheduled"];

  return (
    <div className="leads-page">
      <div className="leads-header">
        <h2>List of Leads</h2>
        <button className="new-lead-btn" onClick={() => navigate("/lead-create")}>
          + Create Lead
        </button>
      </div>

      <div className="leads-search-row">
        <div className="search-input-wrap">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by customer, mobile, lead, area or status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {visibleLeads.length === 0 && !loading && <div className="empty-card">No leads found</div>}

      {orderedGroupKeys.map((groupKey) => {
        const items = groupedLeads[groupKey] ?? [];
        if (items.length === 0) {
          return null;
        }
        return (
          <section className="lead-group" key={groupKey}>
            <div className="lead-group-header">
              <h3>{groupKey}'s Schedule</h3>
              <span>{items.length}</span>
            </div>
            <div className="lead-cards">
              {items.map((lead) => {
                const leadId = getField(lead, ["LeadId", "leadId"]);
                const leadNumber = getField(lead, ["LeadNumber", "leadNumber"], leadId);
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
                        <p className="lead-label">Lead #{leadNumber}</p>
                        <h3>{customerName}</h3>
                      </div>
                      <div className={`lead-status-pill ${getStatusClassName(statusName)}`}>{statusName}</div>
                    </div>

                    <div className="lead-meta-grid">
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
                          onClick={() => openConvertPopup(lead)}
                          disabled={!numericLeadId}
                        >
                          Convert to Job
                        </button>
                      )}
                      {!hasJobId && (
                        <button
                          className="card-btn card-btn-danger"
                          onClick={async () => {
                            const ok = window.confirm("Are you sure you want to cancel this lead?");
                            if (!ok || !numericLeadId) return;
                            try {
                              await api.post(`/leads/cancel/${numericLeadId}`);
                              await refreshCards();
                            } catch (error) {
                              console.error("Cancel lead failed", error);
                              alert("Unable to cancel lead");
                            }
                          }}
                          disabled={!numericLeadId || statusVariant === "cancelled"}
                        >
                          Cancel
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
                          {jobNumber ? `View Job ${jobNumber}` : "View Job"}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="list-footer">
        <span className="count-text">
          Showing {shownCount} of {totalCount || shownCount}
        </span>
        {!normalizedSearch && (
          <button className="load-more-btn" onClick={loadMore} disabled={loading || !hasMore}>
            {loading ? "Loading..." : hasMore ? "Load More" : "No More Leads"}
          </button>
        )}
      </div>

      {selectedLead && (
        <div className="details-overlay">
          <div className="details-card lead-details-card">
            <div className="details-header lead-header">
              <div>
                <p className="job-title">Lead Information</p>
                <h3>Lead #{getField(selectedLead, ["LeadNumber", "leadNumber"], getField(selectedLead, ["LeadId", "leadId"]))}</h3>
              </div>
              <button className="details-close-btn" onClick={() => setSelectedLead(null)} aria-label="Close details">
                <span aria-hidden="true">&times;</span>
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
                <span aria-hidden="true">&times;</span>
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
              <div className="job-info-card full-span-tech">
                <p className="info-label">Scheduled On (Editable)</p>
                <div className="schedule-inline-grid">
                  <input
                    type="date"
                    value={assignScheduleDate}
                    onChange={(e) => setAssignScheduleDate(e.target.value)}
                  />
                  <select value={assignScheduleHour} onChange={(e) => setAssignScheduleHour(e.target.value)}>
                    <option value="">HH</option>
                    {hourOptions.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                  <select value={assignScheduleMinute} onChange={(e) => setAssignScheduleMinute(e.target.value)}>
                    <option value="">MM</option>
                    {minuteOptions.map((minute) => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>
                  <select value={assignSchedulePeriod} onChange={(e) => setAssignSchedulePeriod(e.target.value as "AM" | "PM")}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div className="job-info-card full-span-tech">
                <p className="info-label">Technicians</p>
                <select
                  className="tech-select"
                  value={assignTechId}
                  onChange={(e) => handleAssignTechnician(e.target.value)}
                  disabled={savingAssignment}
                >
                  <option value="">Unassigned</option>
                  {technicians.map((tech) => {
                    const techId = tech.technicianId ?? tech.TechnicianId ?? tech.id;
                    const techName = tech.name ?? tech.Name ?? tech.fullName ?? tech.FullName ?? `Tech ${techId}`;
                    return (
                      <option key={techId} value={String(techId)}>
                        {techName}
                      </option>
                    );
                  })}
                </select>
                {savingAssignment && <p className="job-subtext">Saving technician assignment...</p>}
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
              <span>Job Number: {selectedJob.JobNumber ?? "-"}</span>
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

      {showConvertPopup && (
        <div className="details-overlay">
          <div className="details-card convert-job-card">
            <div className="details-header">
              <h3>Convert Lead to Job</h3>
              <button className="details-close-btn" onClick={() => setShowConvertPopup(false)} aria-label="Close convert popup">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="convert-body">
              <p className="job-subtext">Lead ID: {convertLeadId}</p>
              <div className="input-block">
                <label>Scheduled On</label>
                <div className="schedule-inline-grid">
                  <input
                    type="date"
                    value={convertScheduleDate}
                    onChange={(e) => setConvertScheduleDate(e.target.value)}
                  />
                  <select value={convertScheduleHour} onChange={(e) => setConvertScheduleHour(e.target.value)}>
                    <option value="">HH</option>
                    {hourOptions.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                  <select value={convertScheduleMinute} onChange={(e) => setConvertScheduleMinute(e.target.value)}>
                    <option value="">MM</option>
                    {minuteOptions.map((minute) => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>
                  <select value={convertSchedulePeriod} onChange={(e) => setConvertSchedulePeriod(e.target.value as "AM" | "PM")}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div className="input-block">
                <label>Technicians (Optional)</label>
                <select
                  className="tech-select"
                  value={convertTechId}
                  onChange={(e) => setConvertTechId(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {technicians.map((tech) => {
                    const techId = tech.technicianId ?? tech.TechnicianId ?? tech.id;
                    const techName = tech.name ?? tech.Name ?? tech.fullName ?? tech.FullName ?? `Tech ${techId}`;
                    return (
                      <option key={techId} value={String(techId)}>
                        {techName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="convert-actions">
              <button className="card-btn card-btn-outline" onClick={() => setShowConvertPopup(false)}>
                Cancel
              </button>
              <button className="card-btn card-btn-primary" onClick={createJobFromLead} disabled={creatingJob}>
                {creatingJob ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsList;
