/* When you click on one of the trips on the home page, this expands the information there and lets you see
the full details of the trip, including where to, the people involved, and how paid off it is */

// import { Button } from '../components/components/Buttons';
// import { ChevronLeft, Plus } from 'lucide-react';
// import { Link, Outlet } from 'react-router-dom';
import { useState } from "react";
import trips from "../../databases/trips.json" assert { type: "json" };
import expensesJson from "../../databases/expenses.json" assert { type: "json" };

type Trip = { id: number; destination: string; people: string[]; budget: number };
type Pay = { name: string; amount: number };
type Exp = { id: number; trip_id: number; title: string; total: number; payments: Pay[] };
type Mode = "expenses" | "balances" | "add-expense" | null;
type Props = { tripID: number; onGoToRequests?: () => void };

function roundCents(val: number) { return Math.round(Number(val) * 100) / 100; } // cents stay stable so totals and settlements do not drift
function sumPays(pays: Pay[]) { let sum = 0; for (const pay of pays) sum += Number(pay.amount) || 0; return roundCents(sum); } // payments are reused in both validation and balances

const Details = ({ tripID, onGoToRequests }: Props) => {
  // select trip by id from trips.json
  const trip = (trips as Trip[]).find((row) => row.id === tripID);
  if (!trip) return <p>Trip not found.</p>;

  // grab expenses json  -->  new entries only appear in UI (no persistance)
  const [exps, setExps] = useState<Exp[]>(expensesJson as Exp[]);
  const [mode, setMode] = useState<Mode>(null);

  // allow multiple expand details toggled
  const [openExp, setOpenExp] = useState<Record<number, boolean>>({});
  const [openPerson, setOpenPerson] = useState<Record<string, boolean>>({});

  // form typing and validation  -->  keep all input fields as strings
  const [formAmount, setFormAmount] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formPay, setFormPay] = useState<Record<string, string>>({});
  const [errs, setErrs] = useState<string[]>([]);

  // only need expenses for the selected trip
  const tripExps = exps.filter((row) => row.trip_id === trip.id);

  // helper  -->  clicking the active tab hides the panel, clicking another tab swaps panels
  function toggleMode(next: Mode) { setMode((prev) => (prev === next ? null : next)); }
  // helper  -->  clear the add-expense form
  function resetForm() { setFormAmount(""); setFormTitle(""); setFormPay({}); setErrs([]); }

  // toggle expands on / off
  function toggleExp(expId: number) { setOpenExp((prev) => ({ ...prev, [expId]: !prev[expId] })); }
  function togglePerson(name: string) { setOpenPerson((prev) => ({ ...prev, [name]: !prev[name] })); }

  // settlement math (greedy algo)  -->  split total trip spend evenly, then decide who pays who (paid minus share)
  function calcSettle() {
    // calc total spend  -->  sum trip expenses
    const memberCount = trip.people.length;
    const tripTotal = roundCents(tripExps.reduce((sum, row) => sum + Number(row.total || 0), 0));

    // share per person  -->  equal split (balances view)
    const share = memberCount === 0 ? 0 : roundCents(tripTotal / memberCount);

    // track per person total paid  -->  compute net
    const paid: Record<string, number> = {};
    for (const name of trip.people) paid[name] = 0;

    // sum paid per expense  -->  ignore non-members
    for (const expRow of tripExps) for (const pay of expRow.payments) if (paid[pay.name] !== undefined) paid[pay.name] = roundCents(paid[pay.name] + Number(pay.amount || 0));

    // net  -->  positive: overpaid (creditors)  ;  negative: underpaid (debtors)
    const net: Record<string, number> = {};
    for (const name of trip.people) net[name] = roundCents((paid[name] || 0) - share);
    const creditors: { name: string; amount: number }[] = [];
    const debtors: { name: string; amount: number }[] = [];
    for (const [name, netamount] of Object.entries(net)) { 
      if (netamount > 0) creditors.push({ name, amount: roundCents(netamount) });
      if (netamount < 0) debtors.push({ name, amount: roundCents(Math.abs(netamount)) });
    }

    // settlements  -->  match debtors to creditors until everyone is balanced out
    const settles: { from: string; to: string; amount: number }[] = [];
    let debtorIdx = 0, creditorIdx = 0;

    while (debtorIdx < debtors.length && creditorIdx < creditors.length) {
      const debtor = debtors[debtorIdx];
      const creditor = creditors[creditorIdx];

      // payment amount  -->  smaller remaining balance between the two sides
      const amount = roundCents(Math.min(debtor.amount, creditor.amount));
      settles.push({ from: debtor.name, to: creditor.name, amount });

      // reduce balances as payments are assigned
      debtor.amount = roundCents(debtor.amount - amount);
      creditor.amount = roundCents(creditor.amount - amount);

      if (debtor.amount === 0) debtorIdx++;
      if (creditor.amount === 0) creditorIdx++;
    }

    return { settles, tripTotal, share, paid, net };
  }

  // get settlement results  -->  recomputed per render  ;  ok for now, use useMemo with real database or larger datasetts
  const { settles, tripTotal, share, paid, net } = calcSettle();

  // expenses vs budget  -->  shown next to total spend
  const budgetDelta = roundCents(tripTotal - Number(trip.budget || 0));
  const budgetText = budgetDelta > 0 ? `Over Budget:  $${roundCents(budgetDelta).toFixed(2)}` : `Under Budget:  $${roundCents(Math.abs(budgetDelta)).toFixed(2)}`;

  // phrase rows around the expanded person (list items)
  function rowsFor(name: string) {
    const rows: { text: string; amount: number }[] = [];
    for (const row of settles) { if (row.to === name) rows.push({ text: `${row.from} owes ${name}`, amount: row.amount }); if (row.from === name) rows.push({ text: `${name} owes ${row.to}`, amount: row.amount }); }
    return rows;
  }

  // helper  -->  add expense form validate and save
  function submitExp() {
    const nextErrs: string[] = [];
    const total = Number(formAmount);

    // validate inputs
    if (!formTitle.trim()) nextErrs.push("Description is required.");
    if (!Number.isFinite(total) || total <= 0) nextErrs.push("Amount must be a number greater than 0.");

    // only save positive payer input amounts
    const pays: Pay[] = [];
    for (const name of trip.people) {
      const raw = formPay[name];
      if (!raw) continue;
      const amount = Number(raw);
      if (!Number.isFinite(amount) || amount <= 0) continue;
      pays.push({ name, amount: roundCents(amount) });
    }

    // validate payment amounts against total cost
    if (pays.length === 0) nextErrs.push("At least one member must pay a positive amount.");
    const payTotal = sumPays(pays);
    if (Number.isFinite(total) && pays.length > 0 && roundCents(payTotal) !== roundCents(total)) nextErrs.push(`Amount Total Error: \n    payments sum = $${roundCents(payTotal).toFixed(2)}`);
    if (nextErrs.length > 0) { setErrs(nextErrs); return; }

    // get new expense ids (avoid duplicates)
    const maxId = exps.reduce((maxSoFar, row) => Math.max(maxSoFar, row.id), -1);
    const newExp: Exp = { id: maxId + 1, trip_id: trip.id, title: formTitle.trim(), total: roundCents(total), payments: pays };

    // prepend new expense  -->  view entry without scrolling down
    setExps((prev) => [newExp, ...prev]);
    toggleMode("expenses");
    resetForm();
  }

  
  // mode switcher  -->  which component shows on the second half on the page
  let panel: React.ReactNode = null;

  if (mode === "add-expense") {
    panel = (<>
      <header className="panel-head"><h3 id="add-expense-title">Add Expense</h3></header>
      {errs.length > 0 && (<div id="form-errors"><p>Fix these:</p><ul>{errs.map((err) => <li key={err}>{err}</li>)}</ul></div>)}
      <div className="form-row"><label>Amount: <input value={formAmount} onChange={(e) => setFormAmount(e.target.value)} placeholder="e.g. 250" /></label></div>
      <div className="form-row"><label>Description: <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. hotel" /></label></div>
      <div className="form-row">Paid By
        <ul>{trip.people.map((name) => (<li key={name}><label>{name}: <input value={formPay[name] ?? ""} onChange={(e) => setFormPay((prev) => ({ ...prev, [name]: e.target.value }))} placeholder="0" /></label></li>))}</ul>
      </div>
      <div className="form-actions">
        <button type="button" id="discard-expense" onClick={() => { resetForm(); toggleMode("expenses"); }}>Discard</button>
        <button type="button" id="submit-expense" onClick={submitExp}>Add Expense</button>
      </div>
    </>);
  
  } else if (mode === "balances") {
    panel = (<>
      <header className="panel-head">
        <h3 id="balances-title">Balances</h3>
        <button type="button" id="go-requests" onClick={() => { if (onGoToRequests) onGoToRequests(); }} >Requests</button>
      </header>
      
      <section id="trip-breakdown">
        <p id="trip-total">Trip Total: ${roundCents(tripTotal).toFixed(2)} | {budgetText}</p>
        <p id="trip-share">Per Person: ${roundCents(share).toFixed(2)}</p>
      </section>

      <section className="balances-list">
        {trip.people.map((name) => {
          const isOpen = !!openPerson[name];
          const rows = rowsFor(name);
          return (
            <div key={name} className="person-row">
              <button type="button" className="person-btn" onClick={() => togglePerson(name)}>
                <div className="person-title"><h4>{name}</h4></div>
              </button>

              {isOpen && (
                <div className="person-details">
                  <p>paid: ${roundCents(paid[name] || 0).toFixed(2)} | net: ${roundCents(net[name] || 0).toFixed(2)}</p>
                  {rows.length === 0 ? <p>No balances for {name}.</p> : (
                    <ul className="person-rows">
                      {rows.map((row) => (<li key={`${name}-${row.text}-${row.amount}`}>{row.text} ${roundCents(row.amount).toFixed(2)}</li>))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </>);
  
  } else if (mode === "expenses") {
    // can also be made default 
    panel = (<>
      <header className="panel-head">
        <h3 id="expenses-title">Expenses</h3>
        <button type="button" id="add-expense" onClick={() => { toggleMode("add-expense"); resetForm(); }}>+ Add Expense</button>
      </header>

      {tripExps.length === 0 ? <p>No expenses yet.</p> : (<>
        <br></br>
        <br></br>
        <section className="expenses-list">
          {tripExps.map((expRow) => {
            const isOpen = !!openExp[expRow.id];
            const paidBy = expRow.payments.map((pay) => pay.name).join(", ");
            return (
              <div key={expRow.id} className="expense-row">
                <button type="button" className="expense-btn" onClick={() => toggleExp(expRow.id)}>
                  <div className="expense-top">
                    <div className="expense-title"><h4>{expRow.title}</h4></div>
                    <div className="expense-amount"><p>${roundCents(expRow.total).toFixed(2)}</p></div>
                  </div>
                  <div className="expense-sub"><p>Paid by {paidBy || "—"}</p></div>
                </button>

                {isOpen && (
                  <div className="expense-details">
                    <ul className="expense-pays">
                      {expRow.payments.map((pay) => (<li key={`${expRow.id}-${pay.name}`}>{pay.name} → ${roundCents(pay.amount).toFixed(2)}</li>))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </>)}
    </>);
  }

  
  return (<main id="details-page">
    <header id="trip-head">
      <h2>Trip to {trip.destination}</h2>
      <p>{trip.people.length} members</p>
      <p>Budget: ${trip.budget}</p>

      <h3>Members</h3>
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
