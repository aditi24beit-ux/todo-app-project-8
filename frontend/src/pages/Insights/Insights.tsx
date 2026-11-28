
import { useState } from 'react';
import insightsService, {
  type ProductivityInsights,
} from '../../services/insightsService';

function cleanInsight(text: string) {
  return text
    .replace(/\\\*/g, '')
    .replace(/\*\*/g, '')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/^---+$/gm, '')
    .trim();
}

function Insights() {
  const [data, setData] = useState<ProductivityInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInsights = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await insightsService.getProductivityInsights();

      if (!result || !result.statistics) {
        setError('Productivity statistics could not be loaded.');
        return;
      }

      setData(result);
    } catch (err) {
      console.error('Insights API Error:', err);
      setError('Unable to load insights. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const geminiUnavailable =
    data?.gemini_insights?.toLowerCase().includes('temporarily unavailable');

  return (
    <div className="ai-page">
      <style>{`
        .ai-page {
          padding: 30px;
          max-width: 1200px;
          margin: auto;
          color: #1e293b;
          font-family: Arial, sans-serif;
        }

        .ai-hero {
          background: linear-gradient(120deg, #172554, #4338ca);
          color: white;
          padding: 30px;
          border-radius: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 30px;
        }

        .ai-hero h1 {
          font-size: 28px;
          margin: 8px 0;
        }

        .ai-hero p {
          color: #dbeafe;
          margin: 0;
          line-height: 1.6;
        }

        .ai-kicker {
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 2px;
          color: #c7d2fe;
        }

        .generate-btn {
          background: white;
          color: #3730a3;
          border: none;
          border-radius: 9px;
          padding: 13px 22px;
          font-weight: bold;
          cursor: pointer;
          font-size: 14px;
        }

        .generate-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .section-title {
          font-size: 21px;
          margin-bottom: 18px;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 22px;
          box-shadow: 0 3px 12px rgba(15, 23, 42, 0.04);
        }

        .stat-label {
          color: #64748b;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .stat-value {
          font-size: 30px;
          font-weight: bold;
          color: #1e293b;
        }

        .progress-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 22px;
          margin-bottom: 32px;
        }

        .progress-heading {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 13px;
          font-weight: bold;
        }

        .progress-track {
          height: 11px;
          border-radius: 20px;
          background: #e2e8f0;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 20px;
          background: linear-gradient(90deg, #4f46e5, #818cf8);
        }

        .model-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .model-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 15px;
          padding: 23px;
          box-shadow: 0 3px 12px rgba(15, 23, 42, 0.04);
          min-width: 0;
        }

        .model-card h3 {
          margin: 14px 0;
          font-size: 19px;
        }

        .model-chip {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: bold;
        }

        .gemini-chip {
          color: #1d4ed8;
          background: #dbeafe;
        }

        .groq-chip {
          color: #6d28d9;
          background: #ede9fe;
        }

        .model-status {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 14px;
        }

        .insight-content {
          color: #475569;
          font-size: 14px;
          line-height: 1.8;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .error-message {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 14px;
          margin-bottom: 20px;
        }

        .empty-state {
          background: white;
          border: 1px dashed #cbd5e1;
          padding: 35px;
          text-align: center;
          border-radius: 14px;
          color: #64748b;
          margin-top: 20px;
        }
      `}</style>

      <header className="ai-hero">
        <div>
          <div className="ai-kicker">SMART PRODUCTIVITY</div>
          <h1>AI Productivity Insights</h1>
          <p>Understand your progress and discover ways to work smarter.</p>
        </div>

        <button
          className="generate-btn"
          onClick={fetchInsights}
          disabled={loading}
        >
          {loading ? 'Generating...' : '✦ Generate Insights'}
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      {!data && !loading && !error && (
        <div className="empty-state">
          <h3>Ready to analyse your productivity?</h3>
          <p>Click Generate Insights to view your task statistics and AI recommendations.</p>
        </div>
      )}

      {loading && (
        <div className="empty-state">
          Generating your productivity insights...
        </div>
      )}

      {data && (
        <>
          <h2 className="section-title">Your Productivity Overview</h2>

          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-label">Total Tasks</div>
              <div className="stat-value">{data.statistics.total_tasks}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Completed Tasks</div>
              <div className="stat-value">{data.statistics.completed_tasks}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Pending Tasks</div>
              <div className="stat-value">{data.statistics.pending_tasks}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Overdue Tasks</div>
              <div className="stat-value">{data.statistics.overdue_tasks}</div>
            </div>
          </div>

          <div className="progress-card">
            <div className="progress-heading">
              <span>Overall Completion Rate</span>
              <span>{data.statistics.completion_rate}%</span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, data.statistics.completion_rate)
                  )}%`,
                }}
              />
            </div>
          </div>

          <h2 className="section-title">AI-Generated Recommendations</h2>

          <div className="model-grid">
            <section className="model-card">
              <span className="model-chip gemini-chip">GOOGLE GEMINI</span>
              <h3>Gemini Insights</h3>

              <div className="model-status">
                {geminiUnavailable
                  ? 'Temporarily unavailable'
                  : 'AI-generated productivity analysis'}
              </div>

              <div className="insight-content">
                {cleanInsight(data.gemini_insights || 'No insights available.')}
              </div>
            </section>

            <section className="model-card">
              <span className="model-chip groq-chip">GROQ AI</span>
              <h3>Groq Insights</h3>
              <div className="model-status">
                AI-generated productivity analysis
              </div>

              <div className="insight-content">
                {cleanInsight(data.groq_insights || 'No insights available.')}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default Insights;
