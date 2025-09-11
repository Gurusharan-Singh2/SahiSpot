const Hero = () => {
  return (
    <section className="text-center py-16 bg-gray-50 min-h-screen flex items-center w-full justify-center ">
    <div className="flex flex-col gap-6 justify-center">
        <h2 className="text-3xl font-semibold mb-4 mt-8">
        Find your Sahi Spot, Anytime, Anywhere.
      </h2>
      <input
        type="text"
        placeholder="Enter your location"
        className="border px-4 py-2 rounded w-full mb-4"
      />
      <div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-full mr-2">
          Find Parking
        </button>
        <button className="bg-gray-200 px-6 py-2 rounded-full">
          Reserve a Spot
        </button>
      </div>
    </div>
    </section>
  );
};

export default Hero;
