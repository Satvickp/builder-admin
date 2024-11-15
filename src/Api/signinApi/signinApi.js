
export const response = await axios.post('https://api-dev.prismgate.in/bill-generator-service/users/login', {
    username: username,
    password: password,
    builderName: 'Anand Verma',
  }, {
    headers: { 'Content-Type': 'application/json' },
  });