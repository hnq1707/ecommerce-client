/* eslint-disable @typescript-eslint/no-explicit-any */
// Định nghĩa các kiểu dữ liệu từ API
interface Province {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
}

interface District {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
}

interface Ward {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  district_code: number;
}

// Lấy danh sách tỉnh/thành phố
export async function getProvinces(): Promise<Province[]> {
  try {
    const response = await fetch('https://provinces.open-api.vn/api/p/');
    if (!response.ok) {
      throw new Error('Không thể lấy danh sách tỉnh/thành phố');
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
    throw error;
  }
}

// Lấy danh sách quận/huyện theo tỉnh/thành phố
export async function getDistricts(provinceCode: number): Promise<District[]> {
  try {
    const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
    if (!response.ok) {
      throw new Error('Không thể lấy danh sách quận/huyện');
    }
    const data = await response.json();
    return data.districts || [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách quận/huyện:', error);
    throw error;
  }
}

// Lấy danh sách phường/xã theo quận/huyện
export async function getWards(districtCode: number): Promise<Ward[]> {
  try {
    const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
    if (!response.ok) {
      throw new Error('Không thể lấy danh sách phường/xã');
    }
    const data = await response.json();
    return data.wards || [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phường/xã:', error);
    throw error;
  }
}

// Tìm kiếm địa chỉ
export async function searchAddress(query: string): Promise<any[]> {
  try {
    // Tìm kiếm tỉnh/thành phố
    const provinceResponse = await fetch(
      `https://provinces.open-api.vn/api/p/search/?q=${encodeURIComponent(query)}`,
    );
    if (!provinceResponse.ok) {
      throw new Error('Không thể tìm kiếm tỉnh/thành phố');
    }
    const provinces = await provinceResponse.json();

    // Tìm kiếm quận/huyện
    const districtResponse = await fetch(
      `https://provinces.open-api.vn/api/d/search/?q=${encodeURIComponent(query)}`,
    );
    if (!districtResponse.ok) {
      throw new Error('Không thể tìm kiếm quận/huyện');
    }
    const districts = await districtResponse.json();

    // Tìm kiếm phường/xã
    const wardResponse = await fetch(
      `https://provinces.open-api.vn/api/w/search/?q=${encodeURIComponent(query)}`,
    );
    if (!wardResponse.ok) {
      throw new Error('Không thể tìm kiếm phường/xã');
    }
    const wards = await wardResponse.json();

    // Kết hợp kết quả
    return [
      ...provinces.map((p: any) => ({ ...p, type: 'province' })),
      ...districts.map((d: any) => ({ ...d, type: 'district' })),
      ...wards.map((w: any) => ({ ...w, type: 'ward' })),
    ];
  } catch (error) {
    console.error('Lỗi khi tìm kiếm địa chỉ:', error);
    throw error;
  }
}

// Lấy thông tin chi tiết của một tỉnh/thành phố
export async function getProvinceDetail(provinceCode: number): Promise<Province> {
  try {
    const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}`);
    if (!response.ok) {
      throw new Error('Không thể lấy thông tin tỉnh/thành phố');
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy thông tin tỉnh/thành phố:', error);
    throw error;
  }
}

// Lấy thông tin chi tiết của một quận/huyện
export async function getDistrictDetail(districtCode: number): Promise<District> {
  try {
    const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}`);
    if (!response.ok) {
      throw new Error('Không thể lấy thông tin quận/huyện');
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy thông tin quận/huyện:', error);
    throw error;
  }
}

// Lấy thông tin chi tiết của một phường/xã
export async function getWardDetail(wardCode: number): Promise<Ward> {
  try {
    const response = await fetch(`https://provinces.open-api.vn/api/w/${wardCode}`);
    if (!response.ok) {
      throw new Error('Không thể lấy thông tin phường/xã');
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy thông tin phường/xã:', error);
    throw error;
  }
}
