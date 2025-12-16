import Trips from './components/Trips';
import Details from './components/Details';
import CreateTrip from './components/CreateTrip';
import Requests from './components/Requests';
import { useState } from 'react';

type Screen = "list" | "create" | "details";  // use in page switcher

const Home = () => {
  const [page, setPage] = useState(<Trips />);

  function changePage() {
    setPage(<CreateTrip />);
    document.getElementById('new-adventure').style.display = 'none';
  }

  return (
    <>
      <button id="new-adventure" onClick={changePage}>
        + Start New Adventure
      </button>
      {page}
    </>
  );
};

const App = () => {
  

  const [page, setPage] = useState<Screen>("list");  
  const [tripID, setTripID] = useState<string | null>(null);
   
  // display details for currently selected trip (new or pre-existing)
  function handleSelectTrip(selectedTripID) {
    setTripID(selectedTripID);
    setPage("details");
  }

  // user clicks the plus button
  function handleCreateTrip() {
    setPage("create");
  }

  // decide which page component to render based on the current page key
  let content: React.ReactNode;
  
  if (page === "create") {  // user wants to create a new trip
    content = <CreateTrip />;
  
  } else if (page === "details") {  // user wants to view a specific trip
    content = tripID ? <Details /> : <p>No trip selected.</p>;
  
  } else {  // default (home)  -->  user is viewing all trips  ;  page === "list"
    content = (
      <>
        <button id="new-adventure" onClick={handleCreateTrip}>
          + Start New Adventure
        </button>

        <Trips  />
      </>
    )
  }

  return (
      <>
        <div>
          <h1>WalletWise</h1>
        </div>
        {content}
      </>
    );

    

    

  
  // return (
  //   <>
  //     <div id="title">
  //       <h1>WalletWise</h1>
  //     </div>
  //     <Home />
  //   </>
  // );
};

export default App;

// const App = () => {
//   return (
//     <div>
//       <div>
//         <Form />
//         <div>
//         {/* <div className="flex justify-center"> */}
//           <Button
//             className="flex items-center gap-2 bg-[#3A7FE5] text-white px-4 py-2 rounded font-bold"
//             name="Start New Adventure"
//             variant="ho"
//             isActive={true}
//             onClick={() => console.log('Button Click Success!')}
//             // plusIcon={<Plus />}
//             route="/create-adventure"
//           />
//         </div>
//         <h2 className="font-semibold text-4 pl-3 mt-4 mb-4">All Adventures</h2>
//         <div>
//           <div className="flex flex-col justify-center items-center gap-3">
//             <List title="Trip to Paris" subtitle="4 members" amount={1300} />
//             <List title="Trip to Tokyo" subtitle="3 members" amount={2000} />
//             <List
//               title="Trip to Cartagena"
//               subtitle="7 members"
//               amount={4000}
//             />
//             <List
//               title="Trip to Islamabad"
//               subtitle="5 members"
//               amount={1800}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function App() {
//   return (
//     <div>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/create-adventure" element={<CreateNewGroup />} />
//           <Route path="/" element={<FirstPage />} />
//           <Route path="/trip-name" element={<GroupTripDetails />}>
//             <Route index element={<Navigate to="expenses" replace />} />
//             <Route path="expenses" element={<Expenses />} />
//             <Route path="balances" element={<Balances />} />
//           </Route>
//           <Route path="/adventure-details" element={<AddExpense />} />
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

