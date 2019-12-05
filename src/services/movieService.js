import http from "./httpServiceModule";

const apiEndPoint ='/movies';

export function getMovies() {
  return http.get(apiEndPoint);
}

export function deleteMovie(movieId) {
  return http.delete(apiEndPoint +"/"+ movieId);
}

export function getMovie(id) {
  return http.get(apiEndPoint + "/" + id);
}


export function saveMovie(movie) {
  if( movie._id){
    const body = { ...movie};
    delete body._id;
    return http.put(apiEndPoint + '/' + movie._id, body);
  } 
 
  return http.post(apiEndPoint,movie);
}