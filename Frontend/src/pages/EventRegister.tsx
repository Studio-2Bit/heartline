import { useState } from "react";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function BloodDonationEventForm() {
  const [form, setForm] = useState({
    fullName: "", phone: "", bloodType: "", age: "", gender: "", timeSlot: "", healthNotes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 40, textAlign: "center", maxWidth: 400, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🩸</div>
          <h2 style={{ color: "#dc2626", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Registration Successful!</h2>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>
            Thank you, <strong>{form.fullName}</strong>! Your slot at <strong>{form.timeSlot}</strong> has been confirmed.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ fullName: "", phone: "", bloodType: "", age: "", gender: "", timeSlot: "", healthNotes: "" }); }}
            style={{ marginTop: 24, background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
          >
            Register Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden" }}>

          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, #dc2626, #ef4444)", padding: "28px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 32 }}>🩸</span>
              <div>
                <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>Blood Donation Event</h1>
                <p style={{ color: "#fecaca", fontSize: 13, margin: 0, marginTop: 2 }}>April 12, 2025 · City Medical Center, Colombo</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: "28px 32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

              <div style={{ gridColumn: "span 2" }}>
                <Label>Full Name</Label>
                <Input placeholder="e.g. Ashan Perera" value={form.fullName} onChange={e => set("fullName", e.target.value)} required />
              </div>

              <div>
                <Label>Phone</Label>
                <Input type="tel" placeholder="+94 77 000 0000" value={form.phone} onChange={e => set("phone", e.target.value)} required />
              </div>

              <div>
                <Label>Age</Label>
                <Input type="number" placeholder="e.g. 25" min="18" max="65" value={form.age} onChange={e => set("age", e.target.value)} required />
              </div>

              <div>
                <Label>Gender</Label>
                <Select value={form.gender} onChange={e => set("gender", e.target.value)} required>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </Select>
              </div>

              <div>
                <Label>Blood Type</Label>
                <Select value={form.bloodType} onChange={e => set("bloodType", e.target.value)} required>
                  <option value="">Select</option>
                  {bloodTypes.map(t => <option key={t}>{t}</option>)}
                </Select>
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <Label>Preferred Time Slot</Label>
                <Select value={form.timeSlot} onChange={e => set("timeSlot", e.target.value)} required>
                  <option value="">Select a slot</option>
                  <option>08:00 AM – 09:00 AM</option>
                  <option>09:00 AM – 10:00 AM</option>
                  <option>10:00 AM – 11:00 AM</option>
                  <option>11:00 AM – 12:00 PM</option>
                  <option>01:00 PM – 02:00 PM</option>
                  <option>02:00 PM – 03:00 PM</option>
                  <option>03:00 PM – 04:00 PM</option>
                </Select>
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <Label>Health Diseases / Medical Conditions</Label>
                <textarea
                  rows={3}
                  placeholder="List any health diseases or medical conditions (e.g. diabetes, hypertension)..."
                  value={form.healthNotes}
                  onChange={e => set("healthNotes", e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box", color: "#1e293b" }}
                />
              </div>
            </div>

            <button type="submit" style={{
              marginTop: 8, width: "100%", padding: "13px",
              background: "#dc2626", color: "#fff", border: "none",
              borderRadius: 8, fontSize: 15, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}>
              Register Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", color: "#1e293b", background: "#f8fafc" }} />
  );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", color: "#1e293b", background: "#f8fafc", appearance: "none", cursor: "pointer" }}>
      {children}
    </select>
  );
}