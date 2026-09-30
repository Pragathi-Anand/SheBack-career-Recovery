import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';
import { motion } from 'framer-motion';
import { Upload, FileCode, Play, CheckCircle2 } from 'lucide-react';
import type { ScanResult } from '../App';

interface ScanUploadProps {
  onScanStart: () => void;
  onScanComplete: (result: ScanResult) => void;
  onScanError: (error: string) => void;
  isScanning: boolean;
}

export default function ScanUpload({ onScanStart, onScanComplete, onScanError, isScanning }: ScanUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [sampleMode, setSampleMode] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setSampleMode(null);
    }
  };

  const scanFile = async (selectedFile: File) => {
    onScanStart();
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch(`${API_BASE}/api/scan`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Scan failed');
      const data = await res.json();
      onScanComplete(data);
    } catch (err: any) {
      onScanError(err.message);
    }
  };

  const scanSample = async (sampleId: string) => {
    setSampleMode(sampleId);
    setFile(null);
    onScanStart();

    try {
      const res = await fetch(`${API_BASE}/api/scan/sample/${sampleId}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Scan failed');
      const data = await res.json();
      onScanComplete(data);
    } catch (err: any) {
      onScanError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-text-bright flex items-center gap-3">
          <Upload size={24} className="text-neon-cyan" />
          Target Acquisition
        </h2>
        <p className="text-sm text-text-muted mt-1">Upload Python source code or select a cyber-simulation sample.</p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div
          className={`drop-zone cyber-glass ${dragOver ? 'drag-over' : ''} relative overflow-hidden`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {isScanning ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="cyber-spinner" />
              <p className="text-neon-cyan font-mono animate-pulse">Running autonomous agents...</p>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-neon-green/10 flex items-center justify-center border border-neon-green/30 glow-green">
                <CheckCircle2 size={32} className="text-neon-green" />
              </div>
              <p className="font-mono text-lg text-text-bright">{file.name}</p>
              <button onClick={() => scanFile(file)} className="cyber-btn cyber-btn-success flex items-center gap-2">
                <Play size={16} /> Init Scan
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 text-text-muted">
              <Upload size={48} className="text-neon-cyan/50 mb-2" />
              <p className="text-lg">Drag & Drop Python File</p>
              <p className="text-sm">or click to browse</p>
              <input
                type="file"
                multiple
                accept=".py"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files) {
                    setFiles(Array.from(e.target.files));
                    setSampleMode(null);
                  }
                }}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Demo Samples */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
          Simulation Targets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'sql_injection', name: 'SQL Injection', desc: 'Vulnerable login endpoint' },
            { id: 'rce_eval', name: 'Remote Code Execution', desc: 'Arbitrary eval() execution' },
            { id: 'mixed_vulns', name: 'Mixed Critical Vulnerabilities', desc: 'Multiple vectors including deserialization' }
          ].map((sample) => (
            <div
              key={sample.id}
              onClick={() => !isScanning && scanSample(sample.id)}
              className={`cyber-glass p-5 cursor-pointer hover:border-neon-cyan/50 hover:bg-white/[0.03] transition-all group ${sampleMode === sample.id ? 'border-neon-cyan glow-cyan' : ''} ${isScanning ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <FileCode size={18} className="text-neon-purple group-hover:text-neon-cyan transition-colors" />
                <h4 className="font-mono text-sm font-bold text-text-bright">{sample.name}</h4>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">{sample.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
