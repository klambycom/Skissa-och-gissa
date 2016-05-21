defmodule Frontend.Word do
  @moduledoc """
  Word
  """

  use Frontend.Web, :model

  schema "words" do
    field :word, :string, size: 20
    field :difficulty, Frontend.Difficulty, default: :undecided
    belongs_to :category, Frontend.Category

    timestamps
  end

  @required_fields ~w(word)
  @optional_fields ~w(difficulty)

  @doc """
  Creates a changeset. The only required field is word.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

  @doc """
  Create new empty word
  """
  def new, do: %__MODULE__{}
end
