import React, { useState } from 'react';
import { Shield, TrendingUp, Share2, Download, Eye, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

export default function VerificationResult({ result }) {
  const [reportUrl, setReportUrl] = useState(null);
  const [reportName, setReportName] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  if (!result) {
    return (
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-12 border border-white/20 flex flex-col items-center justify-center h-full relative overflow-hidden">
        <Shield className="w-20 h-20 text-purple-300 mb-4 animate-pulse relative" />
        <h3 className="text-lg font-bold text-white mb-2 relative">No Media Uploaded</h3>
        <p className="text-sm text-purple-200 text-center max-w-sm relative">
          Upload an image or video to verify its authenticity using our multi-layer Swiss Cheese Model
        </p>
      </div>
    );
  }

  const getColor = (s) => {
    if (s >= 90) return 'text-green-600';
    if (s >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLabel = (s) => {
    if (s >= 90) return 'Highly Trusted';
    if (s >= 70) return 'Moderately Trusted';
    return 'Low Trust';
  };

  const strokeColor = result.trustScore >= 90 ? '#0ada94' : result.trustScore >= 70 ? '#f59e0b' : '#ef4444';

  const layerIcons = {
    pass: <CheckCircle className="w-5 h-5 text-green-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    fail: <XCircle className="w-5 h-5 text-red-400" />,
    unknown: <Info className="w-5 h-5 text-gray-400" />
  };

  const loadScript = (src) => new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = (e) => reject(e);
    document.body.appendChild(s);
  });

  const generatePdfFromNode = async (isShare = false) => {
    if (!result) return;
    setIsGenerating(true);
    try {
      // load libs
      if (!window.html2canvas) {
        await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
      }
      if (!window.jspdf) {
        await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
      }

      const html2canvas = window.html2canvas;
      const jsPDF = window.jspdf?.jsPDF || window.jspdf || window.jsPDF;

      // build a small offscreen report node with two-column layout
      const container = document.createElement('div');
      container.style.width = '900px';
      container.style.padding = '24px';
      container.style.background = '#ffffff';
      container.style.color = '#000000';
      container.style.fontFamily = 'Arial, Helvetica, sans-serif';
      container.style.display = 'flex';
      container.style.gap = '20px';

      // Left column - Details
      const leftCol = document.createElement('div');
      leftCol.style.flex = '1';
      leftCol.style.paddingRight = '10px';

      leftCol.innerHTML = `
        <h1 style="font-size:24px;margin:0 0 12px 0;font-weight:bold;color:#1f2937">Verification Report</h1>
        <hr style="margin:12px 0;border:none;border-top:2px solid #e5e7eb">
        
        <div style="margin:16px 0">
          <h3 style="font-size:14px;margin:0 0 6px 0;color:#6b7280;font-weight:bold;text-transform:uppercase">Trust Score</h3>
          <p style="font-size:28px;margin:0;font-weight:bold;color:${result.trustScore >= 90 ? '#10b981' : result.trustScore >= 70 ? '#f59e0b' : '#ef4444'}">${result.trustScore}%</p>
          <p style="font-size:12px;margin:4px 0 0 0;color:#9ca3af">${result.trustScore >= 90 ? 'Highly Trusted' : result.trustScore >= 70 ? 'Moderately Trusted' : 'Low Trust'}</p>
        </div>

        <hr style="margin:12px 0;border:none;border-top:1px solid #e5e7eb">

        <div style="margin:16px 0">
          <div style="margin:12px 0">
            <p style="font-size:12px;margin:0 0 4px 0;color:#6b7280;font-weight:bold">Source Device</p>
            <p style="font-size:14px;margin:0;color:#1f2937;font-weight:500">${result.source}</p>
          </div>
          <div style="margin:12px 0">
            <p style="font-size:12px;margin:0 0 4px 0;color:#6b7280;font-weight:bold">Creator</p>
            <p style="font-size:14px;margin:0;color:#1f2937;font-weight:500">${result.creator}</p>
          </div>
          <div style="margin:12px 0">
            <p style="font-size:12px;margin:0 0 4px 0;color:#6b7280;font-weight:bold">Date & Time</p>
            <p style="font-size:14px;margin:0;color:#1f2937;font-weight:500">${new Date(result.timestamp).toLocaleString()}</p>
          </div>
          <div style="margin:12px 0">
            <p style="font-size:12px;margin:0 0 4px 0;color:#6b7280;font-weight:bold">Modifications</p>
            <p style="font-size:14px;margin:0;color:#1f2937;font-weight:500">${result.modifications}</p>
          </div>
        </div>

        <hr style="margin:12px 0;border:none;border-top:1px solid #e5e7eb">

        <div style="margin:16px 0">
          <h3 style="font-size:14px;margin:0 0 12px 0;color:#6b7280;font-weight:bold;text-transform:uppercase">Layer Analysis</h3>
      `;

      result.layers.forEach(l => {
        const statusColor = l.status === 'pass' ? '#10b981' : l.status === 'warning' ? '#f59e0b' : l.status === 'fail' ? '#ef4444' : '#9ca3af';
        leftCol.innerHTML += `
          <div style="margin:8px 0;padding:8px;background:#f3f4f6;border-left:3px solid ${statusColor};border-radius:4px">
            <p style="font-size:13px;margin:0;color:#1f2937;font-weight:500">${l.name}</p>
            <p style="font-size:11px;margin:2px 0 0 0;color:#6b7280">${l.status.toUpperCase()} ${l.confidence > 0 ? `(${l.confidence}%)` : '(N/A)'}</p>
          </div>
        `;
      });

      leftCol.innerHTML += '</div>';
      container.appendChild(leftCol);

      // Right column - Image
      const rightCol = document.createElement('div');
      rightCol.style.flex = '0 0 280px';
      rightCol.style.display = 'flex';
      rightCol.style.flexDirection = 'column';
      rightCol.style.alignItems = 'center';
      rightCol.style.justifyContent = 'flex-start';

      if (result.preview) {
        const imgWrapper = document.createElement('div');
        imgWrapper.style.width = '100%';
        imgWrapper.style.border = '2px solid #e5e7eb';
        imgWrapper.style.borderRadius = '8px';
        imgWrapper.style.overflow = 'hidden';
        imgWrapper.style.background = '#f9fafb';

        const img = document.createElement('img');
        img.src = result.preview;
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';

        imgWrapper.appendChild(img);
        rightCol.appendChild(imgWrapper);

        const label = document.createElement('p');
        label.style.fontSize = '12px';
        label.style.margin = '8px 0 0 0';
        label.style.color = '#6b7280';
        label.style.fontWeight = 'bold';
        label.textContent = 'Uploaded Media';
        rightCol.appendChild(label);
      }

      container.appendChild(rightCol);

      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);

      const canvas = await html2canvas(container, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth - 40;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);

      const fileName = 'verification-report.pdf';

      // if share requested and platform supports file sharing
      if (isShare && navigator.canShare && window.Blob) {
        const pdfBlob = pdf.output('blob');
        const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
        try {
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: 'Verification Report', text: 'Verification PDF report' });
            document.body.removeChild(container);
            setIsGenerating(false);
            return;
          }
        } catch (e) {
          console.warn('Share failed, falling back to download', e);
        }
      }

      // fallback: trigger download
      const pdfUrl = pdf.output('bloburl');
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // cleanup
      try { document.body.removeChild(container); } catch (e) { }
      setIsGenerating(false);
    } catch (err) {
      console.error('PDF generation error', err);
      alert('Failed to generate PDF report');
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Trust Score */}
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
        <h2 className="text-xl font-bold text-white mb-6 relative flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-400" />
          Verification Results
        </h2>

        {/* Trust Score Meter */}
        <div className="flex justify-center mb-6">
          <div className="flex flex-col items-center space-y-3">
            <div className="relative w-36 h-36">
              <svg className="transform -rotate-90 w-36 h-36">
                <circle cx="72" cy="72" r="64" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                <circle
                  cx="72"
                  cy="72"
                  r="64"
                  stroke={strokeColor}
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${(result.trustScore / 100) * 402} 402`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getColor(result.trustScore)}`}>{result.trustScore}</span>
                <span className="text-xs text-gray-500 font-medium">Trust Score</span>
              </div>
            </div>
            <span className={`text-sm font-semibold ${getColor(result.trustScore)} px-3 py-1 rounded-full bg-white shadow-md`}>
              {getLabel(result.trustScore)}
            </span>
          </div>
        </div>

        {/* Provenance Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="backdrop-blur-md bg-gradient-to-br from-blue-500/20 to-transparent rounded-xl p-4 border border-blue-400/50 hover:border-blue-400 transition-all">
            <p className="text-xs text-blue-200 mb-2 font-semibold uppercase tracking-wider">Source Device</p>
            <p className="text-base font-bold text-white break-words">{result.source || "Unknown Device"}</p>
          </div>
          <div className="backdrop-blur-md bg-gradient-to-br from-purple-500/20 to-transparent rounded-xl p-4 border border-purple-400/50 hover:border-purple-400 transition-all">
            <p className="text-xs text-purple-200 mb-2 font-semibold uppercase tracking-wider">Creator</p>
            <p className="text-base font-bold text-white break-words">{result.creator || "Unknown"}</p>
          </div>
          <div className="backdrop-blur-md bg-gradient-to-br from-green-500/20 to-transparent rounded-xl p-4 border border-green-400/50 hover:border-green-400 transition-all">
            <p className="text-xs text-green-200 mb-2 font-semibold uppercase tracking-wider">Verification Date</p>
            <p className="text-base font-bold text-white">
              {result.timestamp ? new Date(result.timestamp).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div className="backdrop-blur-md bg-gradient-to-br from-orange-500/20 to-transparent rounded-xl p-4 border border-orange-400/50 hover:border-orange-400 transition-all">
            <p className="text-xs text-orange-200 mb-2 font-semibold uppercase tracking-wider">Modifications</p>
            <p className="text-base font-bold text-white">{result.modifications || 0} detected</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => generatePdfFromNode(true)}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 backdrop-blur-md bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105 font-semibold disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" />
            <span>{isGenerating ? 'Working...' : 'Share'}</span>
          </button>

          <div className="flex-1">
            <button
              onClick={() => generatePdfFromNode(false)}
              disabled={isGenerating}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 backdrop-blur-md bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105 font-semibold disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : 'Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Layer Analysis */}
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
        <h3 className="text-lg font-bold text-white mb-4 relative flex items-center gap-2">
          <Eye className="w-5 h-5 text-purple-400" />
          Layer-by-Layer Analysis
        </h3>
        <div className="space-y-3 relative">
          {result.layers.map((layer, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 backdrop-blur-md bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center space-x-3">
                {layerIcons[layer.status]}
                <span className="text-sm font-semibold text-white">{layer.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-purple-200">
                  {layer.confidence > 0 ? `${layer.confidence}%` : 'N/A'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}