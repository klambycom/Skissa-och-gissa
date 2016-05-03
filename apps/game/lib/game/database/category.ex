defmodule Game.Database.Category do
  use Ecto.Schema

  import Ecto.Query, only: [from: 2]

  schema "categories" do
    field :name, :string
    field :description, :string
    has_many :words, Game.Database.Word

    timestamps
  end

  # TODO Only categories with more than some words
  def with_words do
    from p in Game.Database.Category,
      preload: [:words]
  end
end
