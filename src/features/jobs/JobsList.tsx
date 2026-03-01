import { useEffect, useMemo, useState } from "react";
import { MapPin, Phone, Search, Wrench } from "lucide-react";
import api from "../../api/axios";
import "./JobsList.css";

const JobsList = () => {
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [assignTechId, setAssignTechId] = useState<string>("");
  const [assignScheduleDate, setAssignScheduleDate] = useState("");
  const [assignScheduleHour, setAssignScheduleHour] = useState("");
  const [assignScheduleMinute, setAssignScheduleMinute] = useState("");
  const [assignSchedulePeriod, setAssignSchedulePeriod] = useState<"AM" | "PM">("AM");
  const [savingAssignment, setSavingAssignment] = useState(false);

  const hourOptions = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const minuteOptions = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

  const getField = (item: any, keys: string[], fallback = "-") => {
    for (const key of keys) {
      const value = item?.[key];
      if (value !== undefined && value !== null && `${value}`.trim() !== "") {
        return value;
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
    if (value.includes("cancel")) return "cancelled";
    if (value.includes("complete") || value.includes("closed")) return "completed";
    if (value.includes("progress") || value.includes("ongoing") || value.includes("assign")) return "progress";
    if (value.includes("approve")) return "approved";
    if (value.includes("pending") || value.includes("new") || value.includes("open")) return "pending";
    return "default";
  };

  const getStatusClassName = (status: unknown) => `status-${getStatusVariant(status)}`;

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

  const getScheduleDate = (item: any) => {
    const raw = getField(item, ["ScheduledOn", "scheduledOn"], "");
    if (!raw || typeof raw !== "string") {
      return null;
    }
    const dt = new Date(raw);
    return Number.isNaN(dt.getTime()) ? null : startOfDay(dt);
  };

  const matchesSearch = (job: any, term: string) => {
    if (!term) {
      return true;
    }
    const text = [
      getField(job, ["JobNumber", "jobNumber"], ""),
      getField(job, ["CustomerName", "customerName"], ""),
      getField(job, ["MobileNo", "mobileNo"], ""),
      getField(job, ["ServiceName", "serviceName"], ""),
      getField(job, ["JobStatus", "jobStatus"], ""),
      getField(job, ["Address", "address"], ""),
    ]
      .join(" ")
      .toLowerCase();
    return text.includes(term);
  };

  const groupBySchedule = (items: any[]) => {
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

    items.forEach((job) => {
      const scheduleDate = getScheduleDate(job);
      if (!scheduleDate) {
        groups.Unscheduled.push(job);
        return;
      }
      if (scheduleDate.getTime() === today.getTime()) {
        groups.Today.push(job);
        return;
      }
      if (scheduleDate.getTime() === tomorrow.getTime()) {
        groups.Tomorrow.push(job);
        return;
      }
      if (scheduleDate > tomorrow && scheduleDate <= endOfWeek) {
        groups["This Week"].push(job);
        return;
      }
      if (
        scheduleDate.getMonth() === today.getMonth() &&
        scheduleDate.getFullYear() === today.getFullYear()
      ) {
        groups["This Month"].push(job);
        return;
      }
      if (scheduleDate >= nextMonthStart && scheduleDate < monthAfterNextStart) {
        groups["Next Month"].push(job);
        return;
      }
      if (scheduleDate < today) {
        groups.Earlier.push(job);
        return;
      }
      groups.Later.push(job);
    });

    return groups;
  };

  const getTechnicianId = (tech: any) => tech.technicianId ?? tech.TechnicianId ?? tech.id;
  const getTechnicianName = (tech: any) =>
    tech.name ?? tech.Name ?? tech.fullName ?? tech.FullName ?? `Tech ${getTechnicianId(tech)}`;

  const findTechnicianName = (assignedId: number) => {
    if (!assignedId) {
      return "Unassigned";
    }
    const match = technicians.find((tech) => Number(getTechnicianId(tech)) === assignedId);
    return match ? getTechnicianName(match) : `Technician #${assignedId}`;
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs/GetMyJobs");
      const data = res.data;
      const items = Array.isArray(data) ? data : data?.items ?? data?.data ?? data?.jobs ?? [];
      setAllJobs(items);
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
    fetchJobs();
    fetchTechnicians();
  }, []);

  const normalizedSearch = useMemo(() => searchTerm.trim().toLowerCase(), [searchTerm]);
  const filteredJobs = useMemo(
    () => allJobs.filter((job) => matchesSearch(job, normalizedSearch)),
    [allJobs, normalizedSearch]
  );
  const visibleJobs = useMemo(() => {
    if (normalizedSearch) return filteredJobs;
    return filteredJobs.slice(0, visibleCount);
  }, [filteredJobs, normalizedSearch, visibleCount]);
  const shownCount = useMemo(() => visibleJobs.length, [visibleJobs]);
  const totalCount = useMemo(() => filteredJobs.length, [filteredJobs]);
  const hasMore = useMemo(
    () => !normalizedSearch && visibleCount < filteredJobs.length,
    [normalizedSearch, visibleCount, filteredJobs.length]
  );
  const groupedJobs = useMemo(() => groupBySchedule(visibleJobs), [visibleJobs]);
  const orderedGroupKeys = ["Today", "Tomorrow", "This Week", "This Month", "Next Month", "Later", "Earlier", "Unscheduled"];

  const loadMore = () => {
    if (loading || normalizedSearch) {
      return;
    }
    setVisibleCount((prev) => prev + 10);
  };

  const openMoreInfo = (job: any) => {
    setSelectedJob(job);
    const assigned = Number(getField(job, ["AssignedTechnicianId", "assignedTechnicianId"], 0));
    setAssignTechId(Number.isFinite(assigned) && assigned > 0 ? String(assigned) : "");
    const parsed = parseScheduleTo12H(getField(job, ["ScheduledOn", "scheduledOn"], ""));
    setAssignScheduleDate(parsed.date);
    setAssignScheduleHour(parsed.hour);
    setAssignScheduleMinute(parsed.minute);
    setAssignSchedulePeriod(parsed.period);
  };

  const saveAssignment = async () => {
    if (!selectedJob) {
      return;
    }
    const jobId = Number(getField(selectedJob, ["JobId", "jobId"], 0));
    if (!jobId) {
      return;
    }
    const scheduledOn = buildScheduleIso(
      assignScheduleDate,
      assignScheduleHour,
      assignScheduleMinute,
      assignSchedulePeriod
    );
    if (!scheduledOn) {
      alert("Select scheduled date and time");
      return;
    }
    setSavingAssignment(true);
    try {
      await api.post("/jobs/assign", {
        JobId: jobId,
        TechnicianId: assignTechId ? Number(assignTechId) : null,
        ScheduledOn: scheduledOn,
      });
      setSelectedJob((prev: any) =>
        prev
          ? {
              ...prev,
              AssignedTechnicianId: assignTechId ? Number(assignTechId) : 0,
              ScheduledOn: scheduledOn,
            }
          : prev
      );
      await fetchJobs();
    } catch (error) {
      console.error("Unable to update assignment", error);
      alert("Unable to update assignment");
    } finally {
      setSavingAssignment(false);
    }
  };

  return (
    <div className="leads-page">
      <div className="leads-header">
        <h2>My Jobs</h2>
      </div>

      <div className="leads-search-row">
        <div className="search-input-wrap">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by job number, customer, mobile, service or status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {visibleJobs.length === 0 && !loading && <div className="empty-card">No jobs found</div>}

      {orderedGroupKeys.map((groupKey) => {
        const items = groupedJobs[groupKey] ?? [];
        if (items.length === 0) return null;
        return (
          <section className="lead-group" key={groupKey}>
            <div className="lead-group-header">
              <h3>{groupKey}</h3>
              <span>{items.length}</span>
            </div>
            <div className="lead-cards">
              {items.map((job) => {
                const jobId = Number(getField(job, ["JobId", "jobId"], 0));
                const jobNumber = getField(job, ["JobNumber", "jobNumber"], jobId || "-");
                const customerName = getField(job, ["CustomerName", "customerName"]);
                const mobileNo = getField(job, ["MobileNo", "mobileNo"]);
                const serviceName = getField(job, ["ServiceName", "serviceName"]);
                const address = getField(job, ["Address", "address"]);
                const status = getField(job, ["JobStatus", "jobStatus"]);
                const assignedTech = Number(getField(job, ["AssignedTechnicianId", "assignedTechnicianId"], 0));
                const scheduledOn = formatDate(getField(job, ["ScheduledOn", "scheduledOn"], ""));
                const statusVariant = getStatusVariant(status);

                return (
                  <article className={`lead-card lead-card-${statusVariant}`} key={`${jobId}-${jobNumber}`}>
                    <div className="lead-card-top">
                      <div>
                        <p className="lead-label">Job #{jobNumber}</p>
                        <h3>{customerName}</h3>
                      </div>
                      <div className={`lead-status-pill ${getStatusClassName(status)}`}>{status}</div>
                    </div>

                    <div className="lead-meta-grid">
                      <p>
                        <Wrench size={14} /> {serviceName}
                      </p>
                      <p>
                        <Phone size={14} /> {mobileNo}
                      </p>
                      <p>
                        <MapPin size={14} /> {address}
                      </p>
                      <p>Scheduled: {scheduledOn}</p>
                      <p>Technician: {findTechnicianName(assignedTech)}</p>
                    </div>

                    <div className="card-actions">
                      <button className="card-btn card-btn-outline" onClick={() => openMoreInfo(job)}>
                        More Info
                      </button>
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
            {loading ? "Loading..." : hasMore ? "Load More" : "No More Jobs"}
          </button>
        )}
      </div>

      {selectedJob && (
        <div className="details-overlay">
          <div className="details-card job-details-card">
            <div className="details-header job-header">
              <div>
                <p className="job-title">Job Information</p>
                <h3>{getField(selectedJob, ["JobNumber", "jobNumber"], "Job Details")}</h3>
              </div>
              <button className="details-close-btn" onClick={() => setSelectedJob(null)} aria-label="Close job details">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="job-hero">
              <div>
                <p className="job-customer">{getField(selectedJob, ["CustomerName", "customerName"])}</p>
                <p className="job-subtext">{getField(selectedJob, ["MobileNo", "mobileNo"])}</p>
                <p className="job-subtext">{getField(selectedJob, ["ServiceName", "serviceName"])}</p>
              </div>
              <div className={`job-status-pill ${getStatusClassName(getField(selectedJob, ["JobStatus", "jobStatus"]))}`}>
                {getField(selectedJob, ["JobStatus", "jobStatus"])}
              </div>
            </div>

            <div className="job-info-grid">
              <div className="job-info-card">
                <p className="info-label">Schedule</p>
                <p className="info-value">{formatDate(getField(selectedJob, ["ScheduledOn", "scheduledOn"], ""))}</p>
              </div>
              <div className="job-info-card">
                <p className="info-label">Total Amount</p>
                <p className="info-value">{formatCurrency(getField(selectedJob, ["TotalAmount", "totalAmount"], ""))}</p>
              </div>
              <div className="job-info-card">
                <p className="info-label">Quotation ID</p>
                <p className="info-value">{getField(selectedJob, ["QuotationId", "quotationId"])} </p>
              </div>
              <div className="job-info-card">
                <p className="info-label">Start Time</p>
                <p className="info-value">{formatDate(getField(selectedJob, ["StartTime", "startTime"], ""))}</p>
              </div>
              <div className="job-info-card">
                <p className="info-label">End Time</p>
                <p className="info-value">{formatDate(getField(selectedJob, ["EndTime", "endTime"], ""))}</p>
              </div>
              <div className="job-info-card">
                <p className="info-label">Current Action</p>
                <p className="info-value">{getField(selectedJob, ["CurrentButtion", "currentButtion"])}</p>
              </div>
              <div className="job-info-card full-span-tech">
                <p className="info-label">Scheduled On (Editable)</p>
                <div className="schedule-inline-grid">
                  <input type="date" value={assignScheduleDate} onChange={(e) => setAssignScheduleDate(e.target.value)} />
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
                <p className="info-label">Assigned Technician</p>
                <select className="tech-select" value={assignTechId} onChange={(e) => setAssignTechId(e.target.value)}>
                  <option value="">Unassigned</option>
                  {technicians.map((tech) => {
                    const techId = getTechnicianId(tech);
                    return (
                      <option key={techId} value={String(techId)}>
                        {getTechnicianName(tech)}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="job-address-block">
              <p className="info-label">Address</p>
              <p className="info-value">{getField(selectedJob, ["Address", "address"])}</p>
              <p className="job-subtext">
                Lat: {getField(selectedJob, ["Latitude", "latitude"])} | Lng: {getField(selectedJob, ["Longitude", "longitude"])}
              </p>
            </div>

            <div className="convert-actions">
              <button className="card-btn card-btn-outline" onClick={() => setSelectedJob(null)}>
                Close
              </button>
              <button className="card-btn card-btn-primary" onClick={saveAssignment} disabled={savingAssignment}>
                {savingAssignment ? "Saving..." : "Update Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsList;
