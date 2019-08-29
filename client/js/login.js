const signUpGhost = document.getElementById('signUpGhost');
const signInGhost = document.querySelector('.ghost');
const signIn = document.querySelector('#signIn');
const signUp = document.querySelector('#signUp');
const container = document.getElementById('container');
// const url = 'http://localhost:3000/api/auth/signup';
// const url2 = 'http://localhost:3000/api/auth/login';
const url = 'http://192.168.43.96:3000/api/auth/signup';
const url2 = 'http://192.168.43.96:3000/api/auth/login';

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
  const request = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers: {
      'content-type': 'application/json'
    }
  });

  const data = await request.json();
  console.log(data);
};

const loginUser = async e => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');

  const details = { email, password };

  const request = await fetch(url2, {
    method: 'POST',
    body: JSON.stringify(details),
    headers: {
      'content-type': 'application/json'
    }
  });

  const data = await request.json();
  console.log(data);
};
