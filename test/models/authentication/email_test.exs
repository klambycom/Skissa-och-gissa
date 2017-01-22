defmodule SkissaOchGissa.Authentication.EmailTest do
  use SkissaOchGissa.ModelCase

  alias SkissaOchGissa.Authentication.Email

  @valid_attrs %{email: "some content", password_hash: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Email.changeset(%Email{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Email.changeset(%Email{}, @invalid_attrs)
    refute changeset.valid?
  end
end
