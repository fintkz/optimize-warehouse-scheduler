
import { Truck, Users, Clock, BarChart3, Calendar, Zap } from 'lucide-react';

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

const Features = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-lg">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-warehouse-dark">
            Powerful AI-Driven Optimization Features
          </h2>
          <p className="text-warehouse-gray text-lg">
            Our warehouse optimization platform combines AI algorithms with operational expertise to deliver tangible efficiencies.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-6 border border-warehouse-lightGray/50 card-shadow"
            >
              <div className="inline-flex items-center justify-center p-3 bg-warehouse-blue/10 rounded-lg text-warehouse-blue mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-warehouse-dark">{feature.title}</h3>
              <p className="text-warehouse-gray">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
