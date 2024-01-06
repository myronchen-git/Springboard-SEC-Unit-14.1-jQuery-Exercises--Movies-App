$(function () {
  new MoviesApp();
});

class MoviesApp {
  static #sortTypes = ["a-z", "z-a", "0-10", "10-0"];

  constructor() {
    this.sortType = MoviesApp.#sortTypes[0];

    this.movies = new Map();
    this.tableMovies = $("#table-movies");

    // Adding event listeners to DOM elements
    $("#inputs-movie").submit(this.handleSubmit.bind(this));
    this.tableMovies.on("click", ".btn-remove", this.handleRemove.bind(this));
    $("#table-movies > thead").on("click", "th", this.handleSort.bind(this));
  }

  /**
   * Handles the processing after clicking on the submit button in the form.
   *
   * @param {Event} e The click event on the submit button.
   */
  handleSubmit(e) {
    e.preventDefault();
    this.addMovie($("#input-name").val(), Number($("#input-rating").val()));
    this.sortMovies();
    this.displayMovies();
  }

  /**
   * Handles the processing for removal of a movie in the table.
   *
   * @param {Event} e The click event on the "remove" button.
   */
  handleRemove(e) {
    this.deleteMovie(
      e.target.parentElement.parentElement.querySelector(".movie-name")
        .innerText
    );
    e.target.parentElement.parentElement.remove();
  }

  /**
   * Handles the processing for sorting the movies in the HTML table.
   *
   * @param {Event} e The event for when a table header is clicked.
   */
  handleSort(e) {
    this.switchSortType(e.target.innerText);
    this.sortMovies();
    this.displayMovies();
  }

  /**
   * Adds a movie to the movie database (Map).
   *
   * @param {String} name The name of the movie to add.
   * @param {Number} rating The rating of the movie to add.
   */
  addMovie(name, rating) {
    this.movies.set(name, rating);
  }

  /**
   * Deletes a movie from the movie database (Map).
   *
   * @param {String} name The name of the movie to remove.
   */
  deleteMovie(name) {
    this.movies.delete(name);
  }

  /**
   * Sorts the movies database (Map) according to the current sort type, replacing the movies Map with the newly ordered
   * Map.
   */
  sortMovies() {
    // https://www.geeksforgeeks.org/how-to-sort-a-map-in-javascript/

    const collatorName = new Intl.Collator("default", { sensitivity: "base" });
    const collatorRating = new Intl.Collator("default", { numeric: true });
    let comparator;

    switch (this.sortType) {
      // alphabetically for name
      // a-z
      case MoviesApp.#sortTypes[0]:
        comparator = (movie1, movie2) => {
          return collatorName.compare(movie1[0], movie2[0]);
        };
        break;

      // reverse alphabetically for name
      // z-a
      case MoviesApp.#sortTypes[1]:
        comparator = (movie1, movie2) => {
          return collatorName.compare(movie2[0], movie1[0]);
        };
        break;

      // increasing numerically for rating
      // 0-10
      case MoviesApp.#sortTypes[2]:
        comparator = (movie1, movie2) => {
          return collatorRating.compare(movie1[1], movie2[1]);
        };
        break;

      // decreasing numerically for rating
      // 10-0
      case MoviesApp.#sortTypes[3]:
        comparator = (movie1, movie2) => {
          return collatorRating.compare(movie2[1], movie1[1]);
        };
        break;

      default:
        throw new Error("Sort type needs to be valid.");
    }

    this.movies = new Map([...this.movies.entries()].sort(comparator));
  }

  /**
   * Takes a text from a table header and switches the current type of sorting, along with changing the header text.
   *
   * @param {String} str The text from a table column header.
   */
  switchSortType(str) {
    switch (str) {
      case "Name ↓":
        this.sortType = MoviesApp.#sortTypes[1];
        $("#table-movies .thead-name").text("Name ↑");
        break;
      case "Name ↑":
        this.sortType = MoviesApp.#sortTypes[0];
        $("#table-movies .thead-name").text("Name ↓");
        break;
      case "Rating ↓":
        this.sortType = MoviesApp.#sortTypes[3];
        $("#table-movies .thead-rating").text("Rating ↑");
        break;
      case "Rating ↑":
        this.sortType = MoviesApp.#sortTypes[2];
        $("#table-movies .thead-rating").text("Rating ↓");
        break;
    }
  }

  /**
   * Creates the table rows for each movie in the database and appends it to the movies table.
   */
  displayMovies() {
    this.tableMovies.find("tbody > tr").remove();

    for (let [name, rating] of this.movies) {
      this.tableMovies.children("tbody").append(
        $("<tr>")
          .append($("<td>").text(name).addClass("movie-name"))
          .append($("<td>").text(rating).addClass("movie-rating"))
          .append(
            $("<td>").append(
              $("<button>")
                .attr("type", "button")
                .addClass("btn-remove")
                .html("&times;")
            )
          )
      );
    }
  }
}
