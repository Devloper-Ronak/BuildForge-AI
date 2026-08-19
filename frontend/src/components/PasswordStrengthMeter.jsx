import React from "react";
import { FiCheck, FiCircle } from "react-icons/fi";

export const checkPasswordCriteria = (password = "") => {
  return {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };
};

export const getPasswordScore = (criteria) => {
  let score = 0;
  if (criteria.minLength) score += 1;
  if (criteria.hasUpper) score += 1;
  if (criteria.hasLower) score += 1;
  if (criteria.hasNumber) score += 1;
  if (criteria.hasSpecial) score += 1;
  return score;
};

export function PasswordStrengthMeter({ password = "", showRequirements = true }) {
  const criteria = checkPasswordCriteria(password);
  const score = getPasswordScore(criteria);

  if (!password) return null;

  const getStrengthInfo = () => {
    if (score <= 2) {
      return { label: "Weak", color: "#ef4444", width: "25%" };
    }
    if (score === 3) {
      return { label: "Fair", color: "#f59e0b", width: "50%" };
    }
    if (score === 4) {
      return { label: "Good", color: "#3b82f6", width: "75%" };
    }
    return { label: "Strong", color: "#10b981", width: "100%" };
  };

  const info = getStrengthInfo();

  return (
    <div style={{ marginTop: "6px", marginBottom: "8px" }}>
      {/* STRENGTH BAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>Password Strength:</span>
        <span style={{ fontSize: "11px", color: info.color, fontWeight: 700 }}>{info.label}</span>
      </div>

      <div
        style={{
          width: "100%",
          height: "4px",
          backgroundColor: "#e2e8f0",
          borderRadius: "2px",
          overflow: "hidden",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: info.width,
            backgroundColor: info.color,
            transition: "all 0.3s ease",
            borderRadius: "2px",
          }}
        />
      </div>

      {/* REQUIREMENTS CHECKLIST */}
      {showRequirements && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4px 8px",
            background: "#f8fafc",
            padding: "8px 10px",
            borderRadius: "8px",
            border: "1px solid #f1f5f9",
          }}
        >
          <RequirementItem text="Min 8 characters" valid={criteria.minLength} />
          <RequirementItem text="1 uppercase letter (A-Z)" valid={criteria.hasUpper} />
          <RequirementItem text="1 lowercase letter (a-z)" valid={criteria.hasLower} />
          <RequirementItem text="1 number (0-9)" valid={criteria.hasNumber} />
          <RequirementItem text="1 special character" valid={criteria.hasSpecial} />
        </div>
      )}
    </div>
  );
}

function RequirementItem({ text, valid }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        fontSize: "11px",
        color: valid ? "#059669" : "#94a3b8",
        transition: "color 0.2s ease",
      }}
    >
      {valid ? (
        <FiCheck size={12} color="#059669" strokeWidth={3} />
      ) : (
        <FiCircle size={10} color="#cbd5e1" />
      )}
      <span>{text}</span>
    </div>
  );
}

export default PasswordStrengthMeter;
