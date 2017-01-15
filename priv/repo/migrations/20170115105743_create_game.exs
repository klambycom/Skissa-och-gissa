defmodule SkissaOchGissa.Repo.Migrations.CreateGame do
  use Ecto.Migration

  def change do
    create table(:games, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :created_at, :utc_datetime, default: fragment("now()")
      add :started_at, :utc_datetime
      add :ended_at, :utc_datetime
      add :game_type_id, references(:game_types, on_delete: :nothing, type: :binary_id)
    end
    create index(:games, [:game_type_id])

  end
end
