import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, Database, Home, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: Home, href: '/' },
  { name: 'Data Sets', icon: Database, href: '/datasets' },
  { name: 'Analysis', icon: BarChart2, href: '/analysis' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div
      initial={{ width: 256, x: -256 }}
      animate={{ 
        width: isCollapsed ? 80 : 256,
        x: 0
      }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-xl z-40"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-4 p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </motion.button>

      <div className="flex flex-col h-full py-6">
        <nav className="flex-1 space-y-2 px-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200`
              }
            >
              <motion.div
                initial={false}
                animate={{ 
                  width: isCollapsed ? 'auto' : '100%',
                  justifyContent: isCollapsed ? 'center' : 'flex-start'
                }}
                className="flex items-center space-x-3"
              >
                <item.icon className="h-5 w-5" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="truncate"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </NavLink>
          ))}
        </nav>

        <motion.div
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          className="px-4 mt-6"
        >
          {!isCollapsed && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Need help?
              </p>
              <button className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                View Documentation
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}