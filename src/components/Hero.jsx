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
      <div className="flex gap-10 justify-center">
        <button className="bg-Primary text-white px-6 py-2 rounded-full mr-2 text-black hover:bg-white hover:border-2 cursor-pointer hover:border-Primary hover:scale-110 transition-all duration-300 hover:text-black">
          Find Parking
        </button>
        <button className=" border-2 border-Primary px-6 py-2 rounded-full text-black font-semibold hover:bg-Primary cursor-pointer hover:text-white hover:scale-110 transition-all duration-300">
          Reserve a Spot
        </button>
      </div>
    </div>
    </section>
  );
};

export default Hero;
