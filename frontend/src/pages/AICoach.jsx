import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Download, 
  Calendar, 
  CheckSquare, 
  RefreshCw,
  User,
  Leaf,
  Settings
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AICoach({ userProfile, onProfileUpdate }) {
  const footprint = userProfile?.footprint || 4.2;
  const points = userProfile?.points || 280;
  
  const [messages, setMessages] = useState([
    { 
      sender: 'ai', 
      text: `Hello! I am EcoWise AI, your personal sustainability coach. 🌳\n\nI see your annual carbon footprint is estimated at **${footprint} tonnes CO₂e**. I can help you find simple actions to reduce this. What area would you like to discuss today? (Transport, Diet, Utilities, or Shopping?)`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState([
    { id: 'wp_1', text: 'Substitute 2 meat dinners with vegetarian meals', completed: false, gp: 15 },
    { id: 'wp_2', text: 'Commute by public transit, biking, or walking at least once', completed: false, gp: 20 },
    { id: 'wp_3', text: 'Unplug chargers and appliances when not in use (phantom power)', completed: false, gp: 10 },
    { id: 'wp_4', text: 'Lower your water heater thermostat to 120°F (49°C)', completed: false, gp: 15 },
    { id: 'wp_5', text: 'Avoid purchasing single-use plastic bottles or packaging this week', completed: false, gp: 10 },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle direct client-side Gemini API calling if API key exists in localStorage
  const getAIResponse = async (userPrompt) => {
    const apiKey = localStorage.getItem("ecowise_gemini_key") || import.meta.env.VITE_GEMINI_API_KEY;
    
    if (apiKey && apiKey !== "mock-key") {
      try {
        const promptSystem = `You are EcoWise AI, a highly specialized, friendly, and expert sustainability coach. 
        The user has a carbon footprint of ${footprint} tonnes CO2e/year. Answer environmental and carbon reduction questions concisely, citing realistic actions.
        User question: ${userPrompt}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptSystem }] }]
          })
        });

        if (!response.ok) throw new Error("Gemini API key error or rate limit");
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
      } catch (err) {
        console.error("Gemini call failed, falling back to local model:", err);
      }
    }

    // Local smart matching model (Rule-based Fallback)
    const lowerInput = userPrompt.toLowerCase();
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return `Hello! How can I help you reduce your carbon footprint today? We can analyze your Transport, Diet, Utilities, or Shopping habits!`;
    }
    
    if (lowerInput.includes('transport') || lowerInput.includes('car') || lowerInput.includes('flight') || lowerInput.includes('bike')) {
      return `Vehicles contribute about 40% of the average footprint. 🚗\n\n**Suggestions to reduce transport carbon:**\n1. **Switch to Hybrid/EV**: Cuts emissions by 50-80%.\n2. **Carpool/Public Transit**: Sharing rides divides carbon impact.\n3. **Combine trips**: Planning saves mileage.\n4. **Combine flights**: Train travel for domestic trips is 90% cleaner than short-haul flying.`;
    }

    if (lowerInput.includes('diet') || lowerInput.includes('meat') || lowerInput.includes('food') || lowerInput.includes('vegan') || lowerInput.includes('vegetarian')) {
      return `Diet choices play a significant role. Food production accounts for 26% of global greenhouse gases. 🍲\n\n**Suggestions to reduce diet carbon:**\n1. **Eat less red meat**: Beef creates 60kg of CO2 per kg of meat, while peas create just 0.9kg.\n2. **Reduce food waste**: 33% of food is thrown away. Plan meals.\n3. **Source locally**: Buy local produce to reduce "food miles" and transport fuel.`;
    }

    if (lowerInput.includes('electric') || lowerInput.includes('utility') || lowerInput.includes('heat') || lowerInput.includes('energy') || lowerInput.includes('power')) {
      return `Home energy is a primary utility footprint category. 💡\n\n**Suggestions to reduce energy carbon:**\n1. **Switch to LED bulbs**: Uses 75% less energy and lasts 25x longer.\n2. **Adjust thermostat**: Set heating 2 degrees lower in winter to save 8% on fuel bills.\n3. **Phantom Power**: Unplug chargers, TVs, and appliances. Standby energy represents 10% of residential electricity.\n4. **Cold Wash**: Washing clothes at 30°C (86°F) saves 75% of machine energy.`;
    }

    if (lowerInput.includes('shopping') || lowerInput.includes('buy') || lowerInput.includes('clothes') || lowerInput.includes('electronics')) {
      return `Consumption emissions are embedded in manufacturing and shipping. 🛍️\n\n**Suggestions to reduce shopping carbon:**\n1. **Buy quality over quantity**: Choose durable clothes and wear them longer.\n2. **Repair & Recycle**: Repair devices before buying replacements.\n3. **Second-hand options**: Extends product lifetimes, saving up to 80% of manufacturing carbon.`;
    }

    if (lowerInput.includes('offset') || lowerInput.includes('tree') || lowerInput.includes('credits')) {
      return `Carbon offsets fund environmental projects (like planting trees or building solar farms) to balance your emissions. 🌳\n\nWhile offsets are helpful, focusing on direct reduction of emissions (travel, heating, food waste) is always the most effective strategy!`;
    }

    return `That's an interesting point! Reducing carbon in that area involves choosing efficient products, minimizing raw consumption, and prioritizing sharing and recycling models. Would you like me to generate specific, actionable steps for you?`;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setMessages(prev => [...prev, {
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    const responseText = await getAIResponse(userText);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleTogglePlan = (id, gpReward) => {
    let completedState = false;
    const updatedPlan = weeklyPlan.map(task => {
      if (task.id === id) {
        completedState = !task.completed;
        return { ...task, completed: completedState };
      }
      return task;
    });
    setWeeklyPlan(updatedPlan);

    if (completedState) {
      onProfileUpdate({ points: points + gpReward });
      confetti({
        particleCount: 40,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399']
      });
    } else {
      onProfileUpdate({ points: Math.max(0, points - gpReward) });
    }
  };

  const handleDownloadPlan = () => {
    let content = `--- ECOWISE AI - WEEKLY SUSTAINABILITY PLAN ---\n`;
    content += `Target Footprint: ${footprint} t CO2e/year\n\n`;
    content += `Weekly Actions Checklist:\n`;
    weeklyPlan.forEach((task, idx) => {
      content += `[${task.completed ? 'X' : ' '}] ${idx + 1}. ${task.text} (${task.gp} GP)\n`;
    });
    content += `\nGenerated on: ${new Date().toLocaleDateString()}\n`;
    content += `Track your progress at EcoWise AI and earn Green Points!`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ecowise_weekly_plan.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const quickPrompts = [
    "How do I reduce my transportation emissions?",
    "Why does beef have a high carbon footprint?",
    "Tell me about standby power (phantom load).",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in p-1 lg:p-4">
      
      {/* Active Chat Column */}
      <div className="lg:col-span-2 glass-card rounded-2xl flex flex-col h-[520px] justify-between overflow-hidden">
        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-eco-border/40 bg-eco-bg-dark/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-eco-accent-glow border border-eco-accent/30 text-eco-accent rounded-lg">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white font-display block">AI Sustainability Coach</span>
              <span className="text-[10px] text-eco-accent font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-eco-accent rounded-full animate-pulse" />
                Online & Ready
              </span>
            </div>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-2.5 max-w-[85%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              {/* Avatar Icon */}
              <div className={`h-8 w-8 rounded-full border flex items-center justify-center shrink-0 ${
                msg.sender === 'user' 
                  ? 'border-emerald-600 bg-emerald-950/20 text-emerald-400' 
                  : 'border-eco-accent bg-eco-accent-glow text-eco-accent'
              }`}>
                {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Leaf className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-line border ${
                msg.sender === 'user'
                  ? 'bg-eco-accent border-emerald-500 text-white rounded-tr-none'
                  : 'bg-eco-bg-dark/60 border-eco-border/60 text-eco-text-muted rounded-tl-none'
              }`}>
                {msg.text}
                <span className="block text-[8px] text-right mt-2 opacity-60">{msg.time}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-2.5">
              <div className="h-8 w-8 rounded-full border border-eco-accent bg-eco-accent-glow text-eco-accent flex items-center justify-center shrink-0">
                <Leaf className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-none p-4 bg-eco-bg-dark/60 border border-eco-border/60 text-xs text-eco-text-muted">
                <div className="flex gap-1 items-center" aria-label="Eco Coach is typing">
                  <span className="h-1.5 w-1.5 bg-eco-accent rounded-full animate-[bounce_1.4s_infinite_100ms]" />
                  <span className="h-1.5 w-1.5 bg-eco-accent rounded-full animate-[bounce_1.4s_infinite_200ms]" />
                  <span className="h-1.5 w-1.5 bg-eco-accent rounded-full animate-[bounce_1.4s_infinite_300ms]" />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-5 py-2 border-t border-eco-border/20 bg-eco-bg-dark/10 overflow-x-auto whitespace-nowrap flex gap-2 no-scrollbar">
          {quickPrompts.map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputValue(promptText);
              }}
              className="text-[10px] text-eco-text-muted hover:text-white bg-eco-card-light hover:bg-eco-border/30 border border-eco-border/40 px-3 py-1.5 rounded-full transition-all focus:outline-none focus:ring-1 focus:ring-eco-accent shrink-0"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Input container */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-eco-border/40 bg-eco-bg-dark/40 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask EcoWise Coach..."
            className="flex-1 bg-eco-bg-dark border border-eco-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
            aria-label="Ask Eco Coach a question"
          />
          <button
            type="submit"
            aria-label="Send message"
            className="p-3 bg-eco-accent hover:bg-eco-accent/80 text-white rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-eco-accent"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Weekly Plan Column */}
      <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="text-eco-accent h-5 w-5" />
              <h2 className="text-sm font-semibold text-white font-display tracking-wide uppercase">Weekly Action Plan</h2>
            </div>
            
            <button
              onClick={handleDownloadPlan}
              aria-label="Download action plan"
              className="p-2 text-eco-text-muted hover:text-white bg-eco-card-light rounded-lg border border-eco-border/40 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="text-xs text-eco-text-muted leading-relaxed">
            Check off actions as you complete them to earn Green Points and immediately reduce your virtual footprint!
          </p>

          <div className="space-y-3 pt-2" role="group" aria-label="Weekly sustainability checklist">
            {weeklyPlan.map(task => (
              <div 
                key={task.id} 
                className={`p-3 border rounded-xl flex items-start justify-between gap-3 transition-all ${
                  task.completed 
                    ? 'bg-emerald-950/20 border-emerald-900/60 text-emerald-300' 
                    : 'bg-eco-bg-dark/40 border-eco-border/30 text-eco-text-muted'
                }`}
              >
                <button
                  onClick={() => handleTogglePlan(task.id, task.gp)}
                  className="mt-0.5 border border-eco-border rounded h-4 w-4 flex items-center justify-center text-eco-accent shrink-0 focus:outline-none focus:ring-2 focus:ring-eco-accent"
                  aria-checked={task.completed}
                  role="checkbox"
                  aria-label={`Mark task completed: ${task.text}`}
                >
                  {task.completed && <Leaf className="h-3 w-3 fill-eco-accent" />}
                </button>
                <div className="flex-1">
                  <span className={`text-xs block ${task.completed ? 'line-through opacity-60' : ''}`}>{task.text}</span>
                  <span className="text-[9px] text-eco-accent font-semibold">+{task.gp} Green Points</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status indicator */}
        <div className="p-4 bg-emerald-950/20 border border-eco-border/40 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-eco-accent uppercase font-bold tracking-wider block">Plan Progress</span>
            <span className="text-xs font-semibold text-white mt-1 block">
              {weeklyPlan.filter(t => t.completed).length} of 5 Completed
            </span>
          </div>
          <div className="h-10 w-10 rounded-full border-2 border-eco-accent border-dashed flex items-center justify-center text-eco-accent font-bold text-xs">
            {Math.round((weeklyPlan.filter(t => t.completed).length / 5) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}
