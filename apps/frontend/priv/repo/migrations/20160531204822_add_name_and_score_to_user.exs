defmodule Frontend.Repo.Migrations.AddNameAndScoreToUser do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :name, :string, size: 30, null: false
      add :score, :integer, default: 0
    end
  end
end
