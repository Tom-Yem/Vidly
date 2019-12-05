import http from "./httpServiceModule";

const apiEndPoint = "/users";

export function regsiter(user) {
  return http.post(apiEndPoint, {
    email: user.username,
    password: user.password,
    name: user.name
  });
}
