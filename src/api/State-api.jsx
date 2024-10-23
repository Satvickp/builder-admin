import React, { useState } from 'react';
const CreateState = () => {
  const [response, setResponse] = useState(null);
  const [formData, setFormData] = useState({
    name: 'Delhi',
    code: 123,
    monthlyChargesType: 0,
    monthlyCharges: 100.50,
    origin: 'Yes', 
  });
  const handleCreate = () => {
      console.log(formData);
    fetch('http://api.prismgate.in/bill-generator-service/state-masters/create', {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => setResponse(data))
      .catch(error => console.log('Error:', error));
  };
  return (
    <div>
      <button onClick={handleCreate}>Create State</button>
    </div>
  );
};

export default CreateState;
