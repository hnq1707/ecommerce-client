'use client';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MapPin, Plus } from 'lucide-react';
import { Address } from '@/lib/type/Address';
import { Button } from '../ui/button';
import { AddAddressDialog } from './AddAddressDialog';
import { useState } from 'react';

interface AddressSelectionProps {
  addresses: Address[];
  selectedAddressId: string;
  onSelectAddress: (addressId: string) => void;
  onAddressAdded: () => void;
}

export function AddressSelection({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddressAdded
}: AddressSelectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  if (addresses.length === 0) {
    return (
      <div className="text-center p-6 border rounded-md">
        <p className="text-muted-foreground mb-4">Không tìm thấy địa chỉ. Vui lòng thêm địa chỉ.</p>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm địa chỉ mới
        </Button>
        <AddAddressDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddressAdded={onAddressAdded}/>
      </div>
    );
  }
  return (
    <RadioGroup value={selectedAddressId} onValueChange={onSelectAddress} className="space-y-3">
      {addresses.map((address) => (
        <div key={address.id} className="flex items-start space-x-2 border rounded-md p-4">
          <RadioGroupItem value={address.id} id={`address-${address.id}`} className="mt-1" />
          <Label htmlFor={`address-${address.id}`} className="flex-1 cursor-pointer">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{address.street}</p>
                <p className="text-sm text-muted-foreground">
                  {address.district}, {address.city} {address.zipCode}
                </p>
              </div>
            </div>
          </Label>
        </div>
      ))}
      <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Thêm địa chỉ mới
      </Button>
      <AddAddressDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddressAdded={onAddressAdded} />
    </RadioGroup>
  );
}
