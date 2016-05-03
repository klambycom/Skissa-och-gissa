defmodule Game.Database.Word do
  use Ecto.Schema

  schema "words" do
    field :word, :string, size: 20
    field :difficulty, Game.Database.Difficulty, default: :undecided
    belongs_to :category, Game.Database.Category

    timestamps
  end
end
