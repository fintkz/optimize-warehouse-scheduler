
import { Button } from '@/components/ui/button';
import { Truck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-warehouse-blue to-warehouse-darkBlue text-white py-20 md:py-32">
      <div className="container-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-sm font-medium backdrop-blur-sm">
              <span className="mr-2">🚀</span>
              <span>Next-Generation Warehouse Optimization</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Optimize Your Warehouse Operations with AI
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-xl">
              Maximize efficiency, reduce wait times, and optimize worker assignments with our advanced AI-powered scheduling solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" asChild className="bg-white text-warehouse-blue hover:bg-blue-50">
                <Link to="/dashboard">Try Dashboard Demo</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <span>Learn More</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:flex justify-center relative">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur opacity-30"></div>
              <div className="relative bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-6 w-6" />
                    <h3 className="text-xl font-semibold">Optimization Preview</h3>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">+68% Efficiency</span>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/5 p-3 rounded-md">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Worker Utilization</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-3 rounded-md">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Truck Wait Time</span>
                      <span className="font-medium">-43 min</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '57%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-3 rounded-md">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Efficiency Score</span>
                      <span className="font-medium">0.89</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-purple-400 h-2 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
