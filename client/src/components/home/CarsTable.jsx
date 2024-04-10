import React from 'react';
import { Link  } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';

const CarsTable = ({ cars }) => {
  return (
    <div>
         <table className='w-full border-separate border-spacing-2'>
            <thead>
              <tr>
                <th className='border boder-slate-600 rounded-md'>#</th>
                <th className='border boder-slate-600 rounded-md'>Make</th>
                {/* <th className='border boder-slate-600 rounded-md max-md:hidden'>Make</th> */}

                <th className='border boder-slate-600 rounded-md'>Brand</th>
                {/* <th className='border boder-slate-600 rounded-md max-md:hidden'>Brand</th> */}

                <th className='border boder-slate-600 rounded-md'>Year</th>
                {/* <th className='border boder-slate-600 rounded-md max-md:hidden'>Year</th> */}

                <th className='border boder-slate-600 rounded-md'>Operations</th>
              </tr>
            </thead>
            
            <tbody>
              {cars.map((car, index) =>(
                <tr key={car._id} className='h-8'>

                  <td className='border boder-slate-700 rounded-md text-center'>
                    {index + 1}
                  </td>

                  <td className='border boder-slate-700 rounded-md text-center'>
                    {car.make}
                  </td>

                  {/* <td className='border boder-slate-700 rounded-md text-center max-md:hidden'>
                    {car.make}
                  </td> */}

                  <td className='border boder-slate-700 rounded-md text-center'>
                    {car.brand}
                  </td>

                  {/* <td className='border boder-slate-700 rounded-md text-center max-md:hidden'>
                    {car.brand}
                  </td> */}

                  <td className='border boder-slate-700 rounded-md text-center'>
                    {car.year}
                  </td>
                  {/* <td className='border boder-slate-700 rounded-md text-center max-md:hidden'>
                    {car.year}
                  </td> */}

                  <td className='border boder-slate-700 rounded-md text-center'>
                    <div className='flex justify-center gap-x-4'>
                      <Link to={`/cars/details/${car._id}`}>
                        <BsInfoCircle className='text-2xl text-green-600' />
                      </Link>

                      <Link to={`/cars/edit/${car._id}`}>
                        <AiOutlineEdit className='text-2xl text-blue-600' />
                      </Link>

                      <Link to={`/cars/delete/${car._id}`}>
                        <MdOutlineDelete className='text-2xl text-red-600' />
                      </Link>
                    </div>
                  </td>                

                </tr>
              ))}
            </tbody>

          </table>
    </div>
  )
}

export default CarsTable