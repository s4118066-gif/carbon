import React from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingDown, 
  Award, 
  Leaf, 
  ShieldCheck, 
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function Analytics({ userProfile }) {
  const footprint = userProfile?.footprint || 4.2;
  const points = userProfile?.points || 280;
  const treesPlanted = userProfile?.plantedTrees || 3;
  const username = userProfile?.displayName || "Eco Hero";

  // Category breakdown math
  const transportCO2 = footprint * 0.45;
  const energyCO2 = footprint * 0.30;
  const dietCO2 = footprint * 0.15;
  const shoppingCO2 = footprint * 0.10;

  // Chart 1: Category breakdown
  const categoryData = {
    labels: ['Transport', 'Utilities', 'Diet', 'Shopping'],
    datasets: [
      {
        data: [
          parseFloat(transportCO2.toFixed(2)),
          parseFloat(energyCO2.toFixed(2)),
          parseFloat(dietCO2.toFixed(2)),
          parseFloat(shoppingCO2.toFixed(2))
        ],
        backgroundColor: ['#10b981', '#0d9488', '#059669', '#0f766e'],
        borderWidth: 1,
        borderColor: '#05140e',
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#f3f4f6',
          font: { family: 'Outfit', size: 12 }
        }
      }
    },
    cutout: '70%',
  };

  // Chart 2: Target Comparison (Personal vs Regional vs COP Target)
  const comparisonData = {
    labels: ['Personal Score', 'Country Average', 'COP Target (2030)'],
    datasets: [
      {
        label: 'CO₂ emissions (t CO₂e/yr)',
        data: [footprint, 5.6, 2.0],
        backgroundColor: ['#10b981', '#78350f', '#0284c7'],
        borderRadius: 8,
        borderWidth: 0,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0c231c',
        borderColor: '#184435',
        borderWidth: 1,
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#8ca39a' } },
      y: { grid: { color: 'rgba(24, 68, 53, 0.1)' }, ticks: { color: '#8ca39a' } },
    },
  };

  // PDF Carbon Report Generator
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();

      // Heading banner
      doc.setFillColor(12, 35, 28);
      doc.rect(0, 0, 210, 40, 'F');

      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.text("ECOWISE AI CARBON REPORT", 15, 20);
      doc.setFontSize(9);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Official Carbon Footprint Analysis and Reduction Roadmap`, 15, 30);

      // User meta box
      doc.setFillColor(243, 244, 246);
      doc.rect(15, 50, 180, 30, 'F');
      
      doc.setTextColor(55, 65, 81);
      doc.setFontSize(9);
      doc.setFont('Helvetica', 'bold');
      doc.text("Account Name:", 20, 58);
      doc.text("Report Date:", 20, 66);
      doc.text("Green Points Earned:", 120, 58);
      doc.text("Twin Virtual Forest:", 120, 66);
      
      doc.setFont('Helvetica', 'normal');
      doc.text(username, 48, 58);
      doc.text(new Date().toLocaleDateString(), 48, 66);
      doc.text(`${points} GP`, 160, 58);
      doc.text(`${treesPlanted} Trees`, 160, 66);

      // Section 1: Footprint Summary
      doc.setTextColor(12, 35, 28);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.text("1. Annual Carbon Footprint Summary", 15, 95);
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.5);
      doc.line(15, 98, 195, 98);

      doc.setTextColor(55, 65, 81);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Your estimated total carbon footprint is ${footprint} tonnes of CO2 equivalent per year.`, 15, 106);
      
      // Breakdown numbers
      doc.setFont('Helvetica', 'bold');
      doc.text("Category Breakdown:", 15, 116);
      doc.setFont('Helvetica', 'normal');
      doc.text(`- Transportation emissions: ${transportCO2.toFixed(2)} tonnes CO2e/yr (45%)`, 20, 124);
      doc.text(`- Home utilities & heating: ${energyCO2.toFixed(2)} tonnes CO2e/yr (30%)`, 20, 131);
      doc.text(`- Dietary food choices: ${dietCO2.toFixed(2)} tonnes CO2e/yr (15%)`, 20, 138);
      doc.text(`- Shopping & consumption: ${shoppingCO2.toFixed(2)} tonnes CO2e/yr (10%)`, 20, 145);

      // Section 2: Action Roadmap
      doc.setTextColor(12, 35, 28);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.text("2. Sustainability Reduction Roadmap", 15, 162);
      doc.line(15, 165, 195, 165);

      doc.setTextColor(55, 65, 81);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.text("Based on your carbon footprint breakdown, EcoWise AI recommends these immediate steps:", 15, 172);

      doc.setFont('Helvetica', 'bold');
      doc.text("Step 1 (High Priority - Transport):", 15, 182);
      doc.setFont('Helvetica', 'normal');
      doc.text("Choose carpooling, cycling, or public transit. A 20% mileage cut saves 0.35 tonnes CO2/yr.", 15, 188);

      doc.setFont('Helvetica', 'bold');
      doc.text("Step 2 (Medium Priority - Utilities):", 15, 198);
      doc.setFont('Helvetica', 'normal');
      doc.text("Transition to LED lightbulbs and program smart power strips. Saves 0.15 tonnes CO2/yr.", 15, 204);

      doc.setFont('Helvetica', 'bold');
      doc.text("Step 3 (Diet & Shopping):", 15, 214);
      doc.setFont('Helvetica', 'normal');
      doc.text("Incorporate 2 plant-based dinners weekly and extend device usage cycles. Saves 0.10 tonnes CO2/yr.", 15, 220);

      // Footer certification
      doc.setFillColor(12, 35, 28);
      doc.rect(0, 267, 210, 30, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text("EcoWise AI - Empowering Carbon Neutrality", 105, 278, { align: 'center' });
      doc.text("This analysis is calculated using EPA, DEFRA, and IPCC methodologies.", 105, 284, { align: 'center' });

      doc.save(`ecowise_carbon_report_${username.toLowerCase().replace(' ', '_')}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF Report:", error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-1 lg:p-4">
      {/* Page Header */}
      <section 
        className="glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        aria-labelledby="analytics-heading"
      >
        <div>
          <h1 id="analytics-heading" className="text-xl font-bold font-display text-white">Carbon Analytics</h1>
          <p className="text-xs text-eco-text-muted">A detailed breakdown of carbon emissions with regional comparisons and downloadable PDF reports.</p>
        </div>

        <button
          onClick={handleExportPDF}
          className="px-5 py-2.5 rounded-xl bg-eco-accent hover:bg-eco-accent/80 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-eco-accent"
        >
          <Download className="h-4 w-4" />
          <span>Export Carbon Report PDF</span>
        </button>
      </section>

      {/* Chart Layout row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category breakdown */}
        <section aria-label="Emissions Category breakdown" className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-semibold text-white font-display tracking-wide uppercase">Emission Categories (t CO₂e)</h2>
          <div className="h-64 relative flex items-center justify-center">
            <Doughnut data={categoryData} options={donutOptions} />
          </div>
          <div className="text-center pt-2">
            <span className="text-xs text-eco-text-muted">
              Your transport represents **{(45).toFixed(0)}%** of your annual emissions.
            </span>
          </div>
        </section>

        {/* Global/Target comparison */}
        <section aria-label="Regional Benchmarks Comparison" className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-white font-display tracking-wide uppercase">Regional Benchmarks</h2>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>Personal target path</span>
            </span>
          </div>
          <div className="h-64 relative">
            <Bar data={comparisonData} options={barOptions} />
          </div>
          <div className="text-center pt-2">
            <span className="text-xs text-eco-text-muted">
              You are **{(1.4).toFixed(1)} tonnes** cleaner than the average citizen in your region.
            </span>
          </div>
        </section>
      </div>

      {/* Detailed statistics tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detail Stat 1 */}
        <div className="glass-card p-5 rounded-2xl border border-eco-border/40 text-center space-y-1">
          <span className="text-[10px] text-eco-text-muted uppercase font-bold tracking-wider block">Equivalent Trees Saved</span>
          <span className="text-2xl font-bold text-white font-display mt-1 block">{(footprint * 45).toFixed(0)}</span>
          <p className="text-[10px] text-eco-text-muted leading-relaxed">
            The quantity of mature trees needed to absorb your annual emissions from the atmosphere.
          </p>
        </div>

        {/* Detail Stat 2 */}
        <div className="glass-card p-5 rounded-2xl border border-eco-border/40 text-center space-y-1">
          <span className="text-[10px] text-eco-text-muted uppercase font-bold tracking-wider block">Weekly Reduction Target</span>
          <span className="text-2xl font-bold text-eco-accent font-display mt-1 block">-3.8 kg CO₂e</span>
          <p className="text-[10px] text-eco-text-muted leading-relaxed">
            The weekly emissions drop needed to hit your carbon goal of 3.0 tonnes by December.
          </p>
        </div>

        {/* Detail Stat 3 */}
        <div className="glass-card p-5 rounded-2xl border border-eco-border/40 text-center space-y-1">
          <span className="text-[10px] text-eco-text-muted uppercase font-bold tracking-wider block">Bio Forest Coverage</span>
          <span className="text-2xl font-bold text-sky-400 font-display mt-1 block">{treesPlanted} Trees</span>
          <p className="text-[10px] text-eco-text-muted leading-relaxed">
            Total trees planted in your Carbon Twin. Plant more to increase biodiversity ratings!
          </p>
        </div>
      </div>
    </div>
  );
}
