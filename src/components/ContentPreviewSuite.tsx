
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Share2, Download, ExternalLink, Smartphone, Monitor, Tablet } from "lucide-react";

interface ContentPreviewSuiteProps {
  content: any;
  projectIdea: string;
  projectType: string;
}

export const ContentPreviewSuite: React.FC<ContentPreviewSuiteProps> = ({
  content,
  projectIdea,
  projectType,
}) => {
  const [previewMode, setPreviewMode] = useState("desktop");
  const [selectedPlatform, setSelectedPlatform] = useState("twitter");

  const previewModes = [
    { id: "desktop", icon: Monitor, label: "Desktop" },
    { id: "tablet", icon: Tablet, label: "Tablet" },
    { id: "mobile", icon: Smartphone, label: "Mobile" },
  ];

  const platformPreviews = [
    {
      id: "twitter",
      name: "Twitter/X",
      icon: "🐦",
      bgColor: "bg-black",
      textColor: "text-white",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "📸",
      bgColor: "bg-gradient-to-br from-purple-600 to-pink-600",
      textColor: "text-white",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "💼",
      bgColor: "bg-blue-700",
      textColor: "text-white",
    },
    {
      id: "email",
      name: "Email",
      icon: "📧",
      bgColor: "bg-gray-100",
      textColor: "text-gray-900",
    },
  ];

  const getDeviceClasses = () => {
    switch (previewMode) {
      case "mobile":
        return "max-w-sm mx-auto";
      case "tablet":
        return "max-w-2xl mx-auto";
      default:
        return "max-w-4xl mx-auto";
    }
  };

  const renderCoverArtPreview = () => {
    if (!content.coverArt?.length) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Cover Art Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.coverArt.slice(0, 3).map((art: any, idx: number) => (
            <div key={idx} className="relative group">
              <img
                src={art.url}
                alt={`Cover art ${idx + 1}`}
                className="w-full aspect-square object-cover rounded-lg border border-border"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary">
                  <Eye size={14} className="mr-1" />
                  Preview
                </Button>
                <Button size="sm" variant="secondary">
                  <Download size={14} className="mr-1" />
                  Download
                </Button>
              </div>
              <Badge className="absolute top-2 right-2" variant="secondary">
                {art.style}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCopyPreview = () => {
    if (!content.copy?.length) return null;

    const selectedCopy = content.copy.find((c: any) => 
      c.platform === selectedPlatform
    ) || content.copy[0];

    const platformData = platformPreviews.find(p => p.id === selectedPlatform);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Marketing Copy Preview</h3>
          <div className="flex gap-2">
            {platformPreviews.map((platform) => (
              <Button
                key={platform.id}
                variant={selectedPlatform === platform.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatform(platform.id)}
              >
                <span className="mr-1">{platform.icon}</span>
                {platform.name}
              </Button>
            ))}
          </div>
        </div>

        <div className={`${getDeviceClasses()}`}>
          <div className={`${platformData?.bgColor} ${platformData?.textColor} p-6 rounded-lg`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                {platformData?.icon}
              </div>
              <div>
                <div className="font-semibold">Your Project</div>
                <div className="text-sm opacity-75">@yourproject • now</div>
              </div>
            </div>
            
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {selectedCopy?.content || "No content available for this platform"}
            </div>
            
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/20">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Eye size={14} className="mr-1" />
                View
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Share2 size={14} className="mr-1" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ExternalLink size={14} className="mr-1" />
                Open
              </Button>
            </div>
          </div>
        </div>

        {selectedCopy?.metrics && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-green-500">
                {selectedCopy.metrics.readability}%
              </div>
              <div className="text-sm text-body-text/70">Readability</div>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-500">
                {selectedCopy.metrics.engagement}%
              </div>
              <div className="text-sm text-body-text/70">Engagement</div>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-500">
                {selectedCopy.metrics.clarity}%
              </div>
              <div className="text-sm text-body-text/70">Clarity</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Device Preview Controls */}
      <div className="flex items-center justify-center gap-2">
        {previewModes.map((mode) => (
          <Button
            key={mode.id}
            variant={previewMode === mode.id ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode(mode.id)}
          >
            <mode.icon size={14} className="mr-1" />
            {mode.label}
          </Button>
        ))}
      </div>

      {/* Content Previews */}
      <Tabs defaultValue="cover-art" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cover-art">Cover Art</TabsTrigger>
          <TabsTrigger value="marketing-copy">Marketing Copy</TabsTrigger>
        </TabsList>

        <TabsContent value="cover-art" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cover Art Preview</CardTitle>
              <CardDescription>
                See how your generated artwork looks across different contexts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderCoverArtPreview()}
              {!content.coverArt?.length && (
                <div className="text-center py-8 text-body-text/50">
                  <Eye size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Generate cover art to see preview here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing-copy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Copy Preview</CardTitle>
              <CardDescription>
                Preview how your copy appears on different platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderCopyPreview()}
              {!content.copy?.length && (
                <div className="text-center py-8 text-body-text/50">
                  <FileText size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Generate marketing copy to see preview here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
