import React, { Component } from "react";
import _ from "lodash";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getMovies, deleteMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import MoviesTable from "./moviesTable";
import Pagination from "./common/pagination";
import Listgroup from "./common/listGroup";
import paginate from "../utils/paginate";
import NavBar from "./navbar";
import SearhBar from "./common/SearchBar";
import "react-toastify/dist/ReactToastify.css";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    sortColumn: { path: "title", order: "asc" },
    currentPage: 1,
    pageSize: 4,
    searchQuery: ""
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const { data: movies } = await getMovies();
    const genres = [{ _id: "", name: "All genres" }, ...data];
    this.setState({ movies, genres });
  }

  handleLike = movie => {
    const movies = [...this.state.movies];
    let index = movies.indexOf(movie);
    movies[index] = { ...movie };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handleDelete = async movie => {
    const originalMovies = this.state.movies;
    const movies = this.state.movies.filter(m => m._id !== movie._id);
    this.setState({ movies });

    try {
      await deleteMovie(movie._id);
      toast.success("Succesfuly deleted!");
    } catch (er) {
      if (er.response && er.response.status === 404)
        toast.error("this Movie doesnt exist!");

      this.setState({ movies: originalMovies });
    }
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleItemSelect = item => {
    this.setState({ selectedItem: item, currentPage: 1, searchQuery: "" });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };
  handleSearch = qurey => {
    this.setState({ searchQuery: qurey });
  };

  getPagedData = () => {
    const {
      movies,
      currentPage,
      selectedItem,
      pageSize,
      sortColumn,
      searchQuery
    } = this.state;

    let filtered = movies;

    if (searchQuery && selectedItem && selectedItem._id)
      filtered = movies.filter(
        m =>
          m.title.toLowerCase().startsWith(searchQuery.toLowerCase()) &&
          m.genre._id === selectedItem._id
      );
    else if (searchQuery)
      filtered = movies.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedItem && selectedItem._id)
      filtered = movies.filter(m => m.genre._id === selectedItem._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const moviesPerPage = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, moviesPerPage };
  };

  render() {
    const { user } = this.props;
    const { totalCount, moviesPerPage } = this.getPagedData();
    return (
      <React.Fragment>
        <ToastContainer />
        <div className="row">
          <div className="col-3">
            <Listgroup
              items={this.state.genres}
              selectedItem={this.state.selectedItem}
              onItemSelect={this.handleItemSelect}
            />
          </div>
          <div className="col">
            {user && (
              <Link className="btn btn-primary" to="/movies/new">
                New Movie
              </Link>
            )}
            <p>Showing {totalCount} movies in the Database.</p>
            <SearhBar
              value={this.state.searchQuery}
              onChange={this.handleSearch}
            />
            <MoviesTable
              moviesPerPage={moviesPerPage}
              sortColumn={this.state.sortColumn}
              onDelete={this.handleDelete}
              onLike={this.handleLike}
              onSort={this.handleSort}
            />
            <Pagination
              itemsCount={totalCount}
              pageSize={this.state.pageSize}
              currentPage={this.state.currentPage}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Movies;
