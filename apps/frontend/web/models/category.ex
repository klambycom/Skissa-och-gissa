defmodule Frontend.Category do
  @moduledoc """
  Categories is what the games is created from. A category have a name,
  description and words.
  """

  use Frontend.Web, :model

  import Ecto.Query, only: [from: 2]

  schema "categories" do
    field :name, :string
    field :description, :string
    has_many :words, Frontend.Word

    timestamps
  end

  @required_fields ~w(name description)
  @optional_fields ~w()

  @doc """
  Creates a changeset. Required fields is name and description.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

  @doc """
  Create new empty category
  """
  def new, do: %__MODULE__{}

  # TODO Only categories with more than some words
  def with_words do
    from p in Frontend.Category,
      preload: [:words]
  end
end
