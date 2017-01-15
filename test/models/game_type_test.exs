defmodule SkissaOchGissa.GameTypeTest do
  use SkissaOchGissa.ModelCase

  alias SkissaOchGissa.GameType

  @valid_attrs %{description: "some content", title: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = GameType.changeset(%GameType{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = GameType.changeset(%GameType{}, @invalid_attrs)
    refute changeset.valid?
  end
end
