
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Video, Palette, Code, BookOpen, Zap } from "lucide-react";

interface DemoProject {
  id: string;
  title: string;
  description: string;
  type: "Music" | "Film" | "Art" | "Tech" | "Publishing" | "Other";
  icon: React.ReactNode;
  budget: string;
  teamSize: number;
  tags: string[];
  example: {
    projectIdea: string;
    roles: Array<{ name: string; percent: number }>;
    expenses: Array<{ name: string; amount: number }>;
  };
}

const demoProjects: DemoProject[] = [
  {
    id: "indie-album",
    title: "Indie Album Release",
    description: "Crowdfund recording, production, and marketing for an independent music album",
    type: "Music",
    icon: <Music className="w-5 h-5" />,
    budget: "$15,000",
    teamSize: 4,
    tags: ["Music", "Recording", "Marketing"],
    example: {
      projectIdea: "Recording and releasing my debut indie folk album 'Midnight Stories' with professional production, featuring 10 original songs about urban life and personal growth.",
      roles: [
        { name: "Artist/Songwriter", percent: 60 },
        { name: "Producer", percent: 25 },
        { name: "Marketing Manager", percent: 15 }
      ],
      expenses: [
        { name: "Studio Recording", amount: 8000 },
        { name: "Mixing & Mastering", amount: 3000 },
        { name: "Marketing Campaign", amount: 4000 }
      ]
    }
  },
  {
    id: "short-film",
    title: "Independent Short Film",
    description: "Fund a 15-minute narrative short film with professional cast and crew",
    type: "Film",
    icon: <Video className="w-5 h-5" />,
    budget: "$25,000",
    teamSize: 6,
    tags: ["Film", "Drama", "Festival"],
    example: {
      projectIdea: "Creating 'The Last Letter' - a 15-minute drama about a grandmother's final message to her family, shot on location in Brooklyn with professional actors.",
      roles: [
        { name: "Director", percent: 30 },
        { name: "Producer", percent: 20 },
        { name: "Cinematographer", percent: 20 },
        { name: "Lead Actor", percent: 15 },
        { name: "Editor", percent: 15 }
      ],
      expenses: [
        { name: "Equipment Rental", amount: 10000 },
        { name: "Location Fees", amount: 5000 },
        { name: "Cast & Crew", amount: 8000 },
        { name: "Post-Production", amount: 2000 }
      ]
    }
  },
  {
    id: "art-exhibition",
    title: "Pop-up Art Exhibition",
    description: "Curate and host a month-long contemporary art exhibition",
    type: "Art",
    icon: <Palette className="w-5 h-5" />,
    budget: "$8,000",
    teamSize: 3,
    tags: ["Art", "Exhibition", "Community"],
    example: {
      projectIdea: "Organizing 'Digital Souls' - a contemporary art exhibition showcasing how technology affects human connection, featuring 5 emerging artists in a downtown gallery space.",
      roles: [
        { name: "Curator", percent: 50 },
        { name: "Gallery Manager", percent: 30 },
        { name: "Marketing Coordinator", percent: 20 }
      ],
      expenses: [
        { name: "Gallery Rental", amount: 4000 },
        { name: "Artist Fees", amount: 2500 },
        { name: "Opening Event", amount: 1000 },
        { name: "Promotion", amount: 500 }
      ]
    }
  },
  {
    id: "mobile-app",
    title: "Wellness Mobile App",
    description: "Develop and launch a mindfulness app with guided meditations",
    type: "Tech",
    icon: <Code className="w-5 h-5" />,
    budget: "$45,000",
    teamSize: 5,
    tags: ["App", "Wellness", "Startup"],
    example: {
      projectIdea: "Building 'MindfulMoments' - a mobile app offering personalized meditation sessions, sleep stories, and anxiety management tools for busy professionals.",
      roles: [
        { name: "Founder/Product Manager", percent: 35 },
        { name: "Lead Developer", percent: 30 },
        { name: "UI/UX Designer", percent: 20 },
        { name: "Content Creator", percent: 15 }
      ],
      expenses: [
        { name: "Development", amount: 30000 },
        { name: "Design & Assets", amount: 8000 },
        { name: "App Store Fees", amount: 2000 },
        { name: "Initial Marketing", amount: 5000 }
      ]
    }
  }
];

interface DemoProjectsInspirationProps {
  onSelectDemo: (demo: DemoProject) => void;
}

export const DemoProjectsInspiration: React.FC<DemoProjectsInspirationProps> = ({
  onSelectDemo,
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-text">
          Need Inspiration? Start with a Template
        </h3>
        <p className="text-sm text-text/70">
          Choose from these popular project types to get started quickly
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demoProjects.map((project) => (
          <Card key={project.id} className="border-border hover:border-accent/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  {project.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-text">{project.title}</h4>
                  <p className="text-sm text-text/70 mt-1">{project.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-text/60 mb-3">
                <span>Budget: {project.budget}</span>
                <span>Team: {project.teamSize} people</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-background border border-border rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onSelectDemo(project)}
              >
                Use This Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-4">
        <p className="text-xs text-text/50">
          Templates provide example content that you can customize for your project
        </p>
      </div>
    </div>
  );
};
