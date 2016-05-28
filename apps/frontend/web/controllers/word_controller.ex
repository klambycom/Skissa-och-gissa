defmodule Frontend.WordController do
  use Frontend.Web, :controller

  alias Frontend.Category
  alias Frontend.Word

  plug :assign_category

  def index(conn, _params) do
    words = Repo.all(assoc(conn.assigns[:category], :words))
    render(conn, "index.html", words: words, category: conn.assigns[:category])
  end

  def delete(conn, %{"id" => id}) do
    word = Repo.get!(Word, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(word)

    conn
    |> put_flash(:info, "Word deleted successfully.")
    |> redirect(to: category_word_path(conn, :index, conn.assigns[:category]))
  end

  defp assign_category(conn, _opts) do
    case conn.params do
      %{"category_id" => category_id} ->
        category = Repo.get(Category, category_id)
        assign(conn, :category, category)
      _ ->
        conn
    end
  end
end
