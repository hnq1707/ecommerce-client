'use client';

import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ShoppingCartButtonProps {
  isOpen: boolean;
  totalQuantity: number;
  onClick: () => void;
}

export default function ShoppingCartButton({
  isOpen,
  totalQuantity,
  onClick,
}: ShoppingCartButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className={`relative h-12 w-12 transition-all duration-200 ${
              isOpen ? 'bg-primary/10 text-primary' : ''
            }`}
            aria-label="Giỏ hàng"
            aria-expanded={isOpen}
          >
            <ShoppingCart
              className={`h-6 w-6 transition-all duration-300 ${
                isOpen ? 'scale-110 text-primary' : ''
              }`}
            />

            <AnimatePresence>
              {totalQuantity > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3"
                >
                  <Badge
                    className="h-5 min-w-5 p-0 px-1 flex items-center justify-center bg-destructive text-destructive-foreground text-xs font-medium rounded-full"
                    aria-label={`${totalQuantity} sản phẩm trong giỏ`}
                  >
                    {totalQuantity > 99 ? '99+' : totalQuantity}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
}
