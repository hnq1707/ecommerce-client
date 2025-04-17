'use client';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import type { Address } from '@/lib/type/Address';
import { Button } from '@/components/ui/button';
import { AddAddressDialog } from './AddAddressDialog';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface AddressSelectionProps {
  addresses: Address[];
  selectedAddressId: string;
  onSelectAddress: (addressId: string) => void;
  onAddressAdded: () => void;
  onAddressDeleted?: (addressId: string) => void;
  onAddressEdited?: (address: Address) => void;
  onAddressDialogOpen?: () => void; // Thêm prop để thông báo khi dialog mở
  onAddressDialogClose?: () => void; // Thêm prop để thông báo khi dialog đóng
}

export function AddressSelection({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddressAdded,
  onAddressDeleted,
  onAddressEdited,
  onAddressDialogOpen,
  onAddressDialogClose,
}: AddressSelectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Hàm xử lý khi mở dialog
  const handleOpenDialog = () => {
    setIsAddDialogOpen(true);
    if (onAddressDialogOpen) {
      onAddressDialogOpen();
    }
  };

  // Hàm xử lý khi đóng dialog
  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    if (onAddressDialogClose) {
      onAddressDialogClose();
    }
  };

  if (addresses.length === 0) {
    return (
      <div className="text-center p-6 border rounded-md bg-gray-50">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">
          Không tìm thấy địa chỉ. Vui lòng thêm địa chỉ mới.
        </p>
        <Button onClick={handleOpenDialog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm địa chỉ mới
        </Button>
        <AddAddressDialog
          open={isAddDialogOpen}
          onOpenChange={handleCloseDialog}
          onAddressAdded={onAddressAdded}
          onClose={handleCloseDialog}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RadioGroup value={selectedAddressId} onValueChange={onSelectAddress} className="space-y-3">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="flex items-start space-x-2 border rounded-md p-4 hover:border-primary transition-colors"
          >
            <RadioGroupItem value={address.id} id={`address-${address.id}`} className="mt-1" />
            <Label htmlFor={`address-${address.id}`} className="flex-1 cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{address.name}</p>
                      {address.isDefault && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-primary/10 text-primary border-primary/30"
                        >
                          Mặc định
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{address.phoneNumber}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {address.street}, {address.district}, {address.city}{' '}
                      {address.zipCode}
                    </p>
                  </div>
                </div>

                {(onAddressDeleted || onAddressEdited) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                        >
                          <path
                            d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onAddressEdited && (
                        <DropdownMenuItem onClick={() => onAddressEdited(address)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Chỉnh sửa</span>
                        </DropdownMenuItem>
                      )}
                      {onAddressDeleted && (
                        <DropdownMenuItem
                          onClick={() => onAddressDeleted(address.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Xóa</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <Button
        onClick={handleOpenDialog}
        variant="outline"
        className="flex items-center gap-2 mt-4 w-full justify-center"
      >
        <Plus className="h-4 w-4" />
        Thêm địa chỉ mới
      </Button>

      <AddAddressDialog
        open={isAddDialogOpen}
        onOpenChange={handleCloseDialog}
        onAddressAdded={onAddressAdded}
        onClose={handleCloseDialog}
      />
    </div>
  );
}
