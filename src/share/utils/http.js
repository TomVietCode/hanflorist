const API_DOMAIN = process.env.REACT_APP_API_URL || "https://hanflorist-be.onrender.com"

export const get = async (token, path) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Gửi token qua headers
    }
  })
  const result = await response.json()
  return result
}

export const getPublic = async (path) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
  const result = await response.json()
  return result
}

export const getPublicNative = async (path) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
  const result = await response.json()
  return result
}

export const post = async (token, path, data) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  const result = await response.json()
  return result
}

export const patch = async (token, path, data) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  const result = await response.json()
  return result
}

export const patchWithFormData = async (token, path, formData) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: formData
  })
  const result = await response.json()
  return result
}

export const del = async (token, path) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
  const result = await response.json()
  return result
}

export const postPublic = async (path, data) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })
  const result = await response.json()
  return result
}

export const postPublicNative = async (url, data) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })
  const result = await response.json()
  return result
}

export const postWithFormData = async (token, path, formData) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: formData
  })
  const result = await response.json()
  return result
}
