import ChatBot from '@/components/ChatBot'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const Layout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <ChatBot />
      <Footer />
    </div>
  )
}

export default Layout
