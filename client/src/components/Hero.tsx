import { useNavigate } from 'react-router-dom'

function Hero() {
    const navigate = useNavigate();

    return (
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Your Unified Event Ecosystem</h1>
            <p className="text-xl mb-8">Streamline event planning, team collaboration, and real-time event discovery.</p>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-white text-purple-600 px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-100"
            >
              Get Started
            </button>
          </div>
        </section>  
      );
}

export default Hero