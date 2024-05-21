import './App.css';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProductList from './components/ProductList';

function App() {
  return (
    <div className='bg-gray-100'>
      {/* Navbar */}
      <Navbar />
      {/* Banner Slider */}
      <Header />
      {/* Main Content */}
      <main className="container mx-auto mt-8 max-w-screen-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Categories */}
          <Sidebar/>
          {/* Product List */}
          <ProductList/>
        </div>
      </main>
    </div>
  )
}

export default App;
