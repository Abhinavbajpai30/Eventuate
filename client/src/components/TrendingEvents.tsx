function TrendingEvents() {
    const events = [
        { id: 1, name: 'Tech Conference 2025', date: 'May 15, 2025', location: 'Gurugram', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsbP1SjH7EkE1TXIwAcnjd0wZOTem0iIlysA&s' },
        { id: 2, name: 'Music Festival', date: 'June 5, 2025', location: 'New Delhi', image: 'https://theindianmusicdiaries.com/wp-content/smush-webp/2024/12/Supersonic.jpg.webp' },
        { id: 3, name: 'Art Exhibition', date: 'June 20, 2025', location: 'Noida', image: 'https://images.stockcake.com/public/2/3/9/2397d77f-af92-4b51-8bb9-d60d138cf4d0_large/vibrant-art-exhibition-stockcake.jpg' },
      ];
    
      return (
        <section id="events" className="py-16 bg-gray-100">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-8">Trending Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.map(event => (
                <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={event.image} alt={event.name} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                    <p className="text-gray-600 mb-1">{event.date}</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
}

export default TrendingEvents