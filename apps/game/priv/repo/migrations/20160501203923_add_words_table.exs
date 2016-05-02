defmodule Game.Repo.Migrations.AddWordsTable do
  use Ecto.Migration

  def up do
    create table(:words) do
      add :word, :string, size: 20
      add :difficulty, :integer, default: 0

      timestamps
    end
  end

  def down do
    drop table(:words)
  end
end
