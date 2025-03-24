'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Gift, Calendar, Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VoucherPromotion = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-medium mb-3">
            Mua sắm thả ga - Nhận ưu đãi hết g!!!
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Chương trình ưu đãi cực hấp dẫn, chưa từng có dành riêng cho quý khách hàng mua sắm{' '}
            <span className="font-medium">trực tiếp</span> tại hệ thống cửa hàng của{' '}
            <span className="font-bold">HNQ</span>. Sau khi xuất hóa đơn, quý khách được nhận ngay 1
            voucher tới 30% cho lần mua sắm tiếp theo.
          </p>
        </div>

        {/* Promotion Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
            {/* Left side - Image */}
            <div className="relative h-[300px] md:h-auto overflow-hidden bg-red-600">
              <Image
                src="https://file.hstatic.net/200000690725/file/7016_e787c8cdf3b1b34977220ce4b58ec257_8733cd6d628c43199916316faad69722_grande.jpg"
                alt="Gift Voucher 20%"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Right side - Details */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="h-5 w-5 text-red-600" />
                <h2 className="text-xl font-medium">Ưu đãi voucher lên đến 30%</h2>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Calendar className="h-5 w-5 text-gray-500" />
                <p className="text-gray-600">Thời gian: 15 - 27/01/2025</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium">Với mỗi hóa đơn mua sắm từ ngày 15 - 27/01/2025:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-1">
                    <li>
                      Có giá trị từ 1.200.000đ trở lên, Quý khách nhận ngay 1 Voucher giảm giá độc
                      quyền 20%
                    </li>
                    <li>
                      Có giá trị từ 1.700.000đ trở lên, Quý khách nhận ngay 1 Voucher giảm giá độc
                      quyền 30%
                    </li>
                  </ul>
                </div>
              </div>

              <Button
                onClick={() => setExpanded(!expanded)}
                variant="outline"
                className="flex items-center gap-2 w-full justify-center rounded-full"
              >
                {expanded ? (
                  <>
                    Ẩn điều kiện
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Xem điều kiện
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Expandable Terms and Conditions */}
          {expanded && (
            <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 text-gray-500" />
                  <h3 className="font-medium">Điều kiện sử dụng Voucher:</h3>
                </div>

                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-1 mb-6">
                  <li>Áp dụng cho 1 sản phẩm nguyên giá bất kỳ</li>
                  <li>Thời gian áp dụng voucher tới ngày 16/02/2025</li>
                  <li>Không áp dụng đồng thời với các chương trình khuyến mãi khác</li>
                  <li>Mỗi khách hàng chỉ được sử dụng 1 voucher cho 1 lần mua hàng</li>
                </ul>

                <p className="text-gray-700 mb-6">
                  Còn chần chờ gì nữa, đến <span className="font-bold">HNQ</span> gần nhất để thả hồ
                  mua sắm và rinh voucher ngay thôi nào!
                </p>

                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Hệ thống cửa hàng HNQ
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoucherPromotion;
