defmodule Frontend.AdminController do
  use Frontend.Web, :controller

  alias Frontend.Category
  alias Frontend.Word

  plug :scrub_params, "word" when action in [:add_word]

  def index(conn, _params) do
    changeset = Word.changeset(Word.new)
    render conn, "index.html", categories: categories, changeset: changeset
  end

  def add_word(conn, %{"word" => word_params}) do
    changeset =
      Repo.get(Category, word_params["category_id"])
      |> build_assoc(:words)
      |> Word.changeset(word_params)

    case Repo.insert(changeset) do
      {:ok, _word} ->
        conn
        |> put_flash(:info, dgettext("admin", "Word created successfully."))
        |> redirect(to: admin_path(conn, :index))
      {:error, changeset} ->
        render(conn, "index.html", categories: categories, changeset: changeset)
    end
  end

  defp categories, do: Repo.all(Category)
end
