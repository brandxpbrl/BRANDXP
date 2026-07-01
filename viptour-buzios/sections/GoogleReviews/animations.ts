import type { Variants } from "framer-motion";

export const googleReviewsSectionVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
};

export const googleReviewItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};
