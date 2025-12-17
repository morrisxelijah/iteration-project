// Stretch feature
import { useState } from "react";

interface PaymentRequest {
    id: number;
    from: string;
    to: string;
    amount: number;
    reason: string;
    date: string;

}   


// should be a request sent to a friend where it has the payment information (zelle) with only the sent details functionality 
const Requests = () => {
   const [requests, setRequests] = useState<PaymentRequest>([
    
   ]);

    return (
        <>
            <div id="requests-title">
                <h2>Requests</h2>
            </div>
        </>
    )
}

export default Requests;