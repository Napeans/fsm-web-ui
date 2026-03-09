import { Link } from "react-router-dom";
import { useState, type FormEvent } from "react";
import AppDialog from "../../components/AppDialog";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !company.trim() || !phone.trim()) {
      setDialogMessage("Please fill name, company, and phone.");
      return;
    }
    setDialogMessage("Registration request captured. Our team will contact you shortly.");
    setName("");
    setCompany("");
    setPhone("");
    setEmail("");
  };

  return (
    <div className="register-wrapper">
      <article className="register-card">
        <h1>Register For GoField</h1>
        <p>Share your business details and Napeans Technologies will contact you for onboarding.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="reg-name">Full Name</label>
          <input id="reg-name" value={name} onChange={(e) => setName(e.target.value)} />

          <label htmlFor="reg-company">Company Name</label>
          <input id="reg-company" value={company} onChange={(e) => setCompany(e.target.value)} />

          <label htmlFor="reg-phone">Phone</label>
          <input
            id="reg-phone"
            value={phone}
            maxLength={10}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          />

          <label htmlFor="reg-email">Email (Optional)</label>
          <input id="reg-email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <button type="submit">Submit Registration</button>
        </form>

        <div className="register-links">
          <Link to="/login">Go to Login</Link>
          <Link to="/">Back to Website</Link>
        </div>
      </article>

      <AppDialog
        open={Boolean(dialogMessage)}
        title="Registration"
        message={dialogMessage}
        mode="alert"
        onConfirm={() => setDialogMessage("")}
        onClose={() => setDialogMessage("")}
      />
    </div>
  );
};

export default Register;
