defmodule SkissaOchGissa.GameTypeController do
  use SkissaOchGissa.Web, :controller

  alias SkissaOchGissa.GameType

  plug :scrub_params, "game_type" when action in [:create, :update]

  def new(conn, _params),
    do: render(conn, "new.html", changeset: GameType.changeset(%GameType{}))

  def create(conn, %{"game_type" => game_type_params}) do
    case %GameType{} |> GameType.changeset(game_type_params) |> Repo.insert do
      {:ok, _game_type} ->
        conn
        |> put_flash(:info, dgettext("admin", "Game type created successfully."))
        |> redirect(to: page_path(conn, :admin))
      {:error, changeset} ->
        conn
        |> render("new.html", changeset: changeset)
    end
  end

  def edit(conn, %{"id" => id}) do
    game_type = Repo.get!(GameType, id)

    conn
    |> render("edit.html", game_type: game_type, changeset: GameType.changeset(game_type))
  end

  def update(conn, %{"id" => id, "game_type" => game_type_params}) do
    game_type = Repo.get!(GameType, id)

    case game_type |> GameType.changeset(game_type_params) |> Repo.update do
      {:ok, _game_type} ->
        conn
        |> put_flash(:info, dgettext("admin", "Game type updated successfully."))
        |> redirect(to: page_path(conn, :admin))
      {:error, changeset} ->
        conn
        |> render("edit.html", game_type: game_type, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    Repo.get!(GameType, id)
    |> Repo.delete!

    conn
    |> put_flash(:info, dgettext("admin", "Game type deleted successfully."))
    |> redirect(to: page_path(conn, :admin))
  end
end
