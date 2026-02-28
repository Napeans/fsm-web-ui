import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./LeadsList.css";

const LeadsList = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusId, setStatusId] = useState("0");
  const [appliedStatusId, setAppliedStatusId] = useState("0");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadLeads = async () => {
    setLoading(true);
    try {
      const res = await api.post("/leads/pagination", {
        PageNumber: page,
        PageSize: pageSize,
        SearchTerm: appliedSearch || "",
        StatusId: Number(appliedStatusId || "0"),
        FromDate: null,
        ToDate: null,
      });

      const data = res.data;
      if (Array.isArray(data)) {
        setLeads(data);
        setTotalCount(data.length);
        return;
      }

      const items = data?.items ?? data?.data ?? data?.leads ?? [];
      const total = Number(data?.total ?? data?.totalCount ?? data?.count ?? items.length);
      setLeads(items);
      setTotalCount(total);
    } finally {
      setLoading(false);
    }
  };

  const loadStatuses = async () => {
    try {
      const res = await api.get("/leads/statuses");
      const data = Array.isArray(res.data) ? res.data : res.data?.items ?? [];
      setStatuses(data);
    } catch (error) {
      console.error("Unable to load status list", error);
      setStatuses([]);
    }
  };

  useEffect(() => {
    loadStatuses();
  }, []);

  useEffect(() => {
    loadLeads();
  }, [page, pageSize, appliedSearch, appliedStatusId]);

  const deleteLead = async (id: number) => {
    await api.delete(`/leads/${id}`);
    loadLeads();
  };

  const convertToJob = async (id: number) => {
    await api.post(`/leads/${id}/convert`);
    loadLeads();
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const applySearch = () => {
    setPage(1);
    setAppliedSearch(searchText.trim());
    setAppliedStatusId(statusId);
  };

  return (
    <div className="leads-page">
      <div className="leads-header">
        <h2>List of Leads</h2>
      </div>

      <div className="leads-toolbar">
        <div className="search-wrap">
          <input
            type="text"
            placeholder="Search customer / service / status"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applySearch();
              }
            }}
          />
          <button className="search-btn" onClick={applySearch}>
            Search
          </button>
          <select
            className="status-select"
            value={statusId}
            onChange={(e) => setStatusId(e.target.value)}
          >
            <option value="0">All Status</option>
            {statuses.map((status) => {
              const id = status.StatusId ?? status.statusId ?? status.Id ?? status.id;
              const label = status.StatusName ?? status.statusName ?? status.Name ?? status.name;
              return (
                <option key={id} value={id}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
        <button className="new-lead-btn" onClick={() => navigate("/lead-create")}>
          + Create Lead
        </button>
      </div>

      <div className="leads-table-wrap">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Lead ID</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Status</th>
              <th>Job ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && leads.length === 0 && (
              <tr>
                <td colSpan={6} className="empty-row">
                  No leads found
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td colSpan={6} className="empty-row">
                  Loading...
                </td>
              </tr>
            )}

            {leads.map((lead) => (
              <tr key={lead.LeadId}>
                <td>{lead.LeadId}</td>
                <td>{lead.CustomerName}</td>
                <td>{lead.ServiceName}</td>
                <td>{lead.LeadStatus}</td>
                <td>{lead.JobId ?? "-"}</td>
                <td className="actions-cell">
                  <button className="table-btn danger" onClick={() => deleteLead(lead.LeadId)}>
                    Delete
                  </button>
                  {!lead.JobId && (
                    <button className="table-btn primary" onClick={() => convertToJob(lead.LeadId)}>
                      Convert to Job
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span className="pagination-meta">Total: {totalCount}</span>
        <div className="pagination-controls">
          <button
            className="page-btn"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1 || loading}
          >
            Prev
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="page-btn"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages || loading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadsList;
