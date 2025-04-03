
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Grid3X3 } from "lucide-react";

const chapters = [
  {
    id: "coordinate-geometry",
    title: "Coordinate Geometry",
    description: "Learn about the Cartesian plane, plotting points, and understanding conic sections in 3D space.",
    topics: [
      "Introduction to Coordinate Systems",
      "Distance Formula",
      "Conic Sections",
      "Circles, Ellipses, Parabolas & Hyperbolas"
    ]
  },
  {
    id: "vectors",
    title: "Vector Algebra",
    description: "Coming soon - Explore vectors and their operations in 3D space with interactive visualizations.",
    topics: []
  },
  {
    id: "calculus",
    title: "3D Calculus",
    description: "Coming soon - Visualize derivatives, integrals and multivariable calculus in augmented reality.",
    topics: []
  }
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center text-center mb-12">
          <div className="rounded-full bg-ar-blue/10 p-3 mb-4">
            <Grid3X3 size={32} className="text-ar-blue" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">AugumentED</h1>
          <p className="text-xl text-muted-foreground mt-2 max-w-2xl">
            Visualize complex mathematical concepts in augmented reality and master coordinate geometry through immersive learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => (
            <motion.div 
              key={chapter.id}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className={`h-full transition-card ${chapter.topics.length === 0 ? 'opacity-70' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-ar-purple" />
                    {chapter.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{chapter.description}</p>
                  
                  {chapter.topics.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Topics covered:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {chapter.topics.map((topic, idx) => (
                          <li key={idx}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={chapter.topics.length ? "default" : "outline"}
                    disabled={chapter.topics.length === 0}
                    onClick={() => navigate(`/chapter/${chapter.id}`)}
                  >
                    {chapter.topics.length ? "Start Learning" : "Coming Soon"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
