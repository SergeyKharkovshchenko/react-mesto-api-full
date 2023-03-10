import { Component } from "react";

class Api extends Component {
  constructor(setting) {
    super(setting);
    this._address = setting.baseUrl;
  }

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  }

  getUserInfo() {
    return fetch(`${this._address}users/me`, {
      method: "GET",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._getResponseData(res));
  }

  getInitialCards() {
    return fetch(`${this._address}cards`, {
      credentials: 'include',
           headers: {
            "Content-Type": "application/json",
          },
    }).then((res) => this._getResponseData(res));
  }

  getUserAndCards() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  setUserInfo(name, about) {
    return fetch(`${this._address}users/me`, {
      method: "PATCH",
      credentials: 'include',
            headers: {
              "Content-Type": "application/json",
            },
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then((res) => this._getResponseData(res));
  }

  addMyCardToCloud(name, link) {
    return fetch(`${this._address}cards`, {
      method: "POST",
      credentials: 'include',
            headers: {
              "Content-Type": "application/json",
            },
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then((res) => this._getResponseData(res));
  }

  deleteCardFromCloud(id) {
    return fetch(`${this._address}cards/${id}`, {
      method: "DELETE",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._getResponseData(res));
  }

  setUserAvatar(newAvatarLink) {
    return fetch(`${this._address}users/me/avatar`, {
      method: "PATCH",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: newAvatarLink,
      }),
    }).then((res) => this._getResponseData(res));
  }

  changeLikeCardStatus(id, isLiked) {
    if (isLiked) {
      return fetch(`${this._address}cards/${id}/likes`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => this._getResponseData(res));
    } else {
      return fetch(`${this._address}cards/${id}/likes`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => this._getResponseData(res));
    }
  }
}

const api = new Api({
  baseUrl: "https://api.sergey-kh.nomoredomains.club/",
});

export default api;
