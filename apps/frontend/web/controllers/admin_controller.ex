defmodule Frontend.AdminController do
  use Frontend.Web, :controller

  alias Frontend.Category

  def index(conn, _params) do
    categories = Repo.all(Category)
    render conn, "index.html", categories: categories
  end
end
