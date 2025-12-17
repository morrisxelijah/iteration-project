/* When you click on one of the trips on the home page, this expands the information there and lets you see
the full details of the trip, including where to, the people involved, and how paid off it is */

// import { Button } from '../components/components/Buttons';
import { ChevronLeft, Plus } from 'lucide-react';
// import { Link, Outlet } from 'react-router-dom';
import trips from '../../databases/trips.json' assert { type: 'json' };

const Details = ({ tripID }) => {
  const trip = trips.find((t) => t.id === tripID);

  if (!trip) return <p>Trip not found.</p>;

  return (
    <>
      <h2>Trip to {trip.destination}</h2>
      <p>{trip.people.length} members</p>
      <p>Budget: ${trip.budget}</p>

      <h3>Memebers</h3>
      <ul>
        {trip.people.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </>
  );
};

export default Details;

//do we also have to think about state here? ... or are we fine with hardcoding info?
// export const GroupTripDetails = () => {
//   return (
//     <div>
//       <div className="relative w-full text-xl ">
//         <Link to="/" className="absolute left px-4 py-2 pt-4 ">
//           <ChevronLeft />
//         </Link>
//         <h1 className="text-center font-medium pt-4">Adventure Details</h1>
//       </div>
//       <div className="border-none">
//         <h1 className="pl-4 font-bold pt-4 text-[19px]">Trip to California</h1>
//         <h2 className="text-4 mb-4 px-4 pl-4 text-[14px] font-medium text-grey-400">
//           5 members
//         </h2>
//       </div>
//       <div className="flex flex-col items-center w-full mt-4">
//         <div className="flex gap-2 justify-center w-full">
//           <Button
//             className="flex items-center gap-2 bg-[#3A7FE5] text-white px-4 py-2 rounded font-bold w-35 justify-center"
//             name="Expenses"
//             variant="ho"
//             isActive={true}
//             onClick={() => console.log('Button Click Success!')}
//             route={'expenses'}
//           />
//           <Button
//             className="flex items-center gap-2 bg-[#3A7FE5] text-white px-4 py-2 rounded font-bold w-35 justify-center"
//             name="Balances"
//             variant="ho"
//             isActive={true}
//             onClick={() => console.log('Button Click Success!')}
//             route={'balances'}
//           />
//           {/* by clicking on balances will we route to a new page toe list balance info?... more routing required? And should another page be -esm */}
//         </div>
//         <Outlet />
//       </div>
//       <Link to="/adventure-details">
//         <div className="flex justify-center items-center  bg-[#3A7FE5] w-15 h-15 rounded-[30px] ml-70 mt-40 text-white ">
//           <Plus />
//         </div>
//       </Link>
//     </div>
//   );
// };

// import { Link } from 'react-router-dom';
// import { Button } from '../components/components/Buttons';
// import { ChevronLeft, Plus } from 'lucide-react';
// import { useState } from 'react';

// //do we need to input state here since we're taking in data? - esm
// //import {useState} from "react"
// //context API is a thing: The Context API provides a way to pass data deeply through the component tree without explicitly passing props down at every level (prop drilling).
// // You create a Context and a Provider component that holds the state.
// // Consumer components within the Provider's scope can access the context value using useContext

// export const CreateNewGroup = () => {
//   //we need to create state to hold the input value
//   const [adventureName, setAdventureName] = useState(''); //state to hold the input value
//   // const navigate = useNavigate();//maybe we need this to route to the next page after creating a group - esm
//   const handleSubmit = () => {
//     //function to handle the form submission

//     console.log('Adventure Name: ', adventureName);
//     //after submitting, we can navigate to the next page
//     //navigate("/trip-name"); //route to the trip name page after creating a group - esm
//   };
//   //do we start with fetch here to post the new group to the db? - esm
//   fetch('http://localhost:3000/api/adventure', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ name: adventureName }), //send the adventure name to the server
//   });
//   return (
//     <div>
//       <div className="relative w-full text-xl ">
//         <Link to="/" className="absolute left px-4 py-2 pt-4 ">
//           <ChevronLeft />
//         </Link>
//         <h1 className="text-center font-medium pt-4 ">Create Adventure</h1>
//       </div>
//       <h2 className="font-bold text-4 mt-6 mb-2 px-4 pl-4 text-[19px]">
//         Create a New Adventure
//       </h2>
//       <p className="text-4 mb-4 px-4 pl-4 text-[14px] font-medium  ">
//         ADVENTURE NAME
//       </p>
//       <div className="flex justify-center">
//         <input
//           type="text"
//           className=" w-90 rounded-xl border border-[#DEDEDE] bg-white p-4 mb-60"
//           placeholder=""
//         />
//       </div>
//       <div className="flex justify-center">
//         <Button
//           className="flex items-center gap-2 bg-[#3A7FE5] text-white px-4 py-2 rounded font-bold"
//           name="Create New Group"
//           variant="ho"
//           isActive={true}
//           onClick={() => console.log('Button Click Success!')}
//           plusIcon={<Plus />}
//           route="/trip-name"
//         />
//       </div>
//     </div>
//   );
// };

// Expenses Page

/* Supposed to show the expenses and balances of the trip, nestled within the GroupTripDetails */

// import React from 'react';
// import List from './List';
// export const Expenses = () => {
//   return (
//     <div className="flex flex-col justify-center items-center gap-3 pb-20 pt-7">
//       <List title="Groceries" subtitle="Paid by you" amount={250} />
//       <List title="Dinner at restaurant" subtitle="Paid by Erika" amount={90} />
//       <List title="Flights" subtitle="Paid by Arsy" amount={1500} />
//       <List title="Hotel Booking" subtitle="Paid by youErika" amount={600} />
//     </div>
//   );
// };

// // Needs to write to JSON file, tracking expenses across app

// import { ChevronLeft } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { Button } from '../components/components/Buttons';

// export const AddExpense = () => {
//   return (
//     <div className="flex flex-col gap-2">
//       <div className="relative w-full text-xl ">
//         <Link
//           to="/trip-name/expenses"
//           className="absolute left px-4 py-2 pt-4 "
//         >
//           <ChevronLeft />
//         </Link>
//         <h1 className="text-center font-medium pt-4">Add Expense</h1>
//       </div>
//       <div className="pl-4 pr-4 pt-5">
//         <label className="font-bold block mb-2">Amount</label>
//         <input
//           type="text"
//           className="w-full max-w-md rounded-xl border border-[#DEDEDE] bg-white p-4"
//           placeholder="$0.00"
//         />
//       </div>
//       <div className="pl-4 pr-4 pt-5">
//         <label className="font-bold block mb-2">Description</label>
//         <input
//           type="text"
//           className="w-full max-w-md rounded-xl border border-[#DEDEDE] bg-white p-4"
//           placeholder="Dinner with Friends"
//         />
//       </div>
//       <div className="pl-4 pr-4 pt-5">
//         <label className="font-bold block mb-2">Paid by</label>
//         <input
//           type="text"
//           className="w-full max-w-md rounded-xl border border-[#DEDEDE] bg-white p-4 mb-70"
//           placeholder="Friend's names"
//         />
//       </div>
//       <div className="flex justify-center">
//         <Button
//           className="flex items-center gap-2 bg-[#3A7FE5] text-white px-4 py-2 rounded font-bold"
//           name="Add Expense"
//           variant="ho"
//           isActive={true}
//           onClick={() => console.log('Button Click Success!')}
//           route={'/trip-name/expenses'}
//         />
//       </div>
//     </div>
//   );
// };
