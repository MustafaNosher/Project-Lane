import React from "react";

const plans = [
  {
    name: "Basic",
    price: 10,
    features: ["Feature 1", "Feature 2", "Feature 3"],
  },
  {
    name: "Pro",
    price: 20,
    features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
  },
  {
    name: "Enterprise",
    price: 30,
    features: [
      "Feature 1",
      "Feature 2",
      "Feature 3",
      "Feature 4",
      "Feature 5",
    ],
  },
];

interface PlansProps {
  onSelectPlan: (price: number) => void;
}

const Plans: React.FC<PlansProps> = ({ onSelectPlan }) => {
  return (
    <div className="plans-container">
      {plans.map((plan) => (
        <div key={plan.name} className="plan-card">
          <h2>{plan.name}</h2>
          <p>${plan.price}/month</p>
          <ul>
            {plan.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <button onClick={() => onSelectPlan(plan.price)}>Select</button>
        </div>
      ))}
    </div>
  );
};

export default Plans;
