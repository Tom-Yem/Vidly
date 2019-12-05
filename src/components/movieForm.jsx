import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import { getGenres } from "../services/genreService";
import { saveMovie, getMovie } from "../services/movieService";

class MovieForm extends Form {
  state = {
    data: {
      title: "",
      numberInStock: "",
      dailyRentalRate: "",
      genreId: ""
    },
    genres: [],
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string()
      .required()
      .label("title"),
    genreId: Joi.string()
      .required()
      .label("Genre"),
    numberInStock: Joi.number()
      .label("Number in Stock")
      .min(0)
      .required(),
    dailyRentalRate: Joi.number()
      .max(10)
      .required()
      .label("dailyRentalRate")
  };
  async componentDidMount() {
    const {data: genres} = await getGenres();
    this.setState({ genres });

    const movieID = this.props.match.params.id;
    if (movieID === "new") return;

    const {data: movie} = await getMovie(movieID);
    if (!movie) return this.props.history.replace("/not-found");

    this.setState({ data: this.mapToViewModel(movie) });
  }
  mapToViewModel(movie) {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      dailyRentalRate: movie.dailyRentalRate,
      numberInStock: movie.numberInStock
    };
  }
  doSubmit = async() => {
    await saveMovie(this.state.data);

    this.props.history.replace("/");
  };
  render() {
    return (
      <div>
        <h1>Movie Form</h1>
        {this.renderInput("title", "Title")}
        {this.renderSelect("genreId", "Genre", this.state.genres)}
        {this.renderInput("numberInStock", "Number in Stock", "number")}
        {this.renderInput("dailyRentalRate", "Rate", "number")}
        {this.renderButton("Save")}
      </div>
    );
  }
}

export default MovieForm;
