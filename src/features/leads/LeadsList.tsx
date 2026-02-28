import { useEffect, useState } from "react";
import api from "../../api/axios";

const LeadsList = () => {
  const [leads, setLeads] = useState<any[]>([]);

  const loadLeads = async () => {
    const res = await api.get("/leads");
    setLeads(res.data);
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const deleteLead = async (id: number) => {
    await api.delete(`/leads/${id}`);
    loadLeads();
  };

  const convertToJob = async (id: number) => {
    await api.post(`/leads/${id}/convert`);
    loadLeads();
  };

  return (
    <div>
      <h2>Leads</h2>

      <table style={{ width: "100%", background: "white" }}>
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
          {leads.map((lead) => (
            <tr key={lead.LeadId}>
              <td>{lead.LeadId}</td>
              <td>{lead.CustomerName}</td>
              <td>{lead.ServiceName}</td>
              <td>{lead.LeadStatus}</td>
              <td>{lead.JobId ?? "-"}</td>
              <td>
                <button onClick={() => deleteLead(lead.LeadId)}>Delete</button>
                <button>Edit</button>
                {!lead.JobId && (
                  <button onClick={() => convertToJob(lead.LeadId)}>
                    Convert to Job
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsList;