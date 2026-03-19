import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Briefcase, FileText, BarChart3, Loader2, ArrowUpRight, ArrowDownRight, Building2, Star, Users, AlertCircle, AlertTriangle, ThumbsUp, ThumbsDown, ExternalLink, Swords, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { researchCompany, CompanyResearchData } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Markdown from 'react-markdown';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<companyresearchdata |="" null="">(null);
  const [error, setError] = useState<string |="" null="">(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await researchCompany(query);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div classname="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header classname="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5 px-6 py-4">
        <div classname="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div classname="flex items-center gap-2">
            <div classname="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <building2 size="{24}"/>
            </div>
            <div>
              <h1 classname="text-xl font-bold tracking-tight">InsightCorp</h1>
              <p classname="text-xs text-muted-foreground font-mono uppercase tracking-widest opacity-60">AI Intelligence Engine</p>
            </div>
          </div>

          <form onsubmit="{handleSearch}" classname="relative flex-1 max-w-xl">
            <search classname="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size="{18}"/>
            <input type="text" value="{query}" onchange="{(e)" ==""> setQuery(e.target.value)}
              placeholder="Search any company (e.g. NVIDIA, Stripe, SpaceX)..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-black/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
            />
            {loading && (
              <div classname="absolute right-4 top-1/2 -translate-y-1/2">
                <loader2 classname="animate-spin text-emerald-600" size="{18}"/>
              </div>
            )}
          </form>
        </div>
      </header>

      <main classname="max-w-7xl mx-auto px-6 py-8">
        <animatepresence mode="wait">
          {!data && !loading && !error && (
            <motion.div initial="{{" opacity:="" 0,="" y:="" 20="" }}="" animate="{{" opacity:="" 1,="" y:="" 0="" }}="" exit="{{" opacity:="" 0,="" y:="" -20="" }}="" classname="flex flex-col items-center justify-center py-32 text-center">
              <div classname="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 text-emerald-600">
                <search size="{40}"/>
              </div>
              <h2 classname="text-3xl font-bold mb-4">Company Intelligence at your fingertips</h2>
              <p classname="text-gray-500 max-w-md text-lg">
                Enter a company name above to generate a deep-dive research dashboard including growth, patents, and hiring trends.
              </p>
            </motion.div>
          )}

          {loading && (
            <motion.div initial="{{" opacity:="" 0="" }}="" animate="{{" opacity:="" 1="" }}="" exit="{{" opacity:="" 0="" }}="" classname="flex flex-col items-center justify-center py-32 text-center">
              <div classname="relative">
                <div classname="w-24 h-24 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-8"/>
                <building2 classname="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600" size="{32}"/>
              </div>
              <h2 classname="text-2xl font-bold mb-2">Analyzing {query}...</h2>
              <p classname="text-gray-500 animate-pulse">Scouring the internet for the latest data</p>
            </motion.div>
          )}

          {error && (
            <motion.div initial="{{" opacity:="" 0="" }}="" animate="{{" opacity:="" 1="" }}="" classname="bg-red-50 border border-red-100 text-red-700 p-6 rounded-2xl max-w-2xl mx-auto text-center">
              <p classname="font-medium mb-2">Research Failed</p>
              <p classname="text-sm opacity-80">{error}</p>
              <button onclick="{()" ==""> handleSearch({ preventDefault: () => {} } as any)}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {data && !loading && (
            <motion.div initial="{{" opacity:="" 0,="" y:="" 20="" }}="" animate="{{" opacity:="" 1,="" y:="" 0="" }}="" classname="space-y-8 pb-12">
              {/* Hero Section */}
              <div classname="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
                <div classname="flex flex-col gap-8 mb-8">
                  <div classname="flex-1">
                    <div classname="flex items-center gap-3 mb-4">
                      <h2 classname="text-4xl font-bold tracking-tight">{data.name}</h2>
                      <span classname="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">Verified Data</span>
                    </div>
                    <div classname="max-w-4xl text-gray-600 leading-relaxed text-lg mb-8">
                      <markdown>{data.summary}</Markdown>
                    </div>

                    <div classname="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {data.keyMetrics.map((metric, i) => (
                        <div key="{i}" classname="bg-[#f9f9f9] p-4 rounded-2xl border border-black/5 flex flex-col justify-center min-h-[100px]">
                          <p classname="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">{metric.label}</p>
                          <div classname="flex items-baseline gap-2 overflow-hidden">
                            <span classname="text-lg font-bold text-gray-900 break-words line-clamp-2 leading-tight">{metric.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div classname="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Growth Predictions */}
                  <section classname="bg-white rounded-2xl p-6 border border-black/5 shadow-sm flex flex-col">
                    <div classname="flex items-center gap-2 mb-6">
                      <div classname="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <trendingup size="{20}"/>
                      </div>
                      <h3 classname="font-bold text-lg">Growth Predictions</h3>
                    </div>
                    <div classname="space-y-6 flex-1">
                      {data.growthPredictions.map((pred, i) => (
                        <div key="{i}" classname="relative pl-4 border-l-2 border-blue-100">
                          <p classname="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{pred.period}</p>
                          <p classname="text-sm text-gray-700 mb-2">{pred.prediction}</p>
                          <div classname="flex items-center gap-2">
                            <div classname="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div initial="{{" width:="" 0="" }}="" animate="{{" width:="" `${pred.confidence="" *="" 100}%`="" }}="" classname="h-full bg-blue-500"/>
                            </div>
                            <span classname="text-[10px] font-mono text-gray-400">{(pred.confidence * 100).toFixed(0)}% CONF</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Hiring Trends */}
                  <section classname="bg-white rounded-2xl p-6 border border-black/5 shadow-sm flex flex-col">
                    <div classname="flex items-center justify-between mb-6">
                      <div classname="flex items-center gap-2">
                        <div classname="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                          <briefcase size="{20}"/>
                        </div>
                        <h3 classname="font-bold text-lg">Hiring Trends</h3>
                      </div>
                    </div>
                    <div classname="mb-6 flex-1">
                      <p classname="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-1">Current Status</p>
                      <p classname="text-lg font-bold mb-2">{data.hiringTrends.trend}</p>
                      <p classname="text-sm text-gray-600 leading-relaxed mb-4">{data.hiringTrends.details}</p>
                      
                      <div classname="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3 mb-4">
                        <alertcircle classname="text-amber-600 shrink-0 mt-0.5" size="{16}"/>
                        <p classname="text-[11px] text-amber-800 leading-tight">
                          <strong>Note:</strong> Hiring volume data does not account for turnover or attrition rates. Hypergrowth signals may include backfilling for high turnover.
                        </p>
                      </div>
                    </div>
                    <div>
                      <p classname="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Key Roles in Demand</p>
                      <div classname="flex flex-wrap gap-2">
                        {data.hiringTrends.roles.map((role, i) => (
                          <span key="{i}" classname="px-3 py-1.5 bg-[#f5f5f5] text-xs font-medium rounded-lg border border-black/5">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Employee Reviews */}
                  <section classname="bg-white rounded-2xl p-6 border border-black/5 shadow-sm flex flex-col">
                    <div classname="flex items-center gap-2 mb-6">
                      <div classname="p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <users size="{20}"/>
                      </div>
                      <h3 classname="font-bold text-lg">Employee Sentiment</h3>
                    </div>
                    <div classname="space-y-6 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                      {data.employeeReviews.some(r => r.found) ? (
                        data.employeeReviews.filter(r => r.found).map((review, i) => (
                          <div key="{i}" classname="space-y-3 pb-4 border-b border-black/5 last:border-0">
                            <div classname="flex items-center justify-between">
                              <span classname="text-xs font-bold text-purple-600 uppercase tracking-wider">{review.platform}</span>
                              {review.rating !== null && (
                                <div classname="flex items-center gap-2">
                                  {review.rating < 3.0 && (
                                    <div classname="flex items-center gap-1 bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border border-rose-100">
                                      <alerttriangle size="{10}"/>
                                      Low Sentiment
                                    </div>
                                  )}
                                  <div classname="flex items-center gap-1">
                                    <star size="{14}" classname="text-amber-400 fill-amber-400"/>
                                    <span classname="text-sm font-bold">{review.rating.toFixed(1)}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <p classname="text-sm font-medium italic text-gray-700">"{review.summary}"</p>
                            
                            {review.recentReviews && review.recentReviews.length > 0 && (
                              <div classname="space-y-2 py-2">
                                <p classname="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Reviews</p>
                                {review.recentReviews.map((r, idx) => (
                                  <div key="{idx}" classname="bg-gray-50 p-2 rounded-lg border border-black/5">
                                    <p classname="text-[11px] text-gray-600 italic">"{r.text}"</p>
                                    <p classname="text-[9px] text-gray-400 mt-1">— {r.date}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div classname="grid grid-cols-2 gap-3">
                              <div classname="space-y-1">
                                <div classname="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-tight">
                                  <thumbsup size="{10}"/> Pros
                                </div>
                                <ul classname="text-[11px] text-gray-500 list-disc list-inside">
                                  {review.pros.slice(0, 2).map((p, j) => <li key="{j}" classname="truncate">{p}</li>)}
                                </ul>
                              </div>
                              <div classname="space-y-1">
                                <div classname="flex items-center gap-1 text-[10px] font-bold text-rose-600 uppercase tracking-tight">
                                  <thumbsdown size="{10}"/> Cons
                                </div>
                                <ul classname="text-[11px] text-gray-500 list-disc list-inside">
                                  {review.cons.slice(0, 2).map((c, j) => <li key="{j}" classname="truncate">{c}</li>)}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div classname="text-center py-12 text-gray-400">
                          <users size="{32}" classname="mx-auto mb-2 opacity-20"/>
                          <p classname="text-sm italic">No verifiable employee reviews found on major platforms.</p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Competitors Section */}
                  <section classname="bg-white rounded-2xl p-6 border border-black/5 shadow-sm flex flex-col">
                    <div classname="flex items-center gap-2 mb-6">
                      <div classname="p-2 bg-rose-50 text-rose-600 rounded-lg">
                        <swords size="{20}"/>
                      </div>
                      <h3 classname="font-bold text-lg">Market Competitors</h3>
                    </div>
                    <div classname="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                      {data.competitors.length > 0 ? (
                        data.competitors.map((competitor, i) => (
                          <div key="{i}" classname="p-4 rounded-xl border border-black/5 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group">
                            <div classname="flex items-center justify-between mb-2">
                              <h4 classname="font-bold text-gray-900 group-hover:text-rose-600 transition-colors">{competitor.name}</h4>
                            </div>
                            <p classname="text-xs text-gray-600 mb-3 leading-relaxed">{competitor.description}</p>
                            <div classname="pt-2 border-t border-black/5">
                              <p classname="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">Competitive Advantage</p>
                              <p classname="text-[11px] text-gray-700 font-medium italic">"{competitor.advantage}"</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div classname="text-center py-12 text-gray-400">
                          <swords size="{32}" classname="mx-auto mb-2 opacity-20"/>
                          <p classname="text-sm italic">No direct competitors identified</p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Press Coverage Section */}
                  <section classname="bg-white rounded-2xl p-6 border border-black/5 shadow-sm flex flex-col">
                    <div classname="flex items-center gap-2 mb-6">
                      <div classname="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <newspaper size="{20}"/>
                      </div>
                      <h3 classname="font-bold text-lg">Press Coverage</h3>
                    </div>
                    <div classname="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                      {data.pressCoverage.length > 0 ? (
                        data.pressCoverage.map((press, i) => (
                          <a key="{i}" href="{press.url}" target="_blank" rel="noopener noreferrer" classname="block p-4 rounded-xl border border-black/5 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group">
                            <div classname="flex items-center justify-between mb-2">
                              <span classname="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{press.source}</span>
                              <span classname="text-[10px] text-gray-400 font-mono">{press.date}</span>
                            </div>
                            <h4 classname="font-bold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">{press.title}</h4>
                            <p classname="text-xs text-gray-600 leading-relaxed line-clamp-2">{press.summary}</p>
                            <div classname="mt-3 flex items-center gap-1 text-[10px] font-bold text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                              Read Article <arrowupright size="{10}"/>
                            </div>
                          </a>
                        ))
                      ) : (
                        <div classname="text-center py-12 text-gray-400">
                          <newspaper size="{32}" classname="mx-auto mb-2 opacity-20"/>
                          <p classname="text-sm italic">No recent press coverage found</p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Patents & IP */}
                  <section classname="bg-white rounded-2xl p-6 border border-black/5 shadow-sm lg:col-span-3">
                    <div classname="flex items-center gap-2 mb-6">
                      <div classname="p-2 bg-amber-50 text-amber-600 rounded-lg">
                        <filetext size="{20}"/>
                      </div>
                      <h3 classname="font-bold text-lg">Intellectual Property & Patents</h3>
                    </div>
                    <div classname="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      {data.patents.length > 0 ? (
                        data.patents.map((patent, i) => (
                          <div key="{i}" classname="p-4 bg-[#fcfcfc] rounded-xl border border-black/5 hover:border-amber-200 transition-colors group flex flex-col h-full">
                            <div classname="flex justify-between items-start mb-2">
                              <p classname="text-[10px] font-mono text-amber-600 font-bold">{patent.number}</p>
                              <p classname="text-[10px] text-gray-400">{patent.date}</p>
                            </div>
                            <h4 classname="text-sm font-bold mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">{patent.title}</h4>
                            <p classname="text-xs text-gray-500 line-clamp-3 mb-2 flex-1">{patent.summary}</p>
                          </div>
                        ))
                      ) : (
                        <div classname="col-span-full text-center py-12 text-gray-400">
                          <filetext size="{32}" classname="mx-auto mb-2 opacity-20"/>
                          <p classname="text-sm italic">No recent patents found in public records</p>
                        </div>
                      )}
                    </div>

                    {/* Sources Section */}
                    <div classname="pt-6 border-t border-black/5">
                      <h4 classname="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <externallink size="{14}"/> Research Sources
                      </h4>
                      <div classname="flex flex-wrap gap-3">
                        {data.sources.map((source, i) => (
                          <a key="{i}" href="{source.url}" target="_blank" rel="noopener noreferrer" classname="text-[10px] font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 transition-colors">
                            {source.title} <arrowupright size="{10}"/>
                          </a>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Footer Info */}
              <div classname="flex justify-between items-center text-[10px] text-gray-400 font-mono uppercase tracking-widest px-4">
                <p>Data generated via Gemini 3 Flash Intelligence</p>
                <p>Last Updated: {new Date().toLocaleDateString()}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
