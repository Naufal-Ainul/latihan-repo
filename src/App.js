import React, { useState, useEffect } from 'react'; 
import DOMPurify from 'dompurify'; 
import axios from 'axios'; 
function App() { 
const [input, setInput] = useState(""); 
const [csrfToken, setCsrfToken] = useState(""); 
useEffect(() => { 
// Ambil CSRF token saat komponen dimount 
axios.get("http://localhost:4000/api/csrf-token", { withCredentials: true }) 
.then(res => setCsrfToken(res.data.csrfToken)); 
}, []); 
const handleSubmit = async () => { 
const res = await axios.post( 
"http://localhost:4000/api/data", 
{ input }, 
{ 
withCredentials: true, 
headers: { 'XSRF-TOKEN': csrfToken } 
} 
); 
alert(res.data.message); 
}; 
return ( 
<div> 
<h1>Aplikasi Aman</h1> 
<textarea value={input} onChange={e => setInput(e.target.value)} /> 
<button onClick={handleSubmit}>Kirim</button> 
<h3>Output Aman (Disanitasi)</h3> 
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(input) }} /> 
</div> 
); 
} 
export default App;