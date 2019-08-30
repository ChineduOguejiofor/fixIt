const signUpGhost = document.getElementById('signUpGhost');
const signInGhost = document.querySelector('.ghost');
const signIn = document.querySelector('#signIn');
const signUp = document.querySelector('#signUp');
const container = document.getElementById('container');
const signupURL = 'http://localhost:3000/api/auth/signup';
const loginURL = 'http://localhost:3000/api/auth/login';
// const signupURL = 'http://192.168.43.96:3000/api/auth/signup';
// const signupURL2 = 'http://192.168.43.96:3000/api/auth/login';

signUpGhost.addEventListener('click', () => {
  container.classList.add('right-panel-active');
});

signInGhost.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});

signIn.addEventListener('click', () => {});
signUp.addEventListener('click', e => {});

const register = async e => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');

  const credentials = { name, email, password };
  const request = await fetch(signupURL, {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers: {
      'content-type': 'application/json'
    }
  });

  const data = await request.json();
  console.log(request);
};

const loginUser = async e => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');

  const details = { email, password };

  const request = await fetch(loginURL, {
    method: 'POST',
    body: JSON.stringify(details),
    headers: {
      'content-type': 'application/json'
    }
  });

  const data = await request.json();
  const statusCode = await request.status;
  if (statusCode === 200) {
    localStorage.setItem('token', data.token);
    location.href = 'user.html';
    //storetoken
  } else {
  }
  console.log(data);
  console.log(statusCode);
};
