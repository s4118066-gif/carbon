import React, { useState } from 'react';
import { 
  Car, 
  Lightbulb, 
  Utensils, 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';

export default function Calculator({ userProfile, onProfileUpdate }) {
  const [step, setStep] = useState(1);
  const [transport, setTransport] = useState({
    carType: 'gasoline',
    carMiles: 8000,
    transitMiles: 1500,
    shortFlights: 2,
    longFlights: 1
  });
  
  const [energy, setEnergy] = useState({
    electricityKwh: 350,
    heatingType: 'gas',
    heatingUsage: 30
  });

  const [diet, setDiet] = useState({
    dietType: 'average-meat',
    localFoodPct: 40
  });

  const [shopping, setShopping] = useState({
    clothingSpend: 150,
    electronicsCount: 3,
    servicesSpend: 200
  });

  const [isSaved, setIsSaved] = useState(false);

  // Carbon math conversions (Tonnes CO2e / Year)
  const calculateTransportCO2 = () => {
    let carFactor = 0.404; // gasoline lbs CO2/mile
    if (transport.carType === 'diesel') carFactor = 0.35;
    if (transport.carType === 'hybrid') carFactor = 0.22;
    if (transport.carType === 'electric') carFactor = 0.10;
    
    const carCO2 = (transport.carMiles * carFactor) / 2204.62; // convert lbs to tonnes
    const transitCO2 = (transport.transitMiles * 0.14) / 2204.62; // bus/rail Factor
    const shortFlightCO2 = transport.shortFlights * 0.25; // 0.25t per short flight
    const longFlightCO2 = transport.longFlights * 0.9;   // 0.9t per long flight
    
    return carCO2 + transitCO2 + shortFlightCO2 + longFlightCO2;
  };

  const calculateEnergyCO2 = () => {
    // electricity: 350kWh/month * 12 = 4200kWh/yr. 0.38kg/kWh / 1000 = tonnes
    const elecCO2 = (energy.electricityKwh * 12 * 0.38) / 1000;
    let heatingFactor = 5.3; // natural gas kg per therm/unit
    if (energy.heatingType === 'electric') heatingFactor = 0.0; // Handled by electricity
    if (energy.heatingType === 'oil') heatingFactor = 10.1;
    
    const heatCO2 = (energy.heatingUsage * 12 * heatingFactor) / 1000;
    return elecCO2 + heatCO2;
  };

  const calculateDietCO2 = () => {
    let baseDietCO2 = 2.5; // Average meat eater tonnes/yr
    if (diet.dietType === 'heavy-meat') baseDietCO2 = 3.3;
    if (diet.dietType === 'low-meat') baseDietCO2 = 1.9;
    if (diet.dietType === 'vegetarian') baseDietCO2 = 1.5;
    if (diet.dietType === 'vegan') baseDietCO2 = 1.1;
    
    // local food discount (up to 10% reduction)
    const discount = (diet.localFoodPct / 100) * 0.1 * baseDietCO2;
    return baseDietCO2 - discount;
  };

  const calculateShoppingCO2 = () => {
    // Clothing: $150/month * 12 = $1800/yr. ~0.5kg CO2 per dollar
    const clothCO2 = (shopping.clothingSpend * 12 * 0.5) / 1000;
    // Electronics: count * 150kg per device
    const elecCO2 = (shopping.electronicsCount * 120) / 1000;
    // Services: $200/month * 12 = $2400/yr. ~0.2kg CO2 per dollar
    const servicesCO2 = (shopping.servicesSpend * 12 * 0.25) / 1000;
    
    return clothCO2 + elecCO2 + servicesCO2;
  };

  const tTransport = calculateTransportCO2();
  const tEnergy = calculateEnergyCO2();
  const tDiet = calculateDietCO2();
  const tShopping = calculateShoppingCO2();
  const totalCO2 = tTransport + tEnergy + tDiet + tShopping;

  const handleSave = () => {
    const updatedFootprint = parseFloat(totalCO2.toFixed(1));
    const currentPoints = userProfile?.points || 0;
    
    // Award points for completing calculator first time
    const profileData = {
      footprint: updatedFootprint,
      points: currentPoints + 50 // award 50 GP
    };
    
    onProfileUpdate(profileData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Chart data setup
  const chartData = {
    labels: ['Transport', 'Utilities', 'Diet', 'Shopping'],
    datasets: [
      {
        data: [
          parseFloat(tTransport.toFixed(2)),
          parseFloat(tEnergy.toFixed(2)),
          parseFloat(tDiet.toFixed(2)),
          parseFloat(tShopping.toFixed(2)),
        ],
        backgroundColor: ['#10b981', '#0d9488', '#059669', '#0f766e'],
        borderWidth: 1,
        borderColor: '#05140e',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#f3f4f6',
          font: { family: 'Outfit', size: 11 }
        }
      }
    },
    cutout: '65%',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in p-1 lg:p-4">
      {/* Stepper Calculator Form */}
      <div className="lg:col-span-2 glass-card p-6 rounded-2xl flex flex-col justify-between min-h-[500px]">
        <div>
          {/* Header Indicators */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold font-display text-white">Carbon Footprint Calculator</h1>
            <div className="flex items-center gap-1.5" role="progressbar" aria-label="Step progress" aria-valuenow={step} aria-valuemin="1" aria-valuemax="4">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={`h-2 w-8 rounded-full transition-all duration-300 ${
                    i === step 
                      ? 'bg-eco-accent w-12 glow-green' 
                      : i < step ? 'bg-eco-accent/40' : 'bg-eco-border/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stepper Views */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            
            {/* Step 1: Transport */}
            {step === 1 && (
              <fieldset className="space-y-6">
                <legend className="flex items-center gap-2 text-white font-semibold mb-4 border-b border-eco-border/20 pb-2 w-full">
                  <Car className="text-eco-accent h-5 w-5" />
                  <span>Transportation Habits</span>
                </legend>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="carType" className="text-xs font-semibold text-eco-text-muted">Primary Vehicle Type</label>
                    <select 
                      id="carType"
                      value={transport.carType}
                      onChange={(e) => setTransport({...transport, carType: e.target.value})}
                      className="w-full bg-eco-bg-dark border border-eco-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
                    >
                      <option value="gasoline">Gasoline Vehicle</option>
                      <option value="diesel">Diesel Vehicle</option>
                      <option value="hybrid">Hybrid Vehicle</option>
                      <option value="electric">Electric Vehicle</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="carMiles" className="text-xs font-semibold text-eco-text-muted">Annual Driving (Miles)</label>
                    <input 
                      id="carMiles"
                      type="number"
                      value={transport.carMiles}
                      onChange={(e) => setTransport({...transport, carMiles: parseInt(e.target.value) || 0})}
                      className="w-full bg-eco-bg-dark border border-eco-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="transitMiles" className="text-xs font-semibold text-eco-text-muted">Annual Transit (Bus/Train Miles)</label>
                    <input 
                      id="transitMiles"
                      type="number"
                      value={transport.transitMiles}
                      onChange={(e) => setTransport({...transport, transitMiles: parseInt(e.target.value) || 0})}
                      className="w-full bg-eco-bg-dark border border-eco-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="shortFlights" className="text-xs font-semibold text-eco-text-muted">Short Flights/yr (&lt; 3 hrs)</label>
                    <input 
                      id="shortFlights"
                      type="number"
                      value={transport.shortFlights}
                      onChange={(e) => setTransport({...transport, shortFlights: parseInt(e.target.value) || 0})}
                      className="w-full bg-eco-bg-dark border border-eco-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="longFlights" className="text-xs font-semibold text-eco-text-muted">Long Flights/yr (&gt; 3 hrs)</label>
                    <input 
                      id="longFlights"
                      type="number"
                      value={transport.longFlights}
                      onChange={(e) => setTransport({...transport, longFlights: parseInt(e.target.value) || 0})}
                      className="w-full bg-eco-bg-dark border border-eco-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
                    />
                  </div>
                </div>
              </fieldset>
            )}

            {/* Step 2: Energy */}
            {step === 2 && (
              <fieldset className="space-y-6">
                <legend className="flex items-center gap-2 text-white font-semibold mb-4 border-b border-eco-border/20 pb-2 w-full">
                  <Lightbulb className="text-eco-accent h-5 w-5" />
                  <span>Household Utilities</span>
                </legend>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="elec" className="text-xs font-semibold text-eco-text-muted">Monthly Electricity Usage (kWh)</label>
                    <input 
                      id="elec"
                      type="number"
                      value={energy.electricityKwh}
                      onChange={(e) => setEnergy({...energy, electricityKwh: parseInt(e.target.value) || 0})}
                      className="w-full bg-eco-bg-dark border border-eco-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="heating" className="text-xs font-semibold text-eco-text-muted">Heating Energy Source</label>
                    <select 
                      id="heating"
                      value={energy.heatingType}
                      onChange={(e) => setEnergy({...energy, heatingType: e.target.value})}
                      className="w-full bg-eco-bg-dark border border-eco-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
                    >
                      <option value="gas">Natural Gas</option>
                      <option value="oil">Heating Oil</option>
                      <option value="electric">Electric Heat (Heat Pump)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 max-w-md">
                  <label htmlFor="heatUsage" className="text-xs font-semibold text-eco-text-muted">Monthly Heating Fuel Usage (Therms or Liters)</label>
                  <input 
                    id="heatUsage"
                    type="number"
                    disabled={energy.heatingType === 'electric'}
                    value={energy.heatingType === 'electric' ? 0 : energy.heatingUsage}
                    onChange={(e) => setEnergy({...energy, heatingUsage: parseInt(e.target.value) || 0})}
                    className="w-full bg-eco-bg-dark disabled:opacity-40 border border-eco-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
                  />
                  {energy.heatingType === 'electric' && (
                    <span className="text-[10px] text-eco-accent flex items-center gap-1 mt-1">
                      <Info className="h-3.5 w-3.5" />
                      Electric heating emissions are already accounted for in your electricity inputs.
                    </span>
                  )}
                </div>
              </fieldset>
            )}

            {/* Step 3: Diet */}
            {step === 3 && (
              <fieldset className="space-y-6">
                <legend className="flex items-center gap-2 text-white font-semibold mb-4 border-b border-eco-border/20 pb-2 w-full">
                  <Utensils className="text-eco-accent h-5 w-5" />
                  <span>Diet & Food Habits</span>
                </legend>
                
                <div className="space-y-2">
                  <label htmlFor="diet" className="text-xs font-semibold text-eco-text-muted">Your Primary Dietary Style</label>
                  <select 
                    id="diet"
                    value={diet.dietType}
                    onChange={(e) => setDiet({...diet, dietType: e.target.value})}
                    className="w-full bg-eco-bg-dark border border-eco-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
                  >
                    <option value="heavy-meat">Meat Lover (High red meat intake)</option>
                    <option value="average-meat">Average Meat Consumption (Balanced diet)</option>
                    <option value="low-meat">Low Meat Eaters (Fish / Poultry only)</option>
                    <option value="vegetarian">Vegetarian (No meat, includes dairy/eggs)</option>
                    <option value="vegan">Vegan (Zero animal products)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold">
                    <label htmlFor="localFood" className="text-eco-text-muted">Local & Organic Food Share (%)</label>
                    <span className="text-eco-accent">{diet.localFoodPct}%</span>
                  </div>
                  <input 
                    id="localFood"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={diet.localFoodPct}
                    onChange={(e) => setDiet({...diet, localFoodPct: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-eco-border rounded-lg appearance-none cursor-pointer accent-eco-accent"
                  />
                  <p className="text-[10px] text-eco-text-muted leading-relaxed">
                    Sourcing food locally cuts down emissions associated with cross-country freight transportation ("food miles").
                  </p>
                </div>
              </fieldset>
            )}

            {/* Step 4: Shopping */}
            {step === 4 && (
              <fieldset className="space-y-6">
                <legend className="flex items-center gap-2 text-white font-semibold mb-4 border-b border-eco-border/20 pb-2 w-full">
                  <ShoppingBag className="text-eco-accent h-5 w-5" />
                  <span>Consumption & Shopping</span>
                </legend>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="clothing" className="text-xs font-semibold text-eco-text-muted">Clothing Spending ($/mo)</label>
                    <input 
                      id="clothing"
                      type="number"
                      value={shopping.clothingSpend}
                      onChange={(e) => setShopping({...shopping, clothingSpend: parseInt(e.target.value) || 0})}
                      className="w-full bg-eco-bg-dark border border-eco-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="devices" className="text-xs font-semibold text-eco-text-muted">New Electronics/yr</label>
                    <input 
                      id="devices"
                      type="number"
                      value={shopping.electronicsCount}
                      onChange={(e) => setShopping({...shopping, electronicsCount: parseInt(e.target.value) || 0})}
                      className="w-full bg-eco-bg-dark border border-eco-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="services" className="text-xs font-semibold text-eco-text-muted">Dining/Services Spending ($/mo)</label>
                    <input 
                      id="services"
                      type="number"
                      value={shopping.servicesSpend}
                      onChange={(e) => setShopping({...shopping, servicesSpend: parseInt(e.target.value) || 0})}
                      className="w-full bg-eco-bg-dark border border-eco-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
                    />
                  </div>
                </div>
              </fieldset>
            )}

          </form>
        </div>

        {/* Buttons Controls */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-eco-border/20">
          <button
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={step === 1}
            className="px-5 py-2.5 rounded-xl border border-eco-border/80 hover:bg-eco-border/30 text-white font-semibold text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          
          {step < 4 ? (
            <button
              onClick={() => setStep(prev => Math.min(4, prev + 1))}
              className="px-5 py-2.5 rounded-xl bg-eco-accent hover:bg-eco-accent/80 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className={`px-6 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${
                isSaved 
                  ? 'bg-emerald-600 text-white shadow-lg glow-green' 
                  : 'bg-eco-accent hover:bg-eco-accent/80 text-white shadow-md'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Saved & Sync'd!</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Update Profile & Earn 50 GP</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Real-time Calculation Panel */}
      <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white font-display tracking-wide uppercase">Real-Time Footprint</h2>
          
          {/* Big Number Output */}
          <div className="text-center py-6 bg-eco-bg-dark/40 border border-eco-border/30 rounded-2xl relative overflow-hidden">
            <span className="text-[10px] text-eco-text-muted uppercase tracking-widest block mb-1">Total Carbon Output</span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl lg:text-5xl font-bold font-display text-white tracking-tight animate-pulse-slow">
                {totalCO2.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-eco-text-muted">t CO₂e/yr</span>
            </div>
            {totalCO2 < 4.0 ? (
              <span className="text-[10px] text-eco-accent font-semibold flex items-center gap-1 justify-center mt-2">
                <Sparkles className="h-3 w-3" />
                Excellent! Lower than global average
              </span>
            ) : (
              <span className="text-[10px] text-yellow-500 font-semibold block mt-2">
                Opportunity for reduction identified
              </span>
            )}
          </div>

          {/* Breakdown graph */}
          <div className="h-48 relative flex items-center justify-center">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Small educational tip */}
        <div className="p-3.5 bg-emerald-950/20 border border-eco-border/40 rounded-xl">
          <span className="text-[10px] text-eco-accent uppercase font-bold tracking-wider block mb-1">Did you know?</span>
          <p className="text-[11px] text-eco-text-muted leading-relaxed">
            The global target to halt global warming is to reduce personal footprints to under **2.0 tonnes** of CO₂e annually by 2030.
          </p>
        </div>
      </div>
    </div>
  );
}
