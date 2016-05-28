defmodule Frontend.WordTest do
  use Frontend.ModelCase

  alias Frontend.Word
  alias Frontend.Category

  @valid_attrs %{word: "Snow", difficulty: :easy}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Word.changeset(Word.new, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Word.changeset(Word.new, @invalid_attrs)
    refute changeset.valid?
  end
end
