defmodule Frontend.AdminController do
  use Frontend.Web, :controller

  def index(conn, _params) do
    render conn, "index.html", %{}
  end
end
