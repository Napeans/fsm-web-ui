import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { loginUser } from "./auth.service";
import logo from "../../assets/img/logo.png";
import AppDialog from "../../components/AppDialog";
import "./Login.css";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [loggingIn, setLoggingIn] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const showAlert = (message: string) => setDialogMessage(message);

  const handlePinChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && index === 3) {
      event.preventDefault();
      setPin(["", "", "", ""]);
      inputsRef.current[0]?.focus();
      return;
    }

    if (event.key === "Backspace" && !pin[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleLogin = async () => {
    if (loggingIn) {
      return;
    }

    const enteredMobile = mobile.trim();
    if (!enteredMobile) {
      showAlert("Enter mobile number");
      return;
    }
    if (!/^\d{10}$/.test(enteredMobile)) {
      showAlert("Mobile number must be 10 digits");
      return;
    }

    const fullPin = pin.join("");

    if (fullPin.length !== 4) {
      showAlert("Enter 4 digit PIN");
      return;
    }

    try {
      setLoggingIn(true);
      const res = await loginUser({
        Username: enteredMobile,
        Password: fullPin,
        DeviceId: "web-device",
      });

      localStorage.setItem("token", res.accessToken);
      const fullName = (res.FullName ?? res.fullName ?? "").trim();
      if (fullName) {
        localStorage.setItem("fullName", fullName);
      } else {
        localStorage.removeItem("fullName");
      }
      window.location.href = "/lead-create";
    } catch {
      showAlert("Invalid login");
      setPin(["", "", "", ""]);
      inputsRef.current[0]?.focus();
    } finally {
      setLoggingIn(false);
    }
  };

  useEffect(() => {
    if (pin.every((digit) => digit !== "") && mobile.trim()) {
      void handleLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-left">
         <div className="logo-circle">
  <img src={logo} alt="FSM Logo" />
</div>
          <h1>FSM Pro</h1>
          <p>Manage. Assign. Deliver.</p>
        </div>

        <div className="login-right">
          <h2>Sign In</h2>

          <label>Mobile Number</label>
          <input
            type="text"
            value={mobile}
            maxLength={10}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
          />

          <label>Enter PIN</label>
          <div className="pin-container">
            {pin.map((digit, index) => (
              <input
                key={index}
                type="password"
                maxLength={1}
                value={digit}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                onKeyDown={(e) => handlePinKeyDown(e, index)}
                onChange={(e) =>
                  handlePinChange(e.target.value, index)
                }
              />
            ))}
          </div>

          <button className="btn-primary" onClick={handleLogin} disabled={loggingIn}>
            {loggingIn ? "Signing In..." : "Login"}
          </button>
        </div>
      </div>

      <AppDialog
        open={Boolean(dialogMessage)}
        title="Sign In"
        message={dialogMessage}
        mode="alert"
        onConfirm={() => setDialogMessage("")}
        onClose={() => setDialogMessage("")}
      />
    </div>
  );
};

export default Login;
