import React from 'react';
import { Check, X } from 'lucide-react';

const comparisonRows = [
  { feature: 'Quiz Limit', free: '5 Quizzes', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Participant Limit', free: '20 Players', pro: 'Unlimited', enterprise: 'Custom Unlimited' },
  { feature: 'Analytics & Export Reports', free: 'Basic', pro: 'Advanced PDF/CSV', enterprise: 'Custom BI Export' },
  { feature: 'Question Bank & Custom Branding', free: false, pro: true, enterprise: true },
  { feature: 'Support Level', free: false, pro: 'Priority Email', enterprise: '24/7 Dedicated Manager' },
  { feature: 'API & Institution Admin Dashboard', free: false, pro: false, enterprise: true },
];

function CellValue({ value, variant }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="h-4 w-4 text-emerald-500 mx-auto" />
    ) : (
      <X className="h-3.5 w-3.5 text-gray-400 mx-auto" />
    );
  }

  if (variant === 'pro') {
    return <span className="text-sky-500 font-bold">{value}</span>;
  }

  if (variant === 'enterprise') {
    return <span className="text-indigo-500 font-bold">{value}</span>;
  }

  return <span className="text-gray-600">{value}</span>;
}

export default function PlanComparisonTable() {
  return (
    <table className="plan-table">
      <thead>
        <tr>
          <th className="w-2/5">Features</th>
          <th className="w-1/5 plan-free">Free</th>
          <th className="w-1/5 plan-pro">Pro</th>
          <th className="w-1/5 plan-enterprise">Enterprise</th>
        </tr>
      </thead>
      <tbody>
        {comparisonRows.map((row, idx) => (
          <tr key={idx}>
            <td className="feature-name">{row.feature}</td>
            <td className="text-center">
              <CellValue value={row.free} variant="free" />
            </td>
            <td className="text-center pro-col">
              <CellValue value={row.pro} variant="pro" />
            </td>
            <td className="text-center enterprise-col">
              <CellValue value={row.enterprise} variant="enterprise" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
