
// Define types for our app

export interface Chapter {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  topics: Topic[];
  progress?: number;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  subtopics: Subtopic[];
}

export interface Subtopic {
  id: string;
  title: string;
  description: string;
  contentType: "theory" | "visualization" | "exercise" | "quiz";
  completed?: boolean;
}

export interface ConceptVisualization {
  id: string;
  name: string;
  description: string;
  equation?: string;
  render: (props: any) => JSX.Element;
}
