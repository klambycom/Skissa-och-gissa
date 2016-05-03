defmodule Game.Repo.Migrations.AddReferenceToCategoryFromWord do
  use Ecto.Migration

  def up do
    alter table(:words) do
      add :category_id, references(:categories)
    end

    create index(:words, [:category_id])
  end

  def down do
    alter table(:words) do
      remove :category_id
    end
  end
end
