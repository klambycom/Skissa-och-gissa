defmodule Frontend.AdminControllerTest do
  use Frontend.ConnCase

  alias Frontend.Word
  alias Frontend.Category

  @valid_attrs %{word: "ord", category_id: nil}
  @invalid_attrs %{}

  test "GET /admin", %{conn: conn} do
    conn = get conn, "/admin"
    assert html_response(conn, 200) =~ "Skissaochgissa.se"
  end

  test "creates resource and redirects when word data is valid", %{conn: conn} do
    category = Repo.insert! %Category{}
    valid_attrs = %{@valid_attrs | category_id: category.id}

    conn = post conn, admin_path(conn, :add_word), word: valid_attrs
    assert redirected_to(conn) == admin_path(conn, :index)
    assert Repo.get_by(Word, valid_attrs)
  end
end
