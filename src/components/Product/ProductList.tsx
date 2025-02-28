import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

const PRODUCT_PER_PAGE = 8;

const ProductList = () => {


  return (
    <>
      <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
        <Link href="/" className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]">
          <div className="relative w-full h-80">
            <Image
              src={'/phone.png'}
              alt=""
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
            />

            <Image
              src="/phone.png"
              alt=""
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md"
            />
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Test</span>
            <span className="font-semibold">Test</span>
          </div>

          <Button className="rounded-2xl ring-1 w-max py-2 px-4 text-xs">
            Add to Cart
          </Button>
        </Link>
      </div>
      
    </>
  );
};

export default ProductList;
