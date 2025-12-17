// Stretch feature
import { useState } from "react";

// Define the shape of a payment request object
interface PaymentRequest {
    id: number;
    to: string;
    amount: number;
    reason: string;
    paymentInfo: string;
}

const Requests = () => {
    // State: Array to store all payment requests (the notebook)
    const [requests, setRequests] = useState<PaymentRequest[]>([]);
    
    // State: Object to track current form inputs (the blank paper)
    const [form, setForm] = useState({ to: '', amount: '', reason: '', paymentInfo: '' });

    // Runs when user clicks "Send" button
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // Stop page from refreshing
        
        // Add new request to array (add page to notebook)
        setRequests([...requests, { 
            id: Date.now(), // Unique ID for React's key
            ...form, // Copy all form fields
            amount: parseFloat(form.amount) // Convert "50" string to 50 number
        }]);
        
        // Clear the form for next request (erase the paper)
        setForm({ to: '', amount: '', reason: '', paymentInfo: '' });
    };

    return (
        <div id="requests-title">
            <h2>Requests</h2>
            
            {/* Form to create new payment request */}
            <form onSubmit={handleSubmit}>
                {/* Controlled input: value from state, onChange updates state */}
                <input 
                    placeholder="To" 
                    value={form.to} 
                    onChange={event => setForm({...form, to: event.target.value})} 
                    required 
                />
                <input 
                    type="number" 
                    placeholder="Amount" 
                    value={form.amount} 
                    onChange={event => setForm({...form, amount: event.target.value})} 
                    required 
                />
                <input 
                    placeholder="Reason" 
                    value={form.reason} 
                    onChange={event => setForm({...form, reason: event.target.value})} 
                    required 
                />
                <input 
                    placeholder="Zelle/Venmo" 
                    value={form.paymentInfo} 
                    onChange={event => setForm({...form, paymentInfo: event.target.value})} 
                    required 
                />
                <button>Send</button>
            </form>
            
            {/* Display all sent requests (show the notebook) */}
            {requests.map(request => (
                <div key={request.id}> {/* key helps React track each item */}
                    <p>{request.to} - ${request.amount} - {request.reason} - {request.paymentInfo}</p>
                </div>
            ))}
        </div>
    );
};

export default Requests;