
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import { ArrowRight, Truck, BarChart3, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* How It Works Section */}
        <section className="section-padding bg-gray-50">
          <div className="container-lg">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-warehouse-dark">
                How WarehouseAI Works
              </h2>
              <p className="text-warehouse-gray text-lg">
                Our optimization engine uses advanced algorithms to create efficient schedules in three simple steps.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="bg-white rounded-full h-20 w-20 flex items-center justify-center mx-auto shadow-md mb-6">
                  <Truck className="h-8 w-8 text-warehouse-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Input Your Data</h3>
                <p className="text-warehouse-gray">
                  Enter your available workers, truck arrivals, and operational parameters for the shift.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white rounded-full h-20 w-20 flex items-center justify-center mx-auto shadow-md mb-6">
                  <BarChart3 className="h-8 w-8 text-warehouse-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Optimize Schedule</h3>
                <p className="text-warehouse-gray">
                  Our AI engine processes thousands of scheduling possibilities to find the optimal solution.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white rounded-full h-20 w-20 flex items-center justify-center mx-auto shadow-md mb-6">
                  <Users className="h-8 w-8 text-warehouse-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Deploy Assignments</h3>
                <p className="text-warehouse-gray">
                  Workers receive optimized task assignments with minimal truck wait times.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link to="/dashboard">
                  Try it now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="section-padding bg-warehouse-blue text-white">
          <div className="container-lg">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to transform your warehouse operations?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join leading logistics companies already using WarehouseAI to increase efficiency and reduce costs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="bg-white text-warehouse-blue hover:bg-blue-50">
                  Request Demo
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Landing;
