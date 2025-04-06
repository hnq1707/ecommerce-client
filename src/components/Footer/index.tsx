'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const footerLinks = {
    categories: [
      { name: 'Clothing', href: '/list?categoryId=clothing' },
      { name: 'Shoes', href: '/list?categoryId=shoes' },
      { name: 'Accessories', href: '/list?categoryId=accessories' },
      { name: 'New Arrivals', href: '/list?sort=updatedAt%2Cdesc' },
      { name: 'Sale', href: '/list?sale=true' },
    ],
    customerCare: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Shipping', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
      { name: 'Order Status', href: '/order-status' },
      { name: 'Payment Methods', href: '/payment-methods' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
      { name: 'Terms & Conditions', href: '/terms' },
    ],
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Brand Column */}
          <motion.div variants={item} className="space-y-4">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold">HNQ</h2>
            </Link>
            <p className="text-gray-400 text-sm">
              Experience the Sport Outdoors in Style. Discover high-quality gear for your next
              adventure at HNQ.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Facebook size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Instagram size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Youtube size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Twitter size={18} />
              </Button>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div variants={item} className="space-y-4">
            <h3 className="text-lg font-medium">Categories</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Care */}
          <motion.div variants={item} className="space-y-4">
            <h3 className="text-lg font-medium">Customer Care</h3>
            <ul className="space-y-2">
              {footerLinks.customerCare.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={item} className="space-y-4">
            <h3 className="text-lg font-medium">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        

        {/* Bottom Footer */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <div className="mb-4 md:mb-0">
            <p>© 2023 HNQ Studio, Inc. All Rights Reserved</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span>Call Us: +1 (234) 567-8910</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <span>USD $ | English</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
