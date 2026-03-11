import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  Briefcase, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  Sparkles,
  ChevronRight,
  MapPin,
  GraduationCap,
  Zap,
  Copy,
  Download,
  Mail,
  FileCheck,
  Building2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { CareerService, AnalysisResult, JobMatch } from './services/careerService';

const API_KEY = process.env.GEMINI_API_KEY || '';

export default function App() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Entry Level');
  const [techStack, setTechStack] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'resume' | 'coverLetter'>('analysis');

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please provide your resume text first.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setSelectedJob(null);

    try {
      const service = new CareerService(API_KEY);
      const analysis = await service.analyzeJobAndResume(
        resumeText,
        jobDescription,
        targetRole,
        location,
        experienceLevel,
        techStack
      );
      setResult(analysis);
      if (analysis.topJobMatches.length > 0) {
        setSelectedJob(analysis.topJobMatches[0]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to analyze. Please check your API key or try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Perfect Job': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Good Match': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'Moderate Match': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-zinc-600 bg-zinc-50 border-zinc-100';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">SuperApply AI</h1>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-zinc-500">
            <span className="text-indigo-600">Job Finder</span>
            <span>Auto-Apply Agent</span>
            <span>Resume Optimizer</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold">1. Upload Resume</h2>
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                className="w-full h-48 p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-sm"
              />
            </section>

            <section className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold">2. Career Goals</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Target Role</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Tech Stack / Skills</label>
                  <input
                    type="text"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    placeholder="e.g. React, Node.js, AWS"
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Remote"
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Experience</label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>Entry Level</option>
                      <option>Mid Level</option>
                      <option>Senior</option>
                      <option>Executive</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold">3. Specific Job (Optional)</h2>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste a specific JD to match against..."
                className="w-full h-32 p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-sm"
              />
            </section>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Preparing Application...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Find & Auto-Prepare
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!result && !isAnalyzing ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-zinc-300"
                >
                  <div className="bg-indigo-50 p-8 rounded-full mb-6">
                    <Zap className="w-16 h-16 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">Super Job Finder & Auto-Apply</h3>
                  <p className="text-zinc-500 max-w-md">
                    Upload your resume to find the best job matches, get an ATS-optimized resume, and a personalized cover letter ready for submission.
                  </p>
                </motion.div>
              ) : isAnalyzing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center p-12 space-y-8"
                >
                  <div className="relative">
                    <div className="w-32 h-32 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-indigo-600" />
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-bold text-zinc-900">Agent is Working...</h3>
                    <div className="flex flex-col gap-2 text-zinc-500 text-sm">
                      <p className="animate-pulse">Searching for best job matches...</p>
                      <p className="animate-pulse delay-75">Extracting ATS keywords...</p>
                      <p className="animate-pulse delay-150">Generating optimized application package...</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 pb-12"
                >
                  {/* Job Selector */}
                  <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                    {result?.topJobMatches.map((job, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedJob(job)}
                        className={`shrink-0 p-4 rounded-2xl border transition-all text-left min-w-[240px] ${
                          selectedJob === job 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                            : 'bg-white border-zinc-200 text-zinc-900 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                            selectedJob === job ? 'bg-white/20 border-white/30' : getRankColor(job.matchRank)
                          }`}>
                            {job.matchRank}
                          </span>
                          <span className="text-sm font-bold">{job.matchScore}%</span>
                        </div>
                        <h4 className="font-bold truncate">{job.jobTitle}</h4>
                        <p className={`text-xs truncate ${selectedJob === job ? 'text-indigo-100' : 'text-zinc-500'}`}>
                          {job.companyName}
                        </p>
                      </button>
                    ))}
                  </div>

                  {selectedJob && (
                    <div className="space-y-6">
                      {/* Tabs */}
                      <div className="flex bg-white p-1 rounded-xl border border-zinc-200 shadow-sm">
                        <button
                          onClick={() => setActiveTab('analysis')}
                          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                            activeTab === 'analysis' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-50'
                          }`}
                        >
                          <Target className="w-4 h-4" />
                          Match Analysis
                        </button>
                        <button
                          onClick={() => setActiveTab('resume')}
                          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                            activeTab === 'resume' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-50'
                          }`}
                        >
                          <FileCheck className="w-4 h-4" />
                          Optimized Resume
                        </button>
                        <button
                          onClick={() => setActiveTab('coverLetter')}
                          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                            activeTab === 'coverLetter' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-50'
                          }`}
                        >
                          <Mail className="w-4 h-4" />
                          Cover Letter
                        </button>
                      </div>

                      {/* Tab Content */}
                      <div className="space-y-6">
                        {activeTab === 'analysis' && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            {/* Job Info */}
                            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                              <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3">
                                    <Building2 className="w-6 h-6 text-indigo-600" />
                                    <h3 className="text-2xl font-bold text-zinc-900">{selectedJob.jobTitle}</h3>
                                  </div>
                                  <p className="text-lg text-zinc-600 font-medium">{selectedJob.companyName}</p>
                                  <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {selectedJob.location}</span>
                                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {selectedJob.jobType}</span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-indigo-50 px-8 py-4 rounded-2xl border border-indigo-100">
                                  <span className="text-4xl font-black text-indigo-600">{selectedJob.matchScore}%</span>
                                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mt-1">Match Score</span>
                                </div>
                              </div>
                              <div className="prose prose-zinc max-w-none text-zinc-600 text-sm">
                                <p>{selectedJob.summary}</p>
                              </div>
                            </div>

                            {/* Skills Analysis */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                                <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                  Required Skills
                                </h4>
                                <div className="space-y-4">
                                  <div>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Primary</span>
                                    <div className="flex flex-wrap gap-2 mt-1.5">
                                      {selectedJob.requiredSkills.primary.map((s, i) => <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-md font-medium">{s}</span>)}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Technical</span>
                                    <div className="flex flex-wrap gap-2 mt-1.5">
                                      {selectedJob.requiredSkills.technical.map((s, i) => <span key={i} className="px-2 py-1 bg-zinc-100 text-zinc-700 text-xs rounded-md font-medium">{s}</span>)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                                <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                  <AlertCircle className="w-5 h-5 text-amber-500" />
                                  Missing Keywords
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedJob.missingKeywords.map((s, i) => (
                                    <span key={i} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-md font-medium border border-amber-100">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                                <div className="mt-6 p-4 bg-zinc-50 rounded-xl">
                                  <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Resume Gap Analysis</h5>
                                  <p className="text-xs text-zinc-600 leading-relaxed">{selectedJob.resumeAnalysis}</p>
                                </div>
                              </div>
                            </div>

                            {/* Apply Links */}
                            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                              <h4 className="font-bold text-zinc-900 mb-4">Optimized Apply Links</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {selectedJob.searchLinks.map((link, i) => (
                                  <a
                                    key={i}
                                    href={link.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 bg-zinc-50 hover:bg-indigo-50 border border-zinc-200 hover:border-indigo-200 rounded-xl transition-all group"
                                  >
                                    <span className="text-sm font-bold text-zinc-700 group-hover:text-indigo-700">{link.platform}</span>
                                    <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-indigo-600" />
                                  </a>
                                ))}
                              </div>
                              <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                                <h5 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Apply Instructions</h5>
                                <p className="text-xs text-indigo-700 leading-relaxed">{selectedJob.applyInstructions}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {activeTab === 'resume' && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                              <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
                                <h4 className="font-bold text-zinc-900 flex items-center gap-2">
                                  <FileCheck className="w-5 h-5 text-indigo-600" />
                                  ATS-Optimized Resume
                                </h4>
                                <div className="flex gap-2">
                                  <button onClick={() => copyToClipboard(selectedJob.optimizedResume)} className="p-2 hover:bg-white rounded-lg transition-all text-zinc-500 hover:text-indigo-600">
                                    <Copy className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 hover:bg-white rounded-lg transition-all text-zinc-500 hover:text-indigo-600">
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="p-8 bg-white font-mono text-xs leading-relaxed text-zinc-700 whitespace-pre-wrap max-h-[600px] overflow-y-auto">
                                {selectedJob.optimizedResume}
                              </div>
                            </div>
                            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                              <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                What was improved?
                              </h4>
                              <ul className="space-y-2">
                                {selectedJob.recommendedUpdates.map((update, i) => (
                                  <li key={i} className="flex gap-2 text-sm text-emerald-700">
                                    <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" />
                                    {update}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}

                        {activeTab === 'coverLetter' && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                              <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
                                <h4 className="font-bold text-zinc-900 flex items-center gap-2">
                                  <Mail className="w-5 h-5 text-indigo-600" />
                                  Personalized Cover Letter
                                </h4>
                                <div className="flex gap-2">
                                  <button onClick={() => copyToClipboard(selectedJob.coverLetter)} className="p-2 hover:bg-white rounded-lg transition-all text-zinc-500 hover:text-indigo-600">
                                    <Copy className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 hover:bg-white rounded-lg transition-all text-zinc-500 hover:text-indigo-600">
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="p-8 bg-white font-serif text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">
                                {selectedJob.coverLetter}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {result && (
                    <div className="bg-indigo-900 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200">
                      <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <GraduationCap className="w-6 h-6" />
                        Skill & Certification Recommendations
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.skillCertificationRecommendations.map((rec, i) => (
                          <li key={i} className="flex gap-3 text-sm text-indigo-100 bg-white/10 p-4 rounded-xl border border-white/10">
                            <CheckCircle2 className="w-5 h-5 text-indigo-300 shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
