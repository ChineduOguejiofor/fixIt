const BASE_URL = '/api';

function callFetchAPI(
  route,
  method,
  data,
  callback,
  errorHandler = err => {
    console.log(err);
  }
) {
  const myHeaders = new Headers();
  const tokenValue = localStorage.getItem('token');

  myHeaders.append('x-auth-token', tokenValue);
  myHeaders.append('Content-Type', 'application/json');

  // fetch(url)

  fetch(BASE_URL + route, {
    method: method,
    body: data ? JSON.stringify(data) : undefined,
    headers: myHeaders
  })
    .then(async response => {
      if (response.status == 401) {
        location.href = 'login.html';
      } else {
        return {
          data: await response.json(),
          statusCode: response.status
        };
      }
    })
    .then(callback)
    .catch(errorHandler);
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  location.href = 'login.html';
}

function login() {
  location.href = 'login.html';
}

function displayAlert(alertDiv, msg) {
  alertDiv.classList.remove('hide');
  const message = document.createElement('h3');
  message.textContent = msg;

  alertDiv.appendChild(message);
  setTimeout(() => {
    alertDiv.removeChild(message);
    alertDiv.classList.add('hide');
  }, 3000);
}

function formatDate(thedate) {
  const date = new Date(thedate);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}
