import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AdminSidebar from '@/components/layout/AdminSidebar'
import ToastContainer from '@/components/ui/Toast'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8 w-full">
        <AdminSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <Footer />
    </>
  )
}
