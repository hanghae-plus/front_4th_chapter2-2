export const AdminCouponManagementWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className='bg-white p-4 rounded shadow'>
    <h2 className='text-2xl font-semibold mb-4'>쿠폰 관리</h2>
    <div className='bg-white p-4 rounded shadow'>{children}</div>
  </div>
);
