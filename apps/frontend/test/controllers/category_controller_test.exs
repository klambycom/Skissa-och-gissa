defmodule Frontend.CategoryControllerTest do
  use Frontend.ConnCase
  import Frontend.Gettext

  alias Frontend.Category

  @valid_attrs %{name: "Category 1", description: "This is a test category."}
  @invalid_attrs %{}

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, category_path(conn, :new)
    assert html_response(conn, 200) =~ dgettext("admin", "New category")
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, category_path(conn, :create), category: @valid_attrs
    assert redirected_to(conn) == admin_path(conn, :index)
    assert Repo.get_by(Category, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, category_path(conn, :create), category: @invalid_attrs
    assert html_response(conn, 200) =~ dgettext("admin", "New category")
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    category = Repo.insert! Category.new
    conn = get conn, category_path(conn, :edit, category)
    assert html_response(conn, 200) =~ dgettext("admin", "Edit category")
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    category = Repo.insert! Category.new
    conn = put conn, category_path(conn, :update, category), category: @valid_attrs
    assert redirected_to(conn) == admin_path(conn, :index)
    assert Repo.get_by(Category, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    category = Repo.insert! Category.new
    conn = put conn, category_path(conn, :update, category), category: @invalid_attrs
    assert html_response(conn, 200) =~ dgettext("admin", "Edit category")
  end

  test "deletes chosen resource", %{conn: conn} do
    category = Repo.insert! Category.new
    conn = delete conn, category_path(conn, :delete, category)
    assert redirected_to(conn) == admin_path(conn, :index)
    refute Repo.get(Category, category.id)
  end
end
