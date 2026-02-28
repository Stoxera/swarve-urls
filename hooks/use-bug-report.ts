import { useState } from 'react';

export const useBugReport = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendReport = async (data: { 
    title: string; 
    severity: string; 
    area: string; 
    description: string;
    email: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/report-bug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) setSuccess(true);
    } catch (error) {
      console.error("Error reporting bug:", error);
    } finally {
      setLoading(false);
    }
  };

  return { sendReport, loading, success };
};