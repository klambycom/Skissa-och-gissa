defmodule Frontend.WordControllerTest do
  use Frontend.ConnCase

  alias Frontend.Word
  alias Frontend.Category

  test "lists all entries on index", %{conn: conn} do
    category = Repo.insert! %Category{}
    conn = get conn, category_word_path(conn, :index, category)
    assert html_response(conn, 200) =~ "ord i"
  end

  test "deletes chosen resource", %{conn: conn} do
    category = Repo.insert! %Category{}
    word = Repo.insert! %Word{category_id: category.id}

    conn = delete conn, category_word_path(conn, :delete, category, word)
    assert redirected_to(conn) == category_word_path(conn, :index, category)
    refute Repo.get(Word, word.id)
  end
end
