defmodule Game.Database.Category do
  use Ecto.Schema

  schema "categories" do
    field :name, :string
    field :description, :string

    timestamps
  end
end
