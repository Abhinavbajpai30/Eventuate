import React, { useState } from 'react'

function Testimonials() {
    const testimonials = [
        {
          id: 1,
          quote: "Eventuate made planning our conference a breeze! The all-in-one platform saved us so much time and hassle.",
          author: "Sarah K., Conference Organizer"
        },
        {
          id: 2,
          quote: "The team collaboration features are a game-changer. We can easily coordinate tasks and communicate effectively.",
          author: "John D., Event Manager"
        },
        {
          id: 3,
          quote: "Discovering local events has never been easier. The dynamic feed keeps me updated on everything happening around me.",
          author: "Emily R., Event Enthusiast"
        },
    ];

    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentTestimonialIndex((curr) => Math.min(curr+1, testimonials.length-1));
    }

    const prevTestimonial = () => {
        setCurrentTestimonialIndex((curr) => Math.max(curr-1, 0));
    }

    const currentTestimonial = testimonials[currentTestimonialIndex];

    return (
        <section id="testimonials" className="py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">What Our Users Say</h2>
            <div className="bg-gray-100 p-8 rounded-lg shadow-md max-w-2xl mx-auto relative">
              <p className="text-gray-700 italic text-lg mb-6">
                "{currentTestimonial.quote}"
              </p>
              <p className="text-gray-800 font-semibold">- {currentTestimonial.author}</p>
    
              <div className="absolute inset-y-0 left-0 flex items-center">
                <button
                  onClick={prevTestimonial}
                  className="bg-white bg-opacity-50 rounded-full p-2 ml-2 shadow-md hover:bg-opacity-75 focus:outline-none"
                  aria-label="Previous Testimonial"
                >
                  &lt;
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                  onClick={nextTestimonial}
                  className="bg-white bg-opacity-50 rounded-full p-2 mr-2 shadow-md hover:bg-opacity-75 focus:outline-none"
                  aria-label="Next Testimonial"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </section>
      );
}

export default Testimonials