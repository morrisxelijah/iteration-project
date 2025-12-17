/* Should write to trips.json and add data there that will then be re-rendered with the other trips, attaching
the same functionality as the other buttons have */
import data from '../../databases/trips.json' assert { type: 'json' };

const CreateTrip = () => {
  const handleSubmit = (e: any) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formJSON = Object.fromEntries(formData.entries());

    return data.push({
      id: data.length + 1,
      destination: String(formJSON.destination),
      people: String(formJSON.people).split(','),
      budget: Number(formJSON.budget),
    });
  };

  return (
    <>
      <div id="create-trip-title">
        <h2>Create Adventure</h2>
      </div>
      <form id="add-trip" method="post" onSubmit={handleSubmit}>
        <label>
          Destination: <input id="destination" name="destination" />
        </label>
        <br />
        <label>
          People: <input id="people" name="people" />
        </label>
        <br />
        <label>
          Budget: <input id="budget" name="budget" />
        </label>
        <br />
        <button type="submit" id="trip-button">
          Add Trip
        </button>
      </form>
    </>
  );
};

export default CreateTrip;
