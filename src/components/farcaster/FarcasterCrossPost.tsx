
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Send, Image, Link, Hash, Calendar } from 'lucide-react';

interface CrossPostProps {
  projectId: string;
  projectTitle: string;
  projectType: string;
  dropUrl: string;
  defaultMessage?: string;
}

export function FarcasterCrossPost({ 
  projectId, 
  projectTitle, 
  projectType, 
  dropUrl,
  defaultMessage 
}: CrossPostProps) {
  const [castText, setCastText] = useState(
    defaultMessage || 
    `🚀 Just launched my new ${projectType.toLowerCase()} drop: "${projectTitle}"!\n\nCheck it out and support the project 👇`
  );
  const [includeFrame, setIncludeFrame] = useState(true);
  const [includeImage, setIncludeImage] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const { toast } = useToast();

  const characterLimit = 320;
  const charactersUsed = castText.length;
  const charactersRemaining = characterLimit - charactersUsed;

  const handlePost = async () => {
    if (charactersUsed > characterLimit) {
      toast({
        title: "Cast too long",
        description: `Please reduce your cast by ${Math.abs(charactersRemaining)} characters.`,
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);

    try {
      // Simulate API call to post to Farcaster
      await new Promise(resolve => setTimeout(resolve, 2000));

      const castData = {
        text: castText,
        embeds: [
          ...(includeFrame ? [{ url: `${window.location.origin}/frame/${projectId}` }] : []),
          ...(includeImage ? [{ url: `${window.location.origin}/api/og/${projectId}` }] : [])
        ]
      };

      console.log('Posting to Farcaster:', castData);

      toast({
        title: scheduled ? "Cast Scheduled!" : "Cast Posted!",
        description: scheduled 
          ? "Your cast has been scheduled and will be posted automatically."
          : "Your drop has been shared to Farcaster successfully!",
      });

      // Reset form
      setCastText('');

    } catch (error) {
      toast({
        title: "Failed to post",
        description: "There was an error posting to Farcaster. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const addEmoji = (emoji: string) => {
    setCastText(prev => prev + emoji);
  };

  const quickTemplates = [
    "🚀 New drop is live!",
    "🎨 Fresh creative content",
    "💎 Limited edition available",
    "🔥 Don't miss out!",
    "⚡ Lightning launch"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Cross-post to Farcaster
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cast Composer */}
        <div className="space-y-2">
          <Textarea
            placeholder="What's happening with your drop?"
            value={castText}
            onChange={(e) => setCastText(e.target.value)}
            className="min-h-24 resize-none"
          />
          
          <div className="flex justify-between items-center text-sm">
            <div className={`${charactersRemaining < 0 ? 'text-red-500' : 'text-text/70'}`}>
              {charactersRemaining} characters remaining
            </div>
            <div className="text-text/70">
              {charactersUsed}/{characterLimit}
            </div>
          </div>
        </div>

        {/* Quick Templates */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Quick Templates:</label>
          <div className="flex flex-wrap gap-1">
            {quickTemplates.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setCastText(template + '\n\n' + dropUrl)}
                className="text-xs"
              >
                {template}
              </Button>
            ))}
          </div>
        </div>

        {/* Emoji Shortcuts */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Quick Emojis:</label>
          <div className="flex gap-1">
            {['🚀', '🎨', '💎', '🔥', '⚡', '🎯', '💪', '🌟'].map((emoji) => (
              <Button
                key={emoji}
                variant="outline"
                size="sm"
                onClick={() => addEmoji(emoji)}
                className="w-8 h-8 p-0"
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>

        {/* Post Options */}
        <div className="space-y-3 border-t pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              <span className="text-sm">Include interactive frame</span>
            </div>
            <Switch checked={includeFrame} onCheckedChange={setIncludeFrame} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              <span className="text-sm">Include preview image</span>
            </div>
            <Switch checked={includeImage} onCheckedChange={setIncludeImage} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Schedule for later</span>
            </div>
            <Switch checked={scheduled} onCheckedChange={setScheduled} />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-surface/50 rounded-lg p-3 border">
          <div className="text-sm font-medium mb-2">Preview:</div>
          <div className="text-sm whitespace-pre-wrap">{castText || "Your cast will appear here..."}</div>
          
          {includeFrame && (
            <Badge variant="outline" className="mt-2 mr-2">
              <Link className="w-3 h-3 mr-1" />
              Interactive Frame
            </Badge>
          )}
          
          {includeImage && (
            <Badge variant="outline" className="mt-2">
              <Image className="w-3 h-3 mr-1" />
              Preview Image
            </Badge>
          )}
        </div>

        {/* Post Button */}
        <Button
          onClick={handlePost}
          disabled={isPosting || !castText.trim() || charactersUsed > characterLimit}
          className="w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          {isPosting ? "Posting..." : scheduled ? "Schedule Cast" : "Post to Farcaster"}
        </Button>
      </CardContent>
    </Card>
  );
}
