$(function () {
  new MoviesApp();
});

class MoviesApp {
  constructor() {
    this.movies = new Map();
    this.tableMovies = $("#table-movies");

    // Adding event listeners to DOM elements
    $("#inputs-movie").submit(this.handleSubmit.bind(this));
    this.tableMovies.on("click", ".btn-remove", this.handleRemove.bind(this));
  }

  /**
   * Handles the processing after clicking on the submit button in the form.
   *
   * @param {Event} e The click event on the submit button.
   */
  handleSubmit(e) {
    e.preventDefault();
    this.addMovie($("#input-name").val(), Number($("#input-rating").val()));
    this.displayMovies();
  }

  /**
   * Handles the processing for removal of a movie in the table.
   *
   * @param {Event} e The click event on the "remove" button.
   */
  handleRemove(e) {
    this.deleteMovie(
      e.target.parentElement.querySelector(".movie-name").innerText
    );
    e.target.parentElement.remove();
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
   * Creates the table rows for each movie in the database and appends it to the movies table.
   */
  displayMovies() {
    this.tableMovies.find("tbody > tr").remove();

    for (let [name, rating] of this.movies) {
      this.tableMovies
        .children("tbody")
        .append(
          $("<tr>")
            .append($("<td>").text(name).addClass("movie-name"))
            .append($("<td>").text(rating).addClass("movie-rating"))
            .append(
              $("<button>")
                .attr("type", "button")
                .addClass("btn-remove")
                .html("&times;")
            )
        );
    }
  }
}
