const url = 'http://localhost:3000/api/users/requests';
const myHeaders = new Headers();
const tokenValue = localStorage.getItem('token');

myHeaders.append('Authorization', tokenValue);
myHeaders.append('Content-Type', 'application/json');

const getData = async () => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('token')
      }
    });
    const statusCode = await response.status;
    if (statusCode === 400) {
      console.log('There was an error');
    } else {
      const { result } = await response.json();
      console.log(result);
      console.log(result[0].title);
      result.forEach(request => {
        const newDiv = document.createElement('div');
        const rightside = document.getElementById('rightside');
        newDiv.className = 'item-group';
        newDiv.addEventListener('click', function() {
          youclicked(request.id, 'second');
        });
        newDiv.innerHTML = ` 
        
     <h4 class="item">${request.title}</h4>
     <h4 class="item">${request.requesttype ? 'Repair' : 'Maintenance'}</h4>
     <h4 class="item">${request.is_resolved ? 'Approved' : 'Pending'}</h4>
    
     `;
        rightside.append(newDiv);
      });
    }
  } catch (error) {
    console.log('Failed to fetch' + error);
  }
};

getData();

function callme() {
  alert(' I ama called');
}

function youclicked(event, second) {
  alert(event);
  alert(second);
}
