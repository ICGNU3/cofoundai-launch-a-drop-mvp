
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AccentButton } from "@/components/ui/AccentButton";
import { Upload, Wand2, RefreshCw, Download, Eye, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AICoverArtGeneratorProps {
  projectIdea: string;
  projectType: string;
  onArtGenerated: (art: any) => void;
}

export const AICoverArtGenerator: React.FC<AICoverArtGeneratorProps> = ({
  projectIdea,
  projectType,
  onArtGenerated,
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("photorealistic");
  const [theme, setTheme] = useState("modern");
  const [colorPalette, setColorPalette] = useState("vibrant");
  const [moodBoard, setMoodBoard] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [refinementPrompt, setRefinementPrompt] = useState("");

  const artisticStyles = [
    { value: "photorealistic", label: "Photorealistic" },
    { value: "digital-art", label: "Digital Art" },
    { value: "oil-painting", label: "Oil Painting" },
    { value: "watercolor", label: "Watercolor" },
    { value: "vector", label: "Vector Art" },
    { value: "3d-render", label: "3D Render" },
    { value: "minimalist", label: "Minimalist" },
    { value: "grunge", label: "Grunge" },
    { value: "neon", label: "Neon/Cyberpunk" },
    { value: "vintage", label: "Vintage" },
  ];

  const themes = [
    { value: "modern", label: "Modern" },
    { value: "retro", label: "Retro" },
    { value: "futuristic", label: "Futuristic" },
    { value: "nature", label: "Nature" },
    { value: "urban", label: "Urban" },
    { value: "abstract", label: "Abstract" },
    { value: "dark", label: "Dark/Moody" },
    { value: "light", label: "Light/Airy" },
  ];

  const colorPalettes = [
    { value: "vibrant", label: "Vibrant" },
    { value: "muted", label: "Muted" },
    { value: "monochrome", label: "Monochrome" },
    { value: "warm", label: "Warm Tones" },
    { value: "cool", label: "Cool Tones" },
    { value: "pastel", label: "Pastel" },
    { value: "neon", label: "Neon" },
    { value: "earth", label: "Earth Tones" },
  ];

  const handleMoodBoardUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setMoodBoard(prev => [...prev, ...files]);
  };

  const generateCoverArt = async () => {
    setIsGenerating(true);
    try {
      // Construct enhanced prompt
      const enhancedPrompt = `${projectIdea} ${prompt}, ${style} style, ${theme} theme, ${colorPalette} color palette, album cover art, high quality, professional`;
      
      // Simulate AI generation (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockImages = [
        {
          id: 1,
          url: "https://via.placeholder.com/400x400/9A4DFF/FFFFFF?text=Generated+Art+1",
          prompt: enhancedPrompt,
          style,
          theme,
          colorPalette,
        },
        {
          id: 2,
          url: "https://via.placeholder.com/400x400/5D5FEF/FFFFFF?text=Generated+Art+2",
          prompt: enhancedPrompt,
          style,
          theme,
          colorPalette,
        },
        {
          id: 3,
          url: "https://via.placeholder.com/400x400/FF6B9D/FFFFFF?text=Generated+Art+3",
          prompt: enhancedPrompt,
          style,
          theme,
          colorPalette,
        },
      ];
      
      setGeneratedImages(mockImages);
      onArtGenerated(mockImages);
      
      toast({
        title: "Cover Art Generated! 🎨",
        description: "Multiple variations have been created for your project.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Please try again with different parameters.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const refineImage = async (image: any) => {
    if (!refinementPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      // Simulate AI refinement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const refinedImage = {
        ...image,
        id: Date.now(),
        url: `https://via.placeholder.com/400x400/00C896/FFFFFF?text=Refined+Art`,
        refinement: refinementPrompt,
      };
      
      setGeneratedImages(prev => [...prev, refinedImage]);
      setRefinementPrompt("");
      
      toast({
        title: "Image Refined! ✨",
        description: "Your refinement has been applied successfully.",
      });
    } catch (error) {
      toast({
        title: "Refinement Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette size={20} />
            Art Generation Controls
          </CardTitle>
          <CardDescription>
            Create stunning cover art with AI-powered generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Detailed Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your vision: colors, mood, elements, composition..."
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Artistic Style</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {artisticStyles.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Theme</label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Color Palette</label>
              <Select value={colorPalette} onValueChange={setColorPalette}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorPalettes.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Mood Board (Optional)</label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleMoodBoardUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload size={16} className="mr-2" />
                Upload Reference Images
              </Button>
              {moodBoard.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {moodBoard.map((file, idx) => (
                    <Badge key={idx} variant="secondary">
                      {file.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <AccentButton
            onClick={generateCoverArt}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 size={16} className="mr-2" />
                Generate Cover Art
              </>
            )}
          </AccentButton>
        </CardContent>
      </Card>

      {/* Generated Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles size={20} />
            Generated Artwork
          </CardTitle>
          <CardDescription>
            Select and refine your perfect cover art
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedImages.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((image) => (
                  <div
                    key={image.id}
                    className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition ${
                      selectedImage?.id === image.id
                        ? "border-accent shadow-lg"
                        : "border-border hover:border-accent/50"
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.url}
                      alt="Generated artwork"
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                      <Eye size={20} className="text-white" />
                    </div>
                  </div>
                ))}
              </div>

              {selectedImage && (
                <div className="space-y-4 p-4 bg-background/50 rounded-lg">
                  <h4 className="font-medium">Refine Selected Image</h4>
                  <div className="flex gap-2">
                    <Input
                      value={refinementPrompt}
                      onChange={(e) => setRefinementPrompt(e.target.value)}
                      placeholder="Make it brighter, add futuristic elements..."
                      className="flex-1"
                    />
                    <Button
                      onClick={() => refineImage(selectedImage)}
                      disabled={isGenerating || !refinementPrompt.trim()}
                    >
                      <Wand2 size={16} />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download size={14} className="mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw size={14} className="mr-1" />
                      Generate Variations
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-body-text/50">
              <Palette size={48} className="mx-auto mb-4 opacity-20" />
              <p>Generate your first cover art to see results here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
