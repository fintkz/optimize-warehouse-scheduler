
import { Truck, Users, Clock, BarChart3, Calendar, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Truck Schedule Optimization',
    description: 'Minimize wait times and optimize truck loading/unloading schedules with intelligent dock assignments.',
    icon: Truck
  },
  {
    title: 'Worker Assignment',
    description: 'Automatically assign workers to tasks based on skills, availability and optimal resource allocation.',
    icon: Users
  },
  {
    title: 'Real-time Adjustments',
    description: 'Respond to schedule disruptions with real-time optimization and contingency planning.',
    icon: Clock
  },
  {
    title: 'Performance Analytics',
    description: 'Track key metrics including worker utilization, truck wait times, and overall efficiency scores.',
    icon: BarChart3
  },
  {
    title: 'Shift Planning',
    description: 'Optimize entire shifts with balanced workloads and appropriate worker-to-task assignments.',
    icon: Calendar
  },
  {
    title: 'Efficiency Insights',
    description: 'Leverage ML-generated worker efficiency scores to create optimal task assignments.',
    icon: Zap
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const Features = () => {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-blue-50"></div>
        <div className="absolute -left-20 bottom-20 w-64 h-64 rounded-full bg-blue-50"></div>
      </div>
      
      <div className="container-lg relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-warehouse-blue text-sm font-medium mb-4">
              Powerful Features
            </span>
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-warehouse-dark"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Powerful AI-Driven Optimization Features
          </motion.h2>
          <motion.p 
            className="text-warehouse-gray text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our warehouse optimization platform combines AI algorithms with operational expertise to deliver tangible efficiencies.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-xl p-6 border border-warehouse-lightGray/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              variants={item}
            >
              <motion.div 
                className="inline-flex items-center justify-center p-3 bg-warehouse-blue/10 rounded-lg text-warehouse-blue mb-5"
                whileHover={{ scale: 1.05, rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="h-6 w-6" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 text-warehouse-dark">{feature.title}</h3>
              <p className="text-warehouse-gray">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
