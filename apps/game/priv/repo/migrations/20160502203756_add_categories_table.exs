defmodule Game.Repo.Migrations.AddCategoriesTable do
  use Ecto.Migration

  def up do
    create table(:categories) do
      add :name, :string, size: 40
      add :description, :string, size: 500

      timestamps
    end
  end

  def down do
    drop table(:categories)
  end
end
