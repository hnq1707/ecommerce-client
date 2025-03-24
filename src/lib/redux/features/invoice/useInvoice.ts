import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/lib/redux/store';
import { fetchInvoices, fetchInvoiceById, createInvoice } from '@/lib/redux/features/invoice/invoiceSlice';
import { RootState } from '@/lib/redux/store';

type FilterType = 'all' | 'paid' | 'unpaid';

const useInvoices = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { invoices, selectedInvoice, loading, error, currentPage, totalPages, totalItems } =
    useSelector((state: RootState) => state.invoice);

  // Hàm gọi thunk fetchInvoices khi cần
  const getInvoices = (page = 0, size = 10, filter: FilterType = 'all') => {
    dispatch(fetchInvoices({ page, size, filter }));
  };

  // Hàm gọi thunk fetchInvoiceById khi cần lấy chi tiết hóa đơn
  const getInvoiceById = (id: string) => {
    dispatch(fetchInvoiceById(id));
  };
  const createNewInvoice = (orderId: string) => {
    dispatch(createInvoice(orderId));
  };


  return {
    invoices,
    selectedInvoice,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    getInvoices,
    getInvoiceById,
    createNewInvoice
  };
};

export default useInvoices;
