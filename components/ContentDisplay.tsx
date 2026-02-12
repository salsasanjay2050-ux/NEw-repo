
import React, { useState } from 'react';
import { 
  Video, 
  Image as ImageIcon, 
  ListChecks, 
  Monitor, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MLTContent } from '../types';

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  color: string;
  onCopy: () => void;
  isCopied: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, color, onCopy, isCopied }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl bg-${color}-100`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
    </div>
    <button
      onClick={onCopy}
      className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium text-slate-500"
    >
      {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      {isCopied ? 'Copied' : 'Copy Section'}
    </button>
  </div>
);

interface ContentDisplayProps {
  content: MLTContent;
  topic: string;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ content, topic }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const videoScriptText = `
HOOK: ${content.videoScript.hook}

EXPLANATION:
${content.videoScript.mainExplanation.map(part => `[${part.timestamp}] ${part.content}`).join('\n\n')}

CTA: ${content.videoScript.cta}
  `.trim();

  const mcqText = content.practiceMCQs.map((mcq, i) => `
Q${i+1}: ${mcq.question}
A) ${mcq.options.A}
B) ${mcq.options.B}
C) ${mcq.options.C}
D) ${mcq.options.D}
Correct Answer: ${mcq.correctAnswer}
Explanation: ${mcq.explanation}
  `).join('\n\n');

  return (
    <div className="space-y-12 pb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* 1. Video Script Section */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
        <SectionHeader 
          icon={Video} 
          title="📝 Video Script" 
          color="blue" 
          onCopy={() => handleCopy(videoScriptText, 'script')}
          isCopied={copiedSection === 'script'}
        />
        
        <div className="space-y-6 text-slate-700 leading-relaxed">
          <div className="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">The Hook</span>
            <p className="text-lg font-medium italic">"{content.videoScript.hook}"</p>
          </div>

          <div className="space-y-6">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Main Segment</span>
             {content.videoScript.mainExplanation.map((part, idx) => (
               <div key={idx} className="flex gap-4">
                 <div className="font-mono text-sm bg-slate-100 text-slate-500 px-2 py-1 rounded h-fit">
                   {part.timestamp}
                 </div>
                 <p>{part.content}</p>
               </div>
             ))}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Call to Action</span>
            <p className="text-sm font-medium">{content.videoScript.cta}</p>
          </div>
        </div>
      </section>

      {/* 2. Image Prompts Section */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
        <SectionHeader 
          icon={ImageIcon} 
          title="🖼️ Image Prompts" 
          color="purple" 
          onCopy={() => handleCopy(content.imagePrompts.join('\n\n'), 'images')}
          isCopied={copiedSection === 'images'}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.imagePrompts.map((prompt, idx) => (
            <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative group/card hover:border-purple-200 transition-all">
              <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded-full mb-3">SCENE {idx + 1}</span>
              <p className="text-sm text-slate-600 italic">"{prompt}"</p>
              <button 
                onClick={() => handleCopy(prompt, `prompt-${idx}`)}
                className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 transition-opacity p-1.5 hover:bg-white rounded-lg border border-slate-200"
              >
                {copiedSection === `prompt-${idx}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MCQs Section */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
        <SectionHeader 
          icon={ListChecks} 
          title="📋 Practice MCQs" 
          color="green" 
          onCopy={() => handleCopy(mcqText, 'mcqs')}
          isCopied={copiedSection === 'mcqs'}
        />
        <div className="space-y-8">
          {content.practiceMCQs.map((mcq, idx) => (
            <div key={idx} className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
              <h4 className="font-bold text-lg mb-4 flex gap-3">
                <span className="text-green-600">Q{idx + 1}.</span>
                {mcq.question}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {Object.entries(mcq.options).map(([key, value]) => (
                  <div 
                    key={key} 
                    className={`p-3 rounded-xl border text-sm flex items-center gap-3 transition-colors ${
                      key === mcq.correctAnswer ? 'bg-green-50 border-green-200 font-medium' : 'bg-white border-slate-200'
                    }`}
                  >
                    <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold ${
                      key === mcq.correctAnswer ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {key}
                    </span>
                    {value}
                  </div>
                ))}
              </div>
              <div className="bg-white border border-green-100 p-4 rounded-xl">
                <span className="text-[10px] font-bold text-green-600 uppercase mb-1 block">Answer Key & Explanation</span>
                <p className="text-sm text-slate-700 leading-relaxed">
                  <span className="font-bold mr-2 text-green-700">Correct: ({mcq.correctAnswer})</span>
                  {mcq.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. On-Screen Text Section */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
        <SectionHeader 
          icon={Monitor} 
          title="✨ On-Screen Overlays" 
          color="orange" 
          onCopy={() => handleCopy(content.onScreenText.join('\n'), 'overlays')}
          isCopied={copiedSection === 'overlays'}
        />
        <div className="flex flex-wrap gap-3">
          {content.onScreenText.map((text, idx) => (
            <div key={idx} className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-slate-200 flex items-center gap-2 hover:scale-105 transition-transform cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* Footer Branding for content */}
      <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-400">Generated for topic: <span className="text-slate-600 font-semibold">"{topic}"</span></p>
        <button className="flex items-center gap-2 text-blue-600 text-sm font-bold hover:underline">
          <ExternalLink className="w-4 h-4" />
          View Related AIIMS CRE PYQs
        </button>
      </div>
    </div>
  );
};

export default ContentDisplay;
