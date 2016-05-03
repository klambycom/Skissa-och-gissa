defmodule Game.Database.Category do
  use Ecto.Schema

  schema "categories" do
    field :name, :string
    field :description, :string
    has_many :words, Game.Database.Word

    timestamps
  end
end
