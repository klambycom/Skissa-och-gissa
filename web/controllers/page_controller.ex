defmodule SkissaOchGissa.PageController do
  use SkissaOchGissa.Web, :controller

  alias SkissaOchGissa.{Game, GameType}

  def index(conn, _params),
    do: render(conn, "index.html", games: Repo.all(Game.active) |> Repo.preload(:game_type))

  def admin(conn, _params) do
    game_types =
      Repo.all(GameType)
      |> Repo.preload(games: Game.latest)

    conn
    |> render("admin.html", game_types: game_types)
  end
end
