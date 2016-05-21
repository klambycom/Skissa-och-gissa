defmodule Frontend.CategoryTest do
  use Frontend.ModelCase

  alias Frontend.Category

  @valid_attrs %{name: "Category 1", description: "This is a test category."}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Category.changeset(Category.new, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Category.changeset(Category.new, @invalid_attrs)
    refute changeset.valid?
  end
end
