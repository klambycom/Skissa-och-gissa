defmodule SkissaOchGissa.UserController do
  use SkissaOchGissa.Web, :controller

  alias SkissaOchGissa.{Authentication, Auth}

  plug :authenticate when action in [:show]

  def show(conn, %{"id" => id}),
    do: render(conn, "show.html", user: Repo.get(Authentication.Email, id))

  def new(conn, _params) do
    changeset = Authentication.Email.changeset(%Authentication.Email{}, :register)
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"email" => email_params}) do
    changeset =
      %Authentication.Email{}
      |> Authentication.Email.changeset(:register, email_params)

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
