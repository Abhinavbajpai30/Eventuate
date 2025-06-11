import React from 'react'

function HowItWorks() {
    const steps = [
        {
          id: 1,
          title: 'Create Your Event',
          description: 'Easily set up and customize your event details, including date, time, location, and ticketing options.',
          image: 'https://images.squarespace-cdn.com/content/v1/60da576b8b440e12699c9263/1721127305865-H0ZWH3ZSIJEI2Z70CF3G/20210915-110858-OVATION-02944%2B%281%29.jpg'
        },
        {
          id: 2,
          title: 'Organize Your Team',
          description: 'Invite collaborators, assign roles, and manage permissions for seamless team coordination.',
          image: 'https://www.shiftbase.com/hs-fs/hubfs/6a0fa8af-1b1a-4f25-aa51-3ae2579d4e95%5B1%5D.jpeg?width=725&name=6a0fa8af-1b1a-4f25-aa51-3ae2579d4e95%5B1%5D.jpeg'
        },
        {
          id: 3,
          title: 'Manage RSVPs & Engage',
          description: 'Track guest confirmations, send smart reminders, and communicate with attendees through integrated chat.',
          image: 'https://www.happywedding.app/blog/wp-content/uploads/2019/03/Perfect-tips-to-welcome-guests-warmly-for-your-wedding.jpg'
        },
        {
          id: 4,
          title: 'Discover & Share Events',
          description: 'Explore trending events in the dynamic feed and share your own happenings with the community.',
          image: 'https://www.oyorooms.com/blog/wp-content/uploads/2018/02/event.jpg'
        },
      ];
    
    return (
        <section id="how-it-works" className="py-16 bg-gray-100">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12">How Eventuate Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map(step => (
                <div key={step.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                  <img src={step.image} alt={step.title} className="w-full h-48 object-cover rounded-md mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
    );
}

export default HowItWorks