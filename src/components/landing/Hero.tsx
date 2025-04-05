
import { Button } from '@/components/ui/button';
import { Truck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-warehouse-blue to-warehouse-darkBlue text-white py-20 md:py-32 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white/5 blur-3xl"
          animate={{ 
            x: [0, 20, 0], 
            y: [0, 15, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl"
          animate={{ 
            x: [0, -30, 0], 
            y: [0, 20, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="container-lg relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-sm font-medium backdrop-blur-sm border border-white/20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.span 
                className="mr-2 text-lg"
                animate={{ 
                  rotate: [0, 10, 0, -10, 0],
                  scale: [1, 1.2, 1, 1.2, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  repeatDelay: 4
                }}
              >
                🚀
              </motion.span>
              <span>Next-Generation Warehouse Optimization</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Optimize Your Warehouse Operations with AI
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-blue-100 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Maximize efficiency, reduce wait times, and optimize worker assignments with our advanced AI-powered scheduling solution.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button 
                size="lg" 
                asChild 
                className="bg-white text-warehouse-blue hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all group"
              >
                <Link to="/dashboard" className="group-hover:translate-x-0.5 transition-transform">
                  <span>Try Dashboard Demo</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, repeatDelay: 3, duration: 1 }}
                  >
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.span>
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 backdrop-blur-sm text-white hover:bg-white/10 shadow-lg transition-all"
              >
                <span>Learn More</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="hidden lg:flex justify-center relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div 
              className="relative w-full max-w-md"
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-blue-500 to-purple-600 rounded-lg blur opacity-20"></div>
              <div className="relative bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <motion.div 
                      animate={{ rotate: [0, 10, 0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 5 }}
                    >
                      <Truck className="h-6 w-6" />
                    </motion.div>
                    <h3 className="text-xl font-semibold">Optimization Preview</h3>
                  </div>
                  <motion.span 
                    className="px-3 py-1.5 bg-green-500/20 text-green-300 text-xs rounded-full font-medium border border-green-500/30"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    +68% Efficiency
                  </motion.span>
                </div>
                
                <div className="space-y-5">
                  <motion.div 
                    className="bg-white/5 p-4 rounded-md border border-white/10"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span>Worker Utilization</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        className="bg-blue-400 h-2.5 rounded-full" 
                        initial={{ width: "0%" }}
                        animate={{ width: "92%" }}
                        transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-white/5 p-4 rounded-md border border-white/10"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span>Average Truck Wait Time</span>
                      <span className="font-medium">-43 min</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        className="bg-green-400 h-2.5 rounded-full" 
                        initial={{ width: "0%" }}
                        animate={{ width: "57%" }}
                        transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-white/5 p-4 rounded-md border border-white/10"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span>Efficiency Score</span>
                      <span className="font-medium">0.89</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        className="bg-purple-400 h-2.5 rounded-full" 
                        initial={{ width: "0%" }}
                        animate={{ width: "89%" }}
                        transition={{ duration: 1.5, delay: 1.4, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
