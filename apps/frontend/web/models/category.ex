defmodule Frontend.Category do
  use Ecto.Schema

  import Ecto.Query, only: [from: 2]

  schema "categories" do
    field :name, :string
    field :description, :string
    has_many :words, Frontend.Word

    timestamps
  end

  # TODO Only categories with more than some words
  def with_words do
    from p in Frontend.Category,
      preload: [:words]
  end
end
