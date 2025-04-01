import { motion } from "framer-motion";
import FloatingShape from "../components/FloatingShape";

const DashboardPage = () => {
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
        <FloatingShape color="bg-blue-100" size="w-64 h-64" top="-5%" left="10%" delay={0} />
        <FloatingShape color="bg-gray-100" size="w-48 h-48" top="70%" left="80%" delay={5} />
        <FloatingShape color="bg-blue-50" size="w-32 h-32" top="40%" left="-10%" delay={2} />
      
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto mt-10 p-8 bg-white backdrop-filter backdrop-blur-lg rounded-xl shadow-lg border border-gray-200"
        >
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
            Dashboard
          </h2>

          <motion.div
            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Welcome to the Dashboard</h3>
            <p className="text-gray-600">This is your main dashboard page.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
