defmodule SkissaOchGissa.Repo.Migrations.CreateGameType do
  use Ecto.Migration

  def change do
    create table(:game_types, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :title, :string, null: false, size: 100
      add :description, :string, null: false, size: 1000
      add :words, {:array, :string}, default: []
      add :lang_code, :string, null: false, size: 2, default: "sv"

      timestamps()
    end

  end
end
