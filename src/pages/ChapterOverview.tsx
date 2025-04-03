
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

// Define the data for the coordinate geometry chapter
const chapterData = {
  'coordinate-geometry': {
    title: 'Coordinate Geometry',
    description: 'Learn about coordinate systems, graphing, and conic sections in 2D and 3D space.',
    topics: [
      {
        id: 'introduction',
        title: 'Introduction to Coordinate Geometry',
        description: 'Learn the basics of Cartesian coordinates and plotting points in 2D and 3D space.',
        progress: 0,
      },
      {
        id: 'distance-formula',
        title: 'Distance Formula',
        description: 'Calculate the distance between two points in Cartesian space using the Pythagorean theorem.',
        progress: 0,
      },
      {
        id: 'conic-sections',
        title: 'Conic Sections',
        description: 'Understand the fundamental conic sections and their equations.',
        progress: 0,
      },
      {
        id: 'circles',
        title: 'Circles',
        description: 'Explore circles, their equations, and properties in the Cartesian plane.',
        progress: 0,
      },
      {
        id: 'ellipses',
        title: 'Ellipses',
        description: 'Study ellipses, their equations, properties, and applications.',
        progress: 0,
      },
      {
        id: 'parabolas',
        title: 'Parabolas',
        description: 'Examine parabolas, their equations, and real-world applications.',
        progress: 0,
      },
      {
        id: 'hyperbolas',
        title: 'Hyperbolas',
        description: 'Investigate hyperbolas, their equations, and asymptotic behavior.',
        progress: 0,
      },
    ]
  }
};

const ChapterOverview = () => {
  const { chapterId } = useParams<{chapterId: string}>();
  const navigate = useNavigate();
  
  if (!chapterId || !chapterData[chapterId as keyof typeof chapterData]) {
    return <div>Chapter not found</div>;
  }
  
  const chapter = chapterData[chapterId as keyof typeof chapterData];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight">{chapter.title}</h1>
        <p className="text-muted-foreground mt-2">{chapter.description}</p>
      </motion.div>
      
      <motion.div 
        className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {chapter.topics.map((topic) => (
          <motion.div key={topic.id} variants={item}>
            <Card className="h-full transition-card hover:shadow-md">
              <CardHeader>
                <CardTitle>{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Progress value={topic.progress} className="h-2" />
                  <span className="text-xs text-muted-foreground">{topic.progress}%</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/chapter/${chapterId}/${topic.id}`)}
                >
                  {topic.progress > 0 ? "Continue" : "Start"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ChapterOverview;
