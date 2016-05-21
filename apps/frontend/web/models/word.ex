defmodule Frontend.Word do
  use Ecto.Schema

  schema "words" do
    field :word, :string, size: 20
    field :difficulty, Frontend.Difficulty, default: :undecided
    belongs_to :category, Frontend.Category

    timestamps
  end
end
