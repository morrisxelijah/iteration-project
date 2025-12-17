/* Should write to trips.json and add datat there that will then be re-rendered with the other trips, attaching
the same functionality as the other buttons have */
import fs from 'fs/promises';
import trips from '../../databases/trips.json' assert { type: 'json' };
import { resolve } from 'path';

const CreateTrip = () => {
  const addTrip = () => {
    const newTrip = {
      id: 5,
      destination: 'Maldives',
      people: ['Emily', 'Amy'],
      budget: 1200,
    };
    trips.push(newTrip);
    fs.writeFile('../../datbases/trips.json', JSON.stringify(trips))
  };

  return (
    <>
      <div id="create-trip-title">
        <h2>Create Adventure</h2>
      </div>

      <button onClick={addTrip}>Add Trip</button>
      {/* <form id="add-trip">
        <label htmlFor="destination">Destination: </label>
        <input type="text" id="destination" name="destination" required></input>
        <br />
        <label htmlFor="people">People: </label>
        <input type="text" id="people" name="people" required></input>
        <br />
        <input type="submit" value="Add Trip" id="trip-button" onSubmit={addTrip}></input>
      </form> */}
    </>
  );
};

export default CreateTrip;
