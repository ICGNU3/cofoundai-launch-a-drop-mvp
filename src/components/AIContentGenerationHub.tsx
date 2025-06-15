
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, FileText, Sparkles, Wand2 } from "lucide-react";
import { AICoverArtGenerator } from "./AICoverArtGenerator";
import { AICopyGenerator } from "./AICopyGenerator";
import { ContentRefinementTools } from "./ContentRefinementTools";
import { ContentPreviewSuite } from "./ContentPreviewSuite";

interface AIContentGenerationHubProps {
  projectIdea: string;
  projectType: string;
  onContentGenerated?: (content: any) => void;
}

export const AIContentGenerationHub: React.FC<AIContentGenerationHubProps> = ({
  projectIdea,
  projectType,
  onContentGenerated,
}) => {
  const [activeTab, setActiveTab] = useState("cover-art");
  const [generatedContent, setGeneratedContent] = useState<{
    coverArt?: any;
    copy?: any;
    refinements?: any;
  }>({});

  const handleContentUpdate = (type: string, content: any) => {
    const updated = { ...generatedContent, [type]: content };
    setGeneratedContent(updated);
    onContentGenerated?.(updated);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          AI-Powered Content Generation Suite
        </h2>
        <p className="text-body-text/70">
          Create professional marketing assets with advanced AI tools
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cover-art" className="flex items-center gap-2">
            <Palette size={16} />
            Cover Art
          </TabsTrigger>
          <TabsTrigger value="copy" className="flex items-center gap-2">
            <FileText size={16} />
            Marketing Copy
          </TabsTrigger>
          <TabsTrigger value="refinement" className="flex items-center gap-2">
            <Wand2 size={16} />
            Refinement
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Sparkles size={16} />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cover-art" className="mt-6">
          <AICoverArtGenerator
            projectIdea={projectIdea}
            projectType={projectType}
            onArtGenerated={(art) => handleContentUpdate('coverArt', art)}
          />
        </TabsContent>

        <TabsContent value="copy" className="mt-6">
          <AICopyGenerator
            projectIdea={projectIdea}
            projectType={projectType}
            onCopyGenerated={(copy) => handleContentUpdate('copy', copy)}
          />
        </TabsContent>

        <TabsContent value="refinement" className="mt-6">
          <ContentRefinementTools
            content={generatedContent}
            onContentRefined={(refined) => handleContentUpdate('refinements', refined)}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <ContentPreviewSuite
            content={generatedContent}
            projectIdea={projectIdea}
            projectType={projectType}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
