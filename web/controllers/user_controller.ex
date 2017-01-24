defmodule SkissaOchGissa.UserController do
  use SkissaOchGissa.Web, :controller

  alias SkissaOchGissa.{User, Auth}

  plug :authenticate when action in [:show]

  def show(conn, %{"id" => id}),
    do: render(conn, "show.html", user: Repo.get(User, id))

  def new(conn, _params),
    do: render(conn, "new.html", changeset: User.changeset(%User{}, :register))

  def create(conn, %{"user" => user_params}) do
    changeset = User.changeset(%User{}, :register, user_params)

    case Repo.insert(changeset) do
      {:ok, user} ->
        conn
        |> Auth.login(user)
        |> put_flash(:info, gettext("User created!"))
        |> redirect(to: user_path(conn, :show, user))
      {:error, changeset} ->
        conn
        |> render("new.html", changeset: changeset)
    end
  end

  defp authenticate(conn, _opts) do
    if conn.assigns.current_user do
      conn
    else
      conn
      |> put_flash(:error, gettext("You must be logged in to access that page"))
      |> redirect(to: page_path(conn, :index))
      |> halt
    end
  end
end
