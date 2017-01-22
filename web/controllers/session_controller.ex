defmodule SkissaOchGissa.SessionController do
  use SkissaOchGissa.Web, :controller

  alias SkissaOchGissa.Auth

  def new(conn, _), do: render(conn, "new.html")

  def create(conn, %{"session" => %{"email" => email, "password" => password}}) do
    case Auth.login_by_email(conn, email, password) do
      {:ok, conn} ->
        conn
        |> put_flash(:info, gettext("Welcome back!"))
        |> redirect(to: page_path(conn, :index))
      {:error, _reason, conn} ->
        conn
        |> put_flash(:error, gettext("Invalid email/password combination"))
        |> render("new.html")
    end
  end

  def delete(conn, _) do
    conn
    |> Auth.logout
    |> redirect(to: page_path(conn, :index))
  end
end
