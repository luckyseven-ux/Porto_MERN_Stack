import React ,{useState,useEffect} from "react";

const Carousel = ({images}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    const first=currentIndex ===0;
    const newindex =first ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newindex);

  }
  const next = () => {
    const last=currentIndex === images.length - 1;
    const newindex =last ? 0 : currentIndex + 1;
    setCurrentIndex(newindex);
  }
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]); 

  const slide=(index)=>{
    setCurrentIndex(index);
  }

    return (
      <div className="relative w-full max-w-screen-lg mx-auto mt-8 mb-9 overflow-hidden">
  <div
    className="flex transition-transform duration-700 ease-in-out"
    style={{
      width: `${images.length * 100}%`, // Lebar total container sesuai jumlah gambar
      transform: `translateX(-${currentIndex * (100 / images.length)}%)`, // Menggeser sesuai dengan indeks gambar
    }}
  >
    {images.map((image, index) => (
      <div key={index} style={{ width: `${100 / images.length}%` }}> {/* Setiap gambar mengambil proporsi yang sama */}
        <img
          src={image}
          alt={`Slide ${index}`}
          className="w-full h-64 object-cover"
        />
      </div>
    ))}
  </div>
  <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-4">
    <button onClick={prev} className="text-2xl text-white opacity-80">❮</button>
    <button onClick={next} className="text-2xl text-white opacity-80">❯</button>
  </div>
  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
    {images.map((_, index) => (
      <button
        key={index}
        onClick={() => slide(index)}
        className={`h-2 w-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-400'}`}
      />
    ))}
  </div>
</div>
    )}

    export default Carousel;