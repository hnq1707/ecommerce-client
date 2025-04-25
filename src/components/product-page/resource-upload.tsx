'use client';

import type React from 'react';
import { useRef, useState } from 'react';
import { Upload, X, ImageIcon, FileIcon, VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import type { Resource } from '@/lib/types/Resource';

interface ResourceUploaderProps {
  resources: Resource[];
  onResourcesChange: (resources: Resource[]) => void;
  onThumbnailChange?: (thumbnailUrl: string) => void;
  currentThumbnail?: string;
}

// Hàm upload tài nguyên lên API
const uploadResource = async (file: File): Promise<string> => {
  // Tạo FormData để gửi file
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Gọi API upload tài nguyên
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

    

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();

    // Trả về URL từ API
    return data.filePath;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export function ResourceUploader({
  resources,
  onResourcesChange,
  onThumbnailChange,
  currentThumbnail,
}: ResourceUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingResources, setUploadingResources] = useState<{
    [key: string]: { progress: number; status: 'uploading' | 'success' | 'error' };
  }>({});

  // Hiển thị icon cho loại tài nguyên
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4 text-blue-500" />;
      case 'video':
        return <VideoIcon className="h-4 w-4 text-red-500" />;
      default:
        return <FileIcon className="h-4 w-4 text-gray-500" />;
    }
  };
  // Xử lý upload file tài nguyên
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Xử lý upload từng file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = crypto.randomUUID();

      // Cập nhật state để hiển thị tiến trình upload
      setUploadingResources((prev) => ({
        ...prev,
        [fileId]: { progress: 0, status: 'uploading' },
      }));

      try {
        // Cập nhật tiến trình upload
        const updateProgress = (progress: number) => {
          setUploadingResources((prev) => ({
            ...prev,
            [fileId]: { ...prev[fileId], progress },
          }));
        };

        // Giả lập tiến trình upload
        for (let progress = 0; progress <= 100; progress += 10) {
          updateProgress(progress);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Upload file lên API và nhận về URL
        const url = await uploadResource(file);

        // Cập nhật state để hiển thị upload thành công
        setUploadingResources((prev) => ({
          ...prev,
          [fileId]: { progress: 100, status: 'success' },
        }));

        // Xác định loại tài nguyên từ file
        const fileType = file.type.startsWith('image/')
          ? 'image'
          : file.type.startsWith('video/')
          ? 'video'
          : 'document';

        // Tạo resource mới
        const newResource: Resource = {
          id: fileId.toString(),
          name: file.name,
          url: url,
          type: fileType,
          isPrimary: false,
        };

        // Thêm resource vào danh sách
        const updatedResources = [...resources, newResource];
        onResourcesChange(updatedResources);

        // Nếu là ảnh đầu tiên và không có thumbnail, đặt làm thumbnail
        if (fileType === 'image' && !currentThumbnail && onThumbnailChange) {
          onThumbnailChange(url);
        }

        // Thông báo upload thành công
        toast({
          title: 'Upload thành công',
          description: `Đã tải lên file "${file.name}".`,
        });

        // Xóa thông tin tiến trình sau 2 giây
        setTimeout(() => {
          setUploadingResources((prev) => {
            const newState = { ...prev };
            delete newState[fileId];
            return newState;
          });
        }, 2000);
      } catch (error) {
        console.error('Error uploading file:', error);

        // Cập nhật state để hiển thị upload thất bại
        setUploadingResources((prev) => ({
          ...prev,
          [fileId]: { progress: 100, status: 'error' },
        }));

        // Thông báo upload thất bại
        toast({
          title: 'Lỗi upload',
          description: `Không thể tải lên file "${file.name}".`,
          variant: 'destructive',
        });

        // Xóa thông tin tiến trình sau 3 giây
        setTimeout(() => {
          setUploadingResources((prev) => {
            const newState = { ...prev };
            delete newState[fileId];
            return newState;
          });
        }, 3000);
      }
    }

    // Reset input file
    event.target.value = '';
  };

  // Xử lý khi đánh dấu resource là primary
  const handleSetPrimary = (index: number, checked: boolean) => {
    if (!checked) return;

    const updatedResources = resources.map((res, i) => ({
      ...res,
      isPrimary: i === index,
    }));

    onResourcesChange(updatedResources);

    // Nếu là ảnh và được đánh dấu là primary, cập nhật thumbnail
    const resource = resources[index];
    if (resource.type === 'image' && onThumbnailChange) {
      onThumbnailChange(resource.url);
    }
  };

  // Xử lý xóa resource
  const handleDeleteResource = (index: number) => {
    const updatedResources = [...resources];
    updatedResources.splice(index, 1);
    onResourcesChange(updatedResources);
  };

  return (
    <div className="space-y-4">
      {/* Input file ẩn để upload tài nguyên */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,application/pdf"
        multiple
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Nút upload và thông tin */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
          <Upload className="h-4 w-4" />
          Tải lên file
        </Button>
        <p className="text-sm text-muted-foreground">
          Hỗ trợ: JPG, PNG, GIF, PDF, MP4 (tối đa 10MB)
        </p>
      </div>

      {/* Hiển thị tiến trình upload */}
      {Object.entries(uploadingResources).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadingResources).map(([id, { progress, status }]) => (
            <div key={id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Đang tải lên...</span>
                <span className={status === 'error' ? 'text-red-500' : ''}>{progress}%</span>
              </div>
              <Progress value={progress} className={status === 'error' ? 'bg-red-200' : ''} />
            </div>
          ))}
        </div>
      )}

      {/* Danh sách tài nguyên đã upload */}
      {resources.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {resources.map((resource, index) => (
            <div key={index} className="flex items-start gap-4 p-4 border rounded-md">
              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                {resource.type === 'image' ? (
                  <Image
                    src={resource.url || '/placeholder.svg'}
                    alt={resource.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  getResourceIcon(resource.type)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {getResourceIcon(resource.type)}
                  <span className="font-medium text-sm truncate">{resource.name}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-1">{resource.url}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <Checkbox
                      id={`resource-primary-${index}`}
                      checked={resource.isPrimary}
                      onCheckedChange={(checked) => handleSetPrimary(index, !!checked)}
                    />
                    <Label htmlFor={`resource-primary-${index}`} className="text-xs">
                      Chính
                    </Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => handleDeleteResource(index)}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Xóa
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hiển thị khi chưa có tài nguyên nào */}
      {resources.length === 0 && !Object.keys(uploadingResources).length && (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200 mt-4">
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-base font-medium text-gray-700 mb-2">Chưa có tài nguyên nào</h3>
          <p className="text-center text-gray-600 mb-4 text-sm">
            Tải lên hình ảnh hoặc tài liệu của sản phẩm
          </p>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Tải lên file
          </Button>
        </div>
      )}
    </div>
  );
}
