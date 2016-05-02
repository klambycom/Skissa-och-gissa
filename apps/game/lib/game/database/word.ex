defmodule Game.Database.Word do
  use Ecto.Schema

  schema "words" do
    field :word, :string, size: 20
    field :difficulty, Game.Database.Difficulty, default: :undecided

    timestamps
  end
end
