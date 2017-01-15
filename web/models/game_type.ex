defmodule SkissaOchGissa.GameType do
  use SkissaOchGissa.Web, :model

  alias SkissaOchGissa.WordList

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "game_types" do
    field :title, :string
    field :description, :string
    field :words, WordList, default: []
    field :lang_code, :string, default: "sv"

    timestamps
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :description, :words, :lang_code])
    |> validate_required([:title, :description])
    |> validate_length(:title, min: 5, max: 100)
    |> validate_length(:description, max: 1000)
  end
end
