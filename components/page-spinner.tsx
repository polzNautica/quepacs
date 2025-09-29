import { Spinner } from "@heroui/spinner";
import { useLoadingStore } from "@/lib/useLoadingStore";
import { motion, AnimatePresence } from "framer-motion";

export default function PageSpinner() {
  const loading = useLoadingStore((state) => state.loading);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xs bg-gray/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Spinner size="lg" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
