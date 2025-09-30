import { Spinner } from "@heroui/spinner";
import { useLoadingStore } from "@/lib/useLoadingStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function PageSpinner() {
  const loading = useLoadingStore((state) => state.loading);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    if (loading) {
      setTimer(30);

      const countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      const timeout = setTimeout(() => {
        setLoading(false);
        window.alert("Gagal memuat halaman. Jika anda merasakan ini satu kesilapan, sila hubungi admin.");
      }, 30000);

      return () => {
        clearInterval(countdown);
        clearTimeout(timeout);
      };
    }
  }, [loading, setLoading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-gray-200/10"
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
            className="flex flex-col items-center"
          >
            <Spinner size="lg" />
            <p
              className={`mt-4 text-white-600 animate-pulse flex bg-black text-xs px-2 py-1 rounded ${
                timer > 0 ? "visible" : "invisible"
              }`}
            >
              {timer > 10
                ? `Sebentar... (${timer}s)`
                : "Aplikasi mengambil lebih masa daripada diperlukan..."}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
