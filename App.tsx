
import React, { useState, useCallback } from 'react';
import { 
  BookOpen, 
  Video, 
  Image as ImageIcon, 
  ListChecks, 
  Monitor, 
  Loader2, 
  Search, 
  Languages, 
  ChevronRight,
  ClipboardCheck,
  Clipboard,
  Sparkles,
  Stethoscope
} from 'lucide-react';
import { generateMLTContent } from './geminiService';
import { MLTContent, LanguageStyle } from './types';
import ContentDisplay from './components/ContentDisplay';

function App() {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<LanguageStyle>(LanguageStyle.HINGLISH);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<MLTContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await generateMLTContent(topic, language);
      setContent(result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Stethoscope className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">MLT Strategist AI</h1>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">AIIMS CRE Exam Prep</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="flex-1 max-w-2xl w-full flex gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic (e.g. Hemolysis, ELISA, Malarial Parasite...)"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            
            <button
              type="button"
              onClick={() => setLanguage(l => l === LanguageStyle.ENGLISH ? LanguageStyle.HINGLISH : LanguageStyle.ENGLISH)}
              className="px-4 py-2 border border-slate-200 rounded-xl flex items-center gap-2 bg-white hover:bg-slate-50 transition-colors text-sm font-medium whitespace-nowrap"
            >
              <Languages className="w-4 h-4 text-blue-500" />
              {language}
            </button>

            <button
              disabled={isLoading || !topic.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-slate-800">Analyzing Medical Literature...</h2>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              We're synthesizing high-yield facts, exam patterns, and conversational scripts for "{topic}".
            </p>
          </div>
        )}

        {!isLoading && !content && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-10">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-2xl mb-6">
                <BookOpen className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">High-Yield Study Material</h3>
              <p className="text-slate-600">Enter any clinical topic and get AI-curated exam points optimized for Indian medical lab exams.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="bg-purple-100 p-4 rounded-2xl mb-6">
                <Video className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ready-to-Shoot Scripts</h3>
              <p className="text-slate-600">Automatically generated video scripts in Hinglish with hooks and timestamps for your YouTube channel.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">Generation failed</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        )}

        {content && <ContentDisplay content={content} topic={topic} />}
      </main>

      {/* Persistent CTA */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 backdrop-blur-md bg-opacity-90 border border-slate-700">
           <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <img key={i} src={`https://picsum.photos/32/32?random=${i}`} className="w-8 h-8 rounded-full border-2 border-slate-900" alt="Student" />
            ))}
          </div>
          <p className="text-sm font-medium">Join 5000+ Students using the 1000+ MCQ E-Book!</p>
          <button className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">
            GET IT NOW
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
