const data = JSON.stringify({
  username: "adminuser",
  email: "admin@cybershield.com",
  password: "securepassword"
});

fetch('http://localhost:5000/api/auth/setup-admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: data
})
.then(res => res.json())
.then(json => console.log(json))
.catch(err => console.error(err));
