import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BriefcaseBusiness, Clock3, Settings2, Users, Wallet } from "lucide-react";
import api from "../../api/axios";
import "./AdminDashboard.css";

interface LeadStatusStat {
  LeadStatus?: string;
  TotalCount?: number;
}

interface JobStatusStat {
  JobStatus?: string;
  TotalCount?: number;
}

interface ServiceTypeStat {
  ServiceName?: string;
  TotalCount?: number;
}

interface FinancialSummary {
  TotalCollection?: number;
  TotalPendingPayments?: number;
  OverdueAmount?: number;
}

interface DashboardStatsViewModel {
  LeadStats?: LeadStatusStat[];
  JobStats?: JobStatusStat[];
  ServiceStats?: ServiceTypeStat[];
  Financials?: FinancialSummary;
}

interface CountItem {
  label: string;
  count: number;
}

const toDateInputValue = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDefaultFromDate = () => {
  const now = new Date();
  return toDateInputValue(new Date(now.getFullYear(), now.getMonth(), 1));
};

const getDefaultToDate = () => toDateInputValue(new Date());

const normalizeCount = (value: unknown) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const AdminDashboard = () => {
  const [fromDate, setFromDate] = useState(getDefaultFromDate);
  const [toDate, setToDate] = useState(getDefaultToDate);
  const [stats, setStats] = useState<DashboardStatsViewModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchDashboardData = async (from: string, to: string) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await api.post("/admin/dashboard/data", {
        FromDate: `${from}T00:00:00`,
        ToDate: `${to}T23:59:59`,
      });
      setStats(response.data ?? null);
    } catch (error) {
      console.error("Unable to load dashboard data", error);
      setStats(null);
      setErrorMessage("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDashboardData(fromDate, toDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leadStats = useMemo(
    () =>
      (stats?.LeadStats ?? []).map((item) => ({
        label: item.LeadStatus?.trim() || "Unknown",
        count: normalizeCount(item.TotalCount),
      })),
    [stats]
  );

  const jobStats = useMemo(
    () =>
      (stats?.JobStats ?? []).map((item) => ({
        label: item.JobStatus?.trim() || "Unknown",
        count: normalizeCount(item.TotalCount),
      })),
    [stats]
  );

  const serviceStats = useMemo(
    () =>
      (stats?.ServiceStats ?? []).map((item) => ({
        label: item.ServiceName?.trim() || "Unknown",
        count: normalizeCount(item.TotalCount),
      })),
    [stats]
  );

  const leadTotal = useMemo(() => leadStats.reduce((acc, item) => acc + item.count, 0), [leadStats]);
  const jobTotal = useMemo(() => jobStats.reduce((acc, item) => acc + item.count, 0), [jobStats]);
  const serviceTotal = useMemo(() => serviceStats.reduce((acc, item) => acc + item.count, 0), [serviceStats]);

  const financials = stats?.Financials ?? {};
  const totalCollection = normalizeCount(financials.TotalCollection);
  const totalPending = normalizeCount(financials.TotalPendingPayments);
  const overdueAmount = normalizeCount(financials.OverdueAmount);

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleApplyFilter = () => {
    if (!fromDate || !toDate) {
      setErrorMessage("Select both From and To date.");
      return;
    }
    if (new Date(fromDate).getTime() > new Date(toDate).getTime()) {
      setErrorMessage("From Date cannot be greater than To Date.");
      return;
    }
    void fetchDashboardData(fromDate, toDate);
  };

  const chartColors = [
    "#4f46e5",
    "#0891b2",
    "#9333ea",
    "#f59e0b",
    "#dc2626",
    "#16a34a",
    "#2563eb",
    "#db2777",
  ];

  const renderChartRows = (items: CountItem[], emptyText: string) => {
    if (items.length === 0) {
      return <p className="chart-empty">{emptyText}</p>;
    }
    const maxValue = Math.max(...items.map((item) => item.count), 1);
    return (
      <div className="chart-row-list">
        {items.map((item, index) => {
          const widthPercent = (item.count / maxValue) * 100;
          const fillColor = chartColors[index % chartColors.length];
          return (
            <div className="chart-row" key={`${item.label}-${item.count}`}>
              <div className="chart-row-head">
                <span className="chart-label">{item.label}</span>
                <span className="chart-value">{item.count}</span>
              </div>
              <div className="chart-track">
                <div className="chart-fill" style={{ width: `${widthPercent}%`, background: fillColor }} />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="admin-dashboard-page">
      <div className="dashboard-top">
        <div>
          <h2>Dashboard</h2>
          <p>Business snapshot by date range</p>
        </div>
      </div>

      <section className="dashboard-filter-card">
        <div className="filter-field">
          <label htmlFor="fromDate">From Date</label>
          <input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            max={toDate}
          />
        </div>
        <div className="filter-field">
          <label htmlFor="toDate">To Date</label>
          <input
            id="toDate"
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            min={fromDate}
          />
        </div>
        <button className="apply-filter-btn" onClick={handleApplyFilter} disabled={loading}>
          {loading ? "Loading..." : "Apply Filter"}
        </button>
      </section>

      {errorMessage && <p className="dashboard-error">{errorMessage}</p>}

      <section className="financial-grid">
        <article className="financial-card">
          <div className="financial-icon bg-indigo">
            <Wallet size={18} />
          </div>
          <div>
            <p>Total Collection</p>
            <h3>{formatCurrency(totalCollection)}</h3>
          </div>
        </article>
        <article className="financial-card">
          <div className="financial-icon bg-blue">
            <Clock3 size={18} />
          </div>
          <div>
            <p>Total Pending Payments</p>
            <h3>{formatCurrency(totalPending)}</h3>
          </div>
        </article>
        <article className="financial-card">
          <div className="financial-icon bg-red">
            <AlertTriangle size={18} />
          </div>
          <div>
            <p>Overdue Amount</p>
            <h3>{formatCurrency(overdueAmount)}</h3>
          </div>
        </article>
      </section>

      <section className="summary-grid">
        <article className="summary-card">
          <div className="summary-icon summary-icon-lead">
            <Users size={16} />
          </div>
          <span>Lead Records</span>
          <strong>{leadTotal}</strong>
        </article>
        <article className="summary-card">
          <div className="summary-icon summary-icon-job">
            <BriefcaseBusiness size={16} />
          </div>
          <span>Job Records</span>
          <strong>{jobTotal}</strong>
        </article>
        <article className="summary-card">
          <div className="summary-icon summary-icon-service">
            <Settings2 size={16} />
          </div>
          <span>Service Records</span>
          <strong>{serviceTotal}</strong>
        </article>
      </section>

      <section className="charts-grid">
        <article className="chart-card">
          <div className="chart-card-header">
            <h3>Lead Status</h3>
          </div>
          {renderChartRows(leadStats, "No lead data for selected dates.")}
        </article>

        <article className="chart-card">
          <div className="chart-card-header">
            <h3>Job Status</h3>
          </div>
          {renderChartRows(jobStats, "No job data for selected dates.")}
        </article>

        <article className="chart-card">
          <div className="chart-card-header">
            <h3>Service Type</h3>
          </div>
          {renderChartRows(serviceStats, "No service data for selected dates.")}
        </article>
      </section>
    </div>
  );
};

export default AdminDashboard;
