import { motion } from 'framer-motion';

export default function TiltWrapper({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}
