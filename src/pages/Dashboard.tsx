import { useState, useEffect } from 'react';
import { BarChart2, Users, Database, TrendingUp, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { previewData } from '../apiService';

const projectTemplates = [
  {
    id: 1,
    name: 'Data Analysis',
    description: 'Start with a comprehensive data analysis workflow',
    icon: BarChart2,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 2,
    name: 'ML Pipeline',
    description: 'Build an end-to-end machine learning pipeline',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    name: 'Custom Project',
    description: 'Start from scratch with a blank project',
    icon: Plus,
    color: 'from-green-500 to-emerald-500',
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [analysisReports, setAnalysisReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const preview = await previewData();
        // Mocking stats, datasets, and analysis reports based on preview data
        setStats([
          { name: 'Total Datasets', value: preview.datasets || '48', icon: Database, trend: '+12%', trendUp: true },
          { name: 'Active Users', value: '2.7k', icon: Users, trend: '+5.4%', trendUp: true },
          { name: 'Analysis Run', value: '1.2k', icon: BarChart2, trend: '+8.1%', trendUp: true },
          { name: 'Processing Time', value: '2.4s', icon: TrendingUp, trend: '-0.5s', trendUp: true },
        ]);
        setDatasets(preview.datasets || ['Dataset 1.csv', 'Dataset 2.csv', 'Dataset 3.csv']);
        setAnalysisReports(preview.reports || ['Report 1', 'Report 2', 'Report 3']);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {error && <div className="text-red-500">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon
                        className="h-6 w-6 text-gray-400 dark:text-gray-300"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {stat.name}
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            {stat.value}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                  <div className="text-sm">
                    <span
                      className={`font-medium ${
                        stat.trendUp
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {stat.trend}
                    </span>{' '}
                    <span className="text-gray-500 dark:text-gray-300">from last month</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Create Project Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create Project
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors duration-200"
                >
                  <Plus className="h-5 w-5" />
                  <span>New Project</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projectTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    className="relative group rounded-xl overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-10 group-hover:opacity-20 transition-opacity duration-200`} />
                    <div className="relative p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-transparent transition-colors duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <template.icon className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 transition-colors duration-200" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {template.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Recent Datasets
              </h3>
              <div className="space-y-3">
                {datasets.map((dataset, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400"
                  >
                    <Database className="h-5 w-5" />
                    <span>{dataset}</span>
                    <span className="flex-1 text-right">2 hours ago</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Recent Analysis
              </h3>
              <div className="space-y-3">
                {analysisReports.map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400"
                  >
                    <BarChart2 className="h-5 w-5" />
                    <span>{report}</span>
                    <span className="flex-1 text-right">1 day ago</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}