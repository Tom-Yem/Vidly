import http from "./httpServiceModule";


export function getGenres() {
    return http.get('/genres');
  }