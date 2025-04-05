
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import { ArrowRight, Truck, BarChart3, Users, ChevronRight, Stars, Check, Award, Building, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "WarehouseAI has revolutionized our logistics operations, reducing truck wait times by over 40% in just two months.",
    author: "Sarah Johnson",
    position: "Operations Director",
    company: "Global Logistics Inc."
  },
  {
    quote: "The AI-powered worker assignments have significantly improved our overall warehouse efficiency and employee satisfaction.",
    author: "Michael Chen",
    position: "Warehouse Manager",
    company: "FastShip Solutions"
  },
  {
    quote: "Real-time schedule adjustments mean we can handle disruptions without impacting our delivery commitments.",
    author: "Robert Patel",
    position: "Supply Chain VP",
    company: "Prime Distribution"
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* How It Works Section */}
        <section className="section-padding bg-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxRTQwQUYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0xMGg0djFoLTR2LTF6Ii8+PHBhdGggZD0iTTAgMGg2MHY2MEgwVjB6TTMwIDIwaDR2MWgtNHYtMXptMCAyMGg0djFoLTR2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40 pointer-events-none"></div>
          
          <div className="container-lg relative z-10">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="inline-block px-4 py-2 rounded-full bg-warehouse-blue/10 text-warehouse-blue text-sm font-medium mb-4"
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                Simple Integration
              </motion.div>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4 text-warehouse-dark"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                How WarehouseAI Works
              </motion.h2>
              <motion.p 
                className="text-warehouse-gray text-lg"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Our optimization engine uses advanced algorithms to create efficient schedules in three simple steps.
              </motion.p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-warehouse-blue/0 via-warehouse-blue/30 to-warehouse-blue/0"></div>
              
              <motion.div 
                className="text-center z-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
              >
                <motion.div 
                  className="bg-white rounded-full h-24 w-24 flex items-center justify-center mx-auto shadow-xl mb-8 relative border-4 border-white"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="absolute -top-2 -right-2 bg-warehouse-blue text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">1</span>
                  <Truck className="h-10 w-10 text-warehouse-blue" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">Input Your Data</h3>
                <p className="text-warehouse-gray">
                  Enter your available workers, truck arrivals, and operational parameters for the shift.
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center z-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <motion.div 
                  className="bg-white rounded-full h-24 w-24 flex items-center justify-center mx-auto shadow-xl mb-8 relative border-4 border-white"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="absolute -top-2 -right-2 bg-warehouse-blue text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">2</span>
                  <BarChart3 className="h-10 w-10 text-warehouse-blue" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">Optimize Schedule</h3>
                <p className="text-warehouse-gray">
                  Our AI engine processes thousands of scheduling possibilities to find the optimal solution.
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center z-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <motion.div 
                  className="bg-white rounded-full h-24 w-24 flex items-center justify-center mx-auto shadow-xl mb-8 relative border-4 border-white"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="absolute -top-2 -right-2 bg-warehouse-blue text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">3</span>
                  <Users className="h-10 w-10 text-warehouse-blue" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">Deploy Assignments</h3>
                <p className="text-warehouse-gray">
                  Workers receive optimized task assignments with minimal truck wait times.
                </p>
              </motion.div>
            </div>
            
            <motion.div 
              className="text-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-warehouse-blue hover:bg-warehouse-lightBlue shadow-lg hover:shadow-xl transition-all px-8 py-6 h-auto text-base"
              >
                <Link to="/dashboard" className="flex items-center">
                  Try it now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="section-padding bg-white">
          <div className="container-lg">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="inline-block px-4 py-2 rounded-full bg-warehouse-blue/10 text-warehouse-blue text-sm font-medium mb-4"
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                Success Stories
              </motion.div>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4 text-warehouse-dark"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                What Our Clients Say
              </motion.h2>
              <motion.p 
                className="text-warehouse-gray text-lg"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Leading logistics companies trust WarehouseAI to optimize their operations
              </motion.p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="mb-4 text-warehouse-blue">
                    <Stars className="h-7 w-7" />
                  </div>
                  <p className="text-warehouse-gray mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-warehouse-dark">{testimonial.author}</p>
                    <p className="text-sm text-warehouse-gray">{testimonial.position}, {testimonial.company}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Stats */}
        <section className="py-16 bg-warehouse-darkBlue text-white">
          <div className="container-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-100">42%</p>
                <p className="text-blue-200">Average Efficiency Gain</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <p className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-100">3.5M+</p>
                <p className="text-blue-200">Tasks Optimized</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-100">87%</p>
                <p className="text-blue-200">Client Retention</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <p className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-100">28min</p>
                <p className="text-blue-200">Avg. Wait Time Reduction</p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Benefits */}
        <section className="section-padding bg-gray-50">
          <div className="container-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-block px-4 py-2 rounded-full bg-warehouse-blue/10 text-warehouse-blue text-sm font-medium mb-4">
                  Business Impact
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-warehouse-dark">
                  Transform Your Logistics Operations
                </h2>
                <p className="text-warehouse-gray text-lg mb-8">
                  WarehouseAI delivers measurable results that impact your bottom line and operational efficiency.
                </p>
                
                <div className="space-y-4">
                  {['Reduce labor costs by up to 35%', 'Minimize truck wait times', 'Optimize worker utilization', 'Real-time adaptability to disruptions'].map((benefit, i) => (
                    <motion.div 
                      key={i} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: 0.1 * i }}
                    >
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-warehouse-gray">{benefit}</p>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <Button 
                    asChild 
                    className="bg-warehouse-blue hover:bg-warehouse-lightBlue shadow-md"
                  >
                    <Link to="/dashboard">
                      See it in action
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-warehouse-blue/90 to-warehouse-darkBlue/90 z-10">
                  <div className="absolute top-10 left-10 right-10 bottom-10 border-2 border-white/10 rounded-lg overflow-hidden">
                    <div className="h-full w-full p-8 flex flex-col">
                      <div className="mb-4 flex justify-between items-center">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-white/70 text-sm">WarehouseAI Dashboard</div>
                      </div>
                      
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-md p-4 backdrop-blur-sm">
                          <h4 className="text-white text-sm mb-2 font-medium">Worker Utilization</h4>
                          <div className="h-32 flex items-end">
                            {[65, 78, 92, 80, 87, 94, 72].map((value, i) => (
                              <motion.div 
                                key={i}
                                className="flex-1 bg-blue-400/70 mx-0.5 rounded-t"
                                style={{ height: `${value}%` }}
                                initial={{ height: 0 }}
                                whileInView={{ height: `${value}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-white/10 rounded-md p-4 backdrop-blur-sm">
                          <h4 className="text-white text-sm mb-2 font-medium">Truck Wait Times</h4>
                          <div className="flex flex-col space-y-3 mt-4">
                            {[80, 45, 30, 60].map((value, i) => (
                              <div key={i} className="space-y-1">
                                <div className="flex justify-between text-xs text-white/80">
                                  <span>{`Truck ${i+1}`}</span>
                                  <span>{`${value} min`}</span>
                                </div>
                                <motion.div 
                                  className="w-full bg-white/20 rounded-full h-1.5"
                                  initial={{ width: 0 }}
                                  whileInView={{ width: "100%" }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.8, delay: 1 + (i * 0.1) }}
                                >
                                  <motion.div 
                                    className="bg-green-400/70 h-1.5 rounded-full" 
                                    style={{ width: `${100 - value/100*100}%` }}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${100 - value/100*100}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 1.2 + (i * 0.1) }}
                                  />
                                </motion.div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593698054498-55f2b264f80d?q=80&w=2670')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-br from-warehouse-blue to-warehouse-darkBlue text-white overflow-hidden relative">
          <div className="absolute inset-0 overflow-hidden">
            <svg className="absolute right-0 top-0 h-full w-1/2 translate-x-1/2 transform text-white/5" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polygon points="0,0 100,0 50,100 0,100"></polygon>
            </svg>
          </div>
        
          <div className="container-lg relative z-10">
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <motion.div 
                className="inline-flex items-center space-x-2 mb-8"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <Award className="h-6 w-6 text-blue-200" />
                <span className="text-blue-200 font-medium">Enterprise-grade solution</span>
              </motion.div>
              
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Ready to transform your warehouse operations?
              </motion.h2>
              
              <motion.p 
                className="text-xl text-blue-100 mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Join leading logistics companies already using WarehouseAI to increase efficiency and reduce costs.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-warehouse-blue hover:bg-blue-50 font-medium px-8"
                >
                  Request Demo
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 backdrop-blur-sm text-white hover:bg-white/10 font-medium"
                >
                  Contact Sales
                </Button>
              </motion.div>
              
              <motion.div 
                className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-center gap-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center">
                  <ShieldCheck className="h-5 w-5 text-blue-200 mr-2" />
                  <span className="text-blue-100 text-sm">Enterprise Security</span>
                </div>
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-blue-200 mr-2" />
                  <span className="text-blue-100 text-sm">Custom Integrations</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-200 mr-2" />
                  <span className="text-blue-100 text-sm">24/7 Support</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Landing;
