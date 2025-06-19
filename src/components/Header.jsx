
import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/login" className="text-xl font-bold text-gray-800">
          Health Assessment Tool
        </Link>
       
      </div>
    </header>
  )
}

export default Header
