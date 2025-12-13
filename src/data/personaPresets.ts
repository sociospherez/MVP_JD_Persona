export type PersonaPreset = {
  id: string;
  label: string;
  title: string;
  scope: string;
  decisionLevel: string;
  purpose: string;

  stage: string;
  challenges: string;
  team: string;
  culture: string;
  priorities: string;

  axesScores: number[];   // 8 values (1–5)
  axesWeights: number[];  // 8 values (sum ~1)
  strengths: string[];    // ids from your strengths list
};

export const PRESETS: PersonaPreset[] = [
  {
    id: "admin_officer",
    label: "Admin Officer (Operations / Office Admin)",
    title: "Admin Officer",
    scope: "Individual Contributor",
    decisionLevel: "Operational",
    purpose:
      "Provide high-quality administrative and customer support, maintaining accurate records, scheduling, and compliant documentation.",
    stage: "Stabilisation",
    challenges: "High volume requests, accuracy under pressure, record keeping, scheduling constraints, GDPR",
    team: "Supports caseworkers, technical officers, contractors; interfaces with suppliers and customers",
    culture: "Organised, service-driven, confidential",
    priorities: "Data quality, scheduling reliability, document control, customer service",
    axesScores: [3, 3, 4, 3, 2, 4, 3, 4],
    axesWeights: [0.10, 0.10, 0.18, 0.12, 0.08, 0.18, 0.10, 0.14],
    strengths: ["information_centralization", "legislative_compliance", "process_automation"],
  },
  {
    id: "sales_assistant",
    label: "Sales Assistant (Retail / Customer-facing)",
    title: "Sales Assistant",
    scope: "Individual Contributor",
    decisionLevel: "Operational",
    purpose:
      "Drive great customer experience and sales outcomes by supporting customers, maintaining presentation standards, and handling transactions accurately.",
    stage: "Growth",
    challenges: "Footfall spikes, conversion targets, customer complaints, stock accuracy",
    team: "Works with store manager and colleagues; supports customers end-to-end",
    culture: "Friendly, energetic, customer-first",
    priorities: "Customer satisfaction, sales conversion, visual standards, stock discipline",
    axesScores: [3, 2, 2, 5, 4, 3, 2, 5],
    axesWeights: [0.10, 0.06, 0.08, 0.22, 0.18, 0.12, 0.06, 0.18],
    strengths: ["strategic_partnerships", "dashboards_reporting"], // (sales targets / KPIs)
  },
];
