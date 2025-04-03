
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConicSectionVisualization from "@/components/ar/ConicSectionVisualization";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// This is a simplified data structure for the demo
// In a real app, you would fetch this from an API or a more complete data store
const topicData = {
  'introduction': {
    title: 'Introduction to Coordinate Geometry',
    content: `
      <h2>The Cartesian Coordinate System</h2>
      <p>
        The Cartesian coordinate system is a fundamental concept in mathematics that allows us to represent points in space 
        using ordered pairs (x, y) in 2D or triplets (x, y, z) in 3D. It was developed by René Descartes, a French mathematician.
      </p>
      <p>
        This system provides a bridge between algebra and geometry, allowing us to represent geometric shapes using algebraic equations.
      </p>
      <h2>Plotting Points</h2>
      <p>
        In the Cartesian plane, we locate points by their distance from two perpendicular axes:
      </p>
      <ul>
        <li>The x-coordinate (horizontal position)</li>
        <li>The y-coordinate (vertical position)</li>
      </ul>
      <p>
        For example, the point (3, 4) is located 3 units along the x-axis and 4 units along the y-axis.
      </p>
    `,
    hasVisualization: false
  },
  'distance-formula': {
    title: 'Distance Formula',
    content: `
      <h2>The Distance Formula</h2>
      <p>
        The distance between two points (x₁, y₁) and (x₂, y₂) in the Cartesian plane is given by:
      </p>
      <div class="text-center my-4 math-formula">
        d = √[(x₂ - x₁)² + (y₂ - y₁)²]
      </div>
      <p>
        This formula is derived from the Pythagorean theorem, where the distance forms the hypotenuse of a right triangle.
      </p>
      <h2>Applications</h2>
      <p>
        The distance formula is fundamental in coordinate geometry and has applications in:
      </p>
      <ul>
        <li>Finding perimeter and area of geometric shapes</li>
        <li>Determining if three points are collinear</li>
        <li>Testing if a point lies on a given circle</li>
        <li>Calculating the shortest path between locations (in navigation)</li>
      </ul>
    `,
    hasVisualization: false
  },
  'conic-sections': {
    title: 'Conic Sections',
    content: `
      <h2>What are Conic Sections?</h2>
      <p>
        Conic sections are curves obtained by intersecting a plane with a double-napped cone. Depending on the angle and location
        of the intersection, we get four different types of conic sections:
      </p>
      <ul>
        <li><strong>Circle</strong>: When the plane is perpendicular to the axis of the cone</li>
        <li><strong>Ellipse</strong>: When the plane intersects one nappe at an angle to the axis</li>
        <li><strong>Parabola</strong>: When the plane is parallel to a generator line of the cone</li>
        <li><strong>Hyperbola</strong>: When the plane intersects both nappes of the cone</li>
      </ul>
      <p>
        Conic sections have important applications in physics, engineering, and astronomy. For example, the orbits of planets
        are elliptical, and satellite dishes often have parabolic shapes.
      </p>
      <h2>Eccentricity</h2>
      <p>
        Eccentricity (e) is a parameter that determines the shape of a conic section:
      </p>
      <ul>
        <li>Circle: e = 0</li>
        <li>Ellipse: 0 < e < 1</li>
        <li>Parabola: e = 1</li>
        <li>Hyperbola: e > 1</li>
      </ul>
    `,
    hasVisualization: true
  },
  'circles': {
    title: 'Circles',
    content: `
      <h2>Circles in the Coordinate Plane</h2>
      <p>
        A circle is the set of all points in a plane that are at a constant distance (the radius) from a fixed point (the center).
      </p>
      <h2>Standard Equation</h2>
      <p>
        The standard equation of a circle with center (h, k) and radius r is:
      </p>
      <div class="text-center my-4 math-formula">
        (x - h)² + (y - k)² = r²
      </div>
      <p>
        When the center is at the origin (0, 0), the equation simplifies to:
      </p>
      <div class="text-center my-4 math-formula">
        x² + y² = r²
      </div>
      <h2>Properties of Circles</h2>
      <ul>
        <li>All points on the circle are equidistant from the center</li>
        <li>The diameter is twice the radius and passes through the center</li>
        <li>The circumference (perimeter) is 2πr</li>
        <li>The area is πr²</li>
      </ul>
    `,
    hasVisualization: true
  },
  'ellipses': {
    title: 'Ellipses',
    content: `
      <h2>Ellipses in the Coordinate Plane</h2>
      <p>
        An ellipse is the set of all points in a plane such that the sum of the distances from any point on the ellipse to two fixed points (the foci) is constant.
      </p>
      <h2>Standard Equation</h2>
      <p>
        The standard equation of an ellipse centered at (h, k) with semi-major axis a and semi-minor axis b is:
      </p>
      <div class="text-center my-4 math-formula">
        (x - h)²/a² + (y - k)²/b² = 1
      </div>
      <p>
        When a > b, the ellipse is horizontal (stretched along the x-axis).
        When b > a, the ellipse is vertical (stretched along the y-axis).
      </p>
      <h2>Properties of Ellipses</h2>
      <ul>
        <li>The foci are located at (h ± c, k) for horizontal ellipses or (h, k ± c) for vertical ellipses, where c² = a² - b²</li>
        <li>The sum of distances from any point on the ellipse to the two foci is 2a</li>
        <li>The eccentricity e = c/a determines the shape (0 < e < 1)</li>
        <li>When e approaches 0, the ellipse approaches a circle</li>
        <li>When e approaches 1, the ellipse becomes more elongated</li>
      </ul>
      <h2>Real-world Applications</h2>
      <p>
        Ellipses have many applications including:
      </p>
      <ul>
        <li>Planetary orbits (Kepler's first law)</li>
        <li>Whispering galleries with elliptical ceilings</li>
        <li>Elliptical machine gears</li>
        <li>Medical imaging (lithotripsy)</li>
      </ul>
    `,
    hasVisualization: true
  },
  'parabolas': {
    title: 'Parabolas',
    content: `
      <h2>Parabolas in the Coordinate Plane</h2>
      <p>
        A parabola is the set of all points in a plane that are equidistant from a fixed point (the focus) and a fixed line (the directrix).
      </p>
      <h2>Standard Equation</h2>
      <p>
        The standard equation of a parabola with vertex at (h, k) is:
      </p>
      <div class="text-center my-4 math-formula">
        (y - k) = a(x - h)² (for a horizontal parabola)
      </div>
      <div class="text-center my-4 math-formula">
        (x - h) = a(y - k)² (for a vertical parabola)
      </div>
      <p>
        The coefficient a determines the width and direction of the parabola. If a > 0, the parabola opens upward/rightward. If a < 0, the parabola opens downward/leftward.
      </p>
      <h2>Properties of Parabolas</h2>
      <ul>
        <li>The vertex is the turning point of the parabola</li>
        <li>The focus is located at (h, k + 1/4a) for horizontal parabolas or (h + 1/4a, k) for vertical parabolas</li>
        <li>The directrix is the line y = k - 1/4a for horizontal parabolas or x = h - 1/4a for vertical parabolas</li>
        <li>The eccentricity of all parabolas is 1</li>
      </ul>
      <h2>Real-world Applications</h2>
      <p>
        Parabolas have many practical applications:
      </p>
      <ul>
        <li>Reflective properties (satellite dishes, headlights)</li>
        <li>Projectile motion in physics</li>
        <li>Bridge and arch designs</li>
        <li>Suspension cables</li>
      </ul>
    `,
    hasVisualization: true
  },
  'hyperbolas': {
    title: 'Hyperbolas',
    content: `
      <h2>Hyperbolas in the Coordinate Plane</h2>
      <p>
        A hyperbola is the set of all points in a plane such that the absolute difference of the distances from any point on the hyperbola to two fixed points (the foci) is constant.
      </p>
      <h2>Standard Equation</h2>
      <p>
        The standard equation of a hyperbola centered at (h, k) is:
      </p>
      <div class="text-center my-4 math-formula">
        (x - h)²/a² - (y - k)²/b² = 1 (for a horizontal hyperbola)
      </div>
      <div class="text-center my-4 math-formula">
        (y - k)²/a² - (x - h)²/b² = 1 (for a vertical hyperbola)
      </div>
      <p>
        For a horizontal hyperbola, the transverse axis is along the x-axis, and for a vertical hyperbola, the transverse axis is along the y-axis.
      </p>
      <h2>Properties of Hyperbolas</h2>
      <ul>
        <li>The foci are located at (h ± c, k) for horizontal hyperbolas or (h, k ± c) for vertical hyperbolas, where c² = a² + b²</li>
        <li>The vertices are located at (h ± a, k) for horizontal hyperbolas or (h, k ± a) for vertical hyperbolas</li>
        <li>The asymptotes are y - k = ±(b/a)(x - h) for horizontal hyperbolas or x - h = ±(b/a)(y - k) for vertical hyperbolas</li>
        <li>The eccentricity e = c/a is always greater than 1</li>
      </ul>
      <h2>Real-world Applications</h2>
      <p>
        Hyperbolas have several practical applications:
      </p>
      <ul>
        <li>LORAN (Long Range Navigation) systems</li>
        <li>Hyperboloid cooling towers</li>
        <li>Atomic clocks</li>
        <li>Triangulation and positioning systems</li>
      </ul>
    `,
    hasVisualization: true
  },
};

