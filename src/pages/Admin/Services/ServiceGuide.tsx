import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft } from 'lucide-react';
import { getGuideData } from './guides';

export const serviceNames: Record<string, string> = {
  gtmId: "Google Tag Manager",
  googleAnalyticsId: "Google Analytics 4",
  facebook: "Facebook Pixel & CAPI",
  facebookChat: "Facebook Messenger",
  whatsappNumber: "WhatsApp Chat",
  tiktokPixelId: "TikTok Pixel",
  clarityId: "Microsoft Clarity",
  searchConsoleVerificationCode: "Search Console",
  lookerStudioEmbedUrl: "Looker Studio",
  steadfast: "Steadfast Courier",
};

const ServiceGuide: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  const serviceName = serviceId ? serviceNames[serviceId] || serviceId : "Service";
  const guideData = serviceId ? getGuideData(serviceId, serviceName) : null;

  if (!guideData) {
    return <div className="p-10 text-center text-slate-500">Guide not found.</div>;
  }

  return (
    <div className="w-full space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => navigate('/admin/services')}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white">
            {serviceName} Guide
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Step-by-step configuration instructions
          </p>
        </div>
      </div>

      {/* Guide Content Wrapper */}
      <div className="space-y-12">
        {/* Intro */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{guideData.title}</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{guideData.description}</ReactMarkdown>
          </div>
        </div>

        {/* Steps */}
        {guideData.steps.length > 0 && (
          <div className="space-y-8">
            {guideData.steps.map((step, index) => (
  <div
    key={index}
    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
  >
    {/* Text Content */}
    <div className={step.image ? 'lg:sticky lg:top-5 lg:self-center h-fit' : 'lg:col-span-2'}>
      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500">
        {step.title && <h3 className="text-lg font-bold mt-0 mb-4 text-slate-900 dark:text-white">{step.title}</h3>}
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{step.content}</ReactMarkdown>
      </div>
    </div>

    {/* Image Content (if any) */}
    {step.image && (
      <div className="w-full mt-4 lg:mt-0 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <img 
          src={step.image} 
          alt={step.title || "Guide Step Image"} 
          className="w-full h-auto rounded-lg"
        />
      </div>
    )}
  </div>
))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceGuide;
