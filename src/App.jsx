import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import NavBar from './components/NavBar'
import Shop from './components/Shop'
import CartSummary from './components/CartSummary'
import SearchBox from './components/SearchBox'
import LoginForm from './components/LoginForm'
import './App.css'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavBar />
        <main className="app-layout">
          <div className="left-col">
            <SearchBox />
            <Shop />
            <LoginForm />
          </div>
          <CartSummary />
        </main>
      </CartProvider>
    </AuthProvider>
  )
}
