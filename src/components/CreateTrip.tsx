/* Should write to trips.json and add datat there that will then be re-rendered with the other trips, attaching
the same functionality as the other buttons have */
import fs from 'fs/promises';
import data from '../../databases/trips.json' assert { type: 'json' };

const CreateTrip = () => {
  const newTrip = {
    id: 5,
    destination: 'Maldives',
    people: ['Amy', 'Rose'],
    budget: 1300
  }

  
};

export default CreateTrip;
