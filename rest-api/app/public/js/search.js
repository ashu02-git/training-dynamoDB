const searchModule = (() => {
  const BASE_URL = 'http://localhost:3000/api/v1/search';

  return {
    searchUsers: async () => {
      // 検索窓への入力値を習得
      const valueName = document.getElementById('search-name').value;
      const valueMail = document.getElementById('search-mail').value;
      let res;
      if (valueName.length > 0) {
        res = await fetch(BASE_URL + '?name=' + valueName);
      } else {
        res = await fetch(BASE_URL + '?mail=' + valueMail);
      }
      const result = await res.json();

      let body = '';

      for (let i in result) {
        const user = result[i];
        body += `<tr>
                  <td>${user.id}</td>
                  <td>${user.name}</td>
                  <td>${user.mail}</td>
                  <td>${user.profile}</td>
                  <td>${user.date_of_birth}</td>
                  <td>${user.created_date}</td>
                  <td>${user.updated_date}</td>
                </tr>`;
      }

      document.getElementById('users-list').innerHTML = body;
    },
  };
})();
