import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import NavBar from './components/NavBar'
import Shop from './components/Shop'
import CartSummary from './components/CartSummary'
import './App.css'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavBar />
        <main className="app-layout">
          <Shop />
          <CartSummary />
        </main>
      </CartProvider>
    </AuthProvider>
  )
}
