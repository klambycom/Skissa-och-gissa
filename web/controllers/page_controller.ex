defmodule SkissaOchGissa.PageController do
  use SkissaOchGissa.Web, :controller

  alias SkissaOchGissa.GameType

  def index(conn, _params),
    do: render(conn, "index.html")

  def admin(conn, _params),
    do: render(conn, "admin.html", game_types: Repo.all(GameType))
end
