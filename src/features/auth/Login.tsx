import { useState, useRef } from "react";
import { loginUser } from "./auth.service";
import logo from "../../assets/img/logo.png";
import "./Login.css";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handlePinChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleLogin = async () => {
    const fullPin = pin.join("");

    if (fullPin.length !== 4) {
      alert("Enter 4 digit PIN");
      return;
    }

    try {
      const res = await loginUser({
        Username: mobile,
        Password: fullPin,
        DeviceId: "web-device",
      });

      localStorage.setItem("token", res.accessToken);
      window.location.href = "/lead-create";
    } catch {
      alert("Invalid Login");
    }
  };

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
            onChange={(e) => setMobile(e.target.value)}
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
                onChange={(e) =>
                  handlePinChange(e.target.value, index)
                }
              />
            ))}
          </div>

          <button className="btn-primary" onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;