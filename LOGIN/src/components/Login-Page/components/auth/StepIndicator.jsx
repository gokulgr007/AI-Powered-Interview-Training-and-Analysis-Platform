import { motion } from "framer-motion";
import { Check } from "lucide-react";
export function StepIndicator({ currentStep, totalSteps }) {
  const steps = [
    { id: 1, label: "Identity" },
    { id: 2, label: "Career" },
    { id: 3, label: "Security" },
  ];

  return (
    <div className="relative flex justify-between w-full mb-8">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 rounded-full" />
      
      {/* Progress Line */}
      <motion.div 
        className="absolute top-1/2 left-0 h-0.5 bg-indigo-600 -translate-y-1/2 rounded-full origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: (currentStep - 1) / (totalSteps - 1) }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ width: "100%" }}
      />

      {steps.map((step) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;

        return (
          <div key={step.id} className="relative flex flex-col items-center gap-2 z-10">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                isCompleted || isCurrent
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-white border-gray-200 text-gray-400"
              }`}
              initial={false}
              animate={{
                scale: isCurrent ? 1.1 : 1,
              }}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-xs font-bold">{step.id}</span>
              )}
            </motion.div>
            <span 
              className={`text-xs font-medium transition-colors duration-300 ${
                isCurrent ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}


