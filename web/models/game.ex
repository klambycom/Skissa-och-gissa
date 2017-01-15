defmodule SkissaOchGissa.Game do
  use SkissaOchGissa.Web, :model

  alias SkissaOchGissa.GameType

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "games" do
    field :created_at, Ecto.DateTime
    field :started_at, Ecto.DateTime
    field :ended_at, Ecto.DateTime

    belongs_to :game_type, GameType
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:started_at, :ended_at])
  end

  def latest(n \\ 10) do
    from g in __MODULE__,
      limit: ^n
  end
end
