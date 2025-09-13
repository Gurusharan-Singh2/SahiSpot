const steps = [
  { icon: "🔍", label: "Search" },
  { icon: "📍", label: "Select Spot" },
  { icon: "💳", label: "Pay & Book" },
  { icon: "🚗", label: "Park with ease" },
];

const Working = () => (
  <section className="bg-gray-50 py-16 text-center mb-1">
    <h3 className="text-3xl font-bold mb-12">How It Works</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 justify-items-center">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="text-5xl mb-4">{step.icon}</div>
          <p className="text-lg font-medium">{step.label}</p>
        </div>
      ))}
    </div>
    <button className="mt-12 bg-Primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-Secondary transition">
      Book Your Sahi Spot Now
    </button>
  </section>
);

export default Working;
