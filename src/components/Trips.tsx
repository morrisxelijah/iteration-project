import trips from '../../databases/trips.json' assert { type: 'json' };

// Reading JSON file
const Trips = ({ onSelectTrip }) => {
  return (
    <>
      <div id="trips-title">
        <h2>Group Trips</h2>
      </div>
      <section className="group-trips">
        {trips.map((trip) => {
          return (
            <button
              key={trip.id}
              onClick={() => onSelectTrip(trip.id)}
            >
              <div id="title">
                <p>Trip to {trip.destination}</p>
              </div>
              <div id="subtitle">
                <p>{trip.people.length} members</p>
              </div>
              <div id="amount">
                <p>${trip.budget}</p>
              </div>
            </button>
          );
        })}
      </section>
    </>
  );
};

export default Trips;

// Using database
// const Form = () => {
//   const getData = async (): Promise<void> => {
//     const data = await Trips.find({});
//     console.log(data);
//     // return data;
//   };
//   getData();
//   // const data = getData();

//   return (
//     <>
//       <div id="trip-title">
//         <h2>Group Trips</h2>
//       </div>
//       <section className="group-trips">
//         {data.map((trip) => {
//           return (
//             <button>
//               <List
//                 title={`Trip to ${trip.name}`}
//                 subtitle={`${trip.people.length} members`}
//                 amount={trip.budget}
//               />
//             </button>
//           );
//         })}
//       </section>
//     </>
//   );
// };

// Hard-coded
// const Form = () => {
// return (
//   <>
//     <h2>Group Trips</h2>
//     <section className="group-trips">
//       <button>
//         <List title="Trip to Paris" subtitle="4 members" amount={1300} />
//       </button>
//       <button>
//         <List title="Trip to Tokyo" subtitle="3 members" amount={2000} />
//       </button>
//       <button>
//         <List title="Trip to Cartagena" subtitle="7 members" amount={4000} />
//       </button>
//       <button>
//         <List title="Trip to Islamabad" subtitle="5 members" amount={1800} />
//       </button>
//     </section>
//   </>
// );
// }

// export const Form = () => {
//     return (
//         <div className= "flex flex-col font-semibold text-3xl pl-3">
//             {/* <Search className="mb-4 mt-4"/> */}
//             <p className="mb-4">Adventures </p>
//         </div>
//     )
// }
