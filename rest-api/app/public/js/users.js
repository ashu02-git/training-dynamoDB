// 即時関数でモジュール化
const usersModule = (() => {
  const BASE_URL = 'http://localhost:3000/api/v1/users';

  // ヘッダーの設定
  const headers = new Headers();
  headers.set('Content-type', 'application/json');

  const handleError = async (res) => {
    const resJson = await res.json();

    switch (res.status) {
      case 200:
        alert(resJson.message);
        window.location.href = '/';
        break;
      case 201:
        alert(resJson.message);
        window.location.href = '/';
        break;
      case 400:
        // リクエストのパラメータ間違い
        alert(resJson.error);
        break;
      case 404:
        // 指定したリソースが見つからない
        alert(resJson.error);
        break;
      case 500:
        // サーバーの内部エラー
        alert(resJson.error);
        break;
      default:
        alert('何らかのエラーが発生しました。');
        break;
    }
  };

  return {
    fetchAllUsers: async () => {
      const res = await fetch(BASE_URL);
      const users = await res.json();

      for (let i in users) {
        const user = users[i];
        const body = `<tr>
                        <td>${user.id}</td>
                        <td><a href='following.html?uid=${user.id}'>${user.name}</a></td>
                        <td>${user.mail}</td>
                        <td>${user.profile}</td>
                        <td>${user.date_of_birth}</td>
                        <td>${user.created_date}</td>
                        <td>${user.updated_date}</td>
                        <td><a href='edit.html?uid=${user.id}'>編集</a></td>
                      </tr>`;
        document
          .getElementById('users-list')
          .insertAdjacentHTML('beforeend', body);
      }
    },
    createUser: async () => {
      const name = document.getElementById('name').value;
      const mail = document.getElementById('mail').value;
      const profile = document.getElementById('profile').value;
      const dateOfBirth = document.getElementById('date-of-birth').value;

      // リクエストのbody
      const body = {
        name: name,
        mail: mail,
        profile: profile,
        date_of_birth: dateOfBirth,
      };

      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });

      return handleError(res);
    },
    setExistingValue: async (uid) => {
      const res = await fetch(BASE_URL + '/' + uid);
      const resJson = await res.json();

      document.getElementById('name').value = resJson.name;
      document.getElementById('mail').value = resJson.mail;
      document.getElementById('profile').value = resJson.profile;
      document.getElementById('date-of-birth').value = resJson.date_of_birth;
    },
    saveUser: async (uid) => {
      const name = document.getElementById('name').value;
      const mail = document.getElementById('mail').value;
      const profile = document.getElementById('profile').value;
      const dateOfBirth = document.getElementById('date-of-birth').value;

      // リクエストのbody
      const body = {
        name: name,
        mail: mail,
        profile: profile,
        date_of_birth: dateOfBirth,
      };

      const res = await fetch(BASE_URL + '/' + uid, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body),
      });

      return handleError(res);
    },
    deleteUser: async (uid) => {
      const ret = window.confirm('このユーザーを削除しますか？');

      if (!ret) {
        return false;
      } else {
        const res = await fetch(BASE_URL + '/' + uid, {
          method: 'DELETE',
          headers: headers,
        });

        return handleError(res);
      }
    },
    fetchFollowingUsers: async (uid) => {
      const res = await fetch(BASE_URL + '/' + uid + '/following');
      const followingUsers = await res.json();

      for (let i in followingUsers) {
        const followingUser = followingUsers[i];
        const body = `<tr>
                        <td>${followingUser.id}</td>
                        <td><a href='following.html?uid=${followingUser.id}'>${followingUser.name}</a></td>
                        <td>${followingUser.mail}</td>
                        <td>${followingUser.profile}</td>
                        <td>${followingUser.date_of_birth}</td>
                        <td>${followingUser.created_date}</td>
                        <td>${followingUser.updated_date}</td>
                        <td><a href='edit.html?uid=${followingUser.id}'>編集</a></td>
                      </tr>`;
        document
          .getElementById('users-list')
          .insertAdjacentHTML('beforeend', body);
      }
    },
  };
})();
