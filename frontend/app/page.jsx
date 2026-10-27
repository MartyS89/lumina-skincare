"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Camera,
  Sun,
  Moon,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ShieldCheck,
  Droplets,
  HeartPulse,
  Activity,
  Layers,
  Search,
  Plus,
  RefreshCw,
  ChevronRight,
  Flame,
  Send,
  Bot,
  User,
  Key
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api";

export default function SkincareApp() {
  const [activeTab, setActiveTab] = useState("scan");

  // State
  const [products, setProducts] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [scans, setScans] = useState([]);
  const [serverOnline, setServerOnline] = useState(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      id: "init-1",
      role: "assistant",
      content:
        "Hello! I am **Lumina**, your AI Skincare Coach.\n\nI have reviewed your latest diagnostic profile. You can ask me anything about your current skin barrier, active ingredient pairing (e.g. *Can I mix Retinol with BHA?*), or custom product recommendations.\n\nHow can I help your skin glow today?",
      provider: "Lumina AI Coach",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeySettings, setShowApiKeySettings] = useState(false);
  const chatBottomRef = useRef(null);

  // Scan State
  const [scanImage, setScanImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentScan, setCurrentScan] = useState(null);
  const fileInputRef = useRef(null);

  // Conflict Checker State
  const [selectedActives, setSelectedActives] = useState(["Retinol", "Salicylic Acid"]);
  const [conflictReport, setConflictReport] = useState(null);
  const [checkingConflicts, setCheckingConflicts] = useState(false);

  // Product Filter State
  const [productCategory, setProductCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allActivesList = [
    "Retinol",
    "Salicylic Acid",
    "Glycolic Acid",
    "Vitamin C (L-Ascorbic Acid)",
    "Niacinamide",
    "Hyaluronic Acid",
    "Ceramides",
    "Benzoyl Peroxide",
    "Centella Asiatica (Cica)"
  ];

  // Load Initial Data
  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInitialData = async () => {
    try {
      const [prodRes, routRes, scanRes] = await Promise.all([
        fetch(`${API_BASE}/products/`).catch(() => null),
        fetch(`${API_BASE}/routines/`).catch(() => null),
        fetch(`${API_BASE}/scans/`).catch(() => null)
      ]);

      if (prodRes && prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.results || prodData);
        setServerOnline(true);
      } else {
        setServerOnline(false);
        setFallbackData();
      }

      if (routRes && routRes.ok) {
        const routData = await routRes.json();
        setRoutines(routData.results || routData);
      }

      if (scanRes && scanRes.ok) {
        const scanData = await scanRes.json();
        const list = scanData.results || scanData;
        setScans(list);
        if (list.length > 0) setCurrentScan(list[0]);
      }
    } catch {
      setServerOnline(false);
      setFallbackData();
    }
  };

  const setFallbackData = () => {
    const defaultProducts = [
      {
        id: 1,
        name: "Hydrating Facial Cleanser",
        brand: "CeraVe",
        category: "cleanser",
        target_skin_types: ["dry", "normal", "sensitive"],
        key_actives: ["Ceramides", "Hyaluronic Acid"],
        description: "Gentle lotion cleanser that locks in moisture without stripping.",
        price: 14.99,
        rating: 4.8,
        image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60"
      },
      {
        id: 2,
        name: "2% BHA Liquid Exfoliant",
        brand: "Paula's Choice",
        category: "treatment",
        target_skin_types: ["oily", "combination", "acne-prone"],
        key_actives: ["Salicylic Acid"],
        description: "Unclogs pores, clears blackheads, and smoothes rough texture.",
        price: 35.0,
        rating: 4.9,
        image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60"
      },
      {
        id: 3,
        name: "Niacinamide 10% + Zinc 1%",
        brand: "The Ordinary",
        category: "serum",
        target_skin_types: ["oily", "combination", "sensitive"],
        key_actives: ["Niacinamide"],
        description: "High-strength vitamin & mineral blemish formula.",
        price: 6.5,
        rating: 4.6,
        image_url: "https://images.unsplash.com/photo-1608248597359-5f284ec194e8?w=500&auto=format&fit=crop&q=60"
      },
      {
        id: 4,
        name: "Retinol 0.5% in Squalane",
        brand: "The Ordinary",
        category: "treatment",
        target_skin_types: ["dry", "normal", "combination"],
        key_actives: ["Retinol"],
        description: "Refines fine lines, boosts turnover, and fades sun spots.",
        price: 9.2,
        rating: 4.5,
        image_url: "https://images.unsplash.com/photo-1617897903246-719242758050?w=500&auto=format&fit=crop&q=60"
      },
      {
        id: 5,
        name: "Relief Sun : Rice + Probiotics SPF50+",
        brand: "Beauty of Joseon",
        category: "sunscreen",
        target_skin_types: ["all", "sensitive", "dry"],
        key_actives: ["Niacinamide"],
        description: "Lightweight organic sunscreen with dewy nourishing finish.",
        price: 18.0,
        rating: 4.9,
        image_url: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=60"
      }
    ];

    setProducts(defaultProducts);
    setRoutines([
      {
        id: 1,
        title: "Radiant Morning Glow",
        time_of_day: "morning",
        target_goal: "Hydration & Environmental Shield",
        steps: [
          { id: 101, order: 1, step_name: "Gentle Cleanse", notes: "Use lukewarm water", is_completed: true, product_details: defaultProducts[0] },
          { id: 102, order: 2, step_name: "Brightening Niacinamide", notes: "2-3 drops patted into cheeks", is_completed: true, product_details: defaultProducts[2] },
          { id: 103, order: 3, step_name: "Broad Spectrum SPF 50+", notes: "Two finger lengths", is_completed: false, product_details: defaultProducts[4] }
        ]
      },
      {
        id: 2,
        title: "Night Cellular Repair",
        time_of_day: "evening",
        target_goal: "Pore Clearing & Deep Nourishment",
        steps: [
          { id: 201, order: 1, step_name: "Double Cleanse", notes: "Dissolve daily sunscreen", is_completed: false, product_details: defaultProducts[0] },
          { id: 202, order: 2, step_name: "BHA Pore Exfoliant", notes: "2 nights a week only", is_completed: false, product_details: defaultProducts[1] },
          { id: 203, order: 3, step_name: "Retinol 0.5% Serum", notes: "Pea-sized amount on dry skin", is_completed: false, product_details: defaultProducts[3] }
        ]
      }
    ]);

    const initialScan = {
      detected_skin_type: "Combination",
      overall_score: 87,
      hydration_score: 82,
      redness_score: 91,
      blemish_score: 85,
      texture_score: 80,
      detected_concerns: [
        "Slight dehydration lines under eye contour",
        "Enlarged pores and sebum activity in T-zone",
        "Mild surface redness on upper cheeks"
      ],
      ai_recommendations: [
        "Layer Hyaluronic Acid on damp skin before sealing with moisturizer.",
        "Use Salicylic Acid (BHA) 2 evenings weekly to dissolve pore congestion.",
        "Always follow up with SPF 50+ in your morning routine."
      ],
      created_at: new Date().toISOString()
    };
    setCurrentScan(initialScan);
    setScans([initialScan]);
  };

  // Toggle routine step
  const handleToggleStep = async (routineId, stepId) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== routineId) return r;
        return {
          ...r,
          steps: r.steps.map((s) => (s.id === stepId ? { ...s, is_completed: !s.is_completed } : s))
        };
      })
    );

    try {
      await fetch(`${API_BASE}/steps/${stepId}/toggle/`, { method: "POST" });
    } catch {
      // offline fallback
    }
  };

  // Handle Photo selection & Scan
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setScanImage(url);
    }
  };

  const handleRunScan = async () => {
    setAnalyzing(true);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      formData.append("notes", "User scan via Lumina Next.js app");

      const res = await fetch(`${API_BASE}/scans/analyze/`, {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const scanData = await res.json();
        setCurrentScan(scanData);
        setScans((prev) => [scanData, ...prev]);
      } else {
        throw new Error("API error");
      }
    } catch {
      // Fallback simulated scan
      const simulated = {
        detected_skin_type: "Combination / Sensitive",
        overall_score: Math.floor(Math.random() * 10) + 82,
        hydration_score: Math.floor(Math.random() * 15) + 75,
        redness_score: Math.floor(Math.random() * 15) + 78,
        blemish_score: Math.floor(Math.random() * 15) + 80,
        texture_score: Math.floor(Math.random() * 15) + 76,
        detected_concerns: [
          "Mild redness along cheekbones",
          "Low hydration barrier score around nose",
          "Slight pore congestion in T-zone"
        ],
        ai_recommendations: [
          "Apply Ceramide barrier recovery balm in the evening.",
          "Alternate active exfoliation: avoid using BHA and Retinol on the same night.",
          "Maintain daily broad spectrum SPF 50+ application."
        ],
        created_at: new Date().toISOString()
      };
      setCurrentScan(simulated);
      setScans((prev) => [simulated, ...prev]);
    } finally {
      setAnalyzing(false);
    }
  };

  // Conflict Checker
  const toggleActive = (active) => {
    setSelectedActives((prev) =>
      prev.includes(active) ? prev.filter((a) => a !== active) : [...prev, active]
    );
  };

  const handleCheckConflicts = async () => {
    setCheckingConflicts(true);
    try {
      const res = await fetch(`${API_BASE}/conflicts/check/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: selectedActives })
      });

      if (res.ok) {
        const data = await res.json();
        setConflictReport(data);
      } else {
        throw new Error("Failed");
      }
    } catch {
      // Fallback local rule check
      const conflicts = [];
      const hasRetinol = selectedActives.includes("Retinol");
      const hasSalicylic = selectedActives.includes("Salicylic Acid");
      const hasGlycolic = selectedActives.includes("Glycolic Acid");
      const hasBP = selectedActives.includes("Benzoyl Peroxide");
      const hasVitC = selectedActives.includes("Vitamin C (L-Ascorbic Acid)");

      if (hasRetinol && hasSalicylic) {
        conflicts.push({
          ingredient_a: "Retinol",
          ingredient_b: "Salicylic Acid",
          severity: "danger",
          reason: "Both speed up cell turnover and can severely compromise your skin barrier, causing peeling, intense redness, and irritation.",
          suggestion: "Use Salicylic Acid in the morning or alternate nights; reserve Retinol strictly for evening use."
        });
      }
      if (hasRetinol && hasGlycolic) {
        conflicts.push({
          ingredient_a: "Retinol",
          ingredient_b: "Glycolic Acid",
          severity: "danger",
          reason: "AHA exfoliants layered with Retinoids cause over-exfoliation and stinging.",
          suggestion: "Implement Skin Cycling: Exfoliate Night 1, Retinol Night 2, Recovery Nights 3 & 4."
        });
      }
      if (hasRetinol && hasBP) {
        conflicts.push({
          ingredient_a: "Retinol",
          ingredient_b: "Benzoyl Peroxide",
          severity: "danger",
          reason: "Benzoyl Peroxide rapidly oxidizes and neutralizes Retinol, nullifying its anti-aging benefits while causing intense flaking.",
          suggestion: "Use Benzoyl Peroxide in the morning and Retinol at night."
        });
      }
      if (hasVitC && hasBP) {
        conflicts.push({
          ingredient_a: "Vitamin C (L-Ascorbic Acid)",
          ingredient_b: "Benzoyl Peroxide",
          severity: "warning",
          reason: "Benzoyl Peroxide oxidizes Vitamin C, reducing its antioxidant brightening capacity.",
          suggestion: "Apply Vitamin C in the morning under SPF, and Benzoyl Peroxide in the evening."
        });
      }

      setConflictReport({
        analyzed_ingredients: selectedActives,
        conflicts,
        safe: conflicts.length === 0
      });
    } finally {
      setCheckingConflicts(false);
    }
  };

  useEffect(() => {
    handleCheckConflicts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedActives]);

  // AI Assistant Chat Handler
  const handleSendMessage = async (textOverride) => {
    const textToSend = textOverride || inputMessage.trim();
    if (!textToSend || chatLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setChatLoading(true);

    try {
      const history = chatMessages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch(`${API_BASE}/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history,
          api_key: apiKey || undefined
        })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          provider: data.provider || "Lumina AI Coach",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        setChatMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error("Chat request failed");
      }
    } catch {
      // Local fallback if offline
      const assistantMsg = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content:
          "✨ **Dermatology Consultation Tip:**\n\n" +
          "When introducing any potent active (such as Retinoids, AHA/BHA, or Ascorbic Acid), follow the **Rule of 3s**:\n" +
          "• Apply only **2 nights per week** for the first 3 weeks to monitor skin tolerance.\n" +
          "• Buffer with a **Ceramide moisturizer** before active application if sensitive.\n" +
          "• Always pair with **broad-spectrum SPF 50+** each morning.",
        provider: "Lumina AI (Offline Mode)",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setChatLoading(false);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = productCategory === "all" || p.category === productCategory;
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.key_actives.some((act) => act.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                Lumina Skin
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs uppercase tracking-wider font-semibold px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full border border-rose-200">
                AI Skincare
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              <span
                className={`w-2 h-2 rounded-full ${
                  serverOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
                }`}
              />
              <span className="font-medium">
                {serverOnline ? "Django API Online" : "Demo Mode"}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 sm:gap-2 overflow-x-auto no-scrollbar border-t border-slate-100">
          <button
            onClick={() => setActiveTab("scan")}
            className={`flex items-center gap-2 py-3 px-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === "scan"
                ? "border-rose-500 text-rose-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Camera className="w-4 h-4" />
            AI Skin Scanner
          </button>

          <button
            onClick={() => setActiveTab("routine")}
            className={`flex items-center gap-2 py-3 px-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === "routine"
                ? "border-rose-500 text-rose-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sun className="w-4 h-4" />
            Daily Routines
          </button>

          <button
            onClick={() => setActiveTab("conflicts")}
            className={`flex items-center gap-2 py-3 px-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === "conflicts"
                ? "border-rose-500 text-rose-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Conflict Checker
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 py-3 px-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === "products"
                ? "border-rose-500 text-rose-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-4 h-4" />
            Product Catalog
          </button>

          <button
            onClick={() => setActiveTab("diary")}
            className={`flex items-center gap-2 py-3 px-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === "diary"
                ? "border-rose-500 text-rose-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            Skin History
          </button>

          <button
            onClick={() => setActiveTab("coach")}
            className={`flex items-center gap-2 py-3 px-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "coach"
                ? "border-rose-500 text-rose-600 bg-rose-50/50"
                : "border-transparent text-slate-700 hover:text-rose-600"
            }`}
          >
            <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
            AI Coach
            <span className="text-[10px] bg-gradient-to-r from-rose-500 to-amber-500 text-white px-1.5 py-0.2 rounded-full uppercase tracking-wider font-bold">
              LLM
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {/* TAB 1: AI SKIN SCANNER */}
        {activeTab === "scan" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                  <Camera className="w-5 h-5 text-rose-500" />
                  Selfie Skin Scan
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  Take or upload a clean, makeup-free selfie in natural light. Our AI will analyze redness, pore hydration, and skin barrier health.
                </p>

                <div className="relative aspect-[4/5] bg-slate-100 rounded-xl overflow-hidden border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-4">
                  {scanImage ? (
                    <img
                      src={scanImage}
                      alt="Uploaded skin selfie"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                        <Camera className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">Upload your portrait photo</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG or WebP up to 10MB</p>
                    </div>
                  )}

                  {analyzing && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
                      <div className="w-12 h-12 border-4 border-rose-400 border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="font-semibold text-base">Analyzing facial skin zones...</p>
                      <p className="text-xs text-rose-200 mt-1">
                        Detecting barrier moisture, redness index & pore texture
                      </p>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 font-medium text-xs hover:bg-slate-50 transition flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Choose Photo
                  </button>

                  <button
                    onClick={handleRunScan}
                    disabled={analyzing}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium text-xs shadow-md shadow-rose-200 hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {analyzing ? "Scanning..." : "Start AI Analysis"}
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl p-5 border border-rose-100 shadow-sm">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-1">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  AI Skincare Coach Tip
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Skin changes with circadian rhythm. Hydration drops overnight, making barrier repair best suited for your evening routine, while antioxidant defense (like Vitamin C) belongs in the morning under SPF.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-6">
              {currentScan ? (
                <>
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">
                          Diagnostic Result
                        </span>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                          {currentScan.detected_skin_type} Skin Profile
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Analyzed {new Date(currentScan.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-2xl p-3 px-4">
                        <div className="text-right">
                          <div className="text-xs font-medium text-slate-500">Overall Health</div>
                          <div className="text-2xl font-black text-rose-600">
                            {currentScan.overall_score}%
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-sm">
                          {currentScan.overall_score >= 85 ? "A" : "B+"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500 font-medium">Hydration</span>
                          <Droplets className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <div className="text-xl font-bold text-slate-800">
                          {currentScan.hydration_score}%
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            className="bg-blue-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${currentScan.hydration_score}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500 font-medium">Calmness</span>
                          <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                        </div>
                        <div className="text-xl font-bold text-slate-800">
                          {currentScan.redness_score}%
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            className="bg-rose-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${currentScan.redness_score}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500 font-medium">Clarity</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <div className="text-xl font-bold text-slate-800">
                          {currentScan.blemish_score}%
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${currentScan.blemish_score}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500 font-medium">Texture</span>
                          <Activity className="w-3.5 h-3.5 text-amber-500" />
                        </div>
                        <div className="text-xl font-bold text-slate-800">
                          {currentScan.texture_score}%
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${currentScan.texture_score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Detected Facial Concerns
                    </h4>
                    <div className="space-y-2">
                      {currentScan.detected_concerns.map((concern, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-900"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                          <span>{concern}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-rose-500" />
                      AI Action Plan
                    </h4>
                    <div className="space-y-2.5">
                      {currentScan.ai_recommendations.map((rec, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
                        >
                          <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold flex-shrink-0 text-[10px]">
                            {idx + 1}
                          </div>
                          <span className="leading-relaxed">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center flex flex-col items-center justify-center">
                  <Camera className="w-12 h-12 text-slate-300 mb-3" />
                  <h3 className="text-base font-semibold text-slate-700">No skin scan recorded yet</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Click &ldquo;Start AI Analysis&rdquo; to process your photo and receive instant metric diagnostics.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ROUTINES & CHECKLIST */}
        {activeTab === "routine" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Daily Skincare Routine</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track your morning and evening steps. Check off steps as you complete them to build your consistency streak.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-emerald-600" /> 5 Day Streak
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {routines.map((routine) => {
                const isMorning = routine.time_of_day === "morning";
                const completedCount = routine.steps.filter((s) => s.is_completed).length;
                const progressPct =
                  routine.steps.length > 0 ? Math.round((completedCount / routine.steps.length) * 100) : 0;

                return (
                  <div
                    key={routine.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              isMorning
                                ? "bg-amber-100 text-amber-700"
                                : "bg-indigo-100 text-indigo-700"
                            }`}
                          >
                            {isMorning ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-base">{routine.title}</h3>
                            <p className="text-xs text-slate-400">{routine.target_goal}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-semibold text-slate-500">
                            {completedCount}/{routine.steps.length} done
                          </span>
                          <div className="w-20 bg-slate-100 h-2 rounded-full mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isMorning ? "bg-amber-500" : "bg-indigo-500"
                              }`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        {routine.steps.map((step) => (
                          <div
                            key={step.id}
                            onClick={() => handleToggleStep(routine.id, step.id)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              step.is_completed
                                ? "bg-slate-50/70 border-slate-200 opacity-60 line-through"
                                : "bg-white border-slate-200 hover:border-rose-300 hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <button className="text-slate-400 hover:text-emerald-600 transition">
                                {step.is_completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-300" />
                                )}
                              </button>
                              <div>
                                <div className="text-xs font-semibold text-slate-800">
                                  {step.order}. {step.step_name}
                                </div>
                                {step.product_details && (
                                  <div className="text-[11px] text-rose-600 font-medium">
                                    {step.product_details.brand} — {step.product_details.name}
                                  </div>
                                )}
                                {step.notes && (
                                  <div className="text-[10px] text-slate-400 mt-0.5">{step.notes}</div>
                                )}
                              </div>
                            </div>

                            {step.product_details?.key_actives && (
                              <div className="flex flex-wrap gap-1 max-w-[120px] justify-end">
                                {step.product_details.key_actives.map((act, i) => (
                                  <span
                                    key={i}
                                    className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                                  >
                                    {act}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>Click any step to check it off</span>
                      <span className="text-rose-500 font-medium hover:underline cursor-pointer">
                        + Add Custom Product
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CONFLICT CHECKER */}
        {activeTab === "conflicts" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Active Ingredient Conflict Checker</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mixing certain actives (like Retinol and Acids) can disrupt the skin barrier, induce irritation, or cancel out product efficacy.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Select Active Ingredients in Your Products:
              </h3>
              <div className="flex flex-wrap gap-2">
                {allActivesList.map((active) => {
                  const isSelected = selectedActives.includes(active);
                  return (
                    <button
                      key={active}
                      onClick={() => toggleActive(active)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                        isSelected
                          ? "bg-rose-500 text-white shadow-sm shadow-rose-200"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {active} {isSelected ? "✕" : "+"}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-500" />
                  Compatibility Analysis ({selectedActives.length} Actives Selected)
                </h3>

                {conflictReport && (
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      conflictReport.safe
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {conflictReport.safe ? "✓ All Actives Safe Together" : `⚠️ ${conflictReport.conflicts.length} Conflict(s) Detected`}
                  </span>
                )}
              </div>

              {checkingConflicts ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-rose-500" />
                  Evaluating ingredient synergy rules...
                </div>
              ) : conflictReport && conflictReport.conflicts.length > 0 ? (
                <div className="space-y-4">
                  {conflictReport.conflicts.map((conf, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border ${
                        conf.severity === "danger"
                          ? "bg-rose-50/80 border-rose-200"
                          : "bg-amber-50/80 border-amber-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <AlertTriangle
                          className={`w-4 h-4 ${
                            conf.severity === "danger" ? "text-rose-600" : "text-amber-600"
                          }`}
                        />
                        <span
                          className={
                            conf.severity === "danger" ? "text-rose-900" : "text-amber-900"
                          }
                        >
                          Conflict: {conf.ingredient_a} + {conf.ingredient_b}
                        </span>
                        <span
                          className={`ml-auto text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            conf.severity === "danger"
                              ? "bg-rose-200 text-rose-800"
                              : "bg-amber-200 text-amber-800"
                          }`}
                        >
                          {conf.severity === "danger" ? "Severe Danger" : "Caution"}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                        <strong>Why:</strong> {conf.reason}
                      </p>

                      <div className="mt-3 p-2.5 bg-white/80 rounded-lg text-xs text-slate-800 border border-slate-200/50">
                        <strong>Recommended Protocol:</strong> {conf.suggestion}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">Harmonious Actives</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    The chosen ingredients work synergistically without barrier damage when applied in standard cosmetic concentrations.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCT CATALOG */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Skincare Product Directory</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Browse dermatologist-curated products tagged by actives, target skin concerns, and ratings.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search brand, product, active..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: "all", label: "All Products" },
                { id: "cleanser", label: "Cleansers" },
                { id: "serum", label: "Serums" },
                { id: "treatment", label: "Treatments / Actives" },
                { id: "moisturizer", label: "Moisturizers" },
                { id: "sunscreen", label: "Sunscreen (SPF)" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setProductCategory(cat.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                    productCategory === cat.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-3 relative">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 text-slate-800 shadow-sm backdrop-blur-sm">
                        ★ {product.rating}
                      </span>
                    </div>

                    <div className="text-[11px] uppercase tracking-wider font-bold text-rose-500">
                      {product.brand}
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mt-0.5 line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {product.key_actives.map((act, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md font-medium"
                        >
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <button
                      onClick={() => {
                        setActiveTab("conflicts");
                        setSelectedActives((prev) => Array.from(new Set([...prev, ...product.key_actives])));
                      }}
                      className="text-xs text-slate-700 hover:text-rose-600 font-medium flex items-center gap-1"
                    >
                      Check Compatibility <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SKIN HISTORY DIARY */}
        {activeTab === "diary" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Skin Diary & Progress History</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review your skin health scores over time to see the real impact of your active routines.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="space-y-4">
                {scans.map((scan, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center font-black text-base shadow-sm">
                        {scan.overall_score}%
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800">
                          {scan.detected_skin_type} Scan Check-in
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(scan.created_at || Date.now()).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-slate-400">Hydration:</span>{" "}
                        <strong className="text-blue-600">{scan.hydration_score}%</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Calmness:</span>{" "}
                        <strong className="text-rose-600">{scan.redness_score}%</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Texture:</span>{" "}
                        <strong className="text-amber-600">{scan.texture_score}%</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AI SKINCARE COACH ASSISTANT */}
        {activeTab === "coach" && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* Coach Header & LLM Settings Bar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-rose-200">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">Lumina AI Skincare Coach</h2>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Grounded in your latest diagnostic scan, ingredient conflict matrices, and cosmetic science.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowApiKeySettings(!showApiKeySettings)}
                  className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition flex items-center gap-1.5 font-medium"
                >
                  <Key className="w-3.5 h-3.5 text-amber-500" />
                  {apiKey ? "API Key Configured" : "Custom LLM Key"}
                </button>
              </div>
            </div>

            {/* Optional API Key Configuration Drawer */}
            {showApiKeySettings && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 animate-fade-in">
                <div className="flex items-center gap-1.5 font-bold mb-1.5">
                  <Key className="w-4 h-4 text-amber-600" />
                  Optional: Connect Your OpenAI / LLM API Key
                </div>
                <p className="text-slate-600 text-[11px] mb-2.5">
                  By default, Lumina uses its built-in dermatological reasoning engine (free with zero setup). Enter an OpenAI API key below if you wish to query a live **GPT-4o-mini** model.
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="sk-proj-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                  <button
                    onClick={() => setShowApiKeySettings(false)}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl font-medium text-xs hover:bg-slate-800"
                  >
                    Save & Close
                  </button>
                </div>
              </div>
            )}

            {/* Diagnostic Context Bar */}
            {currentScan && (
              <div className="bg-rose-50/60 border border-rose-100 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-rose-900">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  <span>
                    Consultation context grounded in: <strong>{currentScan.detected_skin_type} Profile</strong> (Hydration: {currentScan.hydration_score}%, Calmness: {currentScan.redness_score}%)
                  </span>
                </div>
                <span className="text-[10px] text-rose-600 font-semibold uppercase tracking-wider">
                  RAG Enabled
                </span>
              </div>
            )}

            {/* Chat Messages Container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 min-h-[420px] max-h-[520px] overflow-y-auto flex flex-col gap-4">
              {chatMessages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-[85%] ${
                      isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs ${
                        isUser
                          ? "bg-slate-800"
                          : "bg-gradient-to-tr from-rose-500 to-amber-400 shadow-sm shadow-rose-200"
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>

                    <div>
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                          isUser
                            ? "bg-slate-900 text-white rounded-tr-none"
                            : "bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none shadow-sm"
                        }`}
                      >
                        {msg.content}
                      </div>

                      <div
                        className={`flex items-center gap-2 mt-1 text-[10px] text-slate-400 px-1 ${
                          isUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {msg.provider && (
                          <>
                            <span>•</span>
                            <span className="text-rose-500 font-medium">{msg.provider}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {chatLoading && (
                <div className="flex gap-3 max-w-[80%] mr-auto items-center text-slate-400 text-xs">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-500" />
                    <span>Lumina is formulating advice...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                "Can I use Retinol with BHA?",
                "My skin feels tight & peeling",
                "What order should I layer my serums?",
                "Vitamin C with Niacinamide?",
                "Best sunscreen recommendation"
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={chatLoading}
                  className="text-[11px] bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 text-slate-700 px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask Lumina about routines, active ingredients, barrier repair..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={chatLoading}
                className="flex-1 px-3 py-2 text-xs focus:outline-none text-slate-800 placeholder-slate-400"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={chatLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-rose-500 to-pink-600 text-white p-2.5 rounded-xl hover:opacity-95 transition disabled:opacity-40 shadow-sm shadow-rose-200 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
