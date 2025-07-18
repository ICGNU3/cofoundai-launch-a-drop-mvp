
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image, Video, Lock } from 'lucide-react';
import { MediaFile } from '@/hooks/useDropBuilder';
import { PaymentGate } from '../PaymentGate';
import { usePayment } from '@/hooks/usePayment';

interface MediaUploadStepProps {
  media: MediaFile[];
  onMediaUpdate: (media: MediaFile[]) => void;
  mediaLimit?: number | null; // null = unlimited
}

export const MediaUploadStep: React.FC<MediaUploadStepProps> = ({
  media,
  onMediaUpdate,
  mediaLimit = null
}) => {
  const { canAccessTier } = usePayment();
  const isAtLimit = mediaLimit !== null && media.length >= mediaLimit;

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;

    const newMedia: MediaFile[] = [];
    const remainingSlots = mediaLimit ? mediaLimit - media.length : files.length;
    
    Array.from(files).slice(0, remainingSlots).forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const preview = URL.createObjectURL(file);
        newMedia.push({
          file,
          preview,
          type: file.type.startsWith('image/') ? 'image' : 'video'
        });
      }
    });

    onMediaUpdate([...media, ...newMedia]);
  }, [media, onMediaUpdate, mediaLimit]);

  const removeMedia = useCallback((index: number) => {
    const newMedia = media.filter((_, i) => i !== index);
    onMediaUpdate(newMedia);
  }, [media, onMediaUpdate]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Upload Your Creative Content</h2>
        <p className="text-gray-600">
          Add images or videos that represent your project
        </p>
        {mediaLimit && (
          <p className="text-sm text-orange-600 mt-2">
            Free tier: {media.length}/{mediaLimit} files used
            {!canAccessTier('pro') && (
              <span className="block text-xs">
                Upgrade to Pro for unlimited uploads
              </span>
            )}
          </p>
        )}
      </div>

      {/* Upload Area */}
      <Card className={`border-dashed border-2 ${
        isAtLimit ? 'border-gray-300 opacity-50' : 'border-gray-300 hover:border-blue-400'
      } transition-colors`}>
        <CardContent className="p-8">
          <div className="text-center">
            {isAtLimit ? (
              <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            ) : (
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            )}
            <h3 className="text-lg font-semibold mb-2">
              {isAtLimit ? 'Upload Limit Reached' : 'Drop files here'}
            </h3>
            <p className="text-gray-500 mb-4">
              {isAtLimit ? (
                'Upgrade to Pro for unlimited uploads'
              ) : (
                'Support for images and videos (JPG, PNG, MP4, MOV)'
              )}
            </p>
            
            {!isAtLimit && (
              <>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="media-upload"
                />
                <Button asChild>
                  <label htmlFor="media-upload" className="cursor-pointer">
                    Choose Files
                  </label>
                </Button>
              </>
            )}

            {isAtLimit && !canAccessTier('pro') && (
              <PaymentGate 
                requiredTier="pro" 
                featureName="Unlimited Media Uploads"
              >
                <></>
              </PaymentGate>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Media Preview */}
      {media.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Uploaded Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((item, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-4">
                  <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                    {item.type === 'image' ? (
                      <img
                        src={item.preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={item.preview}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeMedia(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {item.type === 'image' ? (
                      <Image className="w-4 h-4" />
                    ) : (
                      <Video className="w-4 h-4" />
                    )}
                    <span className="text-sm text-gray-600 truncate">
                      {item.file.name}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
