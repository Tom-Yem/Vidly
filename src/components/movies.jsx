import React, { Component } from "react";
import _ from "lodash";
import { getMovies } from "../Starter Code/services/fakeMovieService";
import { getGenres } from "../Starter Code/services/fakeGenreService";
import MoviesTable from "./moviesTable";
import Pagination from "./common/pagination";
import Listgroup from "./common/listGroup";
import paginate from "../utils/paginate";
import NavBar from "./navbar";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    sortColumn: { path: "title", order: "asc" },
    currentPage: 1,
    pageSize: 4
  };

  componentDidMount() {
    const genres = [{ _id: "", name: "All genres" }, ...getGenres()];
    this.setState({ movies: getMovies(), genres });
  }

  handleLike = movie => {
    const movies = [...this.state.movies];
    let index = movies.indexOf(movie);
    movies[index] = { ...movie };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handleDelete = movie => {
    const movies = this.state.movies.filter(m => m._id !== movie._id);
    this.setState({ movies });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleItemSelect = item => {
    this.setState({ selectedItem: item, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      movies,
      currentPage,
      selectedItem,
      pageSize,
      sortColumn
    } = this.state;

    const filtered =
      selectedItem && selectedItem._id
        ? movies.filter(m => m.genre._id === selectedItem._id)
        : movies;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const moviesPerPage = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, moviesPerPage };
  };

  render() {
    const { totalCount, moviesPerPage } = this.getPagedData();
    if (totalCount === 0) return <p>There are no movies to display.</p>;
    return (
      <div className="row">
        <div className="col-3">
          <Listgroup
            items={this.state.genres}
            selectedItem={this.state.selectedItem}
            onItemSelect={this.handleItemSelect}
          />
        </div>
        <div className="col">
          <p>Showing {totalCount} movies in the Database.</p>
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
    );
  }
}

export default Movies;
