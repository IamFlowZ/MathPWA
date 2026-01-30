import { useState, useMemo } from 'preact/hooks';
import {
  parseDataInput,
  calculateStatistics,
  permutations,
  combinations,
  normalCDF,
  normalInverseCDF,
} from '../utils/statistics';
import type { StatisticsData } from '../types';

type StatsTab = 'data' | 'probability';

/**
 * Format a number for display
 */
function formatValue(value: number): string {
  if (!Number.isFinite(value)) return 'Error';
  if (Math.abs(value) < 0.0001 && value !== 0) {
    return value.toExponential(4);
  }
  return Number(value.toPrecision(8)).toString();
}

/**
 * Statistics view for data analysis
 */
export function StatisticsView() {
  const [activeTab, setActiveTab] = useState<StatsTab>('data');
  const [dataInput, setDataInput] = useState('');

  // nPr/nCr inputs
  const [nValue, setNValue] = useState('');
  const [rValue, setRValue] = useState('');

  // Normal distribution inputs
  const [normalX, setNormalX] = useState('');
  const [normalMean, setNormalMean] = useState('0');
  const [normalStdDev, setNormalStdDev] = useState('1');
  const [normalP, setNormalP] = useState('');

  const stats: StatisticsData | null = useMemo(() => {
    const values = parseDataInput(dataInput);
    if (values.length === 0) return null;
    return calculateStatistics(values);
  }, [dataInput]);

  const nPrResult = useMemo(() => {
    const n = parseInt(nValue, 10);
    const r = parseInt(rValue, 10);
    if (Number.isNaN(n) || Number.isNaN(r) || n < 0 || r < 0) return null;
    try {
      return permutations(n, r);
    } catch {
      return null;
    }
  }, [nValue, rValue]);

  const nCrResult = useMemo(() => {
    const n = parseInt(nValue, 10);
    const r = parseInt(rValue, 10);
    if (Number.isNaN(n) || Number.isNaN(r) || n < 0 || r < 0) return null;
    try {
      return combinations(n, r);
    } catch {
      return null;
    }
  }, [nValue, rValue]);

  const normalCDFResult = useMemo(() => {
    const x = parseFloat(normalX);
    const mean = parseFloat(normalMean);
    const stdDev = parseFloat(normalStdDev);
    if (Number.isNaN(x) || Number.isNaN(mean) || Number.isNaN(stdDev) || stdDev <= 0) {
      return null;
    }
    return normalCDF(x, mean, stdDev);
  }, [normalX, normalMean, normalStdDev]);

  const normalInverseResult = useMemo(() => {
    const p = parseFloat(normalP);
    const mean = parseFloat(normalMean);
    const stdDev = parseFloat(normalStdDev);
    if (
      Number.isNaN(p) ||
      Number.isNaN(mean) ||
      Number.isNaN(stdDev) ||
      stdDev <= 0 ||
      p <= 0 ||
      p >= 1
    ) {
      return null;
    }
    try {
      return normalInverseCDF(p, mean, stdDev);
    } catch {
      return null;
    }
  }, [normalP, normalMean, normalStdDev]);

  return (
    <div class="stats-container">
      <div class="stats-tabs">
        <button
          class={`stats-tab ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          Data Stats
        </button>
        <button
          class={`stats-tab ${activeTab === 'probability' ? 'active' : ''}`}
          onClick={() => setActiveTab('probability')}
        >
          Probability
        </button>
      </div>

      {activeTab === 'data' && (
        <div class="stats-data-view">
          <div class="stats-input-container">
            <label class="stats-label" htmlFor="data-input">
              Enter numbers (comma or space separated):
            </label>
            <textarea
              id="data-input"
              class="stats-textarea"
              value={dataInput}
              onInput={(e) => setDataInput((e.target as HTMLTextAreaElement).value)}
              placeholder="1, 2, 3, 4, 5"
              rows={3}
            />
          </div>

          {stats && (
            <div class="stats-results">
              <div class="stats-result-item">
                <div class="stats-result-label">Count (n)</div>
                <div class="stats-result-value">{stats.count}</div>
              </div>
              <div class="stats-result-item">
                <div class="stats-result-label">Sum</div>
                <div class="stats-result-value">{formatValue(stats.sum)}</div>
              </div>
              <div class="stats-result-item">
                <div class="stats-result-label">Mean (x̄)</div>
                <div class="stats-result-value">{formatValue(stats.mean)}</div>
              </div>
              <div class="stats-result-item">
                <div class="stats-result-label">Median</div>
                <div class="stats-result-value">{formatValue(stats.median)}</div>
              </div>
              <div class="stats-result-item">
                <div class="stats-result-label">Mode</div>
                <div class="stats-result-value">
                  {stats.mode.length === 0
                    ? 'None'
                    : stats.mode.map(formatValue).join(', ')}
                </div>
              </div>
              <div class="stats-result-item">
                <div class="stats-result-label">Std Dev (σ)</div>
                <div class="stats-result-value">{formatValue(stats.stdDev)}</div>
              </div>
              <div class="stats-result-item">
                <div class="stats-result-label">Variance (σ²)</div>
                <div class="stats-result-value">{formatValue(stats.variance)}</div>
              </div>
            </div>
          )}

          {!stats && dataInput.trim() && (
            <div class="stats-empty">No valid numbers found</div>
          )}
        </div>
      )}

      {activeTab === 'probability' && (
        <div class="stats-probability-view">
          {/* nPr / nCr */}
          <div class="stats-section">
            <h3 class="stats-section-title">Permutations & Combinations</h3>
            <div class="stats-input-row">
              <label class="stats-label">
                n:
                <input
                  type="number"
                  class="stats-input-small"
                  value={nValue}
                  onInput={(e) => setNValue((e.target as HTMLInputElement).value)}
                  min="0"
                  placeholder="n"
                />
              </label>
              <label class="stats-label">
                r:
                <input
                  type="number"
                  class="stats-input-small"
                  value={rValue}
                  onInput={(e) => setRValue((e.target as HTMLInputElement).value)}
                  min="0"
                  placeholder="r"
                />
              </label>
            </div>
            <div class="stats-results-inline">
              <div class="stats-result-item">
                <div class="stats-result-label">nPr</div>
                <div class="stats-result-value">
                  {nPrResult !== null ? formatValue(nPrResult) : '-'}
                </div>
              </div>
              <div class="stats-result-item">
                <div class="stats-result-label">nCr</div>
                <div class="stats-result-value">
                  {nCrResult !== null ? formatValue(nCrResult) : '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Normal Distribution */}
          <div class="stats-section">
            <h3 class="stats-section-title">Normal Distribution</h3>
            <div class="stats-input-row">
              <label class="stats-label">
                μ (mean):
                <input
                  type="number"
                  class="stats-input-small"
                  value={normalMean}
                  onInput={(e) => setNormalMean((e.target as HTMLInputElement).value)}
                  placeholder="0"
                />
              </label>
              <label class="stats-label">
                σ (std dev):
                <input
                  type="number"
                  class="stats-input-small"
                  value={normalStdDev}
                  onInput={(e) => setNormalStdDev((e.target as HTMLInputElement).value)}
                  min="0.001"
                  step="0.1"
                  placeholder="1"
                />
              </label>
            </div>

            <div class="stats-subsection">
              <div class="stats-input-row">
                <label class="stats-label">
                  x value:
                  <input
                    type="number"
                    class="stats-input-small"
                    value={normalX}
                    onInput={(e) => setNormalX((e.target as HTMLInputElement).value)}
                    step="0.1"
                    placeholder="x"
                  />
                </label>
                <div class="stats-result-item">
                  <div class="stats-result-label">P(X ≤ x)</div>
                  <div class="stats-result-value">
                    {normalCDFResult !== null ? formatValue(normalCDFResult) : '-'}
                  </div>
                </div>
              </div>
            </div>

            <div class="stats-subsection">
              <div class="stats-input-row">
                <label class="stats-label">
                  probability p:
                  <input
                    type="number"
                    class="stats-input-small"
                    value={normalP}
                    onInput={(e) => setNormalP((e.target as HTMLInputElement).value)}
                    min="0.001"
                    max="0.999"
                    step="0.01"
                    placeholder="0.5"
                  />
                </label>
                <div class="stats-result-item">
                  <div class="stats-result-label">x for P(X≤x)=p</div>
                  <div class="stats-result-value">
                    {normalInverseResult !== null ? formatValue(normalInverseResult) : '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
