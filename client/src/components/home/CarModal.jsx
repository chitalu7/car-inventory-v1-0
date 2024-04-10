import { AiOutlineClose } from "react-icons/ai";
import { PiBookOpenTextLight } from "react-icons/pi";
import { BiUserCircle } from "react-icons/bi";

const CarModal = ({ car, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
      <div onClick={(event) => event.stopPropagation()} 
        className="w-11/12 md:w-auto h-auto bg-white rounded-xl p-4 flex flex-col relative m-4 max-w-lg md:max-w-xl lg:max-w-2xl">

        <AiOutlineClose className="absolute right-6 top-6 text-3xl text-red-600 cursor-pointer"
          onClick={onClose}/>

        <div className="mb-4 mx-auto w-auto">
          <p><b>Overview</b></p>
        </div>

        {/* Car Image Display */}
        {car.imageUrl && (
          <img
            src={car.imageUrl}
            alt={`${car.make} ${car.brand}`}
            className="mb-4 max-h-60 mx-auto w-auto object-cover rounded"
          />
        )}

        <h4 className="my-2 text-gray-500"><b>VIN#:</b> {car._id}</h4>

        <div className="flex justify-start items-center gap-x-2">
          <PiBookOpenTextLight className="text-red-300 text-2xl" />
          <h2 className="my-1">{car.make}</h2>
        </div>

        <div className="flex justify-start items-center gap-x-2">
          <BiUserCircle className="text-red-300 text-2xl" />
          <h2 className="my-1">{car.brand}</h2>
        </div>

        <div className="flex justify-start items-center gap-x-2">
          <BiUserCircle className="text-red-300 text-2xl" />
          <h2 className="my-1">{car.year}</h2>
        </div>

        <div>
          <p><b>About the {car.brand} {car.make}</b></p>
          <p>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          </p>
        </div>
        
      

      </div>        
    </div>
  )
}

export default CarModal;
