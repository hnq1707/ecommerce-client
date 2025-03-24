'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, ExternalLink } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Store {
  id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  hours: string;
  phone: string;
  mapUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const stores: Store[] = [
  {
    id: '1',
    name: 'HNQ 02 CHÙA BỘC',
    address: 'Số 02 Chùa Bộc, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    city: 'Hà Nội',
    hours: '8:30 - 22:00',
    phone: '097 640 8388',
    mapUrl: 'https://maps.google.com/?q=21.0065,105.8306',
    coordinates: {
      lat: 21.0065,
      lng: 105.8306,
    },
  },
  {
    id: '2',
    name: 'HNQ 31 YÊN LÃNG',
    address: 'Số 31 Yên Lãng, Quận Đống Đa, TP. Hà Nội',
    district: 'Đống Đa',
    city: 'Hà Nội',
    hours: '8:30 - 22:00',
    phone: '0969963658',
    mapUrl: 'https://maps.google.com/?q=21.0128,105.8203',
    coordinates: {
      lat: 21.0128,
      lng: 105.8203,
    },
  },
  {
    id: '3',
    name: 'HNQ VINCOM ROYAL CITY',
    address: 'Tầng B1, TTTM Vincom Royal City, 72A Nguyễn Trãi, Thanh Xuân, Hà Nội',
    district: 'Thanh Xuân',
    city: 'Hà Nội',
    hours: '10:00 - 22:00',
    phone: '0969963659',
    mapUrl: 'https://maps.google.com/?q=21.0025,105.8156',
    coordinates: {
      lat: 21.0025,
      lng: 105.8156,
    },
  },
  {
    id: '4',
    name: 'HNQ AEON MALL HÀ ĐÔNG',
    address: 'Tầng 1, AEON Mall Hà Đông, Dương Nội, Hà Đông, Hà Nội',
    district: 'Hà Đông',
    city: 'Hà Nội',
    hours: '10:00 - 22:00',
    phone: '0969963660',
    mapUrl: 'https://maps.google.com/?q=20.9839,105.7489',
    coordinates: {
      lat: 20.9839,
      lng: 105.7489,
    },
  },
];

const StoreLocator = () => {
  const [selectedCity, setSelectedCity] = useState<string>('Hà Nội');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [filteredStores, setFilteredStores] = useState<Store[]>(stores);
  const [mapUrl, setMapUrl] = useState<string>('');

  // Lấy danh sách tỉnh thành (city)
  const cities = Array.from(new Set(stores.map((store) => store.city)));

  // Lấy danh sách quận/huyện dựa trên tỉnh thành được chọn
  const districts = Array.from(
    new Set(stores.filter((store) => store.city === selectedCity).map((store) => store.district)),
  );

  // Lọc cửa hàng dựa trên lựa chọn
  useEffect(() => {
    let filtered = stores.filter((store) => store.city === selectedCity);
    if (selectedDistrict && selectedDistrict !== 'all') {
      filtered = filtered.filter((store) => store.district === selectedDistrict);
    }
    setFilteredStores(filtered);

    // Nếu cửa hàng đang chọn không thuộc danh sách mới, chọn cửa hàng đầu tiên
    if (!selectedStore || !filtered.find((store) => store.id === selectedStore.id)) {
      setSelectedStore(filtered.length > 0 ? filtered[0] : null);
    }
  }, [selectedCity, selectedDistrict, selectedStore]);

  // Cập nhật URL bản đồ khi cửa hàng được chọn thay đổi
  useEffect(() => {
    if (selectedStore) {
      const embedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(
        selectedStore.address,
      )}&center=${selectedStore.coordinates.lat},${selectedStore.coordinates.lng}&zoom=16`;
      setMapUrl(embedUrl);
    }
  }, [selectedStore]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Hệ thống cửa hàng</h1>

      <div className="grid md:grid-cols-5 gap-6 lg:gap-8">
        {/* Store Finder Panel */}
        <div className="md:col-span-2 bg-white rounded-xl shadow border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">Tìm cửa hàng</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chọn tỉnh thành
              </label>
              <Select
                value={selectedCity}
                onValueChange={(value) => {
                  setSelectedCity(value);
                  setSelectedDistrict('');
                }}
              >
                <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <SelectValue placeholder="Chọn tỉnh thành" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chọn cửa hàng</label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all" value="all">
                    Tất cả
                  </SelectItem>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className={`p-4 rounded-lg cursor-pointer transition-colors border ${
                  selectedStore?.id === store.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100 border-transparent'
                }`}
              >
                <h3 className="font-semibold text-blue-600">{store.name}</h3>
                <div className="mt-2 space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Giờ: {store.hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{store.phone}</span>
                  </div>
                  <a
                    href={store.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-500 hover:underline mt-1 text-sm"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Xem bản đồ</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Panel */}
        <div className="md:col-span-3 bg-white rounded-xl shadow border border-gray-100 overflow-hidden h-[600px] relative">
          {selectedStore ? (
            <>
              <iframe
                title="Store Location"
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0968448916455!2d${
                  selectedStore.coordinates.lng
                }!3d${
                  selectedStore.coordinates.lat
                }!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd4fcf9dd%3A0x5f168cb5ed0a3108!2s${encodeURIComponent(
                  selectedStore.name,
                )}!5e0!3m2!1sen!2s!4v1679925200928!5m2!1sen!2s`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-md max-w-xs">
                <h3 className="font-semibold text-blue-600 text-sm">{selectedStore.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{selectedStore.address}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Vui lòng chọn cửa hàng để xem bản đồ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
