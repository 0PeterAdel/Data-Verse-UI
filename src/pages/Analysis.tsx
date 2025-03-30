import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, LineChart, PieChart, TrendingUp, Settings2, Download, Wand2, Brain, Share2, RefreshCw } from 'lucide-react';
import Plot from 'react-plotly.js';

const CHART_TYPES = [
  { id: 'bar', name: 'Bar Chart', icon: BarChart2, description: 'Compare values across categories' },
  { id: 'line', name: 'Line Chart', icon: LineChart, description: 'Track changes over time' },
  { id: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Show composition of data' },
  { id: 'scatter', name: 'Scatter Plot', icon: TrendingUp, description: 'Identify correlations' },
];

export default function Analysis() {
  const [selectedChart, setSelectedChart] = useState('bar');
  const [loading, setLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Mock data for demonstration
  const data = {
    bar: {
      x: ['Category A', 'Category B', 'Category C', 'Category D'],
      y: [32, 64, 45, 78],
      type: 'bar',
      marker: {
        color: 'rgb(99, 102, 241)',
        opacity: 0.8,
      },
    },
    line: {
      x: [1, 2, 3, 4, 5],
      y: [2, 5, 3, 8, 4],
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'rgb(99, 102, 241)' },
      line: { width: 3 },
    },
    pie: {
      values: [35, 25, 20, 20],
      labels: ['Product A', 'Product B', 'Product C', 'Product D'],
      type: 'pie',
      marker: {
        colors: ['rgb(99, 102, 241)', 'rgb(129, 140, 248)', 'rgb(165, 180, 252)', 'rgb(199, 210, 254)'],
      },
    },
    scatter: {
      x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      y: [2, 4, 3, 5, 4, 7, 6, 8, 7, 9],
      mode: 'markers',
      type: 'scatter',
      marker: { 
        color: 'rgb(99, 102, 241)',
        size: 10,
      },
    },
  };

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Data Analysis
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Visualize and analyze your data with interactive charts
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Settings2 className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Export Analysis
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {CHART_TYPES.map((chart) => (
            <motion.button
              key={chart.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedChart(chart.id)}
              className={`${
                selectedChart === chart.id
                  ? 'bg-indigo-50 border-indigo-500 dark:bg-indigo-900/20 dark:border-indigo-500'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              } p-4 border-2 rounded-xl flex flex-col items-center justify-center transition-all duration-200 group`}
            >
              <chart.icon
                className={`h-8 w-8 mb-3 ${
                  selectedChart === chart.id
                    ? 'text-indigo-500'
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  selectedChart === chart.id
                    ? 'text-indigo-700 dark:text-indigo-400'
                    : 'text-gray-900 dark:text-gray-300'
                }`}
              >
                {chart.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {chart.description}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Wand2 className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                AI-Powered Analysis
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Share2 className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <Plot
              data={[data[selectedChart as keyof typeof data]]}
              layout={{
                margin: { t: 20, r: 20, b: 40, l: 40 },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: {
                  color: '#6B7280',
                },
                xaxis: {
                  gridcolor: '#E5E7EB',
                  zerolinecolor: '#E5E7EB',
                },
                yaxis: {
                  gridcolor: '#E5E7EB',
                  zerolinecolor: '#E5E7EB',
                },
              }}
              config={{ responsive: true }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-indigo-500" />
            AI Insights
          </h3>
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
            >
              <p className="text-sm text-green-700 dark:text-green-400">
                Positive trend detected in the last 30 days (+15% growth)
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800"
            >
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Seasonal pattern identified with peaks every 3 months
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
            >
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Strong correlation found between variables X and Y (r=0.85)
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Wand2 className="h-5 w-5 mr-2 text-indigo-500" />
            Predictive Models
          </h3>
          <div className="space-y-4">
            {['Linear Regression', 'Random Forest', 'Neural Network'].map((model) => (
              <motion.div
                key={model}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {model}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Accuracy: {Math.round(Math.random() * 20 + 80)}%
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  View Details
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}