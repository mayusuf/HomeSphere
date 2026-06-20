import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import UserSidebar from '@/components/layout/UserSidebar'
import ToastContainer from '@/components/ui/Toast'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8 w-full">
        <UserSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <Footer />
    </>
  )
}
