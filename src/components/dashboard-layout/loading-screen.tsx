"use client"

import { motion } from "framer-motion"
import { Loader2, ShoppingBag } from "lucide-react"

const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ShoppingBag className="h-12 w-12 text-primary mb-2" />
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Đang tải thông tin...</p>
      </motion.div>
    </div>
  )
}

export default LoadingScreen
