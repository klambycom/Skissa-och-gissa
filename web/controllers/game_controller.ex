defmodule SkissaOchGissa.GameController do
  use SkissaOchGissa.Web, :controller

  alias SkissaOchGissa.{Game, GameType}

  def create(conn, %{"game_type_id" => game_type_id}) do
    game_type = Repo.get!(GameType, game_type_id) |> Repo.preload([:games])

    changeset =
      game_type
      |> build_assoc(:games)
      |> Game.changeset(%{})

    case Repo.insert(changeset) do
      {:ok, _game} ->
        conn
        |> put_flash(:info, dgettext("admin", "Game created successfully."))
        |> redirect(to: page_path(conn, :admin))
      {:error, _changeset} ->
        conn
        |> put_flash(:error, dgettext("admin", "Game could not be created."))
        |> redirect(to: page_path(conn, :admin))
    end
  end
end
