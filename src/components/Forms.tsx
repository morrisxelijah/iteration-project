import List from './List';
import trips from '../../databases/trips.json' assert { type: 'json' };
import GroupTripDetails from '../pages/groupTripDetails';
import { useState } from 'react';

// Reading JSON file
const Form = () => {
  return (
    <>
      <div id="trips-title">
        <h2>Group Trips</h2>
      </div>
      <section className="group-trips">
        {trips.map((trip) => {
          return (
            <button>
              <List
                title={`Trip to ${trip.name}`}
                subtitle={`${trip.people.length} members`}
                amount={trip.budget}
              />
            </button>
          );
        })}
      </section>
    </>
  );
};

const Home = () => {
  const [page, setPage] = useState(<Form />);

  function changePage() {
    setPage(<GroupTripDetails />);
    document.getElementById('page-button').style.display = 'none';
  }

  return (
    <>
      <button id="page-button" onClick={changePage}>
        + Start New Adventure
      </button>
      {page}
    </>
  );
};

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

export default Home;

// export const Form = () => {
//     return (
//         <div className= "flex flex-col font-semibold text-3xl pl-3">
//             {/* <Search className="mb-4 mt-4"/> */}
//             <p className="mb-4">Adventures </p>
//         </div>
//     )
// }