const TopicContent = () => {
  const { chapterId, topicId } = useParams<{chapterId: string, topicId: string}>();
  const navigate = useNavigate();
  
  if (!topicId || !topicData[topicId as keyof typeof topicData]) {
    return <div>Topic not found</div>;
  }
  
  const topic = topicData[topicId as keyof typeof topicData];
  
  // Logic to find previous and next topics
  const topicsOrder = ['introduction', 'distance-formula', 'conic-sections', 'circles', 'ellipses', 'parabolas', 'hyperbolas'];
  const currentIndex = topicsOrder.indexOf(topicId);
  const prevTopic = currentIndex > 0 ? topicsOrder[currentIndex - 1] : null;
  const nextTopic = currentIndex < topicsOrder.length - 1 ? topicsOrder[currentIndex + 1] : null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight">{topic.title}</h1>
        
        <div className="mt-8">
          <Tabs defaultValue={topic.hasVisualization ? "interactive" : "theory"}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="theory">Theory</TabsTrigger>
              <TabsTrigger value="interactive" disabled={!topic.hasVisualization}>
                Interactive
              </TabsTrigger>
            </TabsList>
            <TabsContent value="theory">
              <Card className="p-6">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: topic.content }}
                />
              </Card>
            </TabsContent>
            <TabsContent value="interactive">
              {topic.hasVisualization && (
                <Card className="p-6">
                  <ConicSectionVisualization />
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={() => prevTopic ? navigate(`/chapter/${chapterId}/${prevTopic}`) : navigate(`/chapter/${chapterId}`)}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {prevTopic ? 'Previous Topic' : 'Back to Chapter'}
          </Button>
          
          {nextTopic && (
            <Button 
              onClick={() => navigate(`/chapter/${chapterId}/${nextTopic}`)}
              className="gap-2"
            >
              Next Topic
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TopicContent;
