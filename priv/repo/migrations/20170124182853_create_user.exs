defmodule SkissaOchGissa.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:user_auths, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :email, :string, null: false
      add :password_hash, :string

      timestamps()
    end

    create unique_index(:user_auths, [:email])
  end
end
